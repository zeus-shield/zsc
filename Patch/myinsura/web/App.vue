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
