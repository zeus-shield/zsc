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
