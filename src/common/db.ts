import { Db, MongoClient } from "mongodb";

export class MongoDb extends Db {
  private static instance: Db;
  public static getInstance() {
    return this.instance;
  }

  public static async init() {
    if (!this.instance) {
      const mongo = new MongoClient(process.env.DATABASE_URL);
      await mongo.connect();
      this.instance = mongo.db(process.env.DATABASE_NAME);
    }
  }
}
