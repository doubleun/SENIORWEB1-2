<template>
  <section>
    <main class="admin-group-manage-main">
      <h1>Group</h1>

      <!-- Action buttons -->
      <div class="admin-group-manage-actions">
        <div>
          <p class="white--text">Study Program</p>
          <v-select :items="programsArr" dense solo hide-details off />
        </div>
        <div>
          <p class="white--text">Year</p>
          <v-select :items="yearsArr" dense solo hide-details />
        </div>
        <div>
          <p class="white--text">Semester</p>
          <v-select :items="semestersArr" dense solo hide-details />
        </div>
        <div>
          <v-btn color="success"
            ><v-icon>mdi-microsoft-excel</v-icon> Export to Excel</v-btn
          >
          <v-btn color="error"><v-icon>mdi-trash-can</v-icon> Delete</v-btn>
        </div>
      </div>

      <!-- Group table card -->
      <LongTableCard tableTitle="Group">
        <template v-slot:data>
          <!-- Table attributes -->
          <template v-for="attr in attrs">
            <h5 :key="attr">{{ attr }}</h5>
          </template>

          <!-- Table data -->
          <template v-for="group in groupsArr">
            <div :key="group.id + 1" class="group-manage-checkbox-container">
              <v-checkbox v-model="checkbox" value="John" hide-details dense>
                <template v-slot:label>
                  <h5>{{ group.name }}</h5>
                </template>
              </v-checkbox>
            </div>
            <p :key="group.id + 2">{{ group.member }}</p>
            <p :key="group.id + 3">{{ group.program }}</p>
            <p :key="group.id + 4">{{ group.advisor }}</p>
            <p :key="group.id + 5">{{ group.committee.join(", ") }}</p>
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
    yearsArr: ["2021"],
    semestersArr: ["1/2021", "2/2021"],
    attrs: ["GROUP NAME", "MEMBER", "PROGRAM", "ADVISOR", "COMMITTEE"],
    groupsArr: [
      {
        id: 1,
        name: "MOBILE APPLICATION FOR KAREN TRANSLATIOR FOR PHYSIOTHERAPY",
        member: "Anuthep Tayngam",
        program: "Computer Science",
        advisor: "Surapong Uttama",
        committee: ["Khwnuta Kirimasthong", "Sarawut Jaijma"]
      },
      {
        id: 2,
        name: "MOBILE APPLICATION FOR KAREN TRANSLATIOR FOR PHYSIOTHERAPY",
        member: "Anuthep Tayngam",
        program: "Computer Science",
        advisor: "Surapong Uttama",
        committee: ["Khwnuta Kirimasthong", "Sarawut Jaijma"]
      },
      {
        id: 3,
        name: "MOBILE APPLICATION FOR KAREN TRANSLATIOR FOR PHYSIOTHERAPY",
        member: "Anuthep Tayngam",
        program: "Computer Science",
        advisor: "Surapong Uttama",
        committee: ["Khwnuta Kirimasthong", "Sarawut Jaijma"]
      },
      {
        id: 4,
        name: "MOBILE APPLICATION FOR KAREN TRANSLATIOR FOR PHYSIOTHERAPY",
        member: "Anuthep Tayngam",
        program: "Computer Science",
        advisor: "Surapong Uttama",
        committee: ["Khwnuta Kirimasthong", "Sarawut Jaijma"]
      },
      {
        id: 5,
        name: "MOBILE APPLICATION FOR KAREN TRANSLATIOR FOR PHYSIOTHERAPY",
        member: "Anuthep Tayngam",
        program: "Computer Science",
        advisor: "Surapong Uttama",
        committee: ["Khwnuta Kirimasthong", "Sarawut Jaijma"]
      },
      {
        id: 6,
        name: "MOBILE APPLICATION FOR KAREN TRANSLATIOR FOR PHYSIOTHERAPY",
        member: "Anuthep Tayngam",
        program: "Computer Science",
        advisor: "Surapong Uttama",
        committee: ["Khwnuta Kirimasthong", "Sarawut Jaijma"]
      },
      {
        id: 7,
        name: "MOBILE APPLICATION FOR KAREN TRANSLATIOR FOR PHYSIOTHERAPY",
        member: "Anuthep Tayngam",
        program: "Computer Science",
        advisor: "Surapong Uttama",
        committee: ["Khwnuta Kirimasthong", "Sarawut Jaijma"]
      },
      {
        id: 8,
        name: "MOBILE APPLICATION FOR KAREN TRANSLATIOR FOR PHYSIOTHERAPY",
        member: "Anuthep Tayngam",
        program: "Computer Science",
        advisor: "Surapong Uttama",
        committee: ["Khwnuta Kirimasthong", "Sarawut Jaijma"]
      },
      {
        id: 9,
        name: "MOBILE APPLICATION FOR KAREN TRANSLATIOR FOR PHYSIOTHERAPY",
        member: "Anuthep Tayngam",
        program: "Computer Science",
        advisor: "Surapong Uttama",
        committee: ["Khwnuta Kirimasthong", "Sarawut Jaijma"]
      },
      {
        id: 10,
        name: "MOBILE APPLICATION FOR KAREN TRANSLATIOR FOR PHYSIOTHERAPY",
        member: "Anuthep Tayngam",
        program: "Computer Science",
        advisor: "Surapong Uttama",
        committee: ["Khwnuta Kirimasthong", "Sarawut Jaijma"]
      }
    ]
  })
};
</script>

<style>
.admin-group-manage-main {
  margin-block-end: 2rem;
}
.admin-group-manage-main p,
.admin-group-manage-main h5 {
  font-size: 14px;
  margin: 0;
}
.admin-group-manage-main > h1 {
  margin-block: 2rem;
  font-size: 1.8rem;
  color: white;
}
.admin-group-manage-main .v-card__title {
  padding-block-start: 1.5rem;
  font-weight: bold;
}

/* Group manage actions */
.admin-group-manage-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
}
.admin-group-manage-actions .v-select {
  margin-block-end: 23px;
}
/* Reduce the second and third select box's width */
.admin-group-manage-actions > div:nth-child(n + 2):nth-child(-n + 3) {
  width: 10%;
}
.admin-group-manage-actions > div:first-child {
  width: 36%;
}
.admin-group-manage-actions > div:last-child {
  display: flex;
  gap: 0.5rem;
}

/* Group manage table card */
.group-manage-checkbox-container .v-input {
  margin: 0;
}

@media only screen and (max-width: 795px) {
  .admin-group-manage-actions > div:first-child {
    width: 50%;
  }
  .admin-group-manage-actions > div:nth-child(n + 2):nth-child(-n + 3) {
    width: 22%;
  }
  .admin-group-manage-actions .v-select {
    margin-block-end: 0.2rem;
  }
  .admin-group-manage-actions .v-btn {
    margin-block-end: 0.5rem;
  }
}
</style>
