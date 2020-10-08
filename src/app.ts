import express, { Application } from "express";
import appcsv from "./routes/csv.routes"   


export class App {
  private app: Application;

  constructor(private port?: number | string) {
    console.info("Initializing Node js");
    this.app = express();
    this.settings();
    this.middlewares();
    this.routes();
  }

  settings() {   
    this.app.set("port", this.port || 4010);  
    this.app.set('view engine', 'ejs');  
  }

  middlewares() {
    this.app.use(express.json());
  }

  routes() {
    this.app.use(appcsv);
    console.info("Routes Loaded successfuly");
  }

  async listen() {
    (async () => {
      try {
        this.app.listen(this.app.get("port"), '0.0.0.0');
      } catch (error) {
        console.error(
          "There was a Error with the Server Initialization",
          error
        );
      }
    })();
    console.info(`Initializing CSV uploader on :${this.app.get("port")}`);

  }
}
