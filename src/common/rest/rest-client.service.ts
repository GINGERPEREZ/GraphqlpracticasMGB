import {
  BadGatewayException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  isAxiosError,
} from 'axios';
import { firstValueFrom } from 'rxjs';

import type { PaginationParams } from './rest.types.js';

@Injectable()
export class RestClientService {
  private readonly logger = new Logger(RestClientService.name);

  constructor(private readonly httpService: HttpService) {}

  async getOne<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<T>(path, this.mergeConfig(config)),
      );
      return (response as AxiosResponse<T>).data;
    } catch (error) {
      throw this.mapError(error, path);
    }
  }

  async getMany<T>(
    path: string,
    params?: PaginationParams,
    config?: AxiosRequestConfig,
  ): Promise<T[]> {
    const requestConfig = this.mergeConfig({
      params: this.cleanParams(params),
      ...config,
    });

    try {
      const response = await firstValueFrom(
        this.httpService.get<T[]>(path, requestConfig),
      );
      return (response as AxiosResponse<T[]>).data;
    } catch (error) {
      throw this.mapError(error, path);
    }
  }

  async getAllPaginated<T>(
    path: string,
    pageSize = 50,
    config?: AxiosRequestConfig,
  ): Promise<T[]> {
    const results: T[] = [];
    let offset = 0;

    while (true) {
      const chunk = await this.getMany<T>(
        path,
        { offset, limit: pageSize },
        config,
      );

      results.push(...chunk);
      if (chunk.length < pageSize) {
        break;
      }

      offset += pageSize;
    }

    return results;
  }

  private mergeConfig(config?: AxiosRequestConfig): AxiosRequestConfig {
    return {
      timeout: 5000,
      ...config,
    };
  }

  private cleanParams(
    params?: PaginationParams,
  ): Record<string, number> | undefined {
    if (!params) {
      return undefined;
    }

    const cleanedParams: Record<string, number> = {};

    if (params.offset !== undefined) {
      cleanedParams.offset = params.offset;
    }

    if (params.limit !== undefined) {
      cleanedParams.limit = params.limit;
    }

    return Object.keys(cleanedParams).length > 0 ? cleanedParams : undefined;
  }

  private mapError(error: unknown, path: string): HttpException {
    if (isAxiosError(error)) {
      return this.handleAxiosError(error, path);
    }

    this.logger.error(`Unexpected error while calling ${path}`, error as Error);
    return new BadGatewayException(
      `Unexpected error while calling REST API at ${path}`,
    );
  }

  private handleAxiosError(error: AxiosError, path: string): HttpException {
    const status = error.response?.status ?? HttpStatus.BAD_GATEWAY;
    const message = this.resolveErrorMessage(error);

    if (status === HttpStatus.NOT_FOUND) {
      return new NotFoundException(
        `Resource at ${path} was not found in REST API: ${message}`,
      );
    }

    return new HttpException(`REST API error at ${path}: ${message}`, status);
  }

  private resolveErrorMessage(error: AxiosError): string {
    if (error.response?.data) {
      if (typeof error.response.data === 'string') {
        return error.response.data;
      }

      if (
        Array.isArray((error.response.data as { message?: unknown }).message)
      ) {
        return (
          (error.response.data as { message?: unknown }).message as unknown[]
        )
          .map((item) => String(item))
          .join(', ');
      }

      if ((error.response.data as { message?: unknown }).message) {
        return String((error.response.data as { message?: unknown }).message);
      }
    }

    return error.message;
  }
}
