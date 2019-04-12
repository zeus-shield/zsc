<template>
<div class="page-body">
   <!-- slider 轮播-->  
  <section class="wrapper100percent" id="menu1"> 
    <el-carousel trigger="click" :height="imgHeight" >
      <el-carousel-item v-for="item in 3" :key="item">
          <img style="width:100%" :src="getImgUrl(item)" alt=""/>
          <div class="flex-caption flex-caption1" v-if="item == 1">
            <div class="container">
              <div class="row">
                  <div style="text-align:center;">
                    <h1 style="font-size:35px">{{language.index.menu1.title1}}</h1>
                    <p>{{language.index.menu1.page1}}</p>
                  </div>
              </div>
            </div>
          </div>
          <div class="flex-caption flex-caption1" v-if="item == 2">
            <div class="container">
              <div class="row">
                  <div style="text-align:center;">
                    <h1 style="font-size:35px">{{language.index.menu1.title2}}</h1>
                    <p>{{language.index.menu1.page2}}</p>
                  </div>
              </div>
            </div>
          </div> 
          <div class="flex-caption flex-caption1" v-if="item == 3">
            <div class="container">
              <div class="row">
                  <div style="text-align:center;">
                    <h1 style="font-size:35px">{{language.index.menu1.title3}}</h1>
                    <p>{{language.index.menu1.page3}}</p>
                  </div>
              </div>
            </div>
          </div> 
      </el-carousel-item>
    </el-carousel>
  </section>

  <!-- one section 产品介绍-->    
  <section class="wrapper100percent section" id="menu2" style="color:rgb(128,128,128)">
    <div class="sectionwrapper"></div> 
      <div class="container">
        <div class="row">
          <div class="col-md-12" style="text-align:center">
          <br> 
          <h3>{{language.index.menu2.title}}</h3>
          <br>
          <ul class="ul-list">
            <li>
                {{language.index.menu2.page}}
            </li>
          </ul>
        </div>
      </div>  
    </div> 
  </section>
  <!-- one section end -->

  <!-- one section 产品优势-->   
  <section class="wrapper100percent section1" id="menu3" style="background:#F5F5F5;">
    <div class="sectionwrapper"></div> 
    <div class="mainheadlinewrapper">
      <div class="mainheadline">
        <h2>{{language.index.menu3.title}}</h2>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="wrapper100percent" >
         <el-carousel indicator-position="outside" id="test" :interval="4000" type="card" :height="cardHeight" v-on:change="changeFun">
            <el-carousel-item v-for="item in 5" :key="item"  class="el-carousel__mini_item"  style="background:white;border: 1px solid rgba(187, 187, 187, 1); ">
                <div :class="activeIndex == 0?'test':'test-hover'" v-if="item==1">
                  <div class="col-sm-8 homeblog" style="width:90%;margin-top:10px;padding:0;left:50%;">
                    <div style="position:relative;right:50%;">
                      <figure class="view1 view-first1">
                        <img src="../assets/images/team1.jpg" alt=""> 
                      </figure> 
                      <div class="wrapper100percent">
                        <h4>{{language.index.menu3.title1}}</h4>
                        <p class="pageforPhone">{{language.index.menu3.page1}}</p>         
                      </div> 
                    </div>
                  </div>
                </div>
                <div :class="activeIndex == 1?'test':'test-hover'" v-if="item==2">
                  <div class="col-sm-8 homeblog" style="width:90%;margin-top:10px;padding:0;left:50%">
                    <div style="position:relative;right:50%">
                      <figure class="view1 view-first1">
                        <img src="../assets/images/team3.jpg" alt=""> 
                      </figure> 
                      <div class="wrapper100percent">
                        <h4>{{language.index.menu3.title2}}</h4>
                        <p class="pageforPhone">{{language.index.menu3.page2}}</p>         
                      </div> 
                    </div>
                  </div>
                </div>
                <div :class="activeIndex == 2?'test':'test-hover'" v-if="item==3">
                  <div class="col-sm-8 homeblog" style="width:90%;margin-top:10px;padding:0;left:50%">
                    <div style="position:relative;right:50%">
                      <figure class="view1 view-first1">
                        <img src="../assets/images/team2.jpg" alt=""> 
                      </figure> 
                      <div class="wrapper100percent">
                        <h4>{{language.index.menu3.title3}}</h4>
                        <p class="pageforPhone">{{language.index.menu3.page3}}</p>           
                      </div> 
                    </div>
                  </div>
                </div>
                <div :class="activeIndex == 3?'test':'test-hover'" v-if="item==4">
                  <div class="col-sm-8 homeblog" style="width:90%;margin-top:10px;padding:0;left:50%">
                    <div style="position:relative;right:50%">
                    <figure class="view1 view-first1">
                      <img src="../assets/images/team5.jpg" alt=""> 
                    </figure> 
                    <div class="wrapper100percent">
                          <h4>{{language.index.menu3.title4}}</h4>
                          <p class="pageforPhone">{{language.index.menu3.page4}}</p>          
                    </div> 
                    </div>
                  </div>
                </div>
                <div :class="activeIndex == 4?'test':'test-hover'" v-if="item==5">
                  <div class="col-sm-8 homeblog" style="width:90%;margin-top:10px;padding:0;left:50%">
                    <div style="position:relative;right:50%">
                    <figure class="view1 view-first1">
                      <img src="../assets/images/team4.jpg" alt=""> 
                    </figure> 
                    <div class="wrapper100percent">
                          <h4>{{language.index.menu3.title5}}</h4>
                          <p class="pageforPhone">{{language.index.menu3.page5}}</p>         
                    </div> 
                    </div>
                  </div>
                </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>    
    </div>
  </section>
  <!-- one section end --> 

  <!-- one section 产品特色-->   
  <section class="wrapper100percent section1"  id="menu4">
    <div class="sectionwrapper"></div> 
    <div class="mainheadlinewrapper">
      <div class="mainheadline">
        <h2>{{language.index.menu4.title}}</h2>
      </div>
    </div>
    <div class="container">
      <el-row :gutter="50" >
        <div class="wrapper100percent" >
          <el-col :span="20" :offset=2 :md="{span: 8, offset: 0}">
            <el-card class="box-card"  style="margin-bottom:10px;">
              <div class="homeblog" style="width:90%;margin-top:10px;padding:0;left:50%;">
                <div style="position:relative;right:50%;">
                  <figure class="view1 view-first1">
                    <img src="../assets/images/feature1.jpg" alt=""> 
                  </figure> 
                  <div class="wrapper100percent">
                    <p>{{language.index.menu4.page1}}</p>         
                  </div> 
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="20" :offset=2 :md="{span: 8, offset: 0}">
            <el-card class="box-card" style="margin-bottom:10px;">
              <div class="homeblog" style="width:90%;margin-top:10px;padding:0;left:50%">
                <div style="position:relative;right:50%">
                  <figure class="view1 view-first1">
                    <img src="../assets/images/feature2.jpg" alt=""> 
                  </figure> 
                  <div class="wrapper100percent">
                    <p>{{language.index.menu4.page2}}</p>         
                  </div> 
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="20" :offset=2 :md="{span: 8, offset: 0}">
            <el-card class="box-card" style="margin-bottom:10px;">
              <div class="homeblog" style="width:90%;margin-top:10px;padding:0;left:50%">
                <div style="position:relative;right:50%">
                <figure class="view1 view-first1">
                  <img src="../assets/images/feature3.jpg" alt=""> 
                </figure> 
                <div class="wrapper100percent">
                  <p>{{language.index.menu4.page3}}</p>           
                </div> 
                </div>
              </div>
            </el-card>
          </el-col>
        </div>
      </el-row>
    </div>
  </section>
  <!-- one section end --> 


  <!-- one section 联系方式-->  
  <section class="wrapper100percent section" id="menu5">
    <div class="sectionwrapper"></div> 
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <div class="address">
          <h4>{{language.index.menu5.title}}</h4>
        	<ul class="ul-list">
            <li>
              <i class="fa fa-envelope"></i> info@myinsura.io
            </li>
          </ul>
          </div>
        </div>
        </div>
    </div>
    <br> 
  </section>
  <!-- one section end -->  

