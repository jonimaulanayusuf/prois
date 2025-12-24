import "../components/sidebar.js";
import "../components/protected.js";
import remote from "../remote/purchasings.module.js";
import supplierRemote from "../remote/suppliers.module.js";
import itemRemote from "../remote/items.module.js";
import popup from "../utils/popup.module.js";
import array from "../utils/array.module.js";
import formatter from "../utils/formatter.module.js";

let purchasings = [];
let suppliers = [];
let items = [];
let page = 1;
let search = "";
let pages = [];

const $tbody = $("#purchasingsTableBody");
const $pagination = $("#purchasingsPagination");
const $btnSubmit = $("#btnSubmit");

const $itemsBody = $("#purchaseItemsBody");
const $addItemBtn = $("#addItemRowBtn");
const $grandTotalInput = $("#grandTotal");

$addItemBtn.on("click", function (e) {
  const options = items
    .map((item) => `<option value="${item.id}">${item.name}</option>`)
    .join("");

  $itemsBody.append(`
      <tr>
        <td>
          <select class="form-select itemId" required>
            <option value="">Select item</option>
            ${options}
          </select>
        </td>
        <td>
          <input
            type="hidden"
            class="form-control price"
          />
          <span style="font-size: 14px" class="fw-semibold price-view"
            >${formatter.money(0)}</span
          >
        </td>
        <td>
          <input
            type="number"
            class="form-control qty"
            min="1"
            value="1"
            required
          />
        </td>
        <td>
          <input
            type="hidden"
            class="form-control subtotal"
          />
          <span style="font-size: 14px" class="fw-semibold subtotal-view"
            >${formatter.money(0)}</span
          >
        </td>
        <td class="text-center">
          <button
            type="button"
            class="btn btn-sm btn-outline-danger itemDeleteBtn"
          >
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
  `);

  const $newRow = $itemsBody.children().last();
  attachRowEvents($newRow);
});

function calculateGrandTotal() {
  let total = 0;

  $(".subtotal").each(function () {
    total += Number($(this).val() || 0);
  });

  $grandTotalInput.text(formatter.money(total));
}

function attachRowEvents(row) {
  const $itemId = row.find(".itemId");
  const $priceView = row.find(".price-view");
  const $price = row.find(".price");
  const $qty = row.find(".qty");
  const $subtotalView = row.find(".subtotal-view");
  const $subtotal = row.find(".subtotal");
  const $itemDeleteBtn = row.find(".itemDeleteBtn");

  function calculateRowSubtotal() {
    const price = Number($price.val() || 0);
    const qty = Number($qty.val() || 0);
    const subtotal = price * qty;

    $subtotal.val(subtotal);
    $subtotalView.text(formatter.money(subtotal));

    calculateGrandTotal();
  }

  $itemId.on("input", function (e) {
    const id = e.target.value;
    const item = items.find((i) => i.id === id);

    if (!item) {
      $priceView.text(formatter.money(0));
      $price.val(0);
    } else {
      $priceView.text(formatter.money(item.price));
      $price.val(item.price);
    }

    calculateRowSubtotal();
  });

  $qty.on("input", function (e) {
    calculateRowSubtotal();
  });

  $itemDeleteBtn.on("click", function (e) {
    row.remove();
    calculateRowSubtotal();
  });
}

$(document).ready(function () {
  reload();
});

function renderTable() {
  $tbody.empty();
  purchasings.forEach((purchasing, index) => {
    const n = (page - 1) * 10 + index + 1;
    $tbody.append(`
      <tr data-id="${purchasing.id}">
        <td class="text-center">${n}</td>
        <td>${formatter.date(purchasing.date)}</td>
        <td>${purchasing.id}</td>
        <td>${purchasing.supplier_name}</td>
        <td>${formatter.money(purchasing.grand_total)}</td>
        <td>
          <button class="btn btn-sm btn-outline-secondary detailPurchasingBtn">
            Detail
          </button>
        </td>
      </tr>
    `);
  });
}

