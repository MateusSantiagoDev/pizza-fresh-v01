import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  const config = new DocumentBuilder()
  .setTitle("PizzaFresh")
  .setDescription("Aplicação para gestão de mesas de uma pizzaria")
  .setVersion("1.0.0")
  .addTag("status")
  .addTag("table")
  .addTag("product")
  .addTag("user")
  .build()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document)


  await app.listen(3300);
}
bootstrap();
