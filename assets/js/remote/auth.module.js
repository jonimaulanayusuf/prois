import config from "../config.module.js";
import ajax from "../utils/ajax.module.js";

function register(
  username,
  password,
  passwordConfirmation,
  success,
  error = null,
  replaceErrorWhenValid = false
) {
  const data = new FormData();
  data.append("username", username);
  data.append("password", password);
  data.append("password_confirmation", passwordConfirmation);

  const url = `${config.apiBaseUrl}/auth/register`;
  ajax.post(url, data, success, error, replaceErrorWhenValid);
}

function login(
  username,
  password,
  success,
  error = null,
  replaceErrorWhenValid = false
) {
  const data = new FormData();
  data.append("username", username);
  data.append("password", password);

  const url = `${config.apiBaseUrl}/auth/login`;
  ajax.post(url, data, success, error, replaceErrorWhenValid);
}

function registration(
  username,
  password,
  passwordConfirmation,
  success,
  error = null,
  replaceErrorWhenValid = false
) {
  const data = JSON.stringify({
    username: username,
    password: password,
    password_confirmation: passwordConfirmation,
  });

  const url = `${config.apiBaseUrl}/auth/register`;
  ajax.post(url, data, success, error, replaceErrorWhenValid, true);
}

function logout(success, error = null, replaceErrorWhenValid = false) {
  const url = `${config.apiBaseUrl}/auth/logout`;
  ajax.delete(url, success, error, replaceErrorWhenValid);
}

function me(success, error = null, replaceErrorWhenValid = false) {
  const url = `${config.apiBaseUrl}/auth/me`;
  ajax.get(url, success, error, replaceErrorWhenValid);
}

export default {
  registration,
  login,
  logout,
  me,
};
