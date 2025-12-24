import config from "../config.module.js";
import ajax from "../utils/ajax.module.js";

function _get(
  search,
  page,
  success,
  error = null,
  replaceErrorWhenValid = false
) {
  const url = `${config.apiBaseUrl}/purchasings?search=${search}&page=${page}&limit=10`;
  ajax.get(url, success, error, replaceErrorWhenValid);
}

function _detail(id, success, error = null, replaceErrorWhenValid = false) {
  const url = `${config.apiBaseUrl}/purchasings/${id}`;
  ajax.get(url, success, error, replaceErrorWhenValid);
}

function _create(
  supplierId,
  date,
  items,
  success,
  error = null,
  replaceErrorWhenValid = false
) {
  const data = JSON.stringify({
    supplier_id: supplierId,
    date,
    items,
  });

  const url = `${config.apiBaseUrl}/purchasings`;
  ajax.post(url, data, success, error, replaceErrorWhenValid, true);
}

export default {
  get: _get,
  detail: _detail,
  create: _create,
};
