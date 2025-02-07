import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";

async function start() {
  try {
    const PORT = process.env.PORT ?? 3003;
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());
    app.setGlobalPrefix("api");
    app.enableCors({
      origin: (origin, callback) => {
        const allowedOrigins = [
          "http://localhost:8000",
          "http://localhost:3000",
          "https://skidkachi.uz",
          "https://api.skidkachi.uz",
          "https://skidkachi.vercel.app",
        ];
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new BadRequestException("Not allowed by CORS"));
        }
      },
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true,
    });
    const config = new DocumentBuilder()
      .setTitle("Chegirma")
      .setDescription("The Chegirma API description")
      .setVersion("1.0")
      .addTag("NestJS")
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, documentFactory);

    await app.listen(PORT, () => {
      console.log(`Server started at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}
start();
