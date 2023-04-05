import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export class Guard {
  /**
   * Checks if value is empty. Accept strings, numbers, booleans, objects and arrays.
   */
  static isEmpty(value: unknown): boolean {
    if (typeof value === 'number' || typeof value === 'boolean') {
      return false;
    }
    if (typeof value === 'undefined' || value === null) {
      return true;
    }
    if (value instanceof Date) {
      return false;
    }
    if (value instanceof Object && !Object.keys(value).length) {
      return true;
    }
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return true;
      }
      if (value.every((item) => Guard.isEmpty(item))) {
        return true;
      }
    }
    return value === '';
  }

  /**
   * Checks length range of a provided number/string/array
   */
  static lengthIsBetween(
    value: number | string | Array<unknown>,
    min: number,
    max: number,
  ): boolean {
    if (Guard.isEmpty(value)) {
      throw new Error(
        'Cannot check length of a value. Provided value is empty',
      );
    }
    const valueLength =
      typeof value === 'number'
        ? Number(value).toString().length
        : value.length;
    return valueLength >= min && valueLength <= max;
  }
}

export class AddressRequireGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const address = request.address;
    if (!address) {
      throw new UnauthorizedException('Address is required');
    }
    return true;
  }
}
