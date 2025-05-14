export type Tag = {
  _id: string;
  text: string;
  color: string;
  createdBy: string;

  workspaceId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TagResponse = {
  statusCode: number;
  message: string;
  data: Tag;
};
