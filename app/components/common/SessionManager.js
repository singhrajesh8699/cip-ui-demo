let singleton = Symbol();
let singletonEnforcer = Symbol();

class SessionManager {
    token = null;
    user = null;


  constructor(enforcer) {
    if(enforcer != singletonEnforcer) throw "Cannot construct singleton";

        this.token = localStorage.getItem('token');
        try{
            this.user = JSON.parse(localStorage.getItem('user'));
        }catch(err){
            console.log(err);
        }
  }

  static get instance() {
    if(!this[singleton]) {
      this[singleton] = new SessionManager(singletonEnforcer);
    }

    return this[singleton];
  }

    setSession(token, user) {
        localStorage.setItem('token', token);
        this.token = token;

        localStorage.setItem('user', JSON.stringify(user));
        this.user = user;
    }

    isUserLoggedIn() {
        return this.token !== null
    }

    getToken() {
        return this.token;
    }

    getUser() {
        return this.user;
    }

    logout() {
        localStorage.removeItem('token');
        this.token = null;

        localStorage.removeItem('user');
        this.user = null;
    }

}

export default SessionManager
