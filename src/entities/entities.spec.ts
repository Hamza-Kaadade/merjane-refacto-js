import {describe, it, expect} from 'vitest';
import {NormalProduct} from './normal-product.js';
import {SeasonalProduct} from './seasonal-product.js';
import {ExpirableProduct} from './expirable-product.js';

const day = 24 * 60 * 60 * 1000;
const now = new Date('2026-06-01T12:00:00Z');
const daysFromNow = (days: number) => new Date(now.getTime() + (days * day));
const base = {
	id: 1, name: 'Product', available: 5, leadTime: 10,
};

describe('NormalProduct', () => {
	it('can be sold when in stock', () => {
		expect(new NormalProduct(base).canBeSold()).toBe(true);
	});

	it('cannot be sold when out of stock', () => {
		expect(new NormalProduct({...base, available: 0}).canBeSold()).toBe(false);
	});

	it('decrements availability when sold', () => {
		const product = new NormalProduct(base);
		product.sellOne();
		expect(product.available).toBe(4);
	});

	it('sets availability to 0 when marked unavailable', () => {
		const product = new NormalProduct(base);
		product.markUnavailable();
		expect(product.available).toBe(0);
	});
});

describe('SeasonalProduct', () => {
	const season = (start: number, end: number, available = 5) => new SeasonalProduct({
		...base, available, seasonStartDate: daysFromNow(start), seasonEndDate: daysFromNow(end),
	});

	it('can be sold within the season when in stock', () => {
		expect(season(-2, 58).canBeSold(now)).toBe(true);
	});

	it('cannot be sold before the season starts', () => {
		expect(season(10, 60).canBeSold(now)).toBe(false);
	});

	it('cannot be sold after the season ends', () => {
		expect(season(-60, -1).canBeSold(now)).toBe(false);
	});

	it('cannot be sold within the season when out of stock', () => {
		expect(season(-2, 58, 0).canBeSold(now)).toBe(false);
	});

	it('detects that the restock date exceeds the season end', () => {
		expect(season(-2, 5).restockExceedsSeason(now)).toBe(true);
	});

	it('detects that the restock date is within the season', () => {
		expect(season(-2, 30).restockExceedsSeason(now)).toBe(false);
	});

	it('detects that the season has not started', () => {
		expect(season(10, 60).hasNotStarted(now)).toBe(true);
		expect(season(-2, 60).hasNotStarted(now)).toBe(false);
	});
});

describe('ExpirableProduct', () => {
	const expirable = (expiry: number, available = 5) => new ExpirableProduct({...base, available, expiryDate: daysFromNow(expiry)});

	it('can be sold before expiry when in stock', () => {
		expect(expirable(26).canBeSold(now)).toBe(true);
	});

	it('cannot be sold after expiry', () => {
		expect(expirable(-2).canBeSold(now)).toBe(false);
	});

	it('cannot be sold before expiry when out of stock', () => {
		expect(expirable(26, 0).canBeSold(now)).toBe(false);
	});
});
