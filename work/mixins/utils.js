import _ from "lodash";
export default {
  methods: {
    // * Data manipulations
    // Strucured clone
    handleClone(obj) {
      return _.clone(obj);
    },
    // Deep clone
    handleCloneDeep(obj) {
      return _.cloneDeep(obj);
    },
    // * Validations
    handleValidateTextField(
      {
        string = "",
        option = "onlyNormalCharEng",
        required = true,
        errorMsg = "Invalid value",
      },
      ...customValidations
    ) {
      // Destructure custom validations (allow up to 3 conditions)
      const [cv1 = false, cv2 = false, cv3 = false] = customValidations;
      // Evaluate custom validations
      const cvAll = cv1 || cv2 || cv3;

      switch (option) {
        case "onlyNormalCharEng":
          return (required && !string) ||
            cvAll ||
            // ANCHOR old: !/^[A-Za-z][A-Za-z ]*$/.test(string)
            !/^([a-zA-Z]+\s)*[a-zA-Z]+$/.test(string)
            ? errorMsg
            : true;
          break;
        case "onlyNormalCharEngNoSpace":
          return (required && !string) || cvAll || !/^[A-Za-z]*$/.test(string)
            ? errorMsg
            : true;
          break;
        case "onlyNormalCharEngAndNumber":
          return (required && !string) ||
            cvAll ||
            !/^([a-zA-Z0-9]+\s)*[a-zA-Z0-9]+$/.test(string)
            ? errorMsg
            : true;
          break;
        case "onlyNormalCharTh":
          return (required && !string) ||
            cvAll ||
            !/^[\u0E00-\u0E7F]*$/.test(string)
            ? errorMsg
            : true;
        case "onlyNumber":
          return (required && !string) || cvAll || !/^\d+$/.test(string)
            ? errorMsg
            : true;
          break;
        case "onlyNumberFloat":
          return (required && !string) || cvAll || !/^\d*\.?\d+$/.test(string)
            ? errorMsg
            : true;
          break;
      }
    },
  },
};
