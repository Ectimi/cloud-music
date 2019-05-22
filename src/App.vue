<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive">
        <!-- 这里是会被缓存的视图组件 -->
      </router-view>
    </keep-alive>

    <router-view v-if="!$route.meta.keepAlive">
      <!-- 这里是不被缓存的视图组件 -->
    </router-view>
    <Player></Player>
  </div>
</template>

<script>
import Player from './components/Player.vue'
export default {
  name: "app",
  components: {
    Player
  },
  created(){
    
  }
};
</script>

<style lang="scss" scoped>
#app {
  position: relative;
  width: 100%;
  height: 100%;
  font-size: 40px;
  z-index: 1;
}
</style>
