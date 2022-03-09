<template>
  <v-card>
    <v-card-title>
      <h3>Score Student</h3>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        clearable
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table :headers="headers" :items="items" :search="search">
      <template v-slot:item.Progress1="{ item }">
        {{ +item.Progress1 }}
      </template>

      <template v-slot:item.Progress2="{ item }">
        {{ +item.Progress2 }}
      </template>

      <template v-slot:item.Progress3="{ item }">
        {{ +item.Progress3 }}
      </template>

      <template v-slot:item.Progress4="{ item }">
        {{ +item.Progress4 }}
      </template>

      <template v-slot:item.FinalPresentation="{ item }">
        {{ +item.FinalPresentation }}
      </template>

      <template v-slot:item.FinalDocumentation="{ item }">
        {{ +item.FinalDocumentation }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import utils from "@/mixins/utils";

export default {
  mixins: [utils],
  props: { items: Array, headers: Array },
  data() {
    return {
      search: "",
    };
  },
  methods: {
    handleValidateScore(val) {
      return this.handleValidateTextField({
        string: val,
        option: "onlyNormalCharEng",
        errorMsg: "Invalid search",
        required: false,
      });
    },
  },
  mounted() {
    console.log("item", this.items);
  },
};
</script>

<style scoped>
.v-data-table {
}
</style>
