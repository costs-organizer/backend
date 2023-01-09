import { FileUpload } from 'graphql-upload';
import { bucket } from './config';

export const uploadToGoogleCloud = (
  createReadStream: FileUpload['createReadStream'],
  filename: string,
): Promise<void> => {
  // step 1 - upload the file to Google Cloud Storage
  return new Promise((resolves, rejects) =>
    createReadStream()
      .pipe(
        bucket.file(filename).createWriteStream({
          resumable: false,
          gzip: true,
        }),
      )
      .on('error', (err: any) => rejects(err)) // reject on error
      .on('finish', resolves),
  ); // resolve on finish
};
