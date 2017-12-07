export class Auth {

  constructor() {
    this.xyloLoggedIn = false;
  }

  login() {
    this.xyloLoggedIn = true;
  }

  loggedIn() {
    return this.xyloLoggedIn;
  }
}

export let auth = new Auth();