import "../components/sidebar.js";
import "../components/protected.js";
import remote from "../remote/items.module.js";
import popup from "../utils/popup.module.js";
import array from "../utils/array.module.js";
import formatter from "../utils/formatter.module.js";

let items = [];
let limit = 0;
let page = 1;
let search = "";
let pages = [];

const $tbody = $("#itemsTableBody");
const $pagination = $("#itemsPagination");
const $btnSubmit = $("#btnSubmit");

$(document).ready(function () {
  reload();
});

function renderTable() {
  $tbody.empty();
  items.forEach((item, index) => {
    const n = (page - 1) * 10 + index + 1;
    $tbody.append(`
      <tr data-id="${item.id}">
        <td class="text-center">${n}</td>
        <td>${item.name}</td>
        <td>${item.stock}</td>
        <td>${formatter.money(item.price)}</td>
        <td>
          <button class="btn btn-sm btn-outline-secondary editItemBtn">Edit</button>
          <button class="btn btn-sm btn-outline-danger deleteItemBtn">Delete</button>
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
        <button class="page-link itemPaginationBtn">${page_}</button>
      </li>
    `);
  });
}

$("#searchItemInput").on("input", (e) => {
  search = e.target.value;
  page = 1;
  reload();
});

function reload() {
  remote.get(search, page, (res) => {
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

    limit = result?.limit ?? 0;
    page = result?.page ?? 1;

    const totalPages = result?.total_pages ?? 1;
    pages = array.numberToArray(Math.max(totalPages, 1));

    renderTable();
    renderPagination();
  });
}

$("#addItemBtn").on("click", function () {
  $("#itemModalLabel").text("Add Item");
  $("#itemForm")[0].reset();
  $("#itemId").val("");
});

$(document).on("click", ".editItemBtn", function () {
  const $tr = $(this).closest("tr");
  const id = $tr.data("id");
  const item = items.find((i) => i.id === id);
  if (!item) return;

  $("#itemModalLabel").text("Edit Item");
  $("#itemId").val(item.id);
  $("#itemName").val(item.name);
  $("#itemStock").val(item.stock);
  $("#itemPrice").val(item.price);

  const itemModal = new bootstrap.Modal(document.getElementById("itemModal"));
  itemModal.show();
});

$(document).on("click", ".itemPaginationBtn", function () {
  const $li = $(this).closest("li");
  page = $li.data("page");
  reload();
});

function postSuccessSubmit(message) {
  reload();
  popup.success(message);

  const itemModal = bootstrap.Modal.getInstance(
    document.getElementById("itemModal")
  );

  itemModal.hide();
  $btnSubmit.prop("disabled", false);
}

$("#itemForm").on("submit", function (e) {
  e.preventDefault();

  const id = $("#itemId").val();
  const name = $("#itemName").val();
  const stock = parseInt($("#itemStock").val());
  const price = parseInt($("#itemPrice").val());

  $btnSubmit.prop("disabled", true);

  if (id) {
    remote.update(
      id,
      name,
      stock,
      price,
      () => postSuccessSubmit("Item successfully updated!"),
      () => $btnSubmit.prop("disabled", false)
    );
  } else {
    remote.create(
      name,
      stock,
      price,
      () => postSuccessSubmit("Item successfully created!"),
      () => $btnSubmit.prop("disabled", false)
    );
  }
});

$(document).on("click", ".deleteItemBtn", function () {
  const $tr = $(this).closest("tr");
  const id = $tr.data("id");
  const item = items.find((i) => i.id === id);
  if (!item) return;

  popup.confirm(`Are you sure to delete "${item.name}"?`, () => {
    remote.delete(id, () => {
      reload();
      popup.success("Item successfully deleted!");
    });
  });
});
