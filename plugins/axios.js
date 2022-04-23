export default async ({ app, $axios, store, error: nuxtError }) => {
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
      // Instantiate error data
      const errData = error.response.data

      // Get error message
      let errMsg = ''
      if (!!errData && typeof errData === 'string') {
        errMsg = errData
      } else if (
        typeof errData === 'object' &&
        typeof errData?.msg === 'string'
      ) {
        errMsg = errData.msg
      } else {
        error?.message || 'An error has occured'
      }

      // Decide how to handle the error
      if (typeof errData === 'object' && errData.hasOwnProperty('errDialog')) {
        // FIXME: Nested if is bad I know we'll fix this after all API error handling have been refactored
        console.log('Handle axios error NEW way...')
        if (!!app.$swal && errData.errDialog.enabled) {
          app.$swal.fire({
            title: `Error: ${status}`,
            text: errMsg,
            ...(!!errData.errDialog.redirect
              ? {
                  didDestroy: async () => {
                    // console.log('route', route)
                    // console.log('app router', app.router)
                    console.log('swal destroyed, dispatch logout ...')
                    await store.dispatch('auth/logout')
                    app.router.replace('/')
                  }
                }
              : {})
          })
        }

        if (errData.errPage) {
          // Display error page
          nuxtError({
            statusCode: status,
            message: errMsg
          })
        }
      } else {
        // FIXME: This will be delete after API error handling refactor is finished
        // Legacy way of handle error
        console.log('Handle axios error LEGACY way...')
        // TODO: Use if to check whether we want to show error popup or not
        if (!!app.$swal) {
          app.$swal.fire('Error: ' + status, errMsg, 'warning')
        }

        // Display error page
        nuxtError({
          statusCode: status,
          message: errMsg
        })
      }

      return Promise.resolve(errData)
    }
  })
}
