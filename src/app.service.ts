import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getAppStatus(): string {
    return "Servidor rodando em http://localhost:3300 🚀🚀🚀";
  }
}
