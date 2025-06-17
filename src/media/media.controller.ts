import { Body, Controller, Post, Delete, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { S3Service } from '../aws/s3.service';
import {
  GetSignedUploadUrlsRequest,
  GetSignedUploadUrlsResponse,
  DeleteMediaRequest,
  DeleteMediaResponse,
  GetMediaResponse,
  GetMediaRequest
} from '../dto/media';
import { MediaService } from './media.service';
import { GrpcAuthGuard } from 'src/guard/grpc-auth.guard';

@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(
    private readonly s3Service: S3Service,
    private readonly mediaService: MediaService,
  ) {}

  // @UseGuards(GrpcAuthGuard)
  @Post('/getMedia')
  @ApiOperation({ summary: 'Get media URL', description: 'Returns a public URL for accessing the specified media file' })
  @ApiBody({ type: GetMediaRequest })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved media URL',
    type: GetMediaResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Media not found or error getting URL'
  })
  async getMedia(@Body() request: GetMediaRequest): Promise<GetMediaResponse> {
    return await this.mediaService.getMediaInternal(request);
  }

  // @UseGuards(GrpcAuthGuard)
  @Post('/uploadMedia')
  @ApiOperation({ summary: 'Get signed upload URLs', description: 'Generates signed URLs for uploading multiple media files' })
  @ApiBody({ type: GetSignedUploadUrlsRequest })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully generated signed URLs',
    type: GetSignedUploadUrlsResponse,
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Error generating upload URLs' 
  })
  async getSignedUploadUrls(@Body() request: GetSignedUploadUrlsRequest): Promise<GetSignedUploadUrlsResponse> {
    return await this.mediaService.getSignedUrlsInternal(request);
  }

  // @UseGuards(GrpcAuthGuard)
  @Delete('/deleteMedia')
  @ApiOperation({ summary: 'Delete media files', description: 'Deletes specified media files from storage' })
  @ApiBody({ type: DeleteMediaRequest })
  @ApiResponse({ 
    status: 200,
    description: 'Media deletion results',
    type: DeleteMediaResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request or error deleting files'
  })
  async deleteMedia(@Body() request: DeleteMediaRequest): Promise<DeleteMediaResponse> {
    return await this.mediaService.deleteMediaInternal(request);
  }
}