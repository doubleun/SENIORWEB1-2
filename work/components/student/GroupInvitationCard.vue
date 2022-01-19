<template>
  <div>
    <!-- List of Invitation Card -->
    <v-card v-for="invitation in info" :key="invitation.title" class="mt-5">
      <v-row class="justify-center">
        <v-col cols="1"
          ><v-card-actions>
            <v-list-item-avatar color="grey darken-3" size="80">
              <v-img
                class="elevation-6"
                alt=""
                src="https://avataaars.io/?avatarStyle=Transparent&topType=LongHairCurvy&accessoriesType=Kurt&hairColor=BlondeGolden&facialHairType=Blank&clotheType=Hoodie&clotheColor=Red&eyeType=Wink&eyebrowType=UpDownNatural&mouthType=Tongue&skinColor=Pale"
              ></v-img>
            </v-list-item-avatar> </v-card-actions
        ></v-col>
        <v-col cols="6">
          <v-card-text>
            <h3>{{ invitation.name }} invited you.</h3>
            <h3>Project Name : {{ invitation.projectname }}</h3>
            <h3>Project Advisor : {{ invitation.projectname }}</h3>
          </v-card-text>
        </v-col>

        <v-col cols="1">
          <v-btn class="ma-2" outlined fab  color="green">
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </v-col>
        
        <v-col cols="1">
          <v-btn class="ma-2" outlined fab  color="red">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      info: [
        {
          name: "E. Bradley",
          projectname: "AI tools: development trends and selection",
        },
        {
          name: "Thamer Alrawashdeh",
          projectname:
            "A Code Complexity Model of Object Oriented Programming (OOP)",
        },
        {
          name: "Gu Fang",
          projectname:
            "Implementation of Simulation Platform for Craniofacial Surgery Based on COM",
        },
      ],
    };
  },
};
</script>
