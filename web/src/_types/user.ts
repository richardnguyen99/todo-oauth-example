export type UserBase = {
  _id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  avatar: string;
};

export type FetchedUser = UserBase & {
  createdAt: string;
  updatedAt: string;
};

export type User = UserBase & {
  createdAt: Date;
  updatedAt: Date;
};

export type UserResponse = {
  statusCode: number;
  message: string;
  data: FetchedUser | null;
};

export type UsersResponse = {
  statusCode: number;
  message: string;
  data: FetchedUser[];
};
