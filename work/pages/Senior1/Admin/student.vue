<template>
  <section>
    <main class="admin-student-manage-main">
      <h1>Manage Student</h1>

      <!-- Action buttons -->
      <div class="admin-student-manage-actions">
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

      <!-- Student table card -->
      <LongTableCard tableTitle="Student">
        <template v-slot:data>
          <!-- Table attributes -->
          <template v-for="attr in attrs">
            <h5 :key="attr">{{ attr }}</h5>
          </template>

          <!-- Table data -->
          <template v-for="student in studentsArr">
            <p :key="student.id + 1">{{ student.studentId }}</p>
            <p :key="student.id + 2">{{ student.name }}</p>
            <p :key="student.id + 3">{{ student.email }}</p>
            <p :key="student.id + 4">{{ student.semester }}</p>
            <p :key="student.id + 5">{{ student.program }}</p>
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
    attrs: ["ID", "NAME", "EMAIL", "SEMESTER", "STUDY PROGRAM"],
    studentsArr: [
      {
        id: 1,
        studentId: 6131501052,
        name: "Wachirachai Nitsomboon",
        email: "6131501052@lamduan.mfu.ac.th",
        semester: "2/2564",
        program: "Digital Technology for Buisiness Innovation"
      },
      {
        id: 2,
        studentId: 6131501052,
        name: "Wachirachai Nitsomboon",
        email: "6131501052@lamduan.mfu.ac.th",
        semester: "2/2564",
        program: "Digital Technology for Buisiness Innovation"
      },
      {
        id: 3,
        studentId: 6131501052,
        name: "Wachirachai Nitsomboon",
        email: "6131501052@lamduan.mfu.ac.th",
        semester: "2/2564",
        program: "Digital Technology for Buisiness Innovation"
      },
      {
        id: 4,
        studentId: 6131501052,
        name: "Wachirachai Nitsomboon",
        email: "6131501052@lamduan.mfu.ac.th",
        semester: "2/2564",
        program: "Digital Technology for Buisiness Innovation"
      },
      {
        id: 5,
        studentId: 6131501052,
        name: "Wachirachai Nitsomboon",
        email: "6131501052@lamduan.mfu.ac.th",
        semester: "2/2564",
        program: "Digital Technology for Buisiness Innovation"
      },
      {
        id: 6,
        studentId: 6131501052,
        name: "Wachirachai Nitsomboon",
        email: "6131501052@lamduan.mfu.ac.th",
        semester: "2/2564",
        program: "Digital Technology for Buisiness Innovation"
      },
      {
        id: 7,
        studentId: 6131501052,
        name: "Wachirachai Nitsomboon",
        email: "6131501052@lamduan.mfu.ac.th",
        semester: "2/2564",
        program: "Digital Technology for Buisiness Innovation"
      },
      {
        id: 8,
        studentId: 6131501052,
        name: "Wachirachai Nitsomboon",
        email: "6131501052@lamduan.mfu.ac.th",
        semester: "2/2564",
        program: "Digital Technology for Buisiness Innovation"
      },
      {
        id: 9,
        studentId: 6131501052,
        name: "Wachirachai Nitsomboon",
        email: "6131501052@lamduan.mfu.ac.th",
        semester: "2/2564",
        program: "Digital Technology for Buisiness Innovation"
      },
      {
        id: 10,
        studentId: 6131501052,
        name: "Wachirachai Nitsomboon",
        email: "6131501052@lamduan.mfu.ac.th",
        semester: "2/2564",
        program: "Digital Technology for Buisiness Innovation"
      }
    ]
  })
};
</script>

<style>
.admin-student-manage-main {
  margin-block-end: 2rem;
}
.admin-student-manage-main p,
.admin-student-manage-main h5 {
  font-size: 14px;
  margin: 0;
}
.admin-student-manage-main > h1 {
  margin-block: 2rem;
  font-size: 1.8rem;
  color: white;
}
.admin-student-manage-main .v-card__title {
  padding-block-start: 1.5rem;
  font-weight: bold;
}

/* Student manage actions */
.admin-student-manage-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
}
.admin-student-manage-actions .v-select {
  margin-block-end: 23px;
}

/* Reduce the second select box's width */
.admin-student-manage-actions > div:nth-child(2n) {
  width: 10%;
}
.admin-student-manage-actions > div:first-child {
  width: 36%;
}
.admin-student-manage-actions > div:last-child {
  display: flex;
  gap: 0.5rem;
}

/* Student manage table card */
.student-manage-checkbox-container .v-input {
  margin: 0;
}

@media only screen and (max-width: 497px) {
  .admin-student-manage-actions > div:first-child {
    width: 50%;
  }
  .admin-student-manage-actions > div:nth-child(2n) {
    width: 22%;
  }
  .admin-student-manage-actions .v-select {
    margin-block-end: 0.2rem;
  }
  .admin-student-manage-actions .v-btn {
    margin-block-end: 0.5rem;
  }
}
</style>
