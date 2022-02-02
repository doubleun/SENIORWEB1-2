<template>
  <section>
    <main class="coordinator-progress-main">
      <h1>{{ title }} (My Advisee)</h1>

      <!-- Card (Evaluation result) -->
      <ProjectDetailCard :GroupDetail="GroupDetail" />

      <!-- Evaluation result -->
      <v-card
        class="co-evaluation-result-card my-12"
        v-if="this.$route.params.progress === 're-evaluation'"
      >
        <v-card-title>EVALUATION RESULT</v-card-title>
        <EvaluationResultGrid
          :Group_ID="this.$store.state.group.currentUserGroup.Group_ID"
          :evalScores="fetchScoresRes"
        />
      </v-card>

      <!-- Display work -->
      <DisplayWorkSection
        :noWorkSubmitted="noWorkSubmitted"
        :progressId="progressId"
        :submittedFiles="submittedFiles"
        :maxScore="maxScore"
        :Assignment_ID="Assignment_ID"
        :scoreInfo="scoreInfo"
        :progressionDueDate="progressionDueDate"
      />
    </main>
  </section>
</template>

<script>
// import ProjectDetailCard from "@/components/global/projectDetailCard";
// import DisplayWorkSection from "@/components/global/displayWorkSection";

export default {
  layout: "coordinator",
  async asyncData({ $axios, params, redirect, store }) {
    try {
      // If params is not available, redirect back to the group info page
      // TODO: these should be from the available progress, cuz each major has differnt number of progresses
      const allProgresses = [
        "proposal",
        "progress-1",
        "progress-2",
        "progress-3",
        "progress-4",
        "final-presentation",
        "final-documentation",
        "evaluation",
        "re-evaluation",
      ];
      !allProgresses.includes(params.progress) &&
        redirect(`/Senior1/coordinator/${params.groupId}`);

      // Find progress id using index
      const progressId = allProgresses.findIndex(
        (itm) => itm === params.progress
      );

      // This regex will find the first non-word (ie. in this case a dash "-")
      const dashRegex = /[^\w]/g;

      // Use regex to match only 'Number' in params (ie. ignore 'group' that comes before the actual group io)
      const groupId = params.groupId.match(/(\d)/g).join("");

      // Fetch group info
      // If the user is not advisor or committee of this group, an error will be thrown and they will redirect to teacher home page
      const groupRes = await $axios.$post("/group/getGroupWithID", {
        Group_ID: groupId,
        Email: store.state.auth.currentUser.email,
        Project_on_term_ID: store.state.auth.currentUser.projectOnTerm,
      });

      // Fetch submitted file(s)
      const submittedFiles = await $axios.$post(
        "/assignment/getAssignmentFiles",
        {
          Group_ID: groupId,
          Progress_ID: progressId + 2,
        }
      );
      console.log("submittedFiles: ", submittedFiles);

      // Fetch progression due date
      const progressionDueDate = await $axios.$post(
        "/date/getProgressDueDate",
        {
          Progress_ID: progressId + 2,
          Major_ID: store.state.auth.currentUser.major,
          Project_on_term_ID: store.state.auth.currentUser.projectOnTerm,
        }
      );
      console.log("ProgressDueDate: ", progressionDueDate);

      // If no submitted files hides the DisplaWorkSection compoenent
      if (submittedFiles.length === 0) {
        console.log("submittedFiles length is zero, returning null !");
        return {
          GroupDetail: {
            GroupInfo: groupRes.groupInfo[0],
            GroupMembers: groupRes.groupMembers,
          },
          submittedFiles,
          noWorkSubmitted: true,
          title: params.progress.replace(dashRegex, " "),
          Assignment_ID: null,
          progressId: null,
          maxScore: null,
          scoreInfo: null,
          progressionDueDate,
        };
      }

      let maxScore = { score: 0, Assignment_ID: 0 };
      let fetchScoresRes, gradeCriterias;
      // If re-eval, don't fetch max score
      if (progressId === 10) {
        // Fetch available grade criterias
        // Fetch grade from grade criterias
        try {
          gradeCriterias = await $axios.$post("/criteria/gradeMajor", {
            Major_ID: store.state.auth.currentUser.major,
          });

          // Fetch evaluation scores
          fetchScoresRes = await $axios.$post(
            "/assignment/getEvaluationScores",
            {
              Group_ID: groupId,
            }
          );

          // If there are score (in any progress from 1 - final) then calculate the total score, and suggested grade
          if (!!fetchScoresRes && fetchScoresRes.length !== 0) {
            // Calculate total score
            fetchScoresRes.total = Object.values(fetchScoresRes).reduce(
              (prev, current) =>
                parseFloat(prev) + (!current ? 0 : parseFloat(current)),
              0
            );

            // Calculate sugesstion grade
            const suggestGrade = gradeCriterias.find(
              (criteria) => fetchScoresRes.total >= criteria.Grade_Criteria_Pass
            );
            console.log("Suggest grade: ", suggestGrade);

            // Add to fetchScoresRes
            fetchScoresRes.suggestGrade = suggestGrade.Grade_Criteria_Name;
          }
        } catch (err) {
          console.log(err);
          return;
        }
      } else {
        // If progress id is 0 then we can't get max score (since progress id 2 is proposal)
        // Then instead of fetching max score, we fetch only assignment id
        if (progressId === 0) {
          console.log("getting assignment id for proposal");
          maxScore.Assignment_ID = await $axios.$post(
            "/criteria/getAssignmentId",
            {
              Progress_ID: progressId + 2,
              Group_ID: groupId,
            }
          );
        } else {
          // Fetch score criteria for setting the max score this user can give
          maxScore = await $axios.$post("/criteria/getProgressMaxScore", {
            Group_Role: groupRes.groupInfo[0].Current_Member_Role,
            Progress_ID: progressId + 2,
            Project_on_term_ID: store.state.auth.currentUser.projectOnTerm,
          });
        }
      }

      // FIXME: There should be a check before fetching group, not after fetched it
      // Set group state, this is added in later for the layout to know current progress of each group
      // Check if the group state is already set, if not commit again
      if (!store.state.group.currentUserGroup)
        store.commit("group/SET_GROUP", groupRes.groupInfo[0]);

      // Fetch score to check if this user alrady given a score
      const scoreInfo = await $axios.$post(
        "/assignment/getTeacherProgressScore",
        {
          Group_Member_ID: groupRes.groupInfo[0].Current_Member_ID,
          Assignment_ID: maxScore.Assignment_ID,
        }
      );

      // Finally, check current user group member role (subrole) if they're committee then the max score needs to be half
      if (store.state.group.currentUserGroup.Current_Member_Role === 1)
        maxScore.score = maxScore.score / 2;

      // console.log("groupState: ", store.state.group.currentUserGroup);
      // console.log("groupState: ", store.state.auth.currentUser);
      return {
        // Replace the dash with space and use it as title
        title: params.progress.replace(dashRegex, " "),
        // If the allProgresses index is 0 then it needs to be 8 becuase proposal is progress id 8 in database
        progressId: progressId + 2,
        submittedFiles,
        maxScore: maxScore.score,
        Assignment_ID: maxScore.Assignment_ID,
        GroupDetail: {
          GroupInfo: groupRes.groupInfo[0],
          GroupMembers: groupRes.groupMembers,
        },
        fetchScoresRes: !!fetchScoresRes ? fetchScoresRes : {},
        gradeCriterias: !!gradeCriterias ? gradeCriterias : [],
        scoreInfo,
        noWorkSubmitted: false,
        progressionDueDate,
      };
    } catch (error) {
      console.log(error);
      return redirect("/Senior1/coordinator/");
    }
  },
};
</script>

<style>
.coordinator-progress-main {
  margin-block-end: 2rem;
}
.coordinator-progress-main > h1 {
  margin-block: 2rem;
  font-size: 1.8rem;
  color: white;
  text-transform: capitalize;
}
.coordinator-progress-main .v-card__title {
  padding-block-start: 1.5rem;
  font-weight: bold;
}
</style>
