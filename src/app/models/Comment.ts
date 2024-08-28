import { User } from './User';
import { Post } from './Post';

export class Comment {
  constructor(
    public _id: string,
    public user: User,
    public post: Post,
    public text: string,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
