import { Ctx, Start, Update } from "nestjs-telegraf";
import { Context } from "telegraf";

@Update()
export class BotUpdate {
  @Start()
  async onStart(@Ctx() ctx: Context) {
    ctx.reply("Salom");
  }
}
