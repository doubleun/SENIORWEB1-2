<template>
  <v-container>
    <GlobalCsiCriteria class="coordinator-criteria-grade-card" />
  </v-container>
</template>

<script>
// import CsiCriteria from "@/components/global/csiCriteria";

export default {
  layout: "coordinatorsidebar",
  data() {
    return {
      dialog: false,
    };
  },
};
</script>

<style>
.coordinator-criteria-main {
  margin-block-end: 2rem;
}
.coordinator-criteria-main > h1 {
  margin-block: 2rem;
  font-size: 1.8rem;
  color: white;
}
.coordinator-criteria-main .v-card__title {
  padding-block-start: 1.5rem;
  font-weight: bold;
}

.coordinator-edit-grade-criteria {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-block: 2rem;
}
.coordinator-edit-grade-criteria > button {
  /* width: 9rem; */
}

/* Edit grade card */
.grade-criteria-dialog-card {
  padding: 1rem;
}
.grade-criteria-input-flex {
  display: flex;
  width: 80%;
  margin-inline: auto;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 1.4rem;
}
.grade-criteria-input-flex .v-subheader {
  padding: 0 !important;
}
.grade-criteria-input-flex p {
  font-size: 20px;
  height: 40px;
  margin: 0;
}
.grade-criteria-dialog-card hr {
  margin-block: 1rem;
}

/* edit button*/
.btEdit {
  float: right;
}
</style>
