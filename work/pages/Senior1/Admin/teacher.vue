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
          <p class="white--text">Role</p>
          <v-select :items="roleArr" dense solo hide-details />
        </div>
        <div>
          <v-btn color="light"
            ><v-icon>mdi-database-import</v-icon> Import</v-btn
          >
        </div>
      </div>

      <!-- Data table -->
      <AdminDataTable
        tableTitle="Manage Teachers"
        :headers="headers"
        :items="dummyItems"
        manageTeacher
        :teacherEditAttrs="attrs"
      />
    </main>
  </section>
</template>

<script>
// import LongTableCard from "@/components/Admin/longTableCard";
import AdminDataTable from "@/components/Admin/adminDataTable";

export default {
  layout: "admin",
  components: {
    AdminDataTable
  },
  data: () => ({
    programsArr: ["Information and Communication Engineering"],
    roleArr: ["Coordinator", "Teacher"],
    headers: [
      {
        text: "EMAIL",
        align: "center",
        value: "Email"
      },
      { text: "NAME", align: "center", value: "Name" },
      { text: "STUDY PROGRAM", align: "center", value: "Program" },
      { text: "ROLE", align: "center", value: "Role" },
      { text: "Actions", align: "center", value: "actions", sortable: false }
    ],
    dummyItems: [
      {
        Name: "Teacher A",
        Email: "Teacher@gmail.com",
        Program: "CE",
        Role: "Advisor"
      },
      {
        Name: "Teacher B",
        Email: "TeacherB@gmail.com",
        Program: "CE",
        Role: "Advisor"
      }
    ],
    attrs: ["EMAIL", "NAME", "STUDY PROGRAM", "ROLE", "ACTION"]
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
  width: 20%;
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

/* Edit teacher dialog */
.edit-teacher-dialog-card {
  padding: 1rem;
}
.edit-teacher-input-flex {
  display: flex;
  flex-wrap: wrap;
  margin-inline: auto;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 1.4rem;
}
.edit-teacher-input-flex .v-subheader {
  padding: 0 !important;
}
.edit-teacher-input-flex p {
  font-size: 20px;
  height: 40px;
  margin: 0;
}
.edit-teacher-input-flex > div {
  width: 46%;
}
.edit-teacher-dialog-card hr {
  margin-block: 1rem;
}
</style>
