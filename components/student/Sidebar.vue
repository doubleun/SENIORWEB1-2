<template>
  <v-navigation-drawer
    v-model="drawerState"
    fixed
    app
    :color="theme === 'default' ? '#253B6E' : 'white'"
    :dark="theme === 'default'"
    width="310"
  >
    <v-col :style="theme === 'default' ? 'color: white' : 'color: black'">
      <v-row class="justify-center">
        <!-- Logo and website name -->
        <router-link to="/">
          <v-img src="/it_logo.png" max-width="80" class="mb-3"></v-img>
        </router-link>
      </v-row>
      <v-row class="justify-center"
        ><h4>
          SENIOR PROJECT {{ !!displaySemester && !!senior ? senior : '' }}
        </h4></v-row
      >
      <v-row class="justify-center"
        ><h6>SCHOOL OF INFORMATION TECHNOLOGY</h6></v-row
      >
      <v-row class="justify-center" v-if="!!displaySemester && !!academicYear"
        ><h5
          style="margin-left: 5px"
          :style="theme === 'default' ? '#253b6e' : 'white'"
        >
          {{ semester }} / {{ academicYear }}
        </h5></v-row
      >
    </v-col>
    <!-- Lists routes Home-Final Presentation -->
    <v-list shaped class="mt-3">
      <v-list-item-group
        :color="theme === 'default' ? 'white' : 'indigo'"
        :dark="theme === 'default'"
      >
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          :disabled="item.disabled"
          router
          exact
          :active-class="
            theme === 'default' ? 'v-item--active-dark' : 'v-item--active-light'
          "
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => []
    },
    theme: {
      type: String,
      default: () => 'default'
    },
    displaySemester: {
      type: Boolean,
      default: () => true
    },
    drawer: {
      type: Boolean
      // default: () => false
    }
  },
  data: () => ({
    academicYear: null,
    semester: null,
    senior: null,
    toggleDrawer: null
  }),
  mounted() {
    if (!!this.displaySemester) {
      this.academicYear = this.$store.getters['auth/currentUser'].academicYear
      this.semester = this.$store.getters['auth/currentUser'].semester
      this.senior = this.$store.getters['auth/currentUser'].senior
    }
    this.toggleDrawer = this.drawer
  },
  computed: {
    drawerState: {
      get() {
        console.log('drawer satae', this.$store.state.drawer.drawerState)
        return this.$store.state.drawer.drawerState
      },
      set(newValue) {
        this.$store.dispatch('drawer/setDrawerState', newValue)
      }
    }
  }
}
</script>

<style scoped>
.v-item--active-dark {
  padding: 0 16px 0 12px !important;
  border-left: 1px solid #72cef7;
  border-width: 4px;
}
.v-item--active-light {
  padding: 0 16px 0 12px !important;
  border-left: 1px solid #004fab;
  border-width: 4px;
}
.v-list-item {
  height: 42px !important;
}
.v-list-item__title {
  font-size: 14px;
  text-transform: uppercase;
}
</style>
