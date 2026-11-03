import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AudioModule } from './audio/audio.module';

@Module({
  imports: [PrismaModule, AudioModule],
})
export class AppModule {}
