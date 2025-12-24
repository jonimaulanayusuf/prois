function success(message) {
  Swal.fire({
    icon: "success",
    title: "Success",
    text: message || undefined, // jika message kosong, tidak ditampilkan
    confirmButtonText: "OK",
    allowOutsideClick: false,
  });
}

function error(message) {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: message || undefined,
    confirmButtonText: "OK",
    allowOutsideClick: false,
  });
}

function confirm(message, onConfirm) {
  Swal.fire({
    icon: "warning",
    title: "Warning!",
    text: message || undefined,
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
    allowOutsideClick: false,
  }).then((result) => {
    if (result.isConfirmed && typeof onConfirm === "function") {
      onConfirm();
    }
  });
}

export default {
  success,
  error,
  confirm,
};
