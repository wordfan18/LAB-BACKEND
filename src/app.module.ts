import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    JwtModule.register({
      secret:"abc123",
    global: true,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService,],
})
export class AppModule {}
