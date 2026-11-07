import {type Cradle} from '@fastify/awilix';
import {type INotificationService} from '../notifications.port.js';
import {type ProductEntity} from '@/entities/product.js';
import {type ExpirableProduct} from '@/entities/expirable-product.js';
import {type ProductRepository} from '@/repositories/product.repository.js';

export class ProductService {
	private readonly ns: INotificationService;
	private readonly productRepository: ProductRepository;

	public constructor({ns, productRepository}: Pick<Cradle, 'ns' | 'productRepository'>) {
		this.ns = ns;
		this.productRepository = productRepository;
	}

	public async save(product: ProductEntity): Promise<void> {
		await this.productRepository.save(product);
	}

	public async notifyDelay(product: ProductEntity): Promise<void> {
		await this.save(product);
		this.ns.sendDelayNotification(product.leadTime, product.name);
	}

	public async notifyOutOfStock(product: ProductEntity): Promise<void> {
		this.ns.sendOutOfStockNotification(product.name);
		await this.save(product);
	}

	public async notifyExpiration(product: ExpirableProduct): Promise<void> {
		this.ns.sendExpirationNotification(product.name, product.expiryDate);
		await this.save(product);
	}
}
