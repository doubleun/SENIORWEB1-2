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
            <div style="cursor: pointer" @click="pushOtherPage">
              {{ item.groupName }}
            </div>
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
          align: "start",
          sortable: false,
          value: "groupName",
        },
        { text: "MEMBER", value: "member" },
        { text: "ADVISOR", value: "advisor" },
        { text: "COMMITTEE", value: "committee" },
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
