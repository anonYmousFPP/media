import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly defaultExpiration = 3600;

  constructor(private readonly configService: ConfigService) {
    const awsRegion = this.getConfigValue('AWS_REGION');
    const awsAccessKey = this.getConfigValue('AWS_ACCESS_KEY');
    const awsSecretKey = this.getConfigValue('AWS_SECRET_KEY');
    this.bucketName = this.getConfigValue('AWS_BUCKET_NAME');

    this.s3Client = new S3Client({
      region: awsRegion,
      credentials: {
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecretKey,
      },
    });

    this.logger.log(`S3Service initialized successfully with bucket: ${this.bucketName}`);

  }

  private getConfigValue(key: string): string {
    const value = this.configService.get<string>(key);
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
  }

  generateMediaKey(filename: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = filename.split('.').pop();
    return `media/${timestamp}-${randomString}.${extension}`;
  }

  async generatePresignedPutUrl(
    key: string,
    expiresIn: number = this.defaultExpiration
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  getPublicUrl(key: string): string{
    try {
      const awsRegion = this.configService.get<string>('AWS_REGION');
      return `https://${this.bucketName}.s3.${awsRegion}.amazonaws.com/${key}`;
    } catch (error) {
      console.error('Error generating URL:', error);
      throw error;
    }
  }

  async generatePresignedGetUrl(
    key: string,
    expiresIn: number = 86400 // 24 hours
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }


  async generatePresignedUrl(fileName: string, fileType: string): Promise<string> {
    const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        ContentType: fileType,
    });

    const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: 300, 
    });
    return url;
  }

  async deleteFile(files: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: files
    });

    try {
      await this.s3Client.send(command);
      console.log(`File ${files} deleted successfully`);
    } catch (error) {
      console.error('Error deleting file from S3:', error);
      throw error;
    }
  }

}