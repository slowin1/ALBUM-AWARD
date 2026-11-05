import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AudioModule } from './audio/audio.module';
import { AuthModule } from './auth/auth.module';
import { ReviewsModule } from './reviews/reviews.module';
import { VotesModule } from './votes/votes.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [PrismaModule, AudioModule, AuthModule, ReviewsModule, VotesModule, AdminModule],
})
export class AppModule {}
