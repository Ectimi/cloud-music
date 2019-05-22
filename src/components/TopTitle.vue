<template>
  <div class="top">
    <span class="icon-arrow-left icon" @click="fn()"></span>
    <span class="text">{{title}}</span>
    <span class="ani" :class="$store.state.isPlaying?'playing':''" @click="showPlayer">
       <span class="line line-one"></span>
      <span class="line line-one"></span>
      <span class="line line-two"></span>
      <span class="line line-three"></span>
      <span class="line line-four"></span>
    </span>
  </div>
</template>

<script>
export default {
  name: "TopTitle",
  props: ["title", "fn"],
  methods:{
    showPlayer(){
      this.$store.commit('show')
    }
  }
};
</script>

<style lang="scss" scoped>
.top {
  position: sticky;
  left: 0;
  top: 0;
  width: 100%;
  height: 85px;
  display: flex;
  padding: 20px;
  box-sizing: border-box;
  font-size: 45px;
  background-color: white;
  .icon {
    flex: 0 0 5%;
    width: 5%;
  }
  .ani {
    flex: 0 0 10%;
    width: 10%;
  }
  .text {
    flex: 1;
    text-align: center;
  }
  .line {
    display: inline-block;
    width: 1px;
    height: 50px;
    background-color: black;
    margin-right: 10px;
  }
  .line-one,
  .line-three {
    height: 30px;
  }
  .line-two,
  .line-four {
    height: 40px;
  }

}
</style>