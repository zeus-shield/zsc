<template>
  <div class="home">
    <div class="row">
      <el-row class="swiper-slot" :gutter="0">
        <el-col>
          <!-- for original swiper -->
          <div v-if="originalSwiper === true">
            <div class="swiper-container gallery-top">
              <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(item, index) in 3" :key="index">
                  <img :class="{'bg': device === 'pc'}" :src="getImgUrl('banner-bg', item)" alt=""></img>
                  <div class="cover">
                    <div class="inner">
                      <el-row :gutter="0" :class="{ 'row-pc': device === 'pc' }">
                        <el-col :xs="{span: 16, offset: 4}" :sm="{span: 11, offset: 1}" :md="{span: 11, offset: 1}" :lg="{span: 11, offset: 1}">
                          <div class="title">{{ langSet.home.slot1.title[item-1] }}</div>
                          <div class="content">{{ langSet.home.slot1.content[item-1] }}</div>
                        </el-col>
                        <el-col class="space" :xs="{span: 16, offset: 4}" :sm="{span: 0, offset: 0}" :md="{span: 0, offset: 0}" :lg="{span: 0, offset: 0}"></el-col>
                        <el-col :xs="{span: 16, offset: 4}" :sm="{span: 10, offset: 0}" :md="{span: 10, offset: 0}" :lg="{span: 10, offset: 0}">
                          <img class="img" :src="getImgUrl('banner', item)" alt=""></img>
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                </div>
               </div>
              <div class="swiper-button-next swiper-button-white"></div>
              <div class="swiper-button-prev swiper-button-white"></div>
              <div class="swiper-pagination"></div>
            </div>
            <!-- <div class="swiper-container gallery-thumbs">
              <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(item, index) in 3" :key="index">
                  <img class="bg" :src="getImgUrl('banner-bg', item)" alt=""></img>
                </div>
              </div>
            </div> -->
          </div>

          <!-- for vue-awesome-swiper -->
          <div v-else>
            <swiper :options="swiperOptionTop" class="gallery-top" ref="swiperTop">
              <swiper-slide v-for="(item, index) in 3" :key="index">
              </swiper-slide>
            </swiper>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="row">
      <div class="card-slot">
        <el-row :gutter="10">
          <div class="header">{{ langSet.home.slot2.header }}</div>
          <el-col v-for="(item, index) in 4" :key="item" :xs="{span: 24, offset: 0}" :sm="{span: 24, offset: 0}" :md="{span: 24, offset: 0}" :lg="{span: 6, offset: 0}">
            <el-card class="card" shadow="never" :body-style="{ padding: '1.25rem' }">
              <img class="img" :src="getImgUrl('card', 1, item)">
              <span class="title">{{ langSet.home.slot2.title[item-1] }}</span>
              <div>
                <span class="content">{{ langSet.home.slot2.content[item-1] }}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="row">
      <div class="text-slot">
        <el-row :gutter="0">
          <el-card class="card" shadow="never">
            <el-row>
              <div class="title">{{ langSet.home.slot3.title }}</div>
              <el-col :offset="1" :span="22">
                <p class="content">{{ langSet.home.slot3.content }}</p>
              </el-col>
            </el-row>
          </el-card>
        </el-row>
      </div>
    </div>

    <div class="row">
      <div class="card-slot">
        <el-row :gutter="10">
          <div class="header">{{ langSet.home.slot4.header }}</div>
          <el-col v-for="(item, index) in 4" :key="item" :xs="{span: 24, offset: 0}" :sm="{span: 24, offset: 0}" :md="{span: 24, offset: 0}" :lg="{span: 6, offset: 0}">
            <el-card class="card" shadow="never" :body-style="{ padding: '1.25rem' }">
              <img class="img" :src="getImgUrl('card', 2, item)">
              <span class="title">{{ langSet.home.slot4.title[item-1] }}</span>
              <div>
                <span class="content">{{ langSet.home.slot4.content[item-1] }}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>

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
.swiper-slot .cover .inner .content {
  font-size: 1.25rem; // 20px
  color: #fff;
  text-align: left;
}
.swiper-slot .cover .inner .space {
  margin: 0.625rem; // 10px;
}
.swiper-slot .cover .inner .img {
  width: 100%; 
}
.card-slot,
.text-slot {
  padding: 0.5rem;
}
.card-slot .header {
  font-size: 2.25rem; // 36px;
  font-weight: 500;
  color: #232F3E; // #122739;
  text-align: center;
  margin-bottom: 0.625rem; // 10px
}
.card-slot .card {
  margin-bottom: 1.25rem; // 20px
}
.card-slot .img {
  width: 100%;
}
.card-slot .card .title {
  font-size: 1.125rem; // 18px
  color: #007EB9;
  font-weight: 500;
}
.card-slot .card .content {
  font-size: 0.8125rem; // 13px
  font-weight: 500;
  color: #333;
}
.text-slot .card {
  background: #F2F4f4;
}
.text-slot .title {
  font-size: 2.25rem; // 36px;
  font-weight: 500;
  color: #232F3E; // #232F3E;
  text-align: center;
}
.text-slot .content {
  font-size: 1.25rem; // 20px
  font-weight: 500;
  color: #333;
  text-align: left;
}
</style>

<script>
// original swiper
import Swiper from 'swiperjs';
import 'swiper/css/swiper.min.css'; // import in 'config.js'

// vue-awesome-swiper
// import 'swiper/dist/css/swiper.min.css';

import { mapState, mapGetters } from 'vuex';

import utils from '@/common/utils';

export default {
  name: 'Home',
  // components: {
  // },
  data() {
    return {
      lang: '',
      resizeFlag: null,
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
      if (this.originalSwiper === true) {
        // for original swiper
        let swiper = new Swiper('.gallery-top', {
          spaceBetween: 5,
          loop: true,
          loopedSlides: 3, // looped slides should be the same
          freeMode: true,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          },
          thumbs: {
            // swiper: {
            //   el: '.gallery-thumbs',
            //   spaceBetween: 5,
            //   slidesPerView: 3,
            //   touchRatio: 0.2,
            //   loop: true,
            //   loopedSlides: 3, // looped slides should be the same
            //   freeMode: true,
            //   centeredSlides: true,
            //   centeredSlidesBounds: true, // invalid for vue-awesome-swiper(swiper4)
            //   slideToClickedSlide: true
            // }
          }
        });
        console.log(swiper);
      } else {
        // for vue-awesome-swiper thumbs
        // const swiperTop = this.$refs.swiperTop.swiper;
        // const swiperThumbs = this.$refs.swiperThumbs.swiper;
        // swiperTop.controller.control = swiperThumbs;
        // swiperThumbs.controller.control = swiperTop;
      }
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
    getImgUrl(type, param1, param2) {
      if (type === 'banner') {
        return require('@/assets/images/banner/banner-' + (param1) + '.png');
      } else if (type === 'banner-bg') {
        return require('@/assets/images/banner/banner-bg-' + (param1) + '.png');
      } else if (type === 'card') {
        return require('@/assets/images/card/card-' + (param1) + '-' + (param2) + '.png');
      } else {}
    },
    updateHandle() {
      // TODO
    }
  }
};
</script>