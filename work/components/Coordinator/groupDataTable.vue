<template>
  <div>
    <div class="dataTable">
      <!-- Data Table -->
      <v-card>
        <v-card-title>
          <v-spacer></v-spacer>
          <v-col md ="3"><v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
              outlined
            ></v-text-field
          ></v-col>
        </v-card-title>
        <v-data-table :headers="headers" :items="items" :search="search">
          <template v-slot:item.groupName="{ item }">
            <v-row class="mb-6 pa-5 justify-space-around" no-gutters>
              <div style="cursor: pointer">
                {{ item.groupName }}
              </div>
            </v-row>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-row class="justify-center" no-gutters>
              <v-col md="3">
                <v-row align="center" justify="space-around">
                  <v-btn color="primary" @click="pushOtherPage">
                    <v-icon left> mdi-eye-arrow-right </v-icon>
                    View
                  </v-btn>
                </v-row>
              </v-col>
            </v-row>
          </template>
        </v-data-table>
      </v-card>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      search: "",
      headers: [
        {
          text: "GROUP NAME",
          align: "center",
          value: "groupName",
        },
        { text: "MEMBER", value: "member", align: "center" },
        { text: "ADVISOR", value: "advisor", align: "center" },
        { text: "COMMITTEE", value: "committee", align: "center" },
        {
          text: "Actions",
          value: "actions",
          sortable: false,
          align: "center",
          width: 170,
        },
      ],
      items: [
        {
          groupName:
            "Mobile Application for Karen Translator for Translator for Physiotherapy",
          member:
            "Anuthep Tayngam, Pipat Massri, Maneeya Soungpho, Surathat Chinarat, Sasreen Abdunsomad",
          advisor: "Surapong Uttama",
          committee: "Khwunta Kirimasthong, Tossapon Boongeon",
        },
        {
          groupName:
            "Mobile Application for Karen Translator for Translator for Physiotherapy",
          member:
            "Anuthep Tayngam, Pipat Massri, Maneeya Soungpho, Surathat Chinarat, Sasreen Abdunsomad",
          advisor: "Surapong Uttama",
          committee: "Khwunta Kirimasthong, Tossapon Boongeon",
        },
        {
          groupName:
            "Mobile Application for Karen Translator for Translator for Physiotherapy",
          member:
            "Anuthep Tayngam, Pipat Massri, Maneeya Soungpho, Surathat Chinarat, Sasreen Abdunsomad",
          advisor: "Surapong Uttama",
          committee: "Khwunta Kirimasthong, Tossapon Boongeon",
        },
        {
          groupName:
            "Mobile Application for Karen Translator for Translator for Physiotherapy",
          member:
            "Anuthep Tayngam, Pipat Massri, Maneeya Soungpho, Surathat Chinarat, Sasreen Abdunsomad",
          advisor: "Surapong Uttama",
          committee: "Khwunta Kirimasthong, Tossapon Boongeon",
        },
        {
          groupName:
            "Mobile Application for Karen Translator for Translator for Physiotherapy",
          member:
            "Anuthep Tayngam, Pipat Massri, Maneeya Soungpho, Surathat Chinarat, Sasreen Abdunsomad",
          advisor: "Surapong Uttama",
          committee: "Khwunta Kirimasthong, Tossapon Boongeon",
        },
        {
          groupName:
            "Mobile Application for Karen Translator for Translator for Physiotherapy",
          member:
            "Anuthep Tayngam, Pipat Massri, Maneeya Soungpho, Surathat Chinarat, Sasreen Abdunsomad",
          advisor: "Surapong Uttama",
          committee: "Khwunta Kirimasthong, Tossapon Boongeon",
        },
        {
          groupName:
            "Mobile Application for Karen Translator for Translator for Physiotherapy",
          member:
            "Anuthep Tayngam, Pipat Massri, Maneeya Soungpho, Surathat Chinarat, Sasreen Abdunsomad",
          advisor: "Surapong Uttama",
          committee: "Khwunta Kirimasthong, Tossapon Boongeon",
        },
      ],
    };
  },
  methods: {
    pushOtherPage() {
      console.log("success");
      this.$router.push("/Senior1/Coordinator/groupInfo");
    },
  },
};
</script>
