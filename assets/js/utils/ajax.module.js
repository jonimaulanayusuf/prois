import popup from "../utils/popup.module.js";

function ajaxError(error, replaceErrorWhenValid) {
  const defaultError = function (xhr) {
    const error = xhr.responseJSON;
    popup.error(error?.message);
  };

  if (typeof error === "function") {
    return function (xhr) {
      if (replaceErrorWhenValid) {
        error(xhr);
      } else {
        defaultError(xhr);
        error(xhr);
      }
    };
  }

  return defaultError;
}

function _get(url, success, error, replaceErrorWhenValid) {
  $.ajax({
    url: url,
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    xhrFields: { withCredentials: true },
    success: success,
    error: ajaxError(error, replaceErrorWhenValid),
  });
}

function _delete(url, success, error, replaceErrorWhenValid) {
  $.ajax({
    url: url,
    method: "DELETE",
    headers: {
      Accept: "application/json",
    },
    xhrFields: { withCredentials: true },
    success: success,
    error: ajaxError(error, replaceErrorWhenValid),
  });
}

function _post(
  url,
  data,
  success,
  error,
  replaceErrorWhenValid,
  isContentJSON
) {
  $.ajax({
    url: url,
    method: "POST",
    headers: {
      Accept: "application/json",
      ...(isContentJSON && { "Content-Type": "application/json" }),
    },
    xhrFields: { withCredentials: true },
    data: data,
    processData: false,
    contentType: isContentJSON ? "application/json" : false,
    success: success,
    error: ajaxError(error, replaceErrorWhenValid),
  });
}

function _patch(url, data, success, error, replaceErrorWhenValid) {
  $.ajax({
    url: url,
    method: "PATCH",
    headers: {
      Accept: "application/json",
    },
    xhrFields: { withCredentials: true },
    data: data,
    processData: false,
    contentType: false,
    success: success,
    error: ajaxError(error, replaceErrorWhenValid),
  });
}

export default {
  get: _get,
  delete: _delete,
  post: _post,
  patch: _patch,
};
