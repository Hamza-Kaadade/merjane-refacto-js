import {type ProductHandler} from './product-handler.js';
import {type SeasonalProduct} from '@/entities/seasonal-product.js';
import {type ProductService} from '@/services/impl/product.service.js';

export class SeasonalProductHandler implements ProductHandler {
	public constructor(private readonly productService: ProductService) {}

	public async handle(product: SeasonalProduct): Promise<void> {
		const now = new Date();
		if (product.canBeSold(now)) {
			product.sellOne();
			await this.productService.save(product);
		} else if (product.restockExceedsSeason(now)) {
			// Restock would arrive after the season: treat as unavailable
			product.markUnavailable();
			await this.productService.notifyOutOfStock(product);
		} else if (product.hasNotStarted(now)) {
			await this.productService.notifyOutOfStock(product);
		} else {
			// In season but out of stock: announce the delay
			await this.productService.notifyDelay(product);
		}
	}
}
