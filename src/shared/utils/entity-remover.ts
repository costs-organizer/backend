import { BaseDateEntity } from 'src/entities';

export class EntityRemover {
  public removeEntity<T extends BaseDateEntity>(entity: T): T {
    return {
      ...entity,
      deletedAt: new Date(),
    };
  }

  public removeEntities<T extends BaseDateEntity>(entities: T[]): T[] {
    const currentDate = new Date();
    return entities.map((entity) => ({ ...entity, deletedAt: currentDate }));
  }
}
