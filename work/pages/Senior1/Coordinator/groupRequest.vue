<template>
<div>
    <h2 class="header-title mb-2 mt-5 mb-10 white--text">Group Request</h2>
   <tablerequest/> 
</div>
    
</template>

<script>
import tablerequest from "@/components/Coordinator/coTableRequest";

export default {
  layout: "coordinatorsidebar",
  components: {
    tablerequest,
  },
};
</script>
