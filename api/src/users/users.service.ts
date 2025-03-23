import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import mongoose, { type Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

import {
  type CreateUserWithOauthDto,
  type CreateUserDto,
  UpdateUserWithOauthDto,
} from "./dto/create-user.dto";
import { Account, User } from "./schemas/user.schema";
import { OauthUserDto } from "./dto/oauth-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,

    @InjectModel(Account.name)
    private accountModel: Model<Account>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdCat = new this.userModel(createUserDto);
    return createdCat.save();
  }

  async createWithOauth(
    createUserWithOauth: CreateUserWithOauthDto,
  ): Promise<User> {
    const {
      avatar,
      email,
      emailVerified = false,
      oauthId,
      oauthProvider,
      username,
    } = createUserWithOauth;

    const account = new this.accountModel({
      oauthId,
      oauthProvider,
    });

    const user = new this.userModel({
      username,
      avatar,
      email,
      emailVerified,
    });

    account.userId = user._id;
    user.accounts.push(account._id as mongoose.Types.ObjectId);

    await account.save();
    await user.save();

    return user;
  }

  async updateWithOauth(updateUserWithOauthDto: UpdateUserWithOauthDto) {
    const userResult = await this.userModel.updateOne(
      {
        username: updateUserWithOauthDto.username,
      },
      {
        username: updateUserWithOauthDto.username,
        email: updateUserWithOauthDto.email,
        avatar: updateUserWithOauthDto.avatar,
        emailVerified: updateUserWithOauthDto.emailVerified,
      },
    );

    if (!userResult.acknowledged || userResult.matchedCount === 0) {
      throw new UnauthorizedException(
        `User ${updateUserWithOauthDto.username} not found`,
      );
    }

    const accountResult = await this.accountModel.updateOne(
      {
        oauthId: updateUserWithOauthDto.oauthId,
      },
      {
        oauthId: updateUserWithOauthDto.oauthId,
        oauthProvider: updateUserWithOauthDto.oauthProvider,
      },
    );

    if (!accountResult.acknowledged || accountResult.matchedCount === 0) {
      throw new InternalServerErrorException(
        `Cannot update account on User '${updateUserWithOauthDto.username}'`,
      );
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOneWithOAuth(
    oauthUserDto: OauthUserDto,
  ): Promise<User | undefined> {
    return this.accountModel.findOne({
      oauthId: oauthUserDto.oauthId,
      oauthProvider: oauthUserDto.oauthProvider,
    });
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.userModel.findOne({
      username: username,
    });
  }
}
