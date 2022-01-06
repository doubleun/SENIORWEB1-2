<template>
  <div>
    <v-container>
      <h2 class="header-title mb-2 mt-5 mb-10 white--text">User Manage</h2>
      <v-row class="btsem">
        <v-col cols="6" sm="6" md="6" lg="6">
          <div class="login" align="center" justify="center">
            <v-row><h4 class="white--text">Semester</h4></v-row>
            <v-row>
              <v-select
                :items="sem"
                label="semester"
                dense
                solo
                class="teb mb-1 mt-1 ma-2 mb-1"
              ></v-select>
            </v-row>
          </div>
        </v-col>
        <v-col cols="6" sm="6" md="6" lg="6">
          <div class="login" align="center" justify="center">
            <v-row>
              <v-btn
                
                class="mb-1 mt-7 mb-1 ma-2 dark-blue--text"
                @click="handleFileImport"
              >
                <v-icon dark-blue>
                  mdi-application-import
                </v-icon>

                Import
              </v-btn>
              <input
            ref="uploader"
            class="d-none"
            id="fileBrowse"
            type="file"
            accept=".xlsx"
            @change="handleBrowseFile"
          />
            </v-row>
          </div>
        </v-col>
      </v-row>
      <userDataTable />
    </v-container>
  </div>
</template>
<script>
import userDataTable from "@/components/Coordinator/userDataTable";
export default {
  data: () => ({
    sem: ["1/2564", "2/2564"],
    files: [],
  }),
  components: {
    userDataTable
  },
  methods:{
    handleFileImport() {
      window.addEventListener(
        "focus",
        () => {
         
        },
        { once: true }
      );
      // Trigger click on the FileInput
      this.$refs.uploader.click();
    },
     handleBrowseFile(e) {
      if (e?.target.files[0]) {
        // Get date
        const d = new Date().toLocaleString();
        const formData = new FormData();
        
        // Update the files array
        this.files = [...this.files, { file: e.target.files[0], date: d }];
        this.files.map((file) => formData.append("files", file.file));
        formData.append("Major", 1);
        console.log(formData);
        this.$swal
          .fire({
            title: "Are you sure to import this file ? ",
            text: "Please make sure file is correct you can import once per semister!!!",
            showDenyButton: true,
            // showCancelButton: true,
            confirmButtonText: "OK",
            denyButtonText: `Cancel`,
          })
          .then(async(result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              const res = await this.$axios.$post(
                "user/importstudent",
                formData
              )
              console.log(res)
              if (res === "success") {
                this.$swal.fire("Saved!", "", "success");
              } else {
                this.$swal.fire("Error! some thing went wrong", "", "warning");
              }
            }
          });
      }
    },
  }
  ,
  layout: "coordinatorsidebar"
};
</script>

<style scoped>
.v-btn:hover {
  background-color: #1a237e; /* blue */
  color: white;
}
.btsem {
  padding-left: 70%;
}
</style>
