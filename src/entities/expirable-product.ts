import {ProductEntity, type ProductProps} from './product.js';

export type ExpirableProductProps = ProductProps & {
	expiryDate: Date;
};

export class ExpirableProduct extends ProductEntity {
	public readonly type = 'EXPIRABLE' as const;
	public readonly expiryDate: Date;

	public constructor({expiryDate, ...props}: ExpirableProductProps) {
		super(props);
		this.expiryDate = expiryDate;
	}

	public canBeSold(now: Date): boolean {
		return this.isInStock() && this.expiryDate > now;
	}
}
