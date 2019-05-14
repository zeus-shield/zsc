<template>
	<div id="app">
		<!-- <transition name="fade"
		            mode="out-in">
			<router-view></router-view>
		</transition> -->
		<head-main v-if="isRouterAlive"></head-main>
	  <router-view v-if="isRouterAlive"></router-view>
    <footer-main></footer-main>

		<div v-if="isInput">
			<inputs></inputs>
		</div>
    <div v-if="isTransfer">
			<integral-transfer></integral-transfer>
		</div>
    <div v-if="isTrace">
			<integral-trace></integral-trace>
		</div>
	</div>
</template>

<script>
//引入全局登录窗口
import inputs from './components/input';
import integralTransfer from './components/integralTransfer';
import integralTrace from './components/integralTrace';


import HeadMain from './components/header';
import FooterMain from './components/footer';

export default {
  name: 'app',
  metaInfo: {
   
		title: 'myinsura',   
		titleTemplate: '%s | Ethereum blockchain based platform for insuraing',
		meta: [{
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0',
      charset: 'utf-8'
    }]
		
  },
