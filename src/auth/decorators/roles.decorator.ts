import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

/**
 * SetMetadata
 * Nest provides the ability to attach custom metadata to route handlers through the @SetMetadata() decorator.
 *
 * @SetMetadata('roles', ['admin'])
 * key: value
 *
 * Roles decorator passed the [roles]
 * brings roles into SetMetadata() method
 * key is 'roles' and values are [roles]
 */
