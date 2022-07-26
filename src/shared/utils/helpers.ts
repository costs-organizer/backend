import { existsSync } from 'fs';
import { resolve } from 'path';

export const getEnvPath = (dest: string): string => {
  const env: string | undefined = process.env.NODE_ENV;
  console.log('dest', dest);
  const fallback: string = resolve(`${dest}/.env`);
  const filename: string = env ? `${env}.env` : 'development.env';
  const filePath: string = resolve(`${dest}/${filename}`);
  const isPathValid = existsSync(filePath);

  return isPathValid ? filePath : fallback;
};
