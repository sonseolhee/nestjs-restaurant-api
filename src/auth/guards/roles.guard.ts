import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    // console.log(roles);

    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return matchRoles(roles, user.role);
  }
}

function matchRoles(roles, userRole) {
  if (roles.includes(userRole)) return true;
  return false;
}

/**
 * Reflector#get method allows us to easily access the metadata by passing in two arguments: a metadata key and a context (decorator target) to retrieve the metadata from.
 *
 * The context is provided by the call to context.getHandler() :
 * extracting the metadata for the currently processed route handler.
 *
 * Given the ability to provide metadata at multiple levels, you may need to extract and merge metadata from several contexts. The Reflector class provides two utility methods used to help with this. These methods extract both controller and method metadata at once, and combine them in different ways.
 *
 *const roles = this.reflector.getAllAndOverride | getAllAndMerge <string[]>('roles', [
  context.getHandler(),
  context.getClass(),
]);
 */
