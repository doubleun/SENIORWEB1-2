<template>
  <v-card class="group-detail-card">
    <v-card-title style="padding: 1rem 1rem 0">PROJECT NAME</v-card-title>
    <!-- Card content -->
    <div class="progress-card-container">
      <!-- Project name -->
      <div class="progress-project-name">
        <div>
          <p>Thai Name</p>
          <p>ภาษากระเหรื่ยงสำหรับกายภาพบำบัด</p>
        </div>
        <div>
          <p>English Name</p>
          <p>MOBILE APPLICATION FOR KAREN TRANSLATOR FOR PHYSIOTHERAPY</p>
        </div>
      </div>

      <!-- Students -->
      <div class="progress-project-student">
        <div>
          <p>Student 1</p>
          <p>Wachirachai Nitsomboon 6131501052</p>
        </div>
        <div>
          <p>Student 2</p>
          <p>Wachirachai Nitsomboon 6131501052</p>
        </div>
        <div>
          <p>Student 3</p>
          <p>Wachirachai Nitsomboon 6131501052</p>
        </div>
        <div>
          <p>Student 4</p>
          <p>Wachirachai Nitsomboon 6131501052</p>
        </div>
      </div>

      <!-- Advisor, co-advisor -->
      <div class="progress-project-name">
        <div>
          <p>Advisor Name</p>
          <p>Surapong Uttama</p>
        </div>
        <div>
          <p>Co - Advisor</p>
          <p>Surapong Uttama</p>
        </div>
      </div>

      <!-- Committes -->
      <div class="progress-project-name">
        <div>
          <p>Committe 1</p>
          <p>Surapong Uttama</p>
        </div>
        <div>
          <p>Committe 2</p>
          <p>Surapong Uttama</p>
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
