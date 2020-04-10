<template>
  <div class="user-datail" :class="{'user-datail-mobile': device !== 'pc'}">

    <div class="account">
      <div class="header">
        <span class="sprite"></span>
        <span>{{ langSet.user.detail.account.title }}</span>
      </div>

      <div class="interval-md"></div>
      <div class="interval-md"></div>
    </div>

    <div class="interval-lg"></div>
  </div>
</template>

<style lang="scss" scoped>
.user-datail-mobile {
  padding: 1.25rem; // 20px
}
.user-datail {
  font-size: 0.875rem; // 14px;
  color: #444;
}
.interval-md {
  margin: 0.5rem; // 8px;
  min-height: 0.25rem; // 4px;
}
.interval-lg {
  margin: 1rem; // 16px;
  min-height: 0.5rem; // 8px;
}
.account .header,
.security .header {
  font-size: 1.5rem; // 24px;
  font-weight: 400;
  padding: 0.5rem 0;
  border-bottom: 0.0625rem solid #e4e4e4;
}
.account .header .sprite,
.security .header .sprite {
}
.account .tip {
}
.account .tip .title {
  font-size: 0.875rem; // 14px;
  font-weight: 700;
  color: #444;
}
.account .tip .description {
  font-size: 0.875rem; // 14px;
  color: #444;
}
.account .info {
  // margin: 1.25rem auto;
  box-shadow: 0 0.125rem 1.25rem 0 rgba(0,0,0,.05);
  border-radius: 0.25rem;
}
.account .info .gap {
  display: flex;
  justify-content: center;
  align-items: center;
}
.account .info .gap .line {
  content: "";
  height: 70%;
  width: 0.0625rem;
  background-color: #e4e4e4;
}
.account .info .title {
  color: #999;
}
.account .info .content {
  font-weight: 700;
}
.security .row {
  // padding: 0.75rem 1.5rem;
  // border-bottom: 1px solid #e9e9e9;
}
.security .row .col {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.security .row .icon {
  font-size: 1rem; // 16px;
  color: #67C23A;
}
.security .row .description {
  color: #999;
}
.dialog .form .space {
  margin-top: 1.375rem; // 22px;
}
.dialog .button {
  width: 50%;
}
</style>

<script>
</script>