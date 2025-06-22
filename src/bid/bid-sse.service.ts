import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class BidSseService {
  private bidSubject = new Subject<MessageEvent>();

  getBidStream(): Observable<MessageEvent> {
    return this.bidSubject.asObservable();
  }

  sendEvent(event: MessageEvent) {
    this.bidSubject.next(event);
  }
}
