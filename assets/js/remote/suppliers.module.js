import config from "../config.module.js";
import ajax from "../utils/ajax.module.js";

function _get(
  search,
  page,
  success,
  error = null,
  replaceErrorWhenValid = false,
  limit = 10
) {
  const url = `${config.apiBaseUrl}/suppliers?search=${search}&page=${page}&limit=${limit}`;
  ajax.get(url, success, error, replaceErrorWhenValid);
}

function _create(
  name,
  email,
  address,
  success,
  error = null,
  replaceErrorWhenValid = false
) {
  const data = new FormData();
  data.append("name", name);
  data.append("email", email);
  data.append("address", address);

  const url = `${config.apiBaseUrl}/suppliers`;
  ajax.post(url, data, success, error, replaceErrorWhenValid);
}

function _update(
  id,
  name,
  email,
  address,
  success,
  error = null,
  replaceErrorWhenValid = false
) {
  const data = new FormData();
  data.append("name", name);
  data.append("email", email);
  data.append("address", address);

  const url = `${config.apiBaseUrl}/suppliers/${id}`;
  ajax.patch(url, data, success, error, replaceErrorWhenValid);
}

function _delete(id, success, error = null, replaceErrorWhenValid = false) {
  const url = `${config.apiBaseUrl}/suppliers/${id}`;
  ajax.delete(url, success, error, replaceErrorWhenValid);
}

export default {
  get: _get,
  create: _create,
  update: _update,
  delete: _delete,
};
