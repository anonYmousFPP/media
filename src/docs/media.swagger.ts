import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import {
  GetSignedUploadUrlsRequest,
  GetSignedUploadUrlsResponse,
  DeleteMediaRequest,
  DeleteMediaResponse,
  GetMediaResponse,
  GetMediaRequest,
} from '../dto/media';
import { applyDecorators } from '@nestjs/common';

export const ApiMedia = {
  controller: () => ApiTags('media'),

  getMedia: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get media URL',
        description:
          'Returns a public URL for accessing the specified media file',
      }),
      ApiBody({ type: GetMediaRequest }),
      ApiResponse({
        status: 200,
        description: 'Successfully retrieved media URL',
        type: GetMediaResponse,
      }),
      ApiResponse({
        status: 404,
        description: 'Media not found or error getting URL',
      }),
    ),

  uploadMedia: () => (
    ApiOperation({
      summary: 'Get signed upload URLs',
      description: 'Generates signed URLs for uploading multiple media files',
    }),
    ApiBody({ type: GetSignedUploadUrlsRequest }),
    ApiResponse({
      status: 200,
      description: 'Successfully generated signed URLs',
      type: GetSignedUploadUrlsResponse,
    }),
    ApiResponse({
      status: 404,
      description: 'Error generating upload URLs',
    })
  ),

  deleteMedia: () => (
    ApiOperation({
      summary: 'Delete media files',
      description: 'Deletes specified media files from storage',
    }),
    ApiBody({ type: DeleteMediaRequest }),
    ApiResponse({
      status: 200,
      description: 'Media deletion results',
      type: DeleteMediaResponse,
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request or error deleting files',
    })
  ),
};
