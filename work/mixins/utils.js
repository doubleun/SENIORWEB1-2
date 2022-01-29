import _ from "lodash";
export default {
  methods: {
    // Strucured clone
    handleClone(obj) {
      return _.clone(obj);
    },
    // Deep clone
    handleCloneDeep(obj) {
      return _.cloneDeep(obj);
    },
  },
};
