import { ApiProperty } from '@nestjs/swagger';

export class GetMediaRequest {
  @ApiProperty({
    description: 'The key/identifier of the media file',
    example: 'media/1234567890-abc123.jpg',
  })
  fileKey: string;
}

export class GetMediaResponse {
  @ApiProperty({
    description: 'Public URL to access the media file',
    example:
      'https://bucket-name.s3.region.amazonaws.com/media/1234567890-abc123.jpg',
  })
  fileUrl: string;
}

export class GetSignedUploadUrlsRequest {
  @ApiProperty({
    description: 'List of file names to generate upload URLs for',
    example: ['image1.jpg', 'image2.png'],
    type: [String],
  })
  files: string[];
}

export class SignedUrl {
  @ApiProperty({
    description: 'Generated unique key for the file',
    example: 'media/1234567890-abc123.jpg',
  })
  fileKey: string;

  @ApiProperty({
    description: 'Signed URL for uploading the file',
    example:
      'https://bucket-name.s3.region.amazonaws.com/media/1234567890-abc123.jpg?X-Amz-Algorithm=...',
  })
  uploadUrl: string;

  @ApiProperty({
    description: 'Public URL to access the file after upload',
    example:
      'https://bucket-name.s3.region.amazonaws.com/media/1234567890-abc123.jpg',
  })
  publicUrl: string;
}

export class GetSignedUploadUrlsResponse {
  @ApiProperty({
    description: 'Array of signed URL information',
    type: [SignedUrl],
  })
  urls: SignedUrl[];
}

export class DeleteMediaRequest {
  @ApiProperty({
    description: 'List of file keys to delete',
    example: ['media/1234567890-abc123.jpg', 'media/0987654321-def456.png'],
    type: [String],
  })
  files: string[];
}

export class DeleteMediaResponse {
  @ApiProperty({
    description: 'Whether all files were deleted successfully',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'List of successfully deleted files',
    example: ['media/1234567890-abc123.jpg', 'media/0987654321-def456.png'],
    type: [String],
  })
  deletedFiles: string[];

  @ApiProperty({
    description: 'List of files that failed to delete',
    example: [],
    type: [String],
  })
  failedFiles: string[];
  @ApiProperty({
    description: 'Result message',
    example: 'Deleted 2 files, failed to delete 1 file',
    required: false,
  })
  message?: string;
}
