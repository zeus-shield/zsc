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
  created() {
    console.log('%c[UserQuestions]created()', `color:${this.logColor}`);
  },
  mounted() {
    console.log('%c[UserQuestions]mounted()', `color:${this.logColor}`);
  },
  destroyed() {
    console.log('%c[UserQuestions]destroyed()', `color:${this.logColor}`);
  },
  updated() {
    console.log('%c[UserQuestions]updated()', `color:${this.logColor}`);
  },
};
</script>
