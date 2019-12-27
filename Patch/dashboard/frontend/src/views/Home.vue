<template>
  <div class="home">
    Home
  </div>
</template>

<style lang="scss" scoped>
.row {
  margin-bottom: 3.125rem; // 50px;
  &:last-child {
    margin-bottom: 0rem;
  }
}

.gallery-thumbs .swiper-slide {
  opacity: 0.4;
}
// for vue-awesome-swiper
// .gallery-thumbs .swiper-slide-active {
//   opacity: 1;
// }
// for original swiper
.gallery-thumbs .swiper-slide-thumb-active {
  opacity: 1;
}
.swiper-button-next, .swiper-button-prev {
  top: 40%;
  // width: 10%;
  height: 20%;
  margin-top: 0rem;
}
.swiper-slot .bg {
  // height: 100%;
  width: 100%;
}
.swiper-slot .cover {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0rem;
  top: 0rem;

  // display: table;

  display: flex;
  justify-content: center;
  align-items: center;
}
.swiper-slot .cover .inner {
  // display: table-cell;
  // vertical-align: middle;
  // text-align: center;

  width: 100%;
}
.swiper-slot .cover .inner .row-pc {
  display: flex;
  justify-content: left;
  align-items: center;
}
.swiper-slot .cover .inner .title {
  font-size: 2.5rem; // 40px;
  font-weight: 500;
  color: #fff;
  text-align: left;
  margin-bottom: 1rem;
}
.slot2 .content {
  text-align: left;
}
.slot3 .title {
  font-size: 2rem;
  font-weight: 600;
  color: #122739;
  text-align: center;
  margin-bottom: 10px;
}
.slot3 .card {
  margin-bottom: 20px
}
.slot3 .card .text {
  padding: 14px;
}
.slot3 .card .text .sub-title {
  font-size: 18px;
  font-weight: 600;
}
</style>

<script>
// import Swiper from 'swiper';
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
      window.addEventListener('resize', () => {
        if (vm.resizeFlag) {
          clearTimeout(vm.resizeFlag);
        }
        vm.resizeFlag = setTimeout(() => {
          vm.resizeFlag = null;
          vm.updateHandle();
        }, 100);
      });
    }
  },
  created() {
    console.log('%c[Home]created()', `color:${this.logColor}`);
  },
  mounted() {
    console.log('%c[Home]mounted()', `color:${this.logColor}`);
    this.lang = utils.storage.cookie.get('lang');
    this.updateHandle();

    this.$nextTick(() => {
    });
  },
  destroyed() {
    console.log('%c[Home]destroyed()', `color:${this.logColor}`);
  },
  updated() {
    console.log('%c[Home]updated()', `color:${this.logColor}`);
    this.lang = utils.storage.cookie.get('lang');
    this.updateHandle();
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
  }
};
</script>