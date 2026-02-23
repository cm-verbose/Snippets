import dotenv from "dotenv";
import DataHandler from "./modules/DataHandler";

/** Handles statistics */
class SongManager {
  constructor() {
    this.ini();
  }

  private ini() {
    dotenv.config({ quiet: true });
    new DataHandler();
  }
}

new SongManager();
