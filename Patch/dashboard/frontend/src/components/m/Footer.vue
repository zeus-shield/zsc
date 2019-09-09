<template>
  <div class="footer">
    <p>Copyright? 2018-2019 Dashboard(mobile)</p>
  </div>
</template>

<style lang="scss" scoped>
  .footer {
    width: 100%;
    float: left;
    height:50px;
    text-align: center;
    background: RGB(52,58,64)
  }
  .footer p {
    margin-top: 15px;
    color:RGB(154,157,160)
  }
  .footer a {
    font-family: "source sans pro";
    font-weight: 600;
  }
</style>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Footer',
  // components: {
  // },
  data() {
    return {
    };
  },
};
</script>