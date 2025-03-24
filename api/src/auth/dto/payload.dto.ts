export interface AccessTokenPayloadDto {
  username: string;
  sub: string;
  userId: string;
}

export interface RefreshTokenPayloadDto {
  userId: string;
}
