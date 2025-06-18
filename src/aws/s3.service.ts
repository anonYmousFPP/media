import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3_CONSTANTS } from '../utils/constants';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    try {
      const awsRegion = this.getConfigValue(S3_CONSTANTS.ENV_KEYS.REGION);
      const awsAccessKey = this.getConfigValue(
        S3_CONSTANTS.ENV_KEYS.ACCESS_KEY,
      );
      const awsSecretKey = this.getConfigValue(
        S3_CONSTANTS.ENV_KEYS.SECRET_KEY,
      );
      this.bucketName = this.getConfigValue(S3_CONSTANTS.ENV_KEYS.BUCKET_NAME);

      this.s3Client = new S3Client({
        region: awsRegion,
        credentials: {
          accessKeyId: awsAccessKey,
          secretAccessKey: awsSecretKey,
        },
      });

      this.logger.log(S3_CONSTANTS.LOG_MESSAGES.INIT_SUCCESS(this.bucketName));
    } catch (error) {
      this.logger.error(S3_CONSTANTS.ERROR_MESSAGES.INIT_FAILED, error);
      throw error;
    }
  }

  private getConfigValue(key: string): string {
    const value = this.configService.get<string>(key);
    if (!value) {
      throw new Error(S3_CONSTANTS.ERROR_MESSAGES.MISSING_ENV(key));
    }
    return value;
  }

  generateMediaKey(filename: string): string {
    try {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const extension = filename.split('.').pop();
      return `${S3_CONSTANTS.MEDIA_PREFIX}${timestamp}-${randomString}.${extension}`;
    } catch (error) {
      this.logger.error(`Failed to generate media key for ${filename}`, error);
      throw new Error(S3_CONSTANTS.ERROR_MESSAGES.MEDIA_KEY_GEN_FAILED);
    }
  }

  async generatePresignedPutUrl(
    key: string,
    expiresIn: number = S3_CONSTANTS.DEFAULT_EXPIRATION,
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error) {
      this.logger.error(
        `Failed to generate presigned PUT URL for ${key}`,
        error,
      );
      throw new Error(S3_CONSTANTS.ERROR_MESSAGES.PUT_URL_GEN_FAILED);
    }
  }

  getPublicUrl(key: string): string {
    try {
      const awsRegion = this.configService.get<string>(
        S3_CONSTANTS.ENV_KEYS.REGION,
      );
      return `https://${this.bucketName}.s3.${awsRegion}.amazonaws.com/${key}`;
    } catch (error) {
      this.logger.error('Error generating public URL', error);
      throw new Error(S3_CONSTANTS.ERROR_MESSAGES.PUBLIC_URL_GEN_FAILED);
    }
  }

  async generatePresignedGetUrl(
    key: string,
    expiresIn: number = S3_CONSTANTS.GET_URL_EXPIRATION,
  ): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      return getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error) {
      this.logger.error(
        `Failed to generate presigned GET URL for ${key}`,
        error,
      );
      throw new Error(S3_CONSTANTS.ERROR_MESSAGES.GET_URL_GEN_FAILED);
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.log(S3_CONSTANTS.LOG_MESSAGES.FILE_DELETED(key));
    } catch (error) {
      this.logger.error(`Failed to delete file ${key}`, error);
      throw new Error(S3_CONSTANTS.ERROR_MESSAGES.FILE_DELETE_FAILED);
    }
  }
}
