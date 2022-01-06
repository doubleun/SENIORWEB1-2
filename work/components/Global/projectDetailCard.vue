<template>
  <v-card class="group-detail-card">
    <v-card-title style="padding: 1rem 1rem 0">PROJECT NAME</v-card-title>
    <!-- Card content -->
    <div class="progress-card-container">
      <!-- Project name -->
      <div class="progress-project-name">
        <div>
          <p>Thai Name</p>
          <p>{{ thaiName }}</p>
        </div>
        <div>
          <p>English Name</p>
          <p>{{ EngName }}</p>
        </div>
      </div>

      <!-- Students -->
      <div class="progress-project-student">
        <div
          v-for="(student, index) in students"
          :key="student.Group_Member_ID"
        >
          <div>
            <p>Student {{ index + 1 }}</p>
            <p>{{ student.User_Name }}&ensp;{{ student.User_Identity_ID }}</p>
          </div>
        </div>
      </div>

      <!-- Advisor, co-advisor -->
      <div class="progress-project-name">
        <div>
          <p>Advisor Name</p>
          <p>{{ advisor.User_Name }}</p>
        </div>
        <div>
          <p>Co - Advisor</p>
          <p>{{ coAdvisor }}</p>
        </div>
      </div>

      <!-- Committes -->
      <div class="progress-project-name">
        <div v-for="(com, index) in committees" :key="com.Group_Member_ID">
          <div>
            <p>Committe {{ index + 1 }}</p>
            <p>{{ com.User_Name }}</p>
          </div>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  props: {
    GroupDetail: Object
  },
  data() {
    return {
      groupInfo: [],
      thaiName: "",
      EngName: "",
      students: [],
      advisor: {},
      committees: [],
      coAdvisor: "",
      gradeCriteria: []
    };
  },
  mounted() {
    console.log(this.GroupDetail);
    this.thaiName = this.GroupDetail.GroupInfo.Group_Name_Thai;
    this.EngName = this.GroupDetail.GroupInfo.Group_Name_Eng;
    this.coAdvisor = this.GroupDetail.GroupInfo.Co_Advisor;
    this.GroupDetail.GroupMembers.forEach(member => {
      member.Group_Role === 3 || member.Group_Role === 2
        ? this.students.push(member)
        : member.Group_Role == 1
        ? this.committees.push(member)
        : member.Group_Role === 0
        ? (this.advisor = member)
        : null;
    });
  }
};
</script>

<style>
.group-detail-card {
  padding: 0.4rem 1.4rem 1rem;
}
.progress-card-container {
  padding: 0 1rem 1rem;
}
.progress-card-container p {
  font-size: clamp(12px, 90%, 14px);
  margin: 0;
}
.progress-card-container p:nth-child(odd) {
  font-weight: bold;
}
.progress-card-container p:nth-child(even) {
  margin-left: 1rem;
}
.progress-card-container > div {
  margin-block: 1rem;
}

/* Project name */
.progress-project-name {
  display: flex;
  flex-wrap: wrap;
}
.progress-project-name > div:first-child {
  width: 40%;
}
@media only screen and (max-width: 600px) {
  .progress-project-name > div:first-child {
    width: 100%;
    margin-block-end: 0.4rem;
  }
}

/* Students */
.progress-project-student {
  display: flex;
  flex-wrap: wrap;
}
.progress-project-student > div {
  width: 40%;
}
@media only screen and (max-width: 600px) {
  .progress-project-student > div {
    width: 100%;
    margin-block-end: 0.6rem;
  }
}

/* Advisor, co-advisor */

/* Committee */
</style>
