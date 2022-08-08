import { SelectQueryBuilder } from 'typeorm';

const _if = function <Entity>(
  this: SelectQueryBuilder<Entity>,
  condition: boolean,
  ifTrue: (qb: SelectQueryBuilder<Entity>) => any,
  ifFalse?: (qb: SelectQueryBuilder<Entity>) => any,
) {
  if (condition) ifTrue(this);
  else if (!condition && ifFalse) ifFalse(this);
  return this;
};

interface SelectQueryBuilderExtensionsType {
  if: typeof _if;
}

declare module 'typeorm/query-builder/SelectQueryBuilder' {
  // eslint-disable-next-line
  interface SelectQueryBuilder<Entity>
    extends SelectQueryBuilderExtensionsType {}
}

Object.defineProperty(SelectQueryBuilder.prototype, 'if', {
  value: _if,
});
