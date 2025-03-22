import { Injectable } from "@nestjs/common";
import { type Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

import {
  type CreateUserWithOauthDto,
  type CreateUserDto,
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

    user.accounts.push(account);

    account.save();
    user.save();

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOneWithOAuth(
    oauthUserDto: OauthUserDto,
  ): Promise<User | undefined> {
    return this.userModel.findOne({
      "accounts.oauthId": oauthUserDto.oauthId,
      "accounts.oauthProvider": oauthUserDto.oauthProvider,
    });
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.userModel.findOne({
      username: username,
    });
  }
}
