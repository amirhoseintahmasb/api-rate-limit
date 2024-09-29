
import { Controller, Get, Req, Res, HttpStatus } from '@nestjs/common';
import { ApiService } from './api.service';
import { Request, Response } from 'express';

@Controller('data')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get()
  async getData(@Req() request: Request, @Res() response: Response) {
    const userId = request.headers['userid'];
    if (!userId) {
      return response.status(HttpStatus.BAD_REQUEST).send('User ID missing');
    }

    const result = await this.apiService.getData(userId.toString());
    return response.status(result.status).send(result.data);
  }
}
