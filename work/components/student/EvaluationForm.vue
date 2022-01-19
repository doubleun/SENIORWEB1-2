<template>
  <div>
    <!-- Card Upload File -->
    <v-card class="content justify-center mt-5" height="400">
      <v-row>
        <v-spacer></v-spacer>
        <v-col cols="6" sm="5">
          <!-- Alert due date -->
          <v-alert type="info" dense text>
            <h3 class="font-weight-bold">
              Deadline : Due tomorrow , 11 : 59 PM
            </h3>
          </v-alert>
        </v-col>
      </v-row>
      <v-row class="justify-center text-center">
        <v-col cols="6" sm="5">
          <v-icon size="100" color="indigo">mdi-upload</v-icon>
          <h4 class="font-weight-bold">
            Please upload only PDF , DOC , PPT file
          </h4>
          <h4 class="font-weight-bold mb-5">Max upload file size : 2 MB</h4>
          <!-- File input -->
          <v-file-input
            :rules="rules"
            accept=".docx,.pdf,.pptx"
            outlined
            dense
            show-size
            counter
            chips
            multiple
            label="Choose file"
          ></v-file-input>
        </v-col>
      </v-row>
    </v-card>
    <!-- Submit button -->
    <v-row class="text-center"
      ><v-col
        ><v-btn rounded dark color="indigo" class="mt-10">
          Submit
        </v-btn></v-col
      ></v-row
    >
  </div>
</template>
<script>
export default {
  data: () => ({
    rules: [
      value =>
        !value || value.size < 2000000 || "File size should be less than 2 MB"
    ]
  })
};
</script>
<style scoped>
.content {
  padding: 20px;
}
.v-btn {
  width: 200px;
}
</style>
