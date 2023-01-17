import { Index } from 'typeorm';

export const UniqueWhenNotDeleted = () =>
  Index({ unique: true, where: '"deletedAt" IS NULL' });
