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
