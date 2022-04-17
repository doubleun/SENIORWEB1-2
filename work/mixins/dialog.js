import Swal from 'sweetalert2'
export default {
  methods: {
    /**
     * Function to simplify loading dialog while fetching data
     * @param {Function} callback - Callback function that will fetch and API
     * @param {Object} options - Additional options
     * @param {string} options.title - Loading dialog title text
     * @param {number} options.timer - Loading timer before timeout (ms)
     * @param {string} options.successMsg - Success message
     * @returns undefined
     */
    showLoading: async (callback, options) => {
      const {
        title = 'Loading...',
        timer = 2000,
        successMsg = 'Success'
      } = options
      Swal.fire({
        title,
        timer,
        timerProgressBar: true,
        showConfirmButton: false,
        didRender: async () => {
          Swal.showLoading()
          try {
            const res = await callback()
            console.log('dialiog res: ', res)
            if (!res || res.status !== 200) {
              throw new Error(
                'Request status is invalid, please try again later'
              )
            } else {
              Swal.fire(successMsg, '', 'success')
              return res
            }
          } catch (err) {
            console.log(err)
            Swal.showValidationMessage('Request failed, please try again later')
            return
          }
        },
        backdrop: true,
        allowOutsideClick: () => !Swal.isLoading()
      })
    }
  }
}
