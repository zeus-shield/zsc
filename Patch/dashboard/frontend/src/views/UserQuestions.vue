<template>
  <div class="user-questions">
    UserQuestions
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'UserQuestions',
  // components: {
  // },
  data() {
    return {
    };
  },
  // props: {
  // },
  computed: {
    ...mapState({
      logColor: state => state.logColor.user.pc.questions
    })
  },
  computed: {
  },
};
</script>
