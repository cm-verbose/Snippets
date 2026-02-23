import { User } from "../last.fm";
import LastFMRequest from "./LastFMRequest";

/** Handles logic tied with authentication */
export default class UserHandler {
  constructor() {}

  /**
   * Get a user using an application connected to that user
   * @param username The username of the user to get
   * @param apiKey The API key of a registered service to that user
   * @returns The user data
   */
  public async getUser(username: string, apiKey: string): Promise<User> {
    const request = new LastFMRequest()
      .call("user.getinfo")
      .setUser(username)
      .setAPIKey(apiKey)
      .setFormat("json");

    const result = await fetch(request.toString());
    const json: User = await result.json();

    return json;
  }
}
