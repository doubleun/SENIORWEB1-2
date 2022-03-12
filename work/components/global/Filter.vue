<template>
  <div>
    <h1>hi</h1>
  </div>
</template>

<script>
export default {
  props: {
    majors: Array,
    yearNSemsters: Array,
  },
  mounted() {
    console.log("Hi");
  },
  // data() {
  //   return {
  //     selectedMajor: {},
  //     selectedYear: null,
  //     selectedSemester: null,
  //     dialogFilter: false,
  //   };
  // },
  // // mounted() {
  //   this.selectedMajor = this.majors[0];
  //   this.selectedYear = this.yearNSemsters[0].Academic_Year;
  //   this.selectedSemester = this.yearNSemsters[0].Academic_Term;
  //   this.selectedRole = this.roles[0];
  // },
};
</script>
