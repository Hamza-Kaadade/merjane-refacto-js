import {type Product} from '@/db/schema.js';
import {type ProductEntity} from '@/entities/product.js';
import {NormalProduct} from '@/entities/normal-product.js';
import {SeasonalProduct} from '@/entities/seasonal-product.js';
import {ExpirableProduct} from '@/entities/expirable-product.js';

// DB row -> domain entity; unknown types return undefined
export function toProductEntity(row: Product): ProductEntity | undefined {
	const props = {
		id: row.id, name: row.name, available: row.available, leadTime: row.leadTime,
	};

	switch (row.type) {
		case 'NORMAL': {
			return new NormalProduct(props);
		}

		case 'SEASONAL': {
			if (!row.seasonStartDate || !row.seasonEndDate) {
				throw new Error(`Seasonal product ${row.id} has no season dates`);
			}

			return new SeasonalProduct({...props, seasonStartDate: row.seasonStartDate, seasonEndDate: row.seasonEndDate});
		}

		case 'EXPIRABLE': {
			if (!row.expiryDate) {
				throw new Error(`Expirable product ${row.id} has no expiry date`);
			}

			return new ExpirableProduct({...props, expiryDate: row.expiryDate});
		}

		default: {
			return undefined;
		}
	}
}

// Domain entity -> DB row; columns of other product types stay null
export function toProductRow(product: ProductEntity): Product {
	return {
		id: product.id,
		name: product.name,
		type: product.type,
		available: product.available,
		leadTime: product.leadTime,
		expiryDate: product instanceof ExpirableProduct ? product.expiryDate : null,
		seasonStartDate: product instanceof SeasonalProduct ? product.seasonStartDate : null,
		seasonEndDate: product instanceof SeasonalProduct ? product.seasonEndDate : null,
	};
}
