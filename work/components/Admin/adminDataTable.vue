<template>
  <v-card class="long-table-card">
    <v-card-title>
      <h4>{{ tableTitle }}</h4>
      <v-text-field
        placeholder="Search"
        prepend-inner-icon="mdi-magnify"
        outlined
        hide-details
        dense
      ></v-text-field>
    </v-card-title>

    <!-- Grid table -->
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="itemPerPage"
      :item-key="itemKey"
      class="elevation-1"
    >
      <template v-slot:item.User_Role="{ item }">
        <!-- <v-chip
      > -->
        {{ (item.User_Role = handelTextRole(item.User_Role)) }}
        <!-- </v-chip> -->
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  props: {
    tableTitle: String,
    headers: Array,
    itemKey: String,
    itemPerPage: Number,
    items: Array
  },
  methods: {
    handelTextRole(role) {
      console.log("handel text role");
      console.log(role);
      if (role == 0) {
        return "Teacher";
      } else if (role == 1) {
        return "Student";
      } else if (role == 2) {
        return "Coordinator";
      } else {
        return role;
      }
    }
  }
};
</script>

<style>
.long-table-card {
  padding: 0.4rem 1.4rem 1rem;
}
.long-table-card .v-card__title {
  display: flex;
  align-items: center;
  padding: 1rem;
}
.long-table-card .v-card__title h4 {
  flex: 1;
}
.long-table-card .v-card__title .v-input {
  max-width: 40%;
}

/* Grid table */
.long-table-content {
  display: grid;
  grid-template-columns: repeat(5, auto);
  gap: 1.4rem;
  padding: 1.4rem 1rem;
  text-align: center;
  align-items: center;
  overflow-x: auto;
}

@media only screen and (max-width: 768px) {
  .long-table-card .v-card__title {
    display: flex;
    padding: 0;
  }
  .long-table-card .v-card__title h4 {
    font-size: 18px;
  }
  .long-table-content {
    display: grid;
    grid-template-columns: 200px 140px 150px 140px 260px;
    gap: 1.2rem 0.6rem;
    padding: 1rem 0.6rem;
    text-align: center;
    align-items: center;
    overflow-x: auto;
  }
  .long-table-content.small-btn {
    display: grid;
    /* The final column will be auto */
    grid-template-columns: 200px 140px 150px 140px auto;
    gap: 1.2rem 0.6rem;
    padding: 1rem 0.6rem;
    text-align: center;
    align-items: center;
    overflow-x: auto;
  }
}
</style>
