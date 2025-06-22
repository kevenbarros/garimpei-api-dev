// bids.gateway.ts
import { MessageEvent } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { CreateBidDto } from './dto/create-bid.dto';

export class BidsGateway {
  private bidSubject = new Subject<MessageEvent>();

  getBidStream(): Observable<MessageEvent> {
    return this.bidSubject.asObservable();
  }

  emitNewBid(bid: CreateBidDto) {
    this.bidSubject.next({ data: bid });
  }

  sendEvent(event: MessageEvent) {
    this.bidSubject.next(event);
  }
}
