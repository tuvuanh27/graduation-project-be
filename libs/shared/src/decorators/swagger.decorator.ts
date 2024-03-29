import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiOperationOptions } from '@nestjs/swagger/dist/decorators/api-operation.decorator';
import { ApiPropertyOptions } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IResponse } from '@libs/infra/interceptors';
import { IPaginationMetadata } from '@libs/shared/types';
import { Transform } from 'class-transformer';

export * from '@nestjs/swagger';

export function enumToObj(
  enumVariable: Record<string, any>,
): Record<string, any> {
  const enumValues = Object.values(enumVariable);
  const hLen = enumValues.length / 2;
  const object = {};
  for (let i = 0; i < hLen; i++) {
    object[enumValues[i]] = enumValues[hLen + i];
  }
  return object;
}

export function enumProperty(options: ApiPropertyOptions): ApiPropertyOptions {
  const obj = enumToObj(options.enum);
  const enumValues = Object.values(obj);
  return {
    example: enumValues[0],
    ...options,
    enum: enumValues,
    description: (options.description ?? '') + ': ' + JSON.stringify(obj),
  };
}

const createApiOperation = (defaultOptions: ApiOperationOptions) => {
  return (options?: ApiOperationOptions): MethodDecorator =>
    ApiOperation({
      ...defaultOptions,
      ...options,
    });
};

export const ApiEnumProperty = (options: ApiPropertyOptions) =>
  ApiProperty(enumProperty(options));
export const ApiListOperation = createApiOperation({
  summary: 'List all',
});
export const ApiRetrieveOperation = createApiOperation({
  summary: 'Get data 1 record',
});
export const ApiCreateOperation = createApiOperation({
  summary: 'Create new record',
});
export const ApiUpdateOperation = createApiOperation({
  summary: 'Edit record',
});
export const ApiDeleteOperation = createApiOperation({
  summary: 'Delete record',
});
export const ApiBulkDeleteOperation = createApiOperation({
  summary: 'Delete many record',
});

export const ApiFile =
  (fileName = 'file'): MethodDecorator =>
  (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [fileName]: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })(target, propertyKey, descriptor);
  };

export enum EApiOkResponsePayload {
  ARRAY = 'array',
  OBJECT = 'object',
}
export const ApiOkResponsePayload = <DataDto extends Type<unknown>>(
  dto: DataDto,
  type: EApiOkResponsePayload = EApiOkResponsePayload.ARRAY,
  withPagination = false,
) => {
  const data =
    type === EApiOkResponsePayload.ARRAY
      ? {
          type: EApiOkResponsePayload.ARRAY,
          items: { $ref: getSchemaPath(dto) },
        }
      : {
          type: EApiOkResponsePayload.OBJECT,
          properties: {
            data: { $ref: getSchemaPath(dto) },
          },
        };

  const properties =
    type === EApiOkResponsePayload.ARRAY
      ? {
          properties: {
            data: data,
          },
        }
      : { ...data };

  return applyDecorators(
    ApiExtraModels(
      !withPagination ? ResponsePayload : ResponsePaginationPayload,
      dto,
    ),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            $ref: getSchemaPath(
              !withPagination ? ResponsePayload : ResponsePaginationPayload,
            ),
          },
          {
            ...properties,
          },
        ],
      },
    }),
  );
};

export class ResponsePayload<T> implements IResponse<T> {
  @ApiEnumProperty({ enum: HttpStatus, example: HttpStatus.OK })
  statusCode?: HttpStatus;
  @ApiProperty()
  data?: T;
  @ApiProperty()
  _metadata?: {
    [key: string]: any;
  };
  @ApiProperty({
    description:
      'If success = fail, it is message error, if success = true, it will null',
  })
  message?: string | null;
  @ApiProperty({ description: 'Check is success' })
  success?: boolean;
  @ApiProperty({ description: 'Validate error with input data' })
  validatorErrors?: any[];
}

export class PaginationMetadata implements IPaginationMetadata {
  @ApiProperty()
  totalDocs: number;
  @ApiProperty()
  limit: number;
  @ApiProperty()
  page: number;
  @ApiProperty()
  totalPages: number;
}
export class ResponsePaginationPayload<T> extends ResponsePayload<T> {
  @ApiProperty({ type: PaginationMetadata })
  _metadata?: IPaginationMetadata;
}

const valueToBoolean = (value: any) => {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  if (['true', 'on', 'yes', '1'].includes(value.toLowerCase())) {
    return true;
  }
  if (['false', 'off', 'no', '0'].includes(value.toLowerCase())) {
    return false;
  }
  return undefined;
};

export const ToBoolean = () => {
  const toPlain = Transform(
    ({ value }) => {
      return value;
    },
    {
      toPlainOnly: true,
    },
  );
  const toClass = (target: any, key: string) => {
    return Transform(
      ({ obj }) => {
        return valueToBoolean(obj[key]);
      },
      {
        toClassOnly: true,
      },
    )(target, key);
  };
  return function (target: any, key: string) {
    toPlain(target, key);
    toClass(target, key);
  };
};
