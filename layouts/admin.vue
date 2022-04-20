<template>
  <v-app dark>
    <StudentSidebar :items="items" theme="white" :displaySemester="false" />
    <div class="it-background">
      <MainAppbar theme="transparent" />
      <v-main>
        <v-container>
          <Nuxt />
        </v-container>
      </v-main>
    </div>
  </v-app>
</template>

<script>
// import Appbar from "@/components/Global/mainAppbar";
// import Sidebar from "@/components/Student/stuSidebar";

export default {
  middleware: 'checkRole',
  data() {
    return {
      items: [
        {
          icon: 'mdi-home',
          title: 'Home',
          to: '/senior/admin/'
        },
        {
          icon: 'mdi-clipboard-text-clock',
          title: 'Semester Date',
          to: '/senior/admin/semesterDate'
        },
        {
          icon: 'mdi-office-building-cog',
          title: 'Manage Teacher',
          to: '/senior/admin/teacher'
        },
        {
          icon: 'mdi-account-cog',
          title: 'Manage Student',
          to: '/senior/admin/student'
        },
        {
          icon: 'mdi-account-group',
          title: 'Group',
          to: '/senior/admin/group'
        },
        {
          icon: 'mdi-clipboard-check-multiple',
          title: 'Criteria',
          to: '/senior/admin/criteria'
        },
        // {
        //   icon: "mdi-account-search ",
        //   title: "Group of Teacher",
        //   to: "/senior/admin/teacherGroup",
        // },
        {
          icon: 'mdi-clipboard-text',
          title: 'Doucment',
          to: '/senior/admin/viewAssignment'
        },
        {
          icon: 'mdi-clipboard-list',
          title: 'Manage Majors',
          to: '/senior/admin/majorManage'
        }
      ]
    }
  },
  async fetch() {
    try {
      const res = await this.$axios.get('/date/allYearsSemester')
      if (res.status !== 200) {
        throw new Error('Failed to fetch academic date data')
      }
      await this.$store.commit('auth/SET_USER_SEMESTER_DATA', res.data)
    } catch (err) {
      console.log(err)
      return
    }
  }
}
</script>
<style scoped>
.it-background {
  background-color: #edf2f9 !important;
}
.it-background::before {
  position: absolute;
  content: '';
  background-image: url('@/static/bg.png');
  background-repeat: no-repeat;
  background-size: cover;
  height: 30rem;
  width: 100%;
}
</style>
