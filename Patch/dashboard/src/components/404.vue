<template>
  <div class="not-found">
    <img src="../assets/images/not_found.png">
    <p>您访问的页面不存在...</p>
    <div>
      <router-link :to="{path: '/'}"><el-button type="primary" plain>返回首页</el-button></router-link>
    </div>
  </div>
</template>
<style scoped>
</style>
