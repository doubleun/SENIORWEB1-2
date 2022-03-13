<template>
  <v-menu
    ref="menu1"
    v-model="menu1"
    :close-on-content-click="true"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="dateFormatted"
        :label="dateLabel"
        hint="DD/MM/YYYY format"
        persistent-hint
        prepend-icon="mdi-calendar"
        readonly
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="date"
      :min="minDate"
      no-title
      @input="menu1 = false"
    ></v-date-picker>
  </v-menu>
</template>

<script>
export default {
  props: {
    dateLabel: {
      type: String,
      default: () => "Date",
    },
    date: {
      type: String,
      default: () =>
        new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substring(0, 10),
    },
    minDate: {
      type: String,
      default: () => undefined,
    },
  },
  data() {
    return {
      dateFormatted: this.formatDate(this.date),
      menu1: false,
      menu2: false,
    };
  },
  watch: {
    date(val) {
      // Update dateFormatted
      this.dateFormatted = this.formatDate(this.date);

      // Emit event to change date prop
      this.$emit("update-date", this.date);
    },
  },

  methods: {
    formatDate(date) {
      if (!date) return null;
      const isoDate = date.toISOString().substring(0, 10);

      const [year, month, day] = isoDate.split("-");
      return `${day}/${month}/${year}`;
    },
    calAllowDates() {
      if (!this.minDate) return null;
      // return new Date(this.minDate) >= new Date(this.date);
    },
  },
  mounted() {
    console.log(this.date);
  },
};
</script>
