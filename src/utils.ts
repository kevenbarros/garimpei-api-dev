import { Clothing } from './clothing/clothing.entity';

export function isAuctionActive(clothing: Clothing): boolean {
  const now = new Date();
  return (
    now >= new Date(clothing.initial_date) && now <= new Date(clothing.end_date)
  );
}
