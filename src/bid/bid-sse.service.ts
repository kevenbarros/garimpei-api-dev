import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

interface BidEvent {
  clothingId: number;
  bid: any;
  type: 'new_bid';
}

@Injectable()
export class BidSseService {
  private bidSubject = new Subject<BidEvent>();

  getBidStreamForClothing(clothingId: number): Observable<MessageEvent> {
    return this.bidSubject.asObservable().pipe(
      filter((event) => {
        const matches = event.clothingId === clothingId;
        return matches;
      }),
      map((event) => {
        return {
          data: JSON.stringify(event),
          type: 'message',
        } as MessageEvent;
      }),
    );
  }

  emitNewBid(clothingId: number, bid: any) {
    this.bidSubject.next({
      clothingId,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      bid,
      type: 'new_bid',
    });
  }
}
