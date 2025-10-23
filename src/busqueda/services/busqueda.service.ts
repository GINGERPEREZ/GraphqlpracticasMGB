import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BusquedaService {
  private readonly logger = new Logger(BusquedaService.name);

  constructor(private readonly httpService: HttpService) {}

  private baseUrl = 'http://localhost:3000';

  async findAllProductos(): Promise<any[]> {
    const url = `${this.baseUrl}/productos`;
    this.logger.debug(`Requesting productos from ${url}`);
    const res = await firstValueFrom(this.httpService.get(url));
    return res.data ?? [];
  }

  async findAllClientes(): Promise<any[]> {
    const url = `${this.baseUrl}/clientes`;
    this.logger.debug(`Requesting clientes from ${url}`);
    const res = await firstValueFrom(this.httpService.get(url));
    return res.data ?? [];
  }

  async findAllVentas(): Promise<any[]> {
    const url = `${this.baseUrl}/ventas`;
    this.logger.debug(`Requesting ventas from ${url}`);
    const res = await firstValueFrom(this.httpService.get(url));
    return res.data ?? [];
  }
}
