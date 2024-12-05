import { Document } from "mongodb";

export class User implements Document {
  public email!: string;
  public password!: string;
  public fullName!: string;
}
