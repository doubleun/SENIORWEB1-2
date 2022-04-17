export default ({ app, $axios, redirect, error: nuxtError }) => {
  // TODO: Add redirect after error or something
  $axios.onError((error) => {
    console.log("axios error response", error.response);
    const status = error.response.status;
    // console.log("status", status);
    if (status !== 200) {
      let errMsg = error.message || "An error has occured";
      if (!!error.response.data && typeof error.response.data === "string")
        errMsg = error.response.data;

      if (!!app.$swal) {
        app.$swal.fire("Error: " + status, errMsg, "warning");
      }

      nuxtError({
        statusCode: status,
        message: errMsg,
      });
      return Promise.resolve(false);
    }
  });
};
