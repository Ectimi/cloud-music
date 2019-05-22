<template>
  <div class="mine">
    <div class="top">
      <span class="icon-cloud icon"></span>
      <span class="title">我的音乐</span>
      <!-- <span class="icon-playing icon"></span> -->
      <span class="ani" :class="$store.state.isPlaying?'playing':''" @click="showPlayer">
        <span class="line line-one"></span>
        <span class="line line-two"></span>
        <span class="line line-three"></span>
        <span class="line line-four"></span>
      </span>
    </div>
    <div class="list-one">
      <van-row>
        <div class="clearfix list-item">
          <van-col class="icon" span="4">
            <span class="icon-music"></span>
          </van-col>
          <van-col class="item-name clearfix" span="20">
            <span class="fl">本地音乐</span>
            <span class="fr arrow icon-right-arrow"></span>
          </van-col>
        </div>
        <div class="clearfix list-item">
          <van-col class="icon" span="4">
            <span class="icon-recent-play"></span>
          </van-col>
          <van-col class="item-name clearfix" span="20">
            <span class="fl">最近播放</span>
            <span class="fr arrow icon-right-arrow"></span>
          </van-col>
        </div>
        <div class="clearfix list-item">
          <van-col class="icon" span="4">
            <span class="icon-myFm"></span>
          </van-col>
          <van-col class="item-name clearfix" span="20">
            <span class="fl">我的电台</span>
            <span class="fr arrow icon-right-arrow"></span>
          </van-col>
        </div>
        <div class="clearfix list-item">
          <van-col class="icon" span="4">
            <span class="icon-account"></span>
          </van-col>
          <van-col class="item-name clearfix" span="20">
            <span class="fl">我的收藏</span>
            <span class="fr arrow icon-right-arrow"></span>
          </van-col>
        </div>
      </van-row>
    </div>
    <div class="divide"></div>
    <div class="list-two">
      <div class="list-head clearfix">
        <span
          class="fl icon-right-arrow arrow"
          :class="showCreatedList?'show':''"
          @click="showCreated"
        ></span>
        <span class="fl text">我创建的歌单</span>
        <span class="num">({{createdList.length}})</span>
        <span class="fr icon-elli"></span>
      </div>
      <div class="list" v-show="showCreatedList">
        <div
          class="list-item"
          v-for="(item,index) in createdList"
          :key="index"
          :data-id="item.id"
          @click="toSongList"
        >
          <img :src="item.coverImgUrl" class="cover">
          <div class="info">
            <div class="name">{{item.name}}</div>
            <div class="num">{{item.trackCount}}首</div>
          </div>
        </div>
      </div>
    </div>
    <div class="divide"></div>
    <div class="list-three">
      <div class="list-head clearfix">
        <span
          class="fl icon-right-arrow arrow"
          :class="showCollectedList?'show':''"
          @click="showCollected"
        ></span>
        <span class="fl text">我收藏的歌单</span>
        <span class="num">({{collectedList.length}})</span>
        <span class="fr icon-elli"></span>
      </div>
      <div class="list" v-show="showCollectedList">
        <div
          class="list-item"
          v-for="(item,index) in collectedList"
          :key="index"
          :data-id="item.id"
          @click="toSongList"
        >
          <img :src="item.coverImgUrl" class="cover">
          <div class="info">
            <div class="name">{{item.name}}</div>
            <div class="num">{{item.trackCount}}首</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
export default {
  name: "Mine",
  data() {
    return {
      showCreatedList: true,
      showCollectedList: true
    };
  },
  methods: {
    showCreated() {
      this.showCreatedList = !this.showCreatedList;
    },
    showCollected() {
      this.showCollectedList = !this.showCollectedList;
    },
    toSongList(e) {
      this.$router.push({ path: "/songlist/" + e.currentTarget.dataset.id });
    },
     showPlayer(){
      this.$store.commit('show')
    }
  },
  computed:{
    ...mapState(['currentUser']),
    createdList(){
      return this.currentUser.createdList;
    },
    collectedList(){
      return this.currentUser.collectedList;
    }
  },
};
</script>

<style lang="scss" scoped>
.mine {
  width: 100%;
  height: 100%;
  background-color: white;
  padding-top: 20px;
  overflow-y: auto;

  .top {
    display: flex;
    font-size: 45px;
    height: 60px;

    .icon {
      flex: 0 0 10%;
      text-align: center;
    }
    .title {
      text-align: center;
      flex: 1;
      color: rgb(49, 49, 50);
      font-weight: 500;
    }
    .ani{
      flex:0 0 9%;
    }
  }
  .line {
    display: inline-block;
    width: 0;
    border: 1px solid black;
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
  .list-one {
    margin-top: 15px;
    .list-item {
      height: 100px;
      line-height: 100px;
      color: rgb(89, 89, 90);
    }
    .arrow {
      margin-top: 30px;
      margin-right: 30px;
      font-size: 30px;
    }
    .icon {
      text-align: center;
      font-size: 50px;
    }
    .item-name {
      border-bottom: 1px solid rgb(245, 245, 245);
    }
    .list-item:last-child .item-name {
      border: 0;
    }
  }
  .list-two,
  .list-three {
    .show {
      transform: rotateZ(90deg);
      margin-top: -10px;
    }
    padding: 20px;
    box-sizing: border-box;
    .list {
      margin-top: 10px;
    }
    .list-head {
      .text {
        margin-left: 10px;
      }
      .num {
        color: rgb(129, 129, 130);
        font-size: 30px;
        margin-left: 10px;
      }
    }

    .list-item {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      margin-top: 20px;
    }
    .cover {
      display: block;
      flex: 0 0 15%;
      width: 10%;
      height: 120px;
    }

    .info {
      flex: 1;
      width: 80%;
      margin-left: 20px;
    }
    .name {
      margin-top: 10px;
      width: 100%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .num {
      margin-top: 20px;
      font-size: 30px;
      color: rgb(129, 129, 130);
    }
  }
  .list-three{
    padding-bottom: 150px;
  }
}
</style>