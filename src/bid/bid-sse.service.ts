import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class BidSseService {
  private clients: Response[] = [];

  addClient(res: Response) {
    this.clients.push(res);
    res.on('close', () => this.removeClient(res));
  }

  removeClient(res: Response) {
    this.clients = this.clients.filter((client) => client !== res);
  }

  sendEvent(data: any) {
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    this.clients.forEach((client) => client.write(payload));
  }
}
