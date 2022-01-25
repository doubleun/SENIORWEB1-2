<template>
  <main>
    <StudentWorkSubmission
      :title="title"
      :finalDocument="title === 'final documentation'"
      :progressId="progressId"
      :submittedFiles="submittedFiles"
      :advisor="advisor"
      :committees="committees"
      :progressionDueDate="progressionDueDate"
    />

    <CommentCard
      :advisor="advisor"
      :committees="committees"
      :progressId="progressId"
    />
  </main>
</template>

<script>
// import WorkSubmission from "@/components/student/workSubmission";

export default {
  async asyncData({ $axios, params, redirect, store }) {
    // If currentUserGroup is missing, fetch it first
    if (!store.state.group.currentUserGroup)
      // Dispatch event to store current user group info
      await store.dispatch("group/storeGroupInfo");

    // If after fetching group the store still don't have current user group info, redirect them
    if (!store.state.group.currentUserGroup) {
      redirect("/Senior1/student/stuCreateGroup");
      return;
    }
    console.log("after redirect no group!");

    // allProgresses is for listing allowed params
    // TODO: these should be from the available progress, cuz each major has differnt number of progresses
    const allProgresses = [
      "proposal",
      "progress-1",
      "progress-2",
      "progress-3",
      "progress-4",
      "final-presentation",
      "final-documentation",
      "re-evaluation",
    ];
    // If params is not available in the allowed params, redirect back to the home page
    !allProgresses.includes(params.progress) && redirect("/Senior1/student/");

    // Find progress id using index, this still needs to be offset by 2 (ie. + 2, when use)
    const progressId = allProgresses.findIndex(
      (itm) => itm === params.progress
    );

    // * === Block user from getting to progress pages while members are not in the group === * //
    console.log("ProgressID: ", progressId);
    console.log(
      "Current user group members: ",
      store.state.group.currentUserGroupMembers
    );
    // Check if the user alrady has group members in store, if not dispatch an event to fetch it
    if (!store.state.group.currentUserGroupMembers)
      await store.dispatch("group/storeGroupMembers");

    // Then check if there are any members that does not accept the invite yet
    const notAccpetMembers = store.state.group.currentUserGroupMembers.filter(
      (member) => member.User_Status === 0
    );
    console.log("Not accept members: ", notAccpetMembers);
    // If there are, show alert, redirect, and return the function
    if (notAccpetMembers.length > 0) {
      // If notAcceptMembers is return from the asyncData, then we show alert and redirect
      alert("Please wait until all members accept the group invite");
      // Redirect to create group page so they can see all members status
      redirect("/Senior1/student/stuCreateGroup");
      return;
    }

    // This regex will find the first non-word (ie. in this case a dash "-")
    // It's use for construct a work submission card's title from the params (which is one of the option in 'allProgresses')
    const dashRegex = /[^\w]/g;

    // Fetch submitted file(s)
    const submittedFiles = await $axios.$post(
      "/assignment/getAssignmentFiles",
      {
        Group_ID: store.state.group.currentUserGroup.Group_ID,
        Progress_ID: progressId + 2,
      }
    );

    // Fetch teachers and given scores
    let teachers = await $axios.$post("/group/getTeachersWithGroupID", {
      Group_ID: store.state.group.currentUserGroup.Group_ID,
      Progress_ID: progressId + 2,
      Project_on_term_ID: store.state.auth.currentUser.projectOnTerm,
    });
    // console.log("submittedFiles: ", submittedFiles);
    // console.log("Teachers in progress (line: 126): ", teachers);

    // Add files for teachers
    submittedFiles.forEach((file) => {
      switch (file.Group_Member_ID) {
        // If file match advisor id
        case teachers.advisor?.Group_Member_ID:
          teachers.advisor = {
            ...teachers.advisor,
            // Using rest syntax for spreading conditionally
            ...(teachers.advisor?.files
              ? { files: [...teachers.advisor.files, file] }
              : { files: [file] }),
          };
          break;
        // If file match committee 1 id
        case teachers.committees[0]?.Group_Member_ID:
          teachers.committees[0] = {
            ...teachers.committees[0],
            // Using rest syntax for spreading conditionally
            ...(teachers.committees[0]?.files
              ? { files: [...teachers.committees[0].files, file] }
              : { files: [file] }),
          };
          break;
        // If file match committee 2 id
        case teachers.committees[1]?.Group_Member_ID:
          teachers.committees[1] = {
            ...teachers.committees[1],
            // Using rest syntax for spreading conditionally
            ...(teachers.committees[1]?.files
              ? { files: [...teachers.committees[1].files, file] }
              : { files: [file] }),
          };
          break;
      }
    });

    // Fetch progression due date
    const progressionDueDate = await $axios.$post("/date/getProgressDueDate", {
      Progress_ID: progressId + 2,
      Major_ID: store.state.auth.currentUser.major,
      Project_on_term_ID: store.state.auth.currentUser.projectOnTerm,
    });
    console.log("ProgressDueDate: ", progressionDueDate);

    return {
      // Replace the dash with space and use it as title
      title: params.progress.replace(dashRegex, " "),
      // If the allProgresses index is 0 then it needs to be 8 becuase proposal is progress id 8 in database
      progressId: progressId + 2,
      submittedFiles,
      advisor: teachers.advisor,
      committees: teachers.committees,
      teachers,
      progressionDueDate,
    };
  },
  methods: {
    // handleNotAcceptGroup(notAccpetMembers) {
    //   // If notAcceptMembers is return from the asyncData, then we show alert and redirect
    //   if (!!notAccpetMembers && notAccpetMembers.length > 0) {
    //     // Show alert telling user the list of group members who are yet to accept the invitation
    //     this.$swal.fire({
    //       title: "Please wait until all group members accept the invite",
    //       text: "Bla bla",
    //       icon: "warning",
    //       confirmButtonColor: "#3085d6",
    //       confirmButtonText: "Understood",
    //     });
    //     // Redirect user back to home page
    //     this.$router.push("/Senior1/student/");
    //   }
    // },
  },
};
</script>

<style></style>
