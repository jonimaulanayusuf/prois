import "../components/sidebar.js";
import "../components/protected.js";
import remote from "../remote/suppliers.module.js";
import popup from "../utils/popup.module.js";
import array from "../utils/array.module.js";

let suppliers = [];
let limit = 0;
let page = 1;
let search = "";
let pages = [];

const $tbody = $("#suppliersTableBody");
const $pagination = $("#suppliersPagination");
const $btnSubmit = $("#btnSubmit");

$(document).ready(function () {
  reload();
});

function renderTable() {
  $tbody.empty();
  suppliers.forEach((supplier, index) => {
    const n = (page - 1) * 10 + index + 1;
    $tbody.append(`
      <tr data-id="${supplier.id}">
        <td class="text-center">${n}</td>
        <td>${supplier.name}</td>
        <td>${supplier.email}</td>
        <td>${supplier.address}</td>
        <td>
          <button class="btn btn-sm btn-outline-secondary editSupplierBtn">Edit</button>
          <button class="btn btn-sm btn-outline-danger deleteSupplierBtn">Delete</button>
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
        <button class="page-link paginationSupplierBtn">${page_}</button>
      </li>
    `);
  });
}

$("#searchSupplierInput").on("input", (e) => {
  search = e.target.value;
  page = 1;
  reload();
});

function reload() {
  remote.get(search, page, (res) => {
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

    limit = result?.limit ?? 0;
    page = result?.page ?? 1;

    const totalPages = result?.total_pages ?? 1;
    pages = array.numberToArray(Math.max(totalPages, 1));

    renderTable();
    renderPagination();
  });
}

$("#addSupplierBtn").on("click", function () {
  $("#supplierModalLabel").text("Add Supplier");
  $("#supplierForm")[0].reset();
  $("#supplierId").val("");
});

$(document).on("click", ".editSupplierBtn", function () {
  const $tr = $(this).closest("tr");
  const id = $tr.data("id");
  const supplier = suppliers.find((i) => i.id === id);
  if (!supplier) return;

  $("#supplierModalLabel").text("Edit Supplier");
  $("#supplierId").val(supplier.id);
  $("#supplierName").val(supplier.name);
  $("#supplierEmail").val(supplier.email);
  $("#supplierAddress").val(supplier.address);

  const supplierModal = new bootstrap.Modal(
    document.getElementById("supplierModal")
  );
  supplierModal.show();
});

$(document).on("click", ".paginationSupplierBtn", function () {
  const $li = $(this).closest("li");
  page = $li.data("page");
  reload();
});

function postSuccessSubmit(message) {
  reload();
  popup.success(message);

  const supplierModal = bootstrap.Modal.getInstance(
    document.getElementById("supplierModal")
  );

  supplierModal.hide();
  $btnSubmit.prop("disabled", false);
}

$("#supplierForm").on("submit", function (e) {
  e.preventDefault();

  const id = $("#supplierId").val();
  const name = $("#supplierName").val();
  const email = $("#supplierEmail").val();
  const address = $("#supplierAddress").val();

  $btnSubmit.prop("disabled", true);

  if (id) {
    remote.update(
      id,
      name,
      email,
      address,
      () => postSuccessSubmit("Supplier successfully updated!"),
      () => $btnSubmit.prop("disabled", false)
    );
  } else {
    remote.create(
      name,
      email,
      address,
      () => postSuccessSubmit("Supplier successfully created!"),
      () => $btnSubmit.prop("disabled", false)
    );
  }
});

$(document).on("click", ".deleteSupplierBtn", function () {
  const $tr = $(this).closest("tr");
  const id = $tr.data("id");
  const supplier = suppliers.find((i) => i.id === id);
  if (!supplier) return;

  popup.confirm(`Are you sure to delete "${supplier.name}"?`, () => {
    remote.delete(id, () => {
      reload();
      popup.success("Supplier successfully deleted!");
    });
  });
});
