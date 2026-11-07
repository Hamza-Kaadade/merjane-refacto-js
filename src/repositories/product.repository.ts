import {type Cradle} from '@fastify/awilix';
import {eq} from 'drizzle-orm';
import {toProductRow} from './product.mapper.js';
import {products} from '@/db/schema.js';
import {type Database} from '@/db/type.js';
import {type ProductEntity} from '@/entities/product.js';

export class ProductRepository {
	private readonly db: Database;

	public constructor({db}: Pick<Cradle, 'db'>) {
		this.db = db;
	}

	public async save(product: ProductEntity): Promise<void> {
		const row = toProductRow(product);
		await this.db.update(products).set(row).where(eq(products.id, row.id));
	}
}
