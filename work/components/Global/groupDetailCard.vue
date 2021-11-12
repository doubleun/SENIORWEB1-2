<template>
  <v-card class="group-detail-card">
    <v-card-title>GROUP DETAIL</v-card-title>
    <!-- Card content -->
    <div class="group-card-container">
      <!-- Project name -->
      <div class="group-project-name">
        <h3>Project Name</h3>
        <div>
          <p>Thai Name</p>
          <p>ภาษากระเหรื่ยงสำหรับกายภาพบำบัด</p>
          <p>English Name</p>
          <p>MOBILE APPLICATION FOR KAREN TRANSLATOR FOR PHYSIOTHERAPY</p>
        </div>
      </div>

      <!-- Project Member -->
      <div class="group-project-member">
        <h3>Project Member</h3>
        <!-- Student detail -->
        <div class="project-member-detail-container">
          <h4>Student 1</h4>
          <!-- Details -->
          <div class="project-member-detail">
            <div>
              <p>Name</p>
              <p>Wachirachai Nitsomboon</p>
              <p>Phone</p>
              <p>065xxxxxxxxxxxx</p>
            </div>
            <div>
              <p>Student ID</p>
              <p>6131501052</p>
              <p>Email</p>
              <p>6131501052@lamduan.mfu.ac.th</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Project Advisor -->
      <div class="group-project-member">
        <h3>Project Advisor</h3>
        <!-- Advisor detail -->
        <div class="project-member-detail-container">
          <p>Advisor Name</p>
          <p>Suraopong Suraopong</p>
          <p>Co-Advisor</p>
          <p>Suraopong Suraopong</p>
          <p></p>
        </div>
      </div>

      <!-- Project Committee -->
      <div class="group-project-member">
        <h3>Project Committee</h3>
        <!-- Committe detail -->
        <div class="project-member-detail-container">
          <h4>Committee 1</h4>
          <div>
            <p>Committee Name</p>
            <p>Suraopong Suraopong</p>
          </div>
          <p></p>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {};
</script>

<style>
.group-detail-card {
  padding: 0.6rem 1.4rem 1rem;
}
.group-card-container {
  padding: 0 1rem 1rem;
}
.group-card-container p {
  font-size: clamp(12px, 90%, 15px);
  margin: 0;
}
.group-card-container p:nth-child(even) {
  margin-left: 1rem;
  font-weight: bold;
}
.group-card-container > div {
  margin-block: 1.6rem;
}

/* Group member */
.project-member-detail-container {
  display: flex;
  flex-direction: column;
}
.project-member-detail {
  display: flex;
  flex-wrap: wrap;
}
.project-member-detail > div {
  display: flex;
  flex-direction: column;
}
.project-member-detail > div:first-child {
  width: 38%;
}
@media only screen and (max-width: 600px) {
  .project-member-detail > div:first-child {
    width: 100%;
  }
}
.project-member-detail p {
  margin-block: 0.3rem;
}
</style>
