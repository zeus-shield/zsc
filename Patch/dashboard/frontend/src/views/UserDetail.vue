<template>
  <div class="user-datail" :class="{'user-datail-mobile': device !== 'pc'}">
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
}
.account .info .gap {
  display: flex;
  justify-content: center;
  align-items: center;
}
.account .info .gap .line {
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
}
.security .row .icon {
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