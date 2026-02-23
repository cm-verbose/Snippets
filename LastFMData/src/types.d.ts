import type { Song, Track } from "./last.fm";

interface FormattedSong {
  track: Track;
  song: Song;
}

interface NoFormattedSong {
  track: Track;
  song: { err: "no data found" };
}

export { FormattedSong, NoFormattedSong };
