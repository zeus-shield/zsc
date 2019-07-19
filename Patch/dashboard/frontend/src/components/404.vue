<template>
  <div class="not-found">
    <img src="../assets/images/not_found.png">
    <p>?????????...</p>
    <div>
      <router-link :to="{path: '/'}"><el-button type="primary" plain>????</el-button></router-link>
    </div>
  </div>
</template>
<style scoped>
/*  html,body {
    height: 100%;
  }
  #app {
    height: 100%;
    margin-top: 0;
  }*/
  .not-found {
/*    position: absolute;*/
/*    top: 20%;*/
/*    width: 100%;*/
    text-align: center;
  }
/*  .not-found img {
    max-width: 100%;
    max-height: 100%;
  }*/
  .not-found p {
    margin: 20px;
    font-size: 16px;
    color: #0d3349;
  }
</style>
