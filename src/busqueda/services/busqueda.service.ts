import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BusquedaService {
  private readonly logger = new Logger(BusquedaService.name);

  constructor(private readonly httpService: HttpService) {}

  private get baseUrl(): string {
    return process.env.REST_API_URL?.replace(/\/$/, '') ?? 'http://localhost:3000';
  }

  private async safeGetList(url: string): Promise<any[]> {
    try {
      this.logger.debug(`Requesting ${url}`);
      const res = await firstValueFrom(this.httpService.get(url));
      return res.data ?? [];
    } catch (err: any) {
      this.logger.warn(`Failed to fetch ${url}: ${err?.message ?? err}`);
      return [];
    }
  }

  async findAllDishes(): Promise<any[]> {
    return this.safeGetList(`${this.baseUrl}/dishes`);
  }

  async findAllUsers(): Promise<any[]> {
    return this.safeGetList(`${this.baseUrl}/users`);
  }

  async findAllPayments(): Promise<any[]> {
    return this.safeGetList(`${this.baseUrl}/payments`);
  }

  async findAllMenus(): Promise<any[]> {
    return this.safeGetList(`${this.baseUrl}/menus`);
  }
}
