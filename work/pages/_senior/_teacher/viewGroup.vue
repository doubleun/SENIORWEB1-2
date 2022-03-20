<template>
  <v-container>
    <!-- <main class="admin-group-manage-main"> -->
    <!-- <v-row class="col-6 pb-12" style="color: #fff"
      ><p style="font-size: 28px; font-weight: bold">Group</p></v-row
    > -->
    <h2 class="header-title mb-2 mt-5 mb-10 white--text">Group</h2>
    <!-- <button @click="test">test</button> -->
    <SelectSenior />

    <!-- Action buttons -->
    <div class="my-5 d-flex justify-end" style="gap: 0.5rem; flex-wrap: wrap">
      <div>
        <v-btn color="success" @click="handleExports(selected, allGroups)"
          ><v-icon>mdi-microsoft-excel</v-icon>Export to Excel</v-btn
        >
      </div>
      <div>
        <v-btn
          color="indigo darken-2"
          dark
          @click="handleMoveGroups"
          v-if="$store.getters['auth/currentUser'].senior === 1"
          ><v-icon>mdi-microsoft-excel</v-icon>Move group to senior 2</v-btn
        >
      </div>
    </div>

    <ViewGroupDetail
      :majors="majors"
      :yearNSemsters="yearNSemsters"
      :allGroups="allGroups"
      isAdmin
    />
    <!-- </main> -->
  </v-container>
</template>

<script>
import exportXLSX from "@/mixins/exportXLSX";
import dialog from "@/mixins/dialog";

export default {
  mixins: [exportXLSX, dialog],
  layout: "coordinatorsidebar",
  data() {
    return {
      loading: false,
      manageTeacher: false,
    };
  },
};
</script>
