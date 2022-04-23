export default ({ app, $axios, redirect, error: nuxtError }) => {
  // TODO: Add redirect after error or something
  $axios.onError((error) => {
    // TODO: Log error response only in DEV mode
    console.log('axios error response', error.response)
    const status = error.response.status
    // console.log("status", status);
    if (status !== 200) {
      /**
       * @todo Refactor error response data to be an object for more flexibility,
       * like we can send flag `redirect` as a boolean to indicate that this error needs to redirect
       */
      let errMsg = ''
      if (!!error.response.data && typeof error.response.data === 'string') {
        errMsg = error.response.data
      } else if (
        typeof error.response.data === 'object' &&
        typeof error.response.data?.msg === 'string'
      ) {
        errMsg = error.response.data.msg
      } else {
        error?.message || 'An error has occured'
      }

      // TODO: Use if to check whether we want to show error popup or not
      if (!!app.$swal) {
        app.$swal.fire('Error: ' + status, errMsg, 'warning')
      }

      // TODO: Uncomment this incase of displaying error page
      // nuxtError({
      //   statusCode: status,
      //   message: errMsg
      // })
      return Promise.resolve(error.response.data)
    }
  })
}
