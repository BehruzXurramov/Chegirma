import { forwardRef, Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./models/user.models";
import { MailModule } from "../mail/mail.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    MailModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
