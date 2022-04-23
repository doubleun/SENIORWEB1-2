/**
 * Function for format date into iso locale format
 * @param {string} inputDate - Date string from db: ""
 * @param {object} options - Options
 * @param {boolean} options.asDate - Specify that the inputDate is submitted as date object
 * @returns iso locale format date
 */
const formatDateIso = (inputDate, options) => {
  if (!options?.asDate) {
    inputDate = new Date(inputDate)
  }

  return new Date(inputDate - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ')
}

/**
 * Function for returning error handling format object
 * @todo - Implement this NEW error handling to all other responses in API
 * @param {string} msg - Message to display
 * @param {object} errDialog - Flag for sweetalert2 dialog
 * @param {boolean} errDialog.enabled - Display sweetalert2 dialog (if possible)
 * @param {boolean} errDialog.redirect - Logout user and redirect to home page on dialog destroy
 * @param {boolean} errPage - Redirect to Nuxt error page
 * @param {number} status - Status to display
 */
const createErrorJSON = ({
  msg = 'An error has occured',
  errDialog = { enabled: true, redirect: false },
  errPage = false,
  status = 500
}) => {
  return {
    msg,
    errDialog,
    errPage,
    /**
     * @deprecated - Status is propbably will be pull from axios.status, thus making this field worthless (delete later)
     */
    status
  }
}

module.exports = {
  formatDateIso,
  createErrorJSON
}
