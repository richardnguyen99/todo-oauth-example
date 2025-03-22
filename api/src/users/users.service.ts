import { Injectable } from "@nestjs/common";
import { type Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

import { type CreateUserDto } from "./dto/create-user.dto";
import { User } from "./schemas/user.schema";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdCat = new this.userModel(createUserDto);
    return createdCat.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.userModel.findOne({
      username,
    });
  }
}
