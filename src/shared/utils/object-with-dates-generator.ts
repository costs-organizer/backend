import { Injectable } from '@nestjs/common';
import { BaseDateEntity } from 'src/entities';

@Injectable()
export class ObjectWithDatesGenerator<Entity extends BaseDateEntity> {
  public createNewObject = (obj: Entity) => {
    obj.createdAt = new Date();
    obj.updatedAt = new Date();
    obj.deletedAt = null;

    return obj;
  };
}
