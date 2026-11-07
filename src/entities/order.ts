import {type ProductEntity} from './product.js';

export type Order = {
	id: number;
	products: ProductEntity[];
};
