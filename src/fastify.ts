import fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import {jsonSchemaTransform} from 'fastify-type-provider-zod';
import {asValue, type NameAndRegistrationPair} from 'awilix';
import {type Cradle} from '@fastify/awilix';
import {awilixPlugin} from './di/awilix.plugin.js';
import {configureDiContext} from './di/di.context.js';
import shutdownPlugin from './shutdown/shutdown.plugin.js';
import {drizzlePlugin} from './db/drizzle.plugin.js';
import {buildMyController} from './controllers/my-controller.js';

// Overrides let tests replace registrations before the controller resolves its services.
export async function buildFastify(overrides: NameAndRegistrationPair<Cradle> = {}) {
	const server = fastify();

	await server.register(swagger, {
		openapi: {info: {title: 'API', version: '1.0.0'}},
		transform: jsonSchemaTransform,
	});
	await server.register(swaggerUi, {routePrefix: '/docs'});
	await server.register(awilixPlugin());
	await server.register(drizzlePlugin);
	await server.register(shutdownPlugin);
	await server.register(configureDiContext);
	server.diContainer.register(overrides);
	await server.register(buildMyController({orderService: server.diContainer.resolve('orderService')}));

	server.addHook('onRequest', async request => {
		request.diScope.register({
			logger: asValue(request.log),
		});
	});
	return server;
}
