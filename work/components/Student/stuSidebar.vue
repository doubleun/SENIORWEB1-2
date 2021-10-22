<template>
  <v-navigation-drawer
    v-model="drawer"
    fixed
    app
    color="#253b6e"
    dark
    width="310"
  >
    <v-col class="mt-3">
      <v-row class="justify-center">
        <!-- Logo and website name -->
        <router-link to="/Student/stuHome">
          <v-img src="/it_logo.png" max-width="85" class="mb-3"></v-img>
        </router-link>
      </v-row>
      <v-row class="justify-center white--text"><h5>SENIOR PROJECT</h5></v-row>
      <v-row class="justify-center white--text"
        ><h6>SCHOOL OF INFORMATION TECHNOLOGY</h6></v-row
      >
    </v-col>
    <!-- Lists routes Home-Final Presentation -->
    <v-list shaped class="mt-3">
      <v-list-item-group color="white">
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
      <!-- Sub group of List Final Documentation -->
      <v-list-group no-action prepend-icon="mdi-numeric-8-box" color="white">
        <template v-slot:activator>
          <v-list-item-title>Final Documentation</v-list-item-title>
        </template>
        <v-list-item
          v-for="(item, i) in documents"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-title v-text="item.title"></v-list-item-title>
        </v-list-item>
      </v-list-group>
      <!-- List Re-evaluation -->
      <v-list-item-group color="white">
        <v-list-item
          v-for="(item, i) in reevaluations"
          :key="i"
          :to="item.to"
          router
          exact
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
  data() {
    return {
      items: [
        {
          icon: "mdi-home",
          title: "Home",
          to: "/Student/stuHome",
        },
        {
          icon: "mdi-numeric-1-box",
          title: "Group",
          to: "/Student/stuCreateGroup",
        },
        {
          icon: "mdi-numeric-2-box",
          title: "Topic",
          to: "/Student/stuTopicEvaluationForm",
        },
        {
          icon: "mdi-numeric-3-box",
          title: "Proposal",
          to: "/Student/stuProposalEvaluationForm",
        },
        {
          icon: "mdi-numeric-4-box",
          title: "Progress 1",
          to: "/Student/stuProgress1EvaluationForm",
        },
        {
          icon: "mdi-numeric-5-box",
          title: "Progress 2",
          to: "/Student/stuProgress2EvaluationForm",
        },
        {
          icon: "mdi-numeric-6-box",
          title: "Progress 3",
          to: "/Student/stuProgress3EvaluationForm",
        },
        {
          icon: "mdi-numeric-7-box",
          title: "Final Presentation",
          to: "/Student/stuFinalPresentationEvaluationForm",
        },
      ],
      documents: [
        {
          title: "Abstract",
          to: "/Student/stuAbstractForm",
        },
        {
          title: "Full Document",
          to: "/Student/stuFullDocumentForm",
        },
        {
          title: "Other Resource",
          to: "/Student/stuOtherResourceForm",
        },
      ],
      reevaluations: [
        {
          icon: "mdi-file-refresh",
          title: "Re - evaluation",
          to: "/Student/stuReevaluationForm",
        },
      ],
    };
  },
  computed: {
    drawer: {
      get() {
        return this.$store.state.drawer;
      },
      set(newVal) {
        this.$store.commit("set_drawer", newVal);
      },
    },
  },
};
</script>