function renderPagination() {
  $pagination.empty();
  pages.forEach((page_) => {
    $pagination.append(`
      <li class="page-item ${page == page_ && "disabled"}" data-page="${page_}">
        <button class="page-link paginationPurchasingBtn">${page_}</button>
      </li>
    `);
  });
}

$("#searchPurchasingInput").on("input", (e) => {
  search = e.target.value;
  page = 1;
  reload();
});

function reload() {
  remote.get(search, page, (res) => {
    const result = res?.result;

    purchasings =
      result?.data?.map((purchasing) => {
        return {
          id: purchasing.id,
          date: purchasing.date,
          supplier_name: purchasing.supplier_name,
          grand_total: purchasing.grand_total,
        };
      }) ?? [];

    page = result?.page ?? 1;

    const totalPages = result?.total_pages ?? 1;
    pages = array.numberToArray(Math.max(totalPages, 1));

    renderTable();
    renderPagination();
  });
}

$("#addPurchasingBtn").on("click", function () {
  $("#purchasingForm")[0].reset();
  $itemsBody.empty();
  calculateGrandTotal();
  itemRemote.get(
    "",
    1,
    (res) => {
      const result = res?.result;

      items =
        result?.data?.map((item) => {
          return {
            id: item.id,
            name: item.name,
            stock: item.stock,
            price: item.price,
          };
        }) ?? [];

      supplierRemote.get(
        "",
        1,
        (res) => {
          const result = res?.result;

          suppliers =
            result?.data?.map((supplier) => {
              return {
                id: supplier.id,
                name: supplier.name,
                email: supplier.email,
                address: supplier.address,
              };
            }) ?? [];

          const options = suppliers
            .map((item) => `<option value="${item.id}">${item.name}</option>`)
            .join("");

          $("#purchasingSupplierId").html(`
        <option value="">Select supplier</option>
        ${options}
      `);
        },
        null,
        false,
        1000
      );
    },
    null,
    false,
    1000
  );
});

$(document).on("click", ".paginationPurchasingBtn", function () {
  const $li = $(this).closest("li");
  page = $li.data("page");
  reload();
});

function postSuccessSubmit(message) {
  reload();
  popup.success(message);

  const purchasingModal = bootstrap.Modal.getInstance(
    document.getElementById("purchaseModal")
  );

  purchasingModal.hide();
  $btnSubmit.prop("disabled", false);
}

$("#purchasingForm").on("submit", function (e) {
  e.preventDefault();

  $btnSubmit.prop("disabled", true);

  const supplierId = $("#purchasingSupplierId").val();
  const date = $("#purchasingDate").val();
  const items = [];

  $itemsBody.find("tr").each(function () {
    const $row = $(this);
    const itemId = $row.find(".itemId").val();
    const qty = $row.find(".qty").val();
    items.push({
      item_id: itemId,
      qty: Number(qty),
    });
  });

  remote.create(
    supplierId,
    date,
    items,
    () => postSuccessSubmit("Purchasing successfully created!"),
    () => $btnSubmit.prop("disabled", false)
  );
});

$(document).on("click", ".detailPurchasingBtn", function () {
  const $tr = $(this).closest("tr");
  const id = $tr.data("id");
  const purchasing = purchasings.find((i) => i.id === id);
  if (!purchasing) return;

  remote.detail(id, (res) => {
    const data = res?.data;

    const rows =
      data?.details
        ?.map(
          (d) => `
      <tr>
        <td>${d.item.name}</td>
        <td>${formatter.money(d.item.price)}</td>
        <td style="width: 120px">${d.qty}</td>
        <td style="width: 180px">${formatter.money(d.subtotal)}</td>
      </tr>
    `
        )
        .join("") ?? "";

    $("#detailPurchasingId").val(data?.id);
    $("#detailPurchasingSupplierId").val(data?.supplier?.name);
    $("#detailPurchasingDate").val(data?.date ? formatter.date(data.date) : "");
    $("#detailPurchaseItemsBody").html(rows);
    $("#detailGrandTotal").text(formatter.money(data.grand_total));
  });

  const purchasingDetailModal = new bootstrap.Modal(
    document.getElementById("purchaseDetailModal")
  );

  purchasingDetailModal.show();
});
