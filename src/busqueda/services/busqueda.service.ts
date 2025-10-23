import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BusquedaService {
  private readonly logger = new Logger(BusquedaService.name);

  constructor(private readonly httpService: HttpService) {}

  private baseUrl = 'http://localhost:3000';

  async findAllDishes(): Promise<any[]> {
    const url = `${this.baseUrl}/dishes`;
    this.logger.debug(`Requesting dishes from ${url}`);
    const res = await firstValueFrom(this.httpService.get(url));
    return res.data ?? [];
  }

  async findAllUsers(): Promise<any[]> {
    const url = `${this.baseUrl}/users`;
    this.logger.debug(`Requesting users from ${url}`);
    const res = await firstValueFrom(this.httpService.get(url));
    return res.data ?? [];
  }

  async findAllPayments(): Promise<any[]> {
    const url = `${this.baseUrl}/payments`;
    this.logger.debug(`Requesting payments from ${url}`);
    const res = await firstValueFrom(this.httpService.get(url));
    return res.data ?? [];
  }
}
