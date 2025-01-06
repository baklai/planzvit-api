import { SetMetadata } from '@nestjs/common';

export const ADMIN_KEY = 'isAdminRequired ';
export const AdminRequired = (isAdminRequired: boolean = true) =>
  SetMetadata(ADMIN_KEY, isAdminRequired);
