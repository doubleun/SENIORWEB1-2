<template>
  <v-container>
    <!-- <main class="coordinator-progress-main"> -->
    <h2 class="header-title mb-2 mt-5 mb-10 white--text">
      {{ title.charAt(0).toUpperCase() + title.slice(1) }} ({{
        groupAdvisor ? "My Advisee" : "Committee"
      }})
    </h2>

    <!-- Card (Evaluation result) -->
    <ProjectDetailCard :GroupDetail="GroupDetail" />

    <!-- Evaluation result -->
    <v-card
      class="co-evaluation-result-card my-12"
      v-if="this.$route.params.progress === 're-evaluation'"
    >
      <div v-if="!noWorkSubmitted">
        <v-card-title>EVALUATION RESULT</v-card-title>
        <EvaluationResultGrid
          :Group_ID="GroupDetail.GroupInfo.Group_ID"
          :evalScores="fetchScoresRes"
        />
      </div>
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
      :gradeNameArr="gradeNameArr"
      :groupAdvisor="groupAdvisor"
      :fetchScoresRes="fetchScoresRes"
    />
    <!-- </main> -->
  </v-container>
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
        redirect(`/senior1/coordinator/${params.groupId}`);

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
      console.log("groupRes", groupRes);
      // Sets group advisor to true if the current user is the advisor of the group (Member_Role of 0 is advisor)
      let groupAdvisor;
      if (groupRes.groupInfo[0].Current_Member_Role === 0) groupAdvisor = true;
      console.log("Is group advisor: ", groupAdvisor);

      // Fetch submitted file(s)
      const submittedFiles = await $axios.$post(
        "/assignment/getAssignmentFiles",
        {
          Group_ID: groupId,
          Progress_ID: progressId + 2,
        }
      );
      console.log("submittedFiles: ", submittedFiles);

      // TODO: Repeat logic (student/work/_progress.vue)
      // Fetch progression due date
      let progressionDueDate = {};
      const currentProgress = store.getters["group/availableProgress"].find(
        (progress) => progress.Progress_ID === progressId + 2
      );
      // console.log("currentProgress: ", currentProgress);
      if (store.getters["group/availableProgress"].length !== 0) {
        progressionDueDate = {
          DueDate_Start: currentProgress.DueDate_Start,
          DueDate_End: currentProgress.DueDate_End,
        };
      }
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
          fetchScoresRes: {},
          gradeCriterias: [],
          maxScore: null,
          scoreInfo: null,
          gradeNameArr: [],
          groupAdvisor,
          progressionDueDate: !!progressionDueDate ? progressionDueDate : {},
        };
      }

      let maxScore = { score: 0, Assignment_ID: 0 };
      let fetchScoresRes, gradeCriterias, gradeNameArr;
      console.log(progressId);

      // If progress id = 8 then it's re-eval, so we'll need grade criterias and scores
      if (progressId === 8) {
        // Fetch available grade criterias
        // Fetch grade from grade criterias
        console.log("Fetching for re-eval");
        try {
          gradeCriterias = await $axios.$post("/criteria/gradeMajor", {
            Major_ID: groupRes.groupInfo[0].Major,
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

          // Create grade name array using all available grade criterias
          gradeNameArr = gradeCriterias.map(
            (criteria) => criteria.Grade_Criteria_Name
          );
          // Add 'as system suggested' as the first element in the array
          gradeNameArr = ["As system suggested", ...gradeNameArr];

          // If there's a given grade assign it to fetchScoreRes for showing in the EvalResultGrid data-table
          groupRes.groupInfo[0].Grade
            ? (fetchScoresRes.normalGrade = groupRes.groupInfo[0].Grade)
            : (fetchScoresRes.normalGrade = "");
        } catch (err) {
          console.log(err);
          return;
        }
      }

      // If progress id is 0 then we can't get max score (since progress id 2 is proposal)
      // Then instead of fetching max score, we fetch only assignment id
      if (progressId === 0 || progressId === 8) {
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

      // FIXME: There should be a check before fetching group, not after fetched it
      // Set group state, this is added in later for the layout to know current progress of each group
      // Check if the group state is already set, if not commit again
      if (!store.state.group.currentUserGroup)
        store.commit("group/SET_GROUP", groupRes.groupInfo[0]);

      // Set available group progressions based on group major
      store.dispatch("group/storeAvailableProgressions");

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
        gradeNameArr: !!gradeNameArr ? gradeNameArr : [],
        groupAdvisor,
        progressionDueDate,
      };
    } catch (error) {
      console.log(error);
      return redirect("/senior1/coordinator/");
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
