<template>
  <section>
    <main class="admin-teacher-manage-main">
      <h1>Manage Teacher</h1>

      <!-- Action buttons -->
      <div class="admin-teacher-manage-actions">
        <div>
          <p class="white--text">Study Program</p>
          <v-select
            v-model="selectedMajor"
            :items="majors"
            @change="handelchangeRenderTeachers"
            item-text="Major_Name"
            item-value="Major_ID"
            return-object
            dense
            solo
            hide-details
            off
          />
        </div>
        <div>
          <p class="white--text">Year</p>
          <v-select
            v-model="selectedYear"
            :items="yearNSemsters.map(itm => itm.Academic_Year)"
            @change="handelchangeRenderTeachers"
            dense
            solo
            hide-details
          />
        </div>
        <div>
          <p class="white--text">Semester</p>
          <v-select
            v-model="selectedSemester"
            :items="yearNSemsters.map(itm => itm.Academic_Term)"
            @change="handelchangeRenderTeachers"
            dense
            solo
            hide-details
          />
        </div>
        <div>
          <p class="white--text">Role</p>
          <v-select
            v-model="selectedRole"
            :items="roles"
            @change="handelchangeRenderTeachers"
            item-text="Role_Name"
            item-value="Role_ID"
            return-object
            dense
            solo
            hide-details
          />
        </div>
        <div>
          <v-btn color="light"
            ><v-icon>mdi-database-import</v-icon> Import</v-btn
          >
        </div>
      </div>

      <AdminDataTable
        :tableTitle="'Manage Teachers'"
        :headers="headers"
        itemKey="User_Email"
        :items="teachers"
        :itemPerPage="10"
        :teacherEditAttrs="attrs"
        manageTeacher
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
    selectedMajor: {},
    selectedYear: null,
    selectedSemester: null,
    selectedRole: null,
    loading: false,
    dialog1: false,
    singleSelect: false,
    selected: [],
    // Attributes that will show in the 'Edit dialog'
    attrs: ["NAME", "EMAIL"],
    headers: [
      ,
      { text: "NAME", align: "center", value: "User_Name" },
      { text: "EMAIL", align: "center", value: "User_Email" },
      // { text: "STUDY PROGRAM", align: "center", value: "Major_ID" },
      { text: "ROLE", align: "center", value: "User_Role_Name" },
      { text: "Actions", align: "center", value: "actions", sortable: false }
      // { text: "SEM", align: "center", value: "Committee" },
    ]
  }),

  async asyncData({ $axios }) {
    let teachers, majors, yearNSemsters, roles;
    try {
      // Fetch all majors
      majors = await $axios.$get("/user/getAllMajors");

      // Fetch all years and semesters
      yearNSemsters = await $axios.$get("/date/allYearsSemester");

      // Fetch teacher's roles
      roles = await $axios.$get("/user/getTeacherRole");

      // Fetch initial teachers
      teachers = await $axios.$post("/user/getAllUserWithMajor", {
        Major_ID: majors[0].Major_ID,
        Academic_Year: yearNSemsters[0].Academic_Year,
        Academic_Term: yearNSemsters[0].Academic_Term,
        User_Role: roles[0].Role_ID
      });

      // Add user_role_name based on user_role (Should fetch role name from the database ?)
      teachers = teachers.map(teacher => ({
        ...teacher,
        User_Role_Name: teacher.User_Role === 0 ? "Teacher" : "Coordinator"
      }));
    } catch (error) {
      console.log(error);
    }

    return { teachers, majors, yearNSemsters, roles };
  },

  mounted() {
    // Set the default value
    this.selectedMajor = this.majors[0];
    this.selectedYear = this.yearNSemsters[0].Academic_Year;
    this.selectedSemester = this.yearNSemsters[0].Academic_Term;
    this.selectedRole = this.roles[0];
  },

  methods: {
    async handelchangeRenderTeachers() {
      console.log("role", this.selectedRole.Role_ID);
      console.log("major", this.selectedRole.Major_ID);
      this.loading = true;
      try {
        this.teachers = await this.$axios.$post("/user/getAllUserWithMajor", {
          Major_ID: this.selectedMajor.Major_ID,
          Academic_Year: this.selectedYear,
          Academic_Term: this.selectedSemester,
          User_Role: this.selectedRole.Role_ID
        });
        // Add user_role_name based on user_role (Should fetch role name from the database ?)
        this.teachers = this.teachers.map(teacher => ({
          ...teacher,
          User_Role_Name: teacher.User_Role === 0 ? "Teacher" : "Coordinator"
        }));
      } catch (error) {
        console.log(error);
      }

      this.loading = false;
    }
  }
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
  justify-content: flex-start;
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
