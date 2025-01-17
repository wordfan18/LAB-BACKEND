import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder,SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Latihan Nest JS -B')
    .setDescription('NAMA :FIKRAH LEJAHTEGIS NIM :105841105322')
    .setVersion('0.1')
    .addTag('Latihan 1')
    .addBearerAuth()
    .build();


    const dokumentFactory = SwaggerModule.createDocument(app,config);
    SwaggerModule.setup('api-docs',app,dokumentFactory);




  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
