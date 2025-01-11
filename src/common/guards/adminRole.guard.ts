import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { ADMIN_KEY } from '../decorators/admin.decorator';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isAdminRequired = this.reflector.getAllAndOverride<boolean>(ADMIN_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!isAdminRequired) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    return user?.isActivated && user?.role === 'administrator';
  }
}
