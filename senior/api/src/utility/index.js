/**
 * Function for format date into iso locale format
 * @param {string} inputDate - Date string from db: ""
 * @param {object} options - Options
 * @param {boolean} options.asDate - Specify that the inputDate is submitted as date object
 * @returns iso locale format date
 */
const formatDateIso = (inputDate, options) => {
  if (!options?.asDate) {
    inputDate = new Date(inputDate);
  }

  return new Date(inputDate - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
};

module.exports = {
  formatDateIso,
};
