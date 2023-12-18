"use strict";

const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";

class Story {
  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }

  getHostName() {
    return "hostname.com";
    // let storyURL = new URL(this.url);
    // return storyURL.hostname;
  }
}

class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

  static async getStories() {
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "GET",
    });
     const stories = response.data.stories.map(story => new Story(story));
     return new StoryList(stories);
  }

    /**
     * Method to add a new story.
     *
     * @param {User} user 
     * @param {Object} newStory 
     * @returns {Story}.
     */
    async addStory(user, newStory) {
          // UNIMPLEMENTED: complete this function!
      // const response = await axios.post(`${BASE_URL}/stories`, {
      //   token: user.loginToken,
      //   story: newStory
      // });
  
      // const story = new Story(response.data.story);
      // this.stories.unshift(story);
      // return story;


        try {
          const response = await axios.post(`${BASE_URL}/stories`, {
            token: user.loginToken,
            story: newStory
          });
      
          const story = new Story(response.data.story);
          this.stories.unshift(story);
          return story;
        } catch (err) {
          console.error("Error adding story:", err.response.data);
          throw new Error("Failed to add story");
        }
      
      
    }
}


class User {
  /** Make user instance from obj of user data and a token:
   *   - {username, name, createdAt, favorites[], ownStories[]}
   *   - token
   */

  constructor({
                username,
                name,
                createdAt,
                favorites = [],
                ownStories = []
              },
              token) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    // instantiate Story instances for the user's favorites and ownStories
    this.favorites = favorites.map(s => new Story(s));
    this.ownStories = ownStories.map(s => new Story(s));

    // store the login token on the user so it's easy to find for API calls.
    this.loginToken = token;
  }

  /** Register new user in API, make User instance & return it.
   *
   * - username: a new username
   * - password: a new password
   * - name: the user's full name
   */

  static async signup(username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });

    let { user } = response.data

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** Login in user with API, make User instance & return it.

   * - username: an existing user's username
   * - password: an existing user's password
   */

  static async login(username, password) {
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** When we already have credentials (token & username) for a user,
   *   we can log them in automatically. This function does that.
   */

  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      let { user } = response.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }
  async addFavorite(storyId) {
    await axios.post(`${BASE_URL}/users/${this.username}/favorites/${storyId}`, {
      token: this.loginToken,
    });
    this.favorites.push(storyId);
  }

  async removeFavorite(storyId) {
    await axios.delete(`${BASE_URL}/users/${this.username}/favorites/${storyId}`, {
      data: { token: this.loginToken },
    });
    this.favorites = this.favorites.filter(s => s.storyId !== storyId);
  }
  async deleteStory(storyId) {
    await axios.delete(`${BASE_URL}/stories/${storyId}`, {
      data: { token: this.loginToken },
    });
    this.ownStories = this.ownStories.filter(s => s.storyId !== storyId);
  }
}
