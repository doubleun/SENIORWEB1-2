<template>
  <div>
    <div class="announcement">
      <!-- Add announcement button -->

      <v-row class="justify-end pr-5 pt-5 pb-2">
        <!-- Dialog -->
        <v-dialog v-model="dialog" max-width="600px">
          <template v-slot:activator="{ on }">
            <v-btn rounded dark color="indigo" v-on="on">
              Add announcement
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h6 font-weight-bold">Add Announcement</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-col>
                  <v-textarea
                    outlined
                    name="detailAnnouncement"
                    label="Detail"
                  ></v-textarea>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    :return-value.sync="date"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="date"
                        label="Announced Date"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="date" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="red" @click="menu = false">
                        Cancel
                      </v-btn>
                      <v-btn text color="green" @click="$refs.menu.save(date)">
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" text @click="dialog = false"> Cancel </v-btn>
              <v-btn color="green" text @click="dialog = false"> Save </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <v-card class="content mt-5">
        <div class="carousel pa-5">
          <v-alert color="indigo lighten-5">
            <h3 class="font-weight-bold">Announcement</h3>
          </v-alert>

          <!-- Card result of announcement -->
          <div class="cardAnnouncement">
            <v-card
              v-for="announcement in announce"
              :key="announcement.title"
              class="mb-5 elevation-0"
            >
              <v-card-text>
                <h3 class="font-weight-bold">
                  <v-icon small>mdi-checkbox-blank-circle</v-icon>
                  {{ announcement.title }}
                </h3>

                announced on : {{ announcement.date }}
              </v-card-text>
            </v-card>
            <div class="cardPagination">
              <v-row class="justify-end">
                <v-pagination
                  v-model="page"
                  :length="4"
                  prev-icon="mdi-menu-left"
                  next-icon="mdi-menu-right"
                ></v-pagination>
              </v-row>
            </div>
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    menu: false,
    modal: false,
    dialog: false,
    page: 1,
    announce: [
      {
        title:
          "Announcement Progress 2 of Computer Science and Innovation has been postponed until October 31, 2021.",

        date: "13-9-2021",
      },
      {
        title:
          "Announcement from the School of Information Technology Regarding the delivery schedule for every project By all disciplines affiliated with the office, all legs postpone the promotion until October 11, 2021.",

        date: "16-9-102021",
      },
      {
        title:
          "Announcement from the School of Information Technology Regarding server shutdown for system maintenance on October 1, 2021",

        date: "18-9-2021",
      },
    ],
  }),
};
</script>