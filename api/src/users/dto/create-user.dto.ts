export interface CreateUserDto {
  readonly username: string;
  readonly password: string;
  readonly email: string;
}

export interface CreateUserWithOauthDto {
  readonly username: string;
  readonly email: string;
  readonly emailVerified: boolean;
  readonly avatar: string;
  readonly oauthId: string;
  readonly oauthProvider: string;
}

export interface UpdateUserWithOauthDto {
  readonly username: string;
  readonly email: string;
  readonly emailVerified: boolean;
  readonly avatar: string;
  readonly oauthId: string;
  readonly oauthProvider: string;
}
