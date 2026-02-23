declare type TaggedTextWrap<O extends Record<K, V>> = {
  "#text": string;
} & O;

type SizeWrapper = TaggedTextWrap<{ size: number }>;

/** Represents different sizes for the images fields */
declare enum Size {
  SMALL,
  MEDIUM,
  LARGE,
  EXTRALARGE,
}

/** String representation of sizes */
type SizeRepr = Lowercase<keyof typeof Size>;
type SizeUnion<K> = K extends SizeRepr ? TaggedTextWrap<{ size: K }> : never;
type ImageSizeArray = Array<SizeUnion<SizeRepr>>;

// Users
interface User {
  user: {
    name: string;
    age: string;
    subscriber: string;
    realname: string;
    bootstrap: string;
    playcount: string;
    artist_count: string;
    playlists: string;
    track_count: string;
    album_count: string;
    image: ImageSizeArray;
    registered: TaggedTextWrap<{ unixtime: string }>;
    country: string;
    gender: string;
    url: string;
    type: string;
  };
}

// Recent Tracks
interface RecentTracks {
  recenttracks: {
    track: Track[];
    "@attr": {
      user: string;
      totalPages: string;
      page: string;
      total: string;
      perPage: string;
    };
  };
}

interface Track {
  "@attr"?: { nowplaying: "true" };
  artist: TaggedTextWrap<{ mbid: string }>;
  album: TaggedTextWrap<{ mbid: string }>;
  date?: TaggedTextWrap<{ uts: string }>;
  image: ImageSizeArray;
  name: string;
  mbid: string;
  streamable: string;
  url: string;
}

// Songs
interface Song {
  track: {
    name: string;
    mbid?: string;
    url: string;
    duration: string;
    streamable: TaggedTextWrap<{ fulltrack: string }> | string;
    listeners: string;
    playcount: string;
    artist: {
      name: string;
      mbid: string;
      url: string;
    };
    album?: {
      artist: string;
      title: string;
      url: string;
      image: ImageSizeArray;
    };
    toptags: {
      tag: Array<{ name: string; url: string }> | string | any;
    };
    wiki?: {
      published: string;
      summary: string;
      content: string;
    };
  };
}

/// Formatted Song (custom)
interface FormattedSong {
  track: Track, 
  song: Song,
}

interface NoFormattedSong {
  track: Track, 
  song: { err: "no data found" }
}

export { FormattedSong, NoFormattedSong, RecentTracks, Song, Track, User };
