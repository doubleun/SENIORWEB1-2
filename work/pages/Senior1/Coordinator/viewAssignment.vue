<template>
  <section>
    <main class="due-assignment-card-main">
      <h1>Due Date</h1>

      <!-- Assignment card -->
      <v-card>
        <v-card-title>
          Progress 1
        </v-card-title>

        <!-- Content -->
        <div class="due-assignment-thumbnail-container">
          <template v-for="thumb in displayArr">
            <p class="due-assignment-thumbnail" :key="thumb">{{ thumb }}</p>
          </template>
        </div>
        <v-pagination v-model="page" :length="pageLength" circle></v-pagination>
      </v-card>
    </main>
  </section>
</template>

<script>
export default {
  layout: "coordinatorsidebar",
  data() {
    return {
      page: 1,
      tempArr: [...Array(32).keys()],
      eachPageArr: []
    };
  },
  computed: {
    displayArr() {
      // 16 is the maximum thumbnails we want to show
      const startIndex = 16 * (this.page - 1);
      const endIndex = startIndex + 16;
      return this.tempArr.slice(startIndex, endIndex);
    },
    pageLength() {
      return Math.ceil(this.tempArr.length / 16);
    }
  }
};
</script>

<style>
.due-assignment-card-main {
  margin-block-end: 2rem;
}
.due-assignment-card-main > h1 {
  margin-block: 2rem;
  font-size: 1.8rem;
  color: white;
}
.due-assignment-card-main .v-card__title {
  padding-block-start: 1.5rem;
  font-weight: bold;
}
.due-assignment-thumbnail-container {
  display: grid;
  grid-template-columns: repeat(4, auto);
  align-items: center;
  padding: 1rem 1rem 2rem;
  gap: 2rem 1rem;
}
.due-assignment-thumbnail {
  width: 200px;
  height: 200px;
  background-color: #e5e5e5;
  margin-inline: auto;
}
@media only screen and (max-width: 600px) {
  .due-assignment-thumbnail-container {
    display: grid;
    grid-template-columns: repeat(2, auto);
    align-items: center;
    padding: 0.5rem 0.5rem 1rem;
    gap: 1rem 0.5rem;
  }
  .due-assignment-thumbnail {
    width: 140px;
    height: 140px;
    background-color: #e5e5e5;
    margin-inline: auto;
  }
}
</style>
