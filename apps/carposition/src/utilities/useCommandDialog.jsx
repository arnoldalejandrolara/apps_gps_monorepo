import Swal from "sweetalert2";

export function useCommandDialog({ setAlertMessage, setAlertSeverity }) {
  return function showCommandDialog({
    title,
    text,
    successMsg,
    cancelMsg
  }) {
    const swalWithCustomButtons = Swal.mixin({
      customClass: {
        confirmButton: "custom-btn-success",
        cancelButton: "custom-btn-danger"
      },
      buttonsStyling: false
    });

    swalWithCustomButtons.fire({
      title,
      text,
      theme: "dark",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Si, hazlo!",
      cancelButtonText: "No, cancelar!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        setAlertMessage(successMsg);
        setAlertSeverity("success");
        setTimeout(() => setAlertMessage(""), 3000);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        setAlertMessage(cancelMsg);
        setAlertSeverity("warning");
        setTimeout(() => setAlertMessage(""), 3000);
      }
    });
  };
}