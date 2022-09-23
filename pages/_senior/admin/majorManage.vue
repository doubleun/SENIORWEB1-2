<template>
  <v-container>
    <h2 class="header-title mb-2 mt-5 white--text">Manage Major</h2>
    <p class="white--text">
      <strong class="red--text">*</strong>
      <span> Manage all majors that in school of Information Technology </span>
    </p>

    <div class="my-5 d-flex justify-end">
      <v-btn
        class="mr-2 dark-blue--text"
        align="right"
        justify="right"
        color="primary"
        @click="editMajor"
      >
        new major
      </v-btn>
    </div>

    <v-card>
      <v-card-title>
        <h3>Major</h3>
        <v-spacer></v-spacer>
        <v-row class="d-flex justify-end">
          <v-col md="6">
            <v-text-field
              v-model="search"
              clearable
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="majorsUi"
        class="elevation-1"
        :search="search"
      >
        <template v-slot:item.Action="{ item, index }">
          <v-btn color="primary" @click="editMajor(item)">
            <v-icon small> mdi-pencil </v-icon>Edit
          </v-btn>
        </template>

        <template v-slot:top>
          <!-- Edit majors dialog -->
          <v-form ref="form">
            <v-dialog v-model="dialog" persistent max-width="500px">
              <v-card class="mt-5">
                <v-card-title class="text-h5">
                  {{ isAdd ? 'Add Major' : 'Edit Major' }}
                </v-card-title>

                <div class="pa-5">
                  <v-text-field
                    class="mb-5"
                    ref="majorName"
                    v-model="editedItem.Major_Name"
                    label="Major Name"
                    :rules="[(v) => !!v || 'Text is required']"
                    outlined
                    dense
                  ></v-text-field>

                  <v-text-field
                    ref="majorAcronym"
                    v-model="editedItem.Acronym"
                    label="Acronym"
                    :rules="[(v) => !!v || 'Text is required']"
                    outlined
                    dense
                  ></v-text-field>
                </div>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="secondary" text @click="close"> Cancel </v-btn>
                  <v-btn color="primary" @click="save"> Save </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-form>
        </template>

        <template v-slot:item.Major_Status="{ item }">
          <div style="display: flex; justify-content: center">
            <v-switch
              v-model="item.Major_Status"
              :false-value="0"
              :true-value="1"
              inset
              hide-details
              :ripple="false"
              style="margin: 0"
              @click="updateStatus(item)"
            ></v-switch>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import utils from '@/mixins/utils'
import dialog from '@/mixins/dialog'
export default {
  layout: 'admin',
  mixins: [utils, dialog],

  data() {
    return {
      search: '',
      dialog: false,
      editedItem: {},
      isAdd: true,
      headers: [
        // { text: "NAME", align: "center", value: "Major_ID" },
        { text: 'MAJOR NAME', align: 'center', value: 'Major_Name' },
        { text: 'ACRONYM', align: 'center', value: 'Acronym' },
        {
          text: 'On/Off',
          align: 'center',
          value: 'Major_Status',
          sortable: false
        },
        {
          text: 'ACTION',
          align: 'center',
          value: 'Action',
          sortable: false
        }
      ]
    }
  },

  async asyncData({ $axios, store }) {
    let majors, bindMajors
    try {
      // Fetch all majors
      majors = await $axios.$get('/major/getAllMajors')
      console.log('major', majors)
    } catch (error) {
      console.log(error)
    }

    return { majorsUi: majors }
  },

  methods: {
    editMajor(item) {
      this.editedItem = Object.assign({}, item)
      this.isAdd = this.majorsUi.indexOf(item) === -1
      this.dialog = true
    },
    close() {
      this.isAdd = true
      this.dialog = false
      this.editedItem = {}
    },
    // add and update function
    async save() {
      if (!this.$refs.form.validate()) {
        return
      }
      try {
        const res = this.isAdd
          ? await this.$axios.post('/major/add', {
              Major_Name: this.editedItem.Major_Name,
              Acronym: this.editedItem.Acronym
            })
          : await this.$axios.put('/major/update', {
              Major_Name: this.editedItem.Major_Name,
              Acronym: this.editedItem.Acronym,
              Major_Status: this.editedItem.Major_Status,
              Major_ID: this.editedItem.Major_ID
            })

        if (res.status !== 200) {
          throw new Error(
            `Failed to ${
              this.isAdd ? 'Add' : 'Update'
            } major, please try again later`
          )
        }
        this.$swal.fire(
          'Successed!',
          `${this.isAdd ? 'Add' : 'Update'} Major successfully`,
          'success'
        )
        this.dialog = false
        this.$nuxt.refresh()
      } catch (error) {}
    },

    // update status function
    async updateStatus(item) {
      try {
        const res = await this.$axios.put('/major/update', {
          Major_Name: item.Major_Name,
          Acronym: item.Acronym,
          Major_Status: item.Major_Status,
          Major_ID: item.Major_ID
        })

        if (res.status !== 200) {
          throw new Error(
            'Failed to update status major, please try again later'
          )
        }
        this.$swal.fire('Successed!', 'Update status successfully', 'success')
        this.dialog = false
        this.$nuxt.refresh()
      } catch (error) {}
    }
  }
}
</script>
