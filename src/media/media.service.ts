import { Injectable, NotFoundException } from '@nestjs/common';
import { S3Service } from '../aws/s3.service';
import { GetSignedUploadUrlsRequest, GetSignedUploadUrlsResponse, DeleteMediaRequest, DeleteMediaResponse, GetMediaResponse, GetMediaRequest } from 'src/dto/media';
import { MEDIA_CONSTANTS } from '../utils/constants';

@Injectable()
export class MediaService {
  constructor(private readonly s3Service: S3Service) {}

  async getMediaInternal(request: GetMediaRequest): Promise<GetMediaResponse> {
    try {
      const publicUrl = this.s3Service.getPublicUrl(request.fileKey);
      return {
        fileUrl: publicUrl
      };
    } catch (error) {
      throw new NotFoundException(MEDIA_CONSTANTS.ERROR_MESSAGES.GET_MEDIA_FAILED, error.message);
    }
  }

  async getSignedUrlsInternal(request: GetSignedUploadUrlsRequest): Promise<GetSignedUploadUrlsResponse> {
    try{
      const urls = await Promise.all(request.files.map(async (file) => {
        const fileKey = this.s3Service.generateMediaKey(file);
        const uploadUrl = await this.s3Service.generatePresignedPutUrl(fileKey);
        const publicUrl = this.s3Service.getPublicUrl(fileKey);

        return {
          fileKey,
          uploadUrl,
          publicUrl
        };
      }));

      return { urls };
    } catch(error) {
      throw new NotFoundException(MEDIA_CONSTANTS.ERROR_MESSAGES.GENERATE_URLS_FAILED, error.message);
    }
  }

  async deleteMediaInternal(request: DeleteMediaRequest): Promise<DeleteMediaResponse> {
    try{
      const deletedFiles: string[] = [];
      const failedFiles: string[] = [];

      await Promise.all(request.files.map(async (file) => {
        try {
          await this.s3Service.deleteFile(file);
          deletedFiles.push(file);
        } catch (error) {
          failedFiles.push(file);
        }
      }));

      return {
        success: failedFiles.length === 0,
        deletedFiles,
        failedFiles,
        message: failedFiles.length > 0
          ? MEDIA_CONSTANTS.ERROR_MESSAGES.FILE_DELETE_PARTIAL_FAIL(
              deletedFiles.length,
              failedFiles.length
            )
          : MEDIA_CONSTANTS.RESPONSE_MESSAGES.DELETE_SUCCESS(deletedFiles.length)
      };
    }
    catch (error) {
      throw new NotFoundException(
        MEDIA_CONSTANTS.ERROR_MESSAGES.DELETE_MEDIA_FAILED,
        error.message
      );
    }
  }
}