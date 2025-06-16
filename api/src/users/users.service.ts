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
import { Account, User, UserDocument } from "./schemas/user.schema";
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
  ): Promise<UserDocument> {
    const {
      avatar,
      email,
      emailVerified = false,
      oauthId,
      oauthProvider,
      username,
      oauthAccessToken,
      oauthRefreshToken,
    } = createUserWithOauth;

    const account = new this.accountModel({
      oauthId,
      oauthProvider,
      oauthAccessToken,
      oauthRefreshToken,
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
        oauthAccessToken: updateUserWithOauthDto.oauthAccessToken,
        oauthRefreshToken: updateUserWithOauthDto.oauthRefreshToken,
      },
    );

    if (!accountResult.acknowledged || accountResult.matchedCount === 0) {
      throw new InternalServerErrorException(
        `Cannot update account on User '${updateUserWithOauthDto.username}'`,
      );
    }
  }

  async searchUsers(searchTerm: string): Promise<UserDocument[]> {
    if (!searchTerm) {
      return [];
    }

    // Required for MongoDB Atlas Search to work, otherwise it will throw an error
    try {
      return await this.userModel.aggregate().search({
        index: "username_email",
        text: {
          query: searchTerm,
          path: ["username", "email"],
        },
      });
    } catch (error) {
      console.error("Error searching users:", error);
      return [];
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOneWithOAuth(
    oauthUserDto: OauthUserDto,
  ): Promise<UserDocument | null> {
    const users = await this.userModel.aggregate([
      // Lookup to join accounts collection
      {
        $lookup: {
          from: "accounts",
          localField: "accounts",
          foreignField: "_id",
          as: "accountDocs",
        },
      },
      // Unwind the accounts array to filter them
      { $unwind: "$accountDocs" },
      // Match on oauthProvider and oauthId
      {
        $match: {
          "accountDocs.oauthProvider": oauthUserDto.oauthProvider,
          "accountDocs.oauthId": oauthUserDto.oauthId,
        },
      },
      {
        $project: {
          username: 1,
          email: 1,
          emailVerified: 1,
          avatar: 1,
          accounts: 1,
          accountDocs: 1, // contains matched account
        },
      },
    ]);

    // Return first matching user (or null)
    return users[0] || null;
  }

  async findOneById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).populate("accounts").exec();
  }

  async findOne(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({
      username: username,
    });
  }
}
