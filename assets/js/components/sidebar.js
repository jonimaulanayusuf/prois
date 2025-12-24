import auth from "../remote/auth.module.js";

export default (() => {
  $("#logoutBtn").on("click", function (e) {
    e.preventDefault();
    auth.logout(() => {
      window.location = "login.html";
    });
  });
})();
