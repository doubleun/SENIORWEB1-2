<template>
  <div>
    <div class="dataTable">
      <!-- Data Table -->
      <v-card>
        <v-card-title>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table :headers="headers" :items="items" :search="search">
          <template v-slot:item.groupName="{ item }">
            <v-row class="mb-6 pa-5 justify-space-around" no-gutters>
            <div style="cursor: pointer" @click="pushOtherPage">
              {{ item.groupName }}
            </div>
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
        { text: "MEMBER", value: "member",
        align: "center", },
        { text: "ADVISOR", value: "advisor",
        align: "center", },
        { text: "COMMITTEE", value: "committee" ,
        align: "center",},
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
