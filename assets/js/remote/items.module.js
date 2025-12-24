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
  const url = `${config.apiBaseUrl}/items?search=${search}&page=${page}&limit=${limit}`;
  ajax.get(url, success, error, replaceErrorWhenValid);
}

function _create(
  name,
  stock,
  price,
  success,
  error = null,
  replaceErrorWhenValid = false
) {
  const data = new FormData();
  data.append("name", name);
  data.append("stock", stock);
  data.append("price", price);

  const url = `${config.apiBaseUrl}/items`;
  ajax.post(url, data, success, error, replaceErrorWhenValid);
}

function _update(
  id,
  name,
  stock,
  price,
  success,
  error = null,
  replaceErrorWhenValid = false
) {
  const data = new FormData();
  data.append("name", name);
  data.append("stock", stock);
  data.append("price", price);

  const url = `${config.apiBaseUrl}/items/${id}`;
  ajax.patch(url, data, success, error, replaceErrorWhenValid);
}

function _delete(id, success, error = null, replaceErrorWhenValid = false) {
  const url = `${config.apiBaseUrl}/items/${id}`;
  ajax.delete(url, success, error, replaceErrorWhenValid);
}

export default {
  get: _get,
  create: _create,
  update: _update,
  delete: _delete,
};
