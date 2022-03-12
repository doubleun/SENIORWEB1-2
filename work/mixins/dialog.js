import Swal from "sweetalert2";
export default {
  methods: {
    async showLoading(fetchFunction) {
      Swal.fire({
        title: "Updating progress's status",
        timer: 2000,
        timerProgressBar: true,
        didOpen: async () => {
          Swal.showLoading();
          try {
            const res = await fetchFunction();
            if (!res || res.status !== 200) {
              throw new Error(
                "Request status is invalid, please try again later"
              );
            } else {
              Swal.fire("Success", "", "success");
              return;
            }
          } catch (err) {
            console.log(err);
            Swal.showValidationMessage(
              "Request failed, please try again later"
            );
            return;
          }
        },
        backdrop: true,
        allowOutsideClick: () => !Swal.isLoading(),
      }).then(() => window.location.reload());
    },
  },
};
