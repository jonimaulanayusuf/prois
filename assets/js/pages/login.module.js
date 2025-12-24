import auth from "../remote/auth.module.js";
import "../components/unprotected.js";

$("#loginForm").on("submit", function (e) {
  e.preventDefault();

  const username = $("#username").val().trim();
  const password = $("#password").val().trim();
  const $btnSubmit = $("#btnSubmit");

  $btnSubmit.prop("disabled", true);

  auth.login(
    username,
    password,
    () => {
      window.location = "dashboard.html";
    },
    () => {
      $btnSubmit.prop("disabled", false);
    },
    true
  );
});
