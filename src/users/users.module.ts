import { forwardRef, Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./models/user.models";
import { MailModule } from "../mail/mail.module";
import { AuthModule } from "../auth/auth.module";
import { BotModule } from "../bot/bot.module";

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    MailModule,
    BotModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
