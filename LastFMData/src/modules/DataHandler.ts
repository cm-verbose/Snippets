import UserHandler from "./UserHandler";
import { FormattedSong, NoFormattedSong, RecentTracks, Song, Track, User } from "../types";
import LastFMRequest from "./LastFMRequest";
import fs from "fs";

/** Handles Last.FM data tracked from Spotify */
export default class DataHandler {
  private API_KEY!: string;
  private USERNAME!: string;
  private songMap: Map<string, number> = new Map();
  private songs: (FormattedSong | NoFormattedSong)[] = [];

  constructor() {
    this.ini();
  }

  private async ini() {
    const user: User = await this.getUser();
    const playCount: number = parseInt(user.user.playcount);

    await this.getSongs(playCount);
  }

  /** Get user information */
  private async getUser(): Promise<User> {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("[Auth]: Invalid API Key");
    this.API_KEY = apiKey;

    const username = process.env.ACCOUNT_USERNAME;
    if (!username) throw new Error("[Auth]: Invalid username");
    this.USERNAME = username;

    const authHandler = new UserHandler();
    const opResult = await authHandler.getUser(username, apiKey);

    return opResult;
  }

  /** Get song information */
  private async getSongs(count: number) {
    const LAST_PAGE = Math.ceil(count / 1000) + 1;

    if (!fs.existsSync("./data")) {
      fs.mkdirSync("./data");
    }

    for (let page = 1; page < LAST_PAGE; page++) {
      console.log(`[Page ${page} / ${LAST_PAGE}]`);

      const pageURL = new LastFMRequest()
        .call("user.getrecenttracks")
        .setUser(this.USERNAME)
        .setAPIKey(this.API_KEY)
        .setFormat("json")
        .setLimit(1000)
        .setPage(page);

      const pageRes = await fetch(pageURL.toString());
      const pageJSON: RecentTracks = await pageRes.json();

      await this.getSongData(pageJSON.recenttracks.track);
      fs.writeFileSync(`data/data_page_${page}.json`, JSON.stringify(this.songs));
      this.songs = [];
      this.songMap.clear();
    }
    await this.joinFiles("./data/combined.json");
    for (let page = 1; page < LAST_PAGE; page++) {
      fs.rmSync(`./data/data_page_${page}.json`);
    }
  }

  /** Get song data from an array of tracks */
  private async getSongData(tracks: Track[]) {
    for (const track of tracks) {
      const trackMBID = track.mbid;

      if (this.songMap.has(trackMBID)) {
        const index = this.songMap.get(trackMBID);

        if (index === undefined) continue;
        const song = this.songs[index];
        if (!song) continue;

        this.songs.push(song);
      } else if (trackMBID !== "") {
        const songLength = this.songs.length;
        this.songMap.set(trackMBID, songLength === 0 ? 0 : songLength - 1);

        const songURL = new LastFMRequest()
          .call("track.getInfo")
          .setAPIKey(this.API_KEY)
          .setMBID(trackMBID)
          .setFormat("json");

        const songResponse = await fetch(songURL.toString());
        const songData: Song = await songResponse.json();

        const formated: FormattedSong = {
          track,
          song: songData,
        };
        this.songs.push(formated);
      } else {
        const formated: NoFormattedSong = {
          track,
          song: { err: "no data found" },
        };
        this.songs.push(formated);
      }
    }
  }

  /** Join generated files */
  async joinFiles(combinedName: string) {
    const files = fs.readdirSync("data/").sort((a, b) => {
      const nA = parseInt(a.match(/\d+/g)![0]);
      const nB = parseInt(b.match(/\d+/g)![0]);
      return nA - nB;
    });

    const writeStream = fs.createWriteStream(combinedName);
    writeStream.write("[");
    let i = 1;
    for (const file of files) {
      const data = fs.readFileSync(`./data/${file}`, { encoding: "utf-8" });
      let replaceCharacter = ",";

      if (i == files.length) {
        replaceCharacter = "";
      }
      const repl = data.replace(/\s*\]\s*$/g, replaceCharacter).replace(/^\s*\[\s*/g, "");
      writeStream.write(repl);
      i += 1;
    }
    writeStream.write("]");
    writeStream.end();
  }
}
