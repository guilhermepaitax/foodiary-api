import { HeadObjectCommand } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import KSUID from 'ksuid';

import { Meal } from '@application/entities/meal';
import { s3Client } from '@infra/clients/s3-client';
import { Injectable } from '@kernel/decorators/injectable';
import { AppConfig } from '@shared/config/app-config';

@Injectable()
export class MealsFileStorageGateway {
  constructor(private readonly config: AppConfig) {}

  static generateInputFileKey({
    accountId,
    inputType,
  }: MealsFileStorageGateway.GenerateInputFileKeyParams): string {
    const extension = inputType === Meal.InputType.AUDIO ? 'm4a' : 'jpeg';
    const fileName = `${KSUID.randomSync().string}.${extension}`;

    return `${accountId}/${fileName}`;
  }

  async createPOST({
    file,
    mealId,
    accountId,
  }: MealsFileStorageGateway.CreatePOSTParams): Promise<MealsFileStorageGateway.CreatePOSTResult> {
    const bucket = this.config.storage.s3.mealsBucket;

    const { key, size, inputType } = file;
    const contentType = inputType === Meal.InputType.AUDIO ? 'audio/m4a' : 'image/jpeg';

    const FIVE_MINUTES_IN_SECS = 5 * 60;

    const { url, fields } = await createPresignedPost(s3Client, {
      Key: key,
      Bucket: bucket,
      Expires: FIVE_MINUTES_IN_SECS,
      Conditions: [
        { bucket },
        ['eq', '$key', key],
        ['eq', '$Content-Type', contentType],
        ['content-length-range', size, size],
      ],
      Fields: {
        'x-amz-meta-mealid': mealId,
        'x-amz-meta-accountid': accountId,
      },
    });

    const uploadSignature = Buffer.from(
      JSON.stringify({
        url,
        fields: {
          ...fields,
          'Content-Type': contentType,
        },
      }),
    ).toString('base64');

    return { uploadSignature };
  }

  async getFileMetadata({
    fileKey,
  }: MealsFileStorageGateway.GetFileMetadataParams): Promise<MealsFileStorageGateway.GetFileMetadataResult> {
    const command = new HeadObjectCommand({
      Bucket: this.config.storage.s3.mealsBucket,
      Key: fileKey,
    });

    const { Metadata = {} } = await s3Client.send(command);

    if (!Metadata.accountid || !Metadata.mealid) {
      throw new Error(`[getFileMetadata] File metadata not found in "${fileKey}"`);
    }

    return {
      accountId: Metadata.accountid,
      mealId: Metadata.mealid,
    };
  }

  getFileURL({
    fileKey,
  }: MealsFileStorageGateway.GetFileURLParams): string {
    const cdnDomain = this.config.cdns.mealsCDN;

    return `https://${cdnDomain}/${fileKey}`;
  }
}

export namespace MealsFileStorageGateway {
  export type GenerateInputFileKeyParams = {
    accountId: string;
    inputType: Meal.InputType;
  }

  export type CreatePOSTParams = {
    mealId: string;
    accountId: string;
    file: {
      key: string;
      size: number;
      inputType: Meal.InputType;
    }
  }

  export type CreatePOSTResult = {
    uploadSignature: string;
  }

  export type GetFileURLParams = {
    fileKey: string;
  }

  export type GetFileMetadataParams = {
    fileKey: string;
  }

  export type GetFileMetadataResult = {
    accountId: string;
    mealId: string;
  }
}
