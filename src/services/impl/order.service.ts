/* eslint-disable no-await-in-loop -- products must be processed sequentially */
import {type Cradle} from '@fastify/awilix';
import createError from '@fastify/error';
import {NormalProductHandler} from '../handlers/normal-product.handler.js';
import {SeasonalProductHandler} from '../handlers/seasonal-product.handler.js';
import {ExpirableProductHandler} from '../handlers/expirable-product.handler.js';
import {type ProductHandler} from '../handlers/product-handler.js';
import {type OrderRepository} from '@/repositories/order.repository.js';

export const OrderNotFoundError = createError('ORDER_NOT_FOUND', 'Order %s not found', 404);

export class OrderService {
	private readonly orderRepository: OrderRepository;
	private readonly handlers: Record<string, ProductHandler>;

	public constructor({orderRepository, ps}: Pick<Cradle, 'orderRepository' | 'ps'>) {
		this.orderRepository = orderRepository;
		// One strategy per product type
		this.handlers = {
			NORMAL: new NormalProductHandler(ps),
			SEASONAL: new SeasonalProductHandler(ps),
			EXPIRABLE: new ExpirableProductHandler(ps),
		};
	}

	public async process(orderId: number): Promise<number> {
		const order = await this.orderRepository.findWithProducts(orderId);
		if (!order) {
			throw new OrderNotFoundError(orderId);
		}

		for (const product of order.products) {
			// Unknown types have no handler and are skipped
			await this.handlers[product.type]?.handle(product);
		}

		return order.id;
	}
}
