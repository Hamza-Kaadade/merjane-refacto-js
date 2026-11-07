import {ProductEntity, type ProductProps} from './product.js';

export class NormalProduct extends ProductEntity {
	public readonly type = 'NORMAL' as const;

	public constructor(props: ProductProps) {
		super(props);
	}

	public canBeSold(): boolean {
		return this.isInStock();
	}
}
