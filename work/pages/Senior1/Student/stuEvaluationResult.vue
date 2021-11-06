<template>
    <div>
        <Appbar />
    <Sidebar />
 
    <EvaluationResultForm />
    </div>
</template>

<script>
import Appbar from "@/components/Global/mainAppbar";
import Sidebar from "@/components/Student/stuSidebar";
import EvaluationResultForm from "@/components/Student/stuEvaluationResultTable";
export default {
  components: {
    Appbar,
    Sidebar,
    EvaluationResultForm
  },
};
</script>