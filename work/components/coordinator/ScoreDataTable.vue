<template>
  <v-card>
    <v-card-title>
      <h3>Score Student</h3>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        :rules="[(val) => handleValidateScore(val)]"
        clearable
        hide-details
        label="Search "
        prepend-inner-icon="mdi-magnify"
        filled
        rounded
        dense
        class="search"
        color="blue"
      ></v-text-field>
    </v-card-title>
    <v-data-table :headers="headers" :items="items" :search="search">
      <!-- <template v-slot:item.total="{ item }">
        {{
          parseInt(
            +item.Progress1 +
              +item.Progress2 +
              +item.Progress3 +
              +item.Progress4 +
              +item.FinalPresentation +
              +item.FinalDocumentation
          )
        }}
      </template> -->

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
      <!-- <template v-slot:item.grade="{ item }">
        <span v-if="item.finalgrade != null">{{ item.finalgrade }}</span>
        <span v-else>{{ item.grade }}</span>
      </template> -->
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
