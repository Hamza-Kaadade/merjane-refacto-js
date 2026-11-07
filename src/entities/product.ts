export type ProductType = 'NORMAL' | 'SEASONAL' | 'EXPIRABLE';

export type ProductProps = {
	id: number;
	name: string;
	available: number;
	leadTime: number;
};

export abstract class ProductEntity {
	public abstract readonly type: ProductType;
	public readonly id: number;
	public readonly name: string;
	public available: number;
	public readonly leadTime: number;

	protected constructor({id, name, available, leadTime}: ProductProps) {
		this.id = id;
		this.name = name;
		this.available = available;
		this.leadTime = leadTime;
	}

	public abstract canBeSold(now: Date): boolean;

	public sellOne(): void {
		this.available -= 1;
	}

	public markUnavailable(): void {
		this.available = 0;
	}

	protected isInStock(): boolean {
		return this.available > 0;
	}
}
