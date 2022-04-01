<template>
  <div>
    <div class="cardStatus">
      <h2 class="header-title mb-2 mt-5 mb-10 white--text">Home</h2>
      <div v-if="isAdmin">
        <SelectSenior />
      </div>
      <v-row class="justify-space-around">
        <v-card
          v-for="details in info"
          :key="details.title"
          class="mb-5 elevation-0"
          :width="250"
        >
          <v-list-item three-line>
            <v-list-item-content>
              <div class="text-overline font-weight-bold mb-4">
                {{ details.title }}
              </div>
              <v-list-item-title class="text-h5 mb-1">
                {{ details.amount }}
              </v-list-item-title>
            </v-list-item-content>

            <v-list-item-avatar
              ><v-avatar color="#5C6BC0">
                <v-icon dark>{{ details.icon }}</v-icon>
              </v-avatar>
            </v-list-item-avatar>
          </v-list-item>
        </v-card>
      </v-row>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    info: {
      type: Array,
      default: () => [],
    },
    isAdmin: {
      type: Boolean,
      default: () => true,
    },
  },
};
</script>
