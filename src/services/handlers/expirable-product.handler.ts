import {type ProductHandler} from './product-handler.js';
import {type ExpirableProduct} from '@/entities/expirable-product.js';
import {type ProductService} from '@/services/impl/product.service.js';

export class ExpirableProductHandler implements ProductHandler {
	public constructor(private readonly productService: ProductService) {}

	public async handle(product: ExpirableProduct): Promise<void> {
		if (product.canBeSold(new Date())) {
			product.sellOne();
			await this.productService.save(product);
		} else {
			// Expired or out of stock: no longer available
			product.markUnavailable();
			await this.productService.notifyExpiration(product);
		}
	}
}
