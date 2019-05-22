<template>
  <div class="index">
    <router-view></router-view>
    <div class="bottom-tab">
      <van-row>
        <van-col span="12">
          <router-link tag="div" to="/discover/" class="item">
            <div class="icon-music-1 icon"></div>
            <div class="text">发现</div>
          </router-link>
        </van-col>
        <van-col span="12">
          <router-link tag="div" to="/mine" class="item">
            <div class="icon-music icon"></div>
            <div class="text">我的</div>
          </router-link>
        </van-col>
        <!-- <van-col span="8">
          <router-link tag="div" to="account" class="item">
            <div class="icon-account icon"></div>
            <div class="text">账号</div>
          </router-link>
        </van-col> -->
      </van-row>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.index {
  width: 100%;
  height: 100%;
  background-color: white;

  .bottom-tab {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100px;
    text-align: center;
    padding-top: 10px;
    background-color: white;
    z-index: 10;
    .text {
      margin-top: 10px;
      font-size: 30px;
    }
    .exact-active {
      color: red;
    }
  }
}
</style>