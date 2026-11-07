import {type ProductEntity} from '@/entities/product.js';

export type ProductHandler = {
	handle(product: ProductEntity): Promise<void>;
};
