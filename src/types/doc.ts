export type Doc<T> = T & {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};
