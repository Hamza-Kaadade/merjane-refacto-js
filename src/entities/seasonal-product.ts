import {ProductEntity, type ProductProps} from './product.js';

const millisecondsPerDay = 24 * 60 * 60 * 1000;

export type SeasonalProductProps = ProductProps & {
	seasonStartDate: Date;
	seasonEndDate: Date;
};

export class SeasonalProduct extends ProductEntity {
	public readonly type = 'SEASONAL' as const;
	public readonly seasonStartDate: Date;
	public readonly seasonEndDate: Date;

	public constructor({seasonStartDate, seasonEndDate, ...props}: SeasonalProductProps) {
		super(props);
		this.seasonStartDate = seasonStartDate;
		this.seasonEndDate = seasonEndDate;
	}

	public canBeSold(now: Date): boolean {
		return now > this.seasonStartDate && now < this.seasonEndDate && this.isInStock();
	}

	public restockExceedsSeason(now: Date): boolean {
		// Restock date = today + lead time in days
		const restockDate = new Date(now.getTime() + (this.leadTime * millisecondsPerDay));
		return restockDate > this.seasonEndDate;
	}

	public hasNotStarted(now: Date): boolean {
		return this.seasonStartDate > now;
	}
}
