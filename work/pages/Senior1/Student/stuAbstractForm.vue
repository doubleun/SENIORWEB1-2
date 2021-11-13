<template>
  <div>
    <h2 class="header-title mb-2 mt-5">Abstract</h2>
    <v-divider></v-divider>
    <EvaluationForm />
  </div>
</template>
<script>
import EvaluationForm from "@/components/Student/stuEvaluationForm";
export default {
  components: {
    Appbar,
    Sidebar,
    EvaluationForm
  }
};
</script>
