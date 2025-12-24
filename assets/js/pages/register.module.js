import auth from "../remote/auth.module.js";
import "../components/unprotected.js";

$("#registerForm").on("submit", function (e) {
  e.preventDefault();

  const username = $("#username").val().trim();
  const password = $("#password").val().trim();
  const passwordConfirmation = $("#passwordConfirmation").val().trim();
  const $btnSubmit = $("#btnSubmit");

  $btnSubmit.prop("disabled", true);

  auth.registration(
    username,
    password,
    passwordConfirmation,
    () => {
      window.location = "dashboard.html";
    },
    () => {
      $btnSubmit.prop("disabled", false);
    }
  );
});
