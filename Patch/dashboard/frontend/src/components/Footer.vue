<template>
  <div class="footer">
    <p>Copyright? 2018-2019 Dashboard</p>
  </div>
</template>

<style lang="scss" scoped>
  .footer {
    width: 100%;
    float: left;
    height:50px;
    text-align: center;
    background-color: #545c64; // RGB(52,58,64)
  }
  .footer p {
    margin-top: 15px;
    color: #fff; // RGB(154,157,160)
  }
  .footer a {
    font-family: "source sans pro";
    font-weight: 600;
  }
</style>

<script>
import { mapState } from 'vuex';

export default {
};
</script>