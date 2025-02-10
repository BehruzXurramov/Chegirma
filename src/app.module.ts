import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { MailModule } from "./mail/mail.module";
import { BotModule } from "./bot/bot.module";
import { TelegrafModule } from "nestjs-telegraf";
import { BOT_NAME } from "./app.constants";
import { DistrictModule } from "./district/district.module";
import { SocialLinkModule } from "./social_link/social_link.module";
import { CategoryModule } from "./category/category.module";
import { DiscountTypeModule } from "./discount_type/discount_type.module";
import { RegionModule } from "./region/region.module";

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      botName: BOT_NAME,
      useFactory: () => ({
        token: process.env.BOT_API || "Token",
        middlewares: [],
        include: [BotModule],
      }),
    }),
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.POSTGRES_HOST,
      username: process.env.POSTGRES_USER,
      port: Number(process.env.POSTGRES_PORT),
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [],
      autoLoadModels: true,
      sync: { alter: true },
      logging: false,
    }),
    UsersModule,
    AuthModule,
    MailModule,
    BotModule,
    DistrictModule,
    SocialLinkModule,
    CategoryModule,
    DiscountTypeModule,
    RegionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
