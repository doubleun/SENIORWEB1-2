<template>
  <section>
    <main class="admin-teacher-manage-main">
      <h1>Manage Teacher</h1>

      <!-- Action buttons -->
      <div class="admin-teacher-manage-actions">
        <div>
          <p class="white--text">Study Program</p>
          <v-select :items="programsArr" dense solo hide-details off />
        </div>
        <div>
          <p class="white--text">Semester</p>
          <v-select :items="semestersArr" dense solo hide-details />
        </div>
        <div>
          <v-btn color="light"
            ><v-icon>mdi-database-import</v-icon> Import</v-btn
          >
        </div>
      </div>

      <!-- Teacher table card -->
      <LongTableCard tableTitle="Teacher" smallBtn>
        <template v-slot:data>
          <!-- Table attributes -->
          <template v-for="attr in attrs">
            <h5 :key="attr">{{ attr }}</h5>
          </template>

          <!-- Table data -->
          <template v-for="teacher in teachersArr">
            <p :key="teacher.id + 1">{{ teacher.email }}</p>
            <p :key="teacher.id + 2">{{ teacher.name }}</p>
            <p :key="teacher.id + 3">{{ teacher.program }}</p>
            <p :key="teacher.id + 4">{{ teacher.role }}</p>
            <v-btn
              :key="teacher.id + 5"
              color="primary"
              class="admin-teacher-manage-edit-btn"
              ><v-icon>mdi-pen</v-icon> Edit</v-btn
            >
          </template>
        </template>
      </LongTableCard>
    </main>
  </section>
</template>

<script>
import LongTableCard from "@/components/Admin/longTableCard";

export default {
  layout: "admin",
  components: {
    LongTableCard
  },
  data: () => ({
    programsArr: ["Information and Communication Engineering"],
    semestersArr: ["1/2021", "2/2021"],
    attrs: ["ID", "NAME", "EMAIL", "SEMESTER", "ACTION"],
    teachersArr: [
      {
        id: 1,
        email: "surapong@lamduan.mfu.ac.th",
        name: "Worasak Rueangsirarak",
        role: "Coordinator",
        program: "Digital Technology for Buisiness Innovation"
      },
      {
        id: 2,
        email: "surapong@lamduan.mfu.ac.th",
        name: "Worasak Rueangsirarak",
        role: "Coordinator",
        program: "Digital Technology for Buisiness Innovation"
      },
      {
        id: 3,
        email: "surapong@lamduan.mfu.ac.th",
        name: "Worasak Rueangsirarak",
        role: "Coordinator",
        program: "Digital Technology for Buisiness Innovation"
      },
      {
        id: 4,
        email: "surapong@lamduan.mfu.ac.th",
        name: "Worasak Rueangsirarak",
        role: "Coordinator",
        program: "Digital Technology for Buisiness Innovation"
      },
      {
        id: 5,
        email: "surapong@lamduan.mfu.ac.th",
        name: "Worasak Rueangsirarak",
        role: "Coordinator",
        program: "Digital Technology for Buisiness Innovation"
      },
      {
        id: 6,
        email: "surapong@lamduan.mfu.ac.th",
        name: "Worasak Rueangsirarak",
        role: "Coordinator",
        program: "Digital Technology for Buisiness Innovation"
      },
      {
        id: 7,
        email: "surapong@lamduan.mfu.ac.th",
        name: "Worasak Rueangsirarak",
        role: "Coordinator",
        program: "Digital Technology for Buisiness Innovation"
      },
      {
        id: 8,
        email: "surapong@lamduan.mfu.ac.th",
        name: "Worasak Rueangsirarak",
        role: "Coordinator",
        program: "Digital Technology for Buisiness Innovation"
      },
      {
        id: 9,
        email: "surapong@lamduan.mfu.ac.th",
        name: "Worasak Rueangsirarak",
        role: "Coordinator",
        program: "Digital Technology for Buisiness Innovation"
      },
      {
        id: 10,
        email: "surapong@lamduan.mfu.ac.th",
        name: "Worasak Rueangsirarak",
        role: "Coordinator",
        program: "Digital Technology for Buisiness Innovation"
      }
    ]
  })
};
</script>

<style>
.admin-teacher-manage-main {
  margin-block-end: 2rem;
}
.admin-teacher-manage-main p,
.admin-teacher-manage-main h5 {
  font-size: 14px;
  margin: 0;
}
.admin-teacher-manage-main > h1 {
  margin-block: 2rem;
  font-size: 1.8rem;
  color: white;
}
.admin-teacher-manage-main .v-card__title {
  padding-block-start: 1.5rem;
  font-weight: bold;
}

/* Teacher manage actions */
.admin-teacher-manage-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
}
.admin-teacher-manage-actions .v-select {
  margin-block-end: 23px;
}

/* Reduce the second select box's width */
.admin-teacher-manage-actions > div:nth-child(2n) {
  width: 10%;
}
.admin-teacher-manage-actions > div:first-child {
  width: 36%;
}
.admin-teacher-manage-actions > div:last-child {
  display: flex;
  gap: 0.5rem;
}

/* Teacher manage table card */
.teacher-manage-checkbox-container .v-input {
  margin: 0;
}

@media only screen and (max-width: 497px) {
  .admin-teacher-manage-actions > div:first-child {
    width: 50%;
  }
  .admin-teacher-manage-actions > div:nth-child(2n) {
    width: 22%;
  }
  .admin-teacher-manage-actions .v-select {
    margin-block-end: 0.2rem;
  }
  .admin-teacher-manage-actions .v-btn {
    margin-block-end: 0.5rem;
  }
  .admin-teacher-manage-main .admin-teacher-manage-edit-btn {
    font-size: 12px;
  }
  .admin-teacher-manage-main .admin-teacher-manage-edit-btn i {
    font-size: 18px;
  }
}
</style>
