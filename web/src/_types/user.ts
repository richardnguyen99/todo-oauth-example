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
