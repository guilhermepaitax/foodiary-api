import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import KSUID from 'ksuid';

import { Meal } from '@application/entities/meal';
import { s3Client } from '@infra/clients/s3-client';
import { Injectable } from '@kernel/decorators/injectable';
import { AppConfig } from '@shared/config/app-config';

@Injectable()
export class MealsFileStorageGateway {
  constructor(private readonly appConfig: AppConfig) {}

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
  }: MealsFileStorageGateway.CreatePOSTParams): Promise<MealsFileStorageGateway.CreatePOSTResult> {
    const bucket = this.appConfig.storage.s3.mealsBucket;

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
}

export namespace MealsFileStorageGateway {
  export type GenerateInputFileKeyParams = {
    accountId: string;
    inputType: Meal.InputType;
  }

  export type CreatePOSTParams = {
    mealId: string;
    file: {
      key: string;
      size: number;
      inputType: Meal.InputType;
    }
  }

  export type CreatePOSTResult = {
    uploadSignature: string;
  }
}