</div>
</template>

<script>
import api from '../common/api'
import en_GB from '../common/language/en-GB.js';
import zh_CN from '../common/language/zh-CN.js';


export default {
  data() {
    return {
     imgHeight:'0px',
     cardHeight:'0px',
     activeIndex:0,
     activeIndexTwo:0,
     imgHeightTemp:0,
     language:api.getCookie('language') == 'en' ? en_GB : zh_CN,
    };
  },
  methods: {
      getImgUrl(item) {
          return require("../assets/images/slider"+(item+6)+".jpg");
      },

      changeFun(val, oldVal){
        this.activeIndex = val;
      },

      changeFunTwo(val, oldVal){
        this.activeIndexTwo = val;
      }
    
  },
  watch: {
     activeIndex(val, oldVal) {
  
    },

    activeIndexTwo(val, oldVal) {
  
    },
  },
  mounted() {
    let temp = api.getCookie("Code");
    if(temp == undefined) {
      api.setCookie("isLogin",false);
    }

    let imgHeightTemp = window.screen.width;
    if(imgHeightTemp >= 992) {
      this.imgHeight = 416 +"px";
      this.cardHeight = api.getCookie('language') == 'en' ? '350px' : '300px';
    } else if(imgHeightTemp >=768){
      this.cardHeight = api.getCookie('language') == 'en' ? '350px' : '300px';
    } else if(imgHeightTemp >=668){
      this.cardHeight = api.getCookie('language') == 'en' ? '350px' : '250px';
    } else {
      this.imgHeight = window.screen.width * 500 / 1190 + "px";
      this.cardHeight = api.getCookie('language') == 'en' ? '400px' : '250px';
    }
