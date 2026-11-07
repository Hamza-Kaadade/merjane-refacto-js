import {type Cradle} from '@fastify/awilix';
import {eq} from 'drizzle-orm';
import {toProductEntity} from './product.mapper.js';
import {orders} from '@/db/schema.js';
import {type Database} from '@/db/type.js';
import {type Order} from '@/entities/order.js';
import {type ProductEntity} from '@/entities/product.js';

export class OrderRepository {
	private readonly db: Database;

	public constructor({db}: Pick<Cradle, 'db'>) {
		this.db = db;
	}

	public async findWithProducts(orderId: number): Promise<Order | undefined> {
		const order = await this.db.query.orders.findFirst({
			where: eq(orders.id, orderId),
			with: {
				products: {
					columns: {},
					with: {
						product: true,
					},
				},
			},
		});
		if (!order) {
			return undefined;
		}

		const products = order.products
			.map(({product}) => toProductEntity(product))
			.filter((product): product is ProductEntity => product !== undefined);
		return {id: order.id, products};
	}
}
