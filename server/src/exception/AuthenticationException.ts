import ApplicationException from "./ApplicationException";

class AuthenticationException extends ApplicationException {
  constructor() {
    super("Authentication Failed", 401);
  }
}

export default AuthenticationException;
