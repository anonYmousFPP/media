import { Body, Controller, Post, Delete, UseGuards } from '@nestjs/common';
import { S3Service } from '../aws/s3.service';
import { GetSignedUploadUrlsRequest, GetSignedUploadUrlsResponse, DeleteMediaRequest, DeleteMediaResponse, GetMediaResponse, GetMediaRequest } from '../dto/media';
import { MediaService } from './media.service';
import { GrpcAuthGuard } from 'src/guard/grpc-auth.guard';
import { ApiMedia } from 'src/docs/media.swagger';
import { HttpStatus, HttpCode } from '@nestjs/common';
@Controller('media')
@ApiMedia.controller()
export class MediaController {
  constructor(
    private readonly s3Service: S3Service,
    private readonly mediaService: MediaService,
  ) {}

  // @UseGuards(GrpcAuthGuard)
  @Post('/getMedia')
  @HttpCode(HttpStatus.OK)
  @ApiMedia.getMedia()
  getMedia(@Body() request: GetMediaRequest): GetMediaResponse {
    return this.mediaService.getMediaInternal(request);
  }

  // @UseGuards(GrpcAuthGuard)
  @Post('/uploadMedia')
  @HttpCode(HttpStatus.CREATED)
  @ApiMedia.uploadMedia()
  async getSignedUploadUrls(
    @Body() request: GetSignedUploadUrlsRequest,
  ): Promise<GetSignedUploadUrlsResponse> {
    return await this.mediaService.getSignedUrlsInternal(request);
  }

  // @UseGuards(GrpcAuthGuard)
  @Delete('/deleteMedia')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiMedia.deleteMedia()
  async deleteMedia(
    @Body() request: DeleteMediaRequest,
  ): Promise<DeleteMediaResponse> {
    return await this.mediaService.deleteMediaInternal(request);
  }
}
