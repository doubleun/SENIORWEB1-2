import _ from 'lodash'
export default {
  methods: {
    // * Data manipulations
    // Strucured clone
    handleClone(obj) {
      return _.clone(obj)
    },
    // Deep clone
    handleCloneDeep(obj) {
      return _.cloneDeep(obj)
    },

    // * Validations
    handleValidateTextField(
      {
        string = '',
        option = 'onlyNormalCharEng',
        required = true,
        errorMsg = 'Invalid value'
      },
      ...customValidations
    ) {
      // Destructure custom validations (allow up to 3 conditions)
      const [cv1 = false, cv2 = false, cv3 = false] = customValidations
      // Evaluate custom validations
      const cvAll = cv1 || cv2 || cv3

      switch (option) {
        case 'onlyNormalCharEng':
          return (required && !string) ||
            cvAll ||
            // ANCHOR old: !/^[A-Za-z][A-Za-z ]*$/.test(string)
            !/^$|^([a-zA-Z]+\s)*[a-zA-Z]+$/.test(string)
            ? errorMsg
            : true
          break
        case 'onlyNormalCharEngNoSpace':
          return (required && !string) ||
            cvAll ||
            !/^$|^[A-Za-z]*$/.test(string)
            ? errorMsg
            : true
          break
        case 'onlyNormalCharEngAndNumber':
          return (required && !string) ||
            cvAll ||
            !/^$|^([a-zA-Z0-9]+\s)*[a-zA-Z0-9]+$/.test(string)
            ? errorMsg
            : true
          break
        case 'onlyNormalCharTh':
          return (required && !string) ||
            cvAll ||
            !/^$|^[\u0E00-\u0E7F]*$/.test(string)
            ? errorMsg
            : true
        case 'onlyNumber':
          return (required && !string && string !== 0) ||
            cvAll ||
            !/^$|^\d+$/.test(string)
            ? errorMsg
            : true
          break
        case 'onlyNumberFloat':
          return (required && !string && string !== 0) ||
            cvAll ||
            !/^$|^\d*\.?\d+$/.test(string)
            ? errorMsg
            : true
          break
      }
    },

    // check file type (accepted method)
    handelCheckInputFile({
      fileName,
      // type = ["docx", "pptx", "xlsx"] // decline type
      type = ['txt', 'jpeg', 'jpg', 'png', 'gif', 'bmp', 'pdf'], // accept type
      errorMsg = 'This file can not preview'
    }) {
      // console.log("fileNameAA", fileName);
      // return true;

      let fileType = fileName.split('.')
      // console.log("fileType", fileType);
      // console.log("fileType1", fileType[fileType.length - 1].toLowerCase());

      if (type.includes(fileType[fileType.length - 1].toLowerCase())) {
        // console.log("show");
        return true
      }
      return errorMsg
    },

    // Check if the array is valid
    isValidArray(array) {
      return Array.isArray(array) && !_.isEmpty(array)
    },

    // Lodash isEqual
    isEqual(el1, el2) {
      return _.isEqual(el1, el2)
    },

    // * Format data
    /**
     * Handle format date object as locale string
     * @param {...(Date|string)} inputDate - Input date object to format
     * @param {object} options - Options
     * @param {boolean} options.createDate - Create new date from inputDate as a string
     * @param {boolean} options.displayTime - Show or hide time after date
     * @param {boolean} options.dateStyle - full, long, medium, short
     * @param {boolean} options.timeStyle - full, long, medium, short
     * @param {string} locale.timeStyle - Locale for the output date time string ('th-TH', 'en-US')
     * @returns locale date string
     */
    formatLocaleDateString(inputDate, options) {
      if (!inputDate) return
      const {
        createDate = false,
        displayTime = true,
        dateStyle = 'full',
        timeStyle = 'medium',
        locale = 'en-US'
      } = options

      // If create date is true, create new date object from inputDate
      if (!!createDate) {
        inputDate = new Date(inputDate)
      }

      return inputDate.toLocaleString(locale, {
        dateStyle: dateStyle,
        ...(!!displayTime ? { timeStyle } : {})
      })
    },

    /**
     * Handle format byte to sizes
     * @param {number} bytes - Bytes needs to be convert
     * @returns string of human readable sizes
     */
    bytesToSize(bytes) {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      if (bytes === 0) return '0'
      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
      if (i === 0) return `${bytes} ${sizes[i]}`
      return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`
    }
  }
}
