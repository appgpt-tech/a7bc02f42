//Class to create tables and seed new database
import { DataSource } from "typeorm";
import { DBConfiguration } from "./Configuration";
import { SettingsEntity } from "./db/Settings.entity";
//autogenerate imports based on resources
import { BooksEntity } from "./db/Books.entity";
import { AuthorsEntity } from "./db/Authors.entity";
import { GenresEntity } from "./db/Genres.entity";

export class Database {
  static dbConfiguration: DBConfiguration;
  public static ds: DataSource;

  static async Initialize(dbConfiguration: DBConfiguration) {
    Database.dbConfiguration = dbConfiguration;
    let dbConfig: any = dbConfiguration as any;
    //Autogenerate entities array from resource names

    dbConfig.entities = [SettingsEntity, BooksEntity, AuthorsEntity, GenresEntity];
    Database.ds = new DataSource(dbConfig);
    await Database.ds.initialize();

    //TODO: Drop all tables


    await Database.Seed();
  }
  static async Seed() {
    let data: any = {"Books":[{"Title":"To Kill a Mockingbird","Author":"Harper Lee","Genre":"Southern Gothic, Legal Thriller","BookCover":"MockingbirdCover.png"},{"Title":"1984","Author":"George Orwell","Genre":"Dystopian, Political Fiction, Social Science Fiction","BookCover":"1984Cover.png"},{"Title":"Pride and Prejudice","Author":"Jane Austen","Genre":"Classic, Regency Romance","BookCover":"PrideAndPrejudiceCover.png"}],"Authors":[{"Name":"Harper Lee","Books":["To Kill a Mockingbird"]},{"Name":"George Orwell","Books":["1984"]},{"Name":"Jane Austen","Books":["Pride and Prejudice"]}],"Genres":[{"Category":"Southern Gothic"},{"Category":"Legal Thriller"},{"Category":"Dystopian"}]};
    //Autogenerate multiple such calls ie for each resource and its data object
    let isSeeded = await this.IsSeeded();
    //if (!isSeeded) {
    //forcing app recreation
    if (true){
      console.log('   Seeding database...');
      await this.SeedResource("BooksEntity", data.Books);
await this.SeedResource("AuthorsEntity", data.Authors);
await this.SeedResource("GenresEntity", data.Genres); 
      await this.SeedResource("SettingsEntity", {
        settingname: "isSeeded",
        settingvalue: "true",
      });
    }else{
      console.log('   Database seeded already!');
    }
  }
  static async IsSeeded() {
    const repo = Database.ds.getRepository("SettingsEntity");
    let rec: any = await repo.findOne({
      select: {
        settingname: true,
        settingvalue: true,
      },
      where: {
        settingname: "isSeeded",
      },
    });
    if (rec && rec.settingvalue) return true;
    return false;
  }
  static async SeedResource(resourceName: any, resourceData: any) {
    const repo = Database.ds.getRepository(resourceName);
    //await repo.clear();
    console.log('   Seeding table '+resourceName);
    await repo.upsert(resourceData, ["id"]);
  }
}

