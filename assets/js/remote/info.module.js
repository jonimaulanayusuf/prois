import config from "../config.module.js";
import ajax from "../utils/ajax.module.js";

function summary(success, error = null, replaceErrorWhenValid = false) {
  const url = `${config.apiBaseUrl}/info`;
  ajax.get(url, success, error, replaceErrorWhenValid);
}

export default {
  summary,
};
