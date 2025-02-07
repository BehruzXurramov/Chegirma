import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./models/user.models";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import * as uuid from "uuid";
import { MailService } from "../mail/mail.service";
import { FindUserDto } from "./dto/find-user.dto";
import { Op } from "sequelize";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService
  ) {}

  async getTokens(user: User) {
    const payload = {
      id: user.id,
      is_active: user.is_active,
      is_owner: user.is_owner,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async create(createUserDto: CreateUserDto) {
    if (createUserDto.password !== createUserDto.confirm_password) {
      throw new BadRequestException("Parollar mos emas");
    }
    const activation_link = uuid.v4();
    const hashed_password = await bcrypt.hash(createUserDto.password, 7);
    const newUser = await this.userModel.create({
      ...createUserDto,
      hashed_password,
      activation_link,
    });

    try {
      await this.mailService.sendMail(newUser);
    } catch (error) {
      throw new InternalServerErrorException("Xat yuborishda xatolik");
    }
    return newUser;
  }

  async activate(link: string) {
    if (!link) {
      throw new BadRequestException("Activation link not found");
    }

    const updateUser = await this.userModel.update(
      { is_active: true },
      {
        where: {
          activation_link: link,
          is_active: false,
        },
        returning: true,
      }
    );
    if (!updateUser[1][0]) {
      throw new BadRequestException("User already activation");
    }
    const response = {
      message: "User activated successfully",
      user: updateUser[1][0].is_active,
    };
    return response;
  }

  findOneByEmail(email: string) {
    return this.userModel.findOne({ where: { email } });
  }

  async updateRefreshToken(id: number, hashed_refresh_token: string | null) {
    const updatedUser = await this.userModel.update(
      { hashed_refresh_token },
      {
        where: { id },
      }
    );
    return updatedUser;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return this.userModel.findByPk(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findUser(findUserDto: FindUserDto) {
    const { name, email, phone } = findUserDto;
    const where = {};
    if (name) {
      where["name"] = {
        [Op.like]: `%${name}%`,
      };
    }
    if (email) {
      where["email"] = {
        [Op.like]: `%${email}%`,
      };
    }
    if (phone) {
      where["phone"] = {
        [Op.like]: `%${phone}%`,
      };
    }
    console.log(where);

    const users = await this.userModel.findAll({ where });
    if (!users) {
      throw new NotFoundException("User not found");
    }
    return users;
  }
}
