import { User } from './User';
import { Comment } from './Comment';

export class Post {
  constructor(
    public _id: string,
    public user: User,
    public text: string,
    public comments: string[],
    public commentsShowed: Comment[],
    public likes: string[],
    public showComments: boolean,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
