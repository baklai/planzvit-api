import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getAboutAPI(): string {
    return 'API PLANZVIT v1.0';
  }
}
