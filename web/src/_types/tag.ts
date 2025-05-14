export type Tag = {
  _id: string;
  workspaceId: string;
  createdBy: string;
  color: string;
  text: string;

  createdAt?: Date;
  updatedAt?: Date;
};
