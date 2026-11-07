import fastifyPlugin from 'fastify-plugin';
import {serializerCompiler, validatorCompiler, type ZodTypeProvider} from 'fastify-type-provider-zod';
import {z} from 'zod';
import {type OrderService} from '@/services/impl/order.service.js';

export function buildMyController({orderService}: {orderService: OrderService}) {
    return fastifyPlugin(async server => {
        // Add schema validator and serializer
        server.setValidatorCompiler(validatorCompiler);
        server.setSerializerCompiler(serializerCompiler);

        server.withTypeProvider<ZodTypeProvider>().post('/orders/:orderId/processOrder', {
            schema: {
                params: z.object({
                    orderId: z.coerce.number(),
                }),
                response: {
                    200: z.object({orderId: z.number()}),
                },
            },
        }, async request => {
            const orderId = await orderService.process(request.params.orderId);
            return {orderId};
        });
    });
}
