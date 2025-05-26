import { Clothing } from './clothing/clothing.entity';

export function isAuctionActive(clothing: Clothing): boolean {
  const now = new Date();
  return now >= clothing.initial_date && now <= clothing.end_date;
}
