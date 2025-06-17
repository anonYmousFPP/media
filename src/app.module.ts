import { Module } from '@nestjs/common';
import { MediaModule } from './media/media.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [MediaModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
