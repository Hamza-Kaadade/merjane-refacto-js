import {type ProductHandler} from './product-handler.js';
import {type NormalProduct} from '@/entities/normal-product.js';
import {type ProductService} from '@/services/impl/product.service.js';

export class NormalProductHandler implements ProductHandler {
	public constructor(private readonly productService: ProductService) {}

	public async handle(product: NormalProduct): Promise<void> {
		if (product.canBeSold()) {
			product.sellOne();
			await this.productService.save(product);
		} else if (product.leadTime > 0) {
			// Out of stock: announce the restock delay
			await this.productService.notifyDelay(product);
		}
	}
}
