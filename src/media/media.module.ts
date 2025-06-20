import { Module } from '@nestjs/common';
import { S3Service } from '../aws/s3.service';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { GrpcAuthModule } from 'src/guard/grpc-auth.module';

@Module({
  imports: [GrpcAuthModule],
  providers: [S3Service, MediaService],
  controllers: [MediaController],
  exports: [MediaService],
})
export class MediaModule {}
