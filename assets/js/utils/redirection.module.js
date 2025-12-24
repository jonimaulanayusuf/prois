import auth from "../remote/auth.module.js";

function redirectIfNotLogin() {
  auth.me(
    null,
    () => {
      window.location = "login.html";
    },
    true
  );
}

function redirectIfLogin() {
  auth.me(
    () => {
      window.location = "dashboard.html";
    },
    () => {},
    true
  );
}

function redirectAfterAuthCheck() {
  auth.me(
    () => {
      window.location = "dashboard.html";
    },
    () => {
      window.location = "login.html";
    },
    true
  );
}

export default {
  redirectIfNotLogin,
  redirectIfLogin,
  redirectAfterAuthCheck,
};
