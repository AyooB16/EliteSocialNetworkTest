export class User {
  constructor(
    public _id: string,
    public email: string,
    public password: string,
    public username: string,
    public image: string,
    public bio: string
  ) {}
}
