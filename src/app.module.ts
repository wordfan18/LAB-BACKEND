import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { AuthModule } from './auth.module';
import { ProfileModule } from './profile/profile.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    JwtModule.register({
      secret:"abc123",
    global: true,
    }),
    AuthModule,
    ProfileModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService,],
})
export class AppModule {}
