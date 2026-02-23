export default class LastFMRequest {
  private PREFIX = "http://ws.audioscrobbler.com/2.0/" as const;
  private reqStr = `${this.PREFIX}`;

  /**
   * Format request with a method to a call
   * @param method
   * @returns
   */
  public call(method: string): Omit<LastFMRequest, "call"> {
    this.reqStr += `?method=${method}`;
    return this;
  }

  /**
   * Set the username
   * @param username
   * @returns
   */
  public setUser(username: string): Omit<LastFMRequest, "setUser"> {
    this.reqStr += `&user=${username}`;
    return this;
  }

  /**
   * Set the API Key to access some data
   * @param apiKey the key to use
   * @returns
   */
  public setAPIKey(apiKey: string): Omit<LastFMRequest, "setAPIKey"> {
    this.reqStr += `&api_key=${apiKey}`;
    return this;
  }

  /**
   * Set the returned format of the data
   * @param format the format to use
   * @returns
   */
  public setFormat(format: string): Omit<LastFMRequest, "setFormat"> {
    this.reqStr += `&format=${format}`;
    return this;
  }

  /**
   * Set the limit for the request information
   * @param limit the limit to use
   * @returns
   */
  public setLimit(limit: number): Omit<LastFMRequest, "setLimit"> {
    this.reqStr += `&limit=${limit}`;
    return this;
  }

  public setPage(page: number): Omit<LastFMRequest, "setPage"> {
    this.reqStr += `&page=${page}`;
    return this;
  }

  public setMBID(mbid: string): Omit<LastFMRequest, "setMBID"> {
    this.reqStr += `&mbid=${mbid}`;
    return this;
  }

  public toString() {
    return this.reqStr;
  }
}
