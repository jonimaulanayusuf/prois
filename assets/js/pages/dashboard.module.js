import "../components/sidebar.js";
import "../components/protected.js";
import remote from "../remote/info.module.js";

$(document).ready(function () {
  remote.summary(
    (res) => {
      $("#totalItems").text(res.data?.total_items);
      $("#totalSuppliers").text(res.data?.total_suppliers);
      $("#totalPurchasings").text(res.data?.total_purchasings);
    },
    () => {}
  );
});
