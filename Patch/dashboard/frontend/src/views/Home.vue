<template>
  <div class="home">
    Home
  </div>
</template>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 50px;
  &:last-child {
    margin-bottom: 0px;
  }
}

.gallery-thumbs .swiper-slide {
  opacity: 0.4;
.slot3 .card .text {
  padding: 14px;
}
.slot3 .card .text .sub-title {
  font-size: 18px;
  font-weight: 600;
}
</style>

<script>
import Swiper from 'swiper';
import 'swiper/dist/css/swiper.min.css';

import { mapState, mapGetters } from 'vuex';

import utils from '../common/utils';

export default {
  name: 'Home',
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
      logColor: state => state.logColor.home
    }),
    ...mapGetters('lang', ['langSet']),
    ...mapGetters('device', ['device'])
  },
  beforeCreate() {
    let vm = this;
    if (process.env.NODE_ENV === 'development') {
    }
  },
  created() {
    console.log('%c[Home]created()', `color:${this.logColor}`);
  },
  mounted() {
    console.log('%c[Home]mounted()', `color:${this.logColor}`);
  },
  destroyed() {
    console.log('%c[Home]destroyed()', `color:${this.logColor}`);
  },
  updated() {
    console.log('%c[Home]updated()', `color:${this.logColor}`);
    this.lang = utils.storage.cookie.get('lang');
  },
  beforeRouteEnter(to, from, next) {
    console.log('%c[Home]beforeRouteEnter(\"%s\" => \"%s\")', 'color:black', from.fullPath, to.fullPath);
    next(vm => {
      // console.log(vm);
      console.log('%c[Home]beforeRouteEnter(\"%s\" => \"%s\") next', `color:${vm.logColor}`, from.fullPath, to.fullPath);
    });
  },
  beforeRouteUpdate(to, from, next) {
    console.log('%c[Home]beforeRouteUpdate(\"%s\" => \"%s\")', `color:${this.logColor}`, from.fullPath, to.fullPath);
    next();
  },
  beforeRouteLeave(to, from, next) {
    console.log('%c[Home]beforeRouteLeave(\"%s\" => \"%s\")', `color:${this.logColor}`, from.fullPath, to.fullPath);
    next();
  },
  methods: {
    getImgUrl(item) {
      return require('@/assets/images/slider' + (item) + '.jpg');
    },
    updateHeight() {
      let imgHeightTemp = window.screen.width;
      if (imgHeightTemp >= 992) {
        this.imgHeight = 500 + 'px';
        this.cardHeight = this.lang === 'en' ? '350px' : '300px';
      } else if (imgHeightTemp >= 768) {
        this.cardHeight = this.lang === 'en' ? '350px' : '300px';
      } else if (imgHeightTemp >= 668) {
        this.cardHeight = this.lang === 'en' ? '350px' : '250px';
      } else {
        this.imgHeight = (window.screen.width - (20 + 8) * 2) * 500 / 1190 + 'px';
        this.cardHeight = this.lang === 'en' ? '400px' : '250px';
      }
    },
    changeFun(val, oldVal) {
      this.activeIndex = val;
    }
  }
};
</script>