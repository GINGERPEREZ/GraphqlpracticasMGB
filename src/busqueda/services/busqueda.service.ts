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

  private async safeGet<T>(url: string): Promise<T | null> {
    try {
      this.logger.debug(`Requesting ${url}`);
      const res = await firstValueFrom(this.httpService.get(url));
      return (res.data as T) ?? null;
    } catch (err: any) {
      this.logger.warn(`Failed to fetch ${url}: ${err?.message ?? err}`);
      return null;
    }
  }

  private async safeGetList(url: string): Promise<any[]> {
    const data = await this.safeGet<any[]>(url);
    return Array.isArray(data) ? data : [];
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

  async findMenuById(id: string): Promise<any | null> {
    return this.safeGet<any>(`${this.baseUrl}/menus/${id}`);
  }

  async findRestaurantById(id: string): Promise<any | null> {
    return this.safeGet<any>(`${this.baseUrl}/restaurants/${id}`);
  }

  async findUserById(id: string): Promise<any | null> {
    return this.safeGet<any>(`${this.baseUrl}/users/${id}`);
  }

  async findReservationById(id: string): Promise<any | null> {
    return this.safeGet<any>(`${this.baseUrl}/reservations/${id}`);
  }
}
