<template>
  <div class="discover">
    <div class="top">
      <van-row>
        <van-col span="1" offset="1">
          <span class="icon-microphone icon"></span>
        </van-col>
        <van-col span="16" offset="2">
          <div class="input-box">
            <span class="icon-glass icon"></span>
            <input type="text" v-model="keyWords" @focus="changeSearchState">
            <span class="icon-close close" v-show="isSearch" @click="changeSearchState"></span>
          </div>
        </van-col>
        <van-col span="2" offset="2">
          <span class="ani" :class="$store.state.isPlaying?'playing':''" @click="showPlayer">
            <span class="line line-one"></span>
            <span class="line line-two"></span>
            <span class="line line-three"></span>
            <span class="line line-four"></span>
          </span>
        </van-col>
      </van-row>
    </div>
    <Search class="search" :keyWords="keyWords" :isSearch="isSearch" @changeKeyWords="changeKeyWords"></Search>

    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="banner">
        <van-swipe :autoplay="5000" indicator-color="red">
          <van-swipe-item v-for="(item,index) in bannerData" :key="index">
            <div class="banner-img" :style="{backgroundImage:'url('+item.imageUrl+')'}"></div>
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="listen">
        <van-row>
          <van-col span="6" class="item" @click.native="show">
            <span class="icon-uniE920 red-bg"></span>
            <span class="day">{{day}}</span>
            <div class="text">每日推荐</div>
          </van-col>
          <van-col span="6" class="item" @click.native="toSuqare">
            <span class="icon-Music-Playlist red-bg"></span>
            <div class="text">歌单</div>
          </van-col>
          <van-col span="6" class="item" @click.native="toRanking">
            <span class="icon-ranking-list red-bg"></span>
            <div class="text">排行榜</div>
          </van-col>
          <van-col span="6" class="item" @click.native="toRadio">
            <span class="icon-microphone red-bg"></span>
            <div class="text">电台</div>
          </van-col>
        </van-row>
      </div>
      <van-loading class="loading" color="black" v-if="songList.length==0"/>
      <div class="song-list" v-else>
        <div class="clearfix">
          <div class="title1 fl">推荐歌单</div>
          <div class="title2 fr" @click="toSuqare">歌单广场</div>
        </div>
        <van-row class="list" type="flex" justify="center">
          <van-col
            class="item"
            v-for="(item,index) in showSongList"
            :key="index"
            :data-id="item.id"
            @click.native="toSongList"
          >
            <img :src="item.picUrl" class="cover">
            <div class="name elli">{{item.name}}</div>
          </van-col>
        </van-row>
      </div>
    </van-pull-refresh>
    <transition name="showRecommend">
      <Recommend
        class="recommend"
        v-show="showRecommend"
        :showRecommend="showRecommend"
        @show="show"
      ></Recommend>
    </transition>
  </div>
</template>

<script>
import { Swipe, SwipeItem, PullRefresh, Loading } from "vant";
import Recommend from "../components/Recommend.vue";
import utils from "../utils/utils.js";
import Search from "../components/Search.vue"
export default {
  name: "Discover",
  data() {
    return {
      bannerData: [],
      songList: [],
      isLoading: false,
      showRecommend: false,
      keyWords:'',
      isSearch:false,
    };
  },
  computed: {
    day() {
      return new Date().getDate();
    },
    //首页随机展示的6个推荐歌单
    showSongList() {
      let showList = [];
      let max = this.songList.length;
      utils.getNumNoRepeat(max, 6).forEach(item => {
        showList.push(this.songList[item]);
      });
      return showList;
    }
  },
  methods: {
    loadData() {
      let bannerUrl = "/api/banner";
      let songListUrl = "/api/recommend/resource";
      this.axios
        .all([this.axios.get(bannerUrl), this.axios.get(songListUrl)])
        .then(
          this.axios.spread((bannerRes, songListRes) => {
            this.bannerData = bannerRes.data.banners;
            this.songList = songListRes.data.recommend;
            this.isLoading = false;
            console.log(this.bannerData)
          })
        );
    },
    changeKeyWords(keywords){
      this.keyWords=keywords
    },
    changeSearchState(e){
      if(e.currentTarget.classList.contains('close')){
        this.isSearch=false;
        this.keyWords=''
        return;
      }
      this.isSearch=true;
    },
    showPlayer(){
      this.$store.commit('show')
    },
    onRefresh() {
      this.loadData();
    },
    show() {
      this.showRecommend = !this.showRecommend;
    },
    //路由相关
    toSongList(e) {
      this.$router.push({ path: "/songlist/" + e.currentTarget.dataset.id });
    },
    toSuqare() {
      this.$router.push({ path: "/songlistsquare" });
    },
    toRanking(){
      this.$router.push({path:'/ranking'});
    },
    toRadio(){
      this.$router.push({path:'/radio'});
    }
  },
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [PullRefresh.name]: PullRefresh,
    [Loading.name]: Loading,
    Recommend,
    Search
  },
  created() {
    this.loadData();
    this.$store.dispatch('getUserList',this)
  }
};
</script>

<style lang="scss" scoped>
.discover {
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  
  .search{
    position: absolute;
    left:0;
    top:100px;
    z-index: 20;
  }
  .loading {
    top: 500px;
  }

  .top {
    width: 100%;
    height: 80px;
    line-height: 80px;
    padding: 20px;
    box-sizing: border-box;
    .icon {
      font-size: 50px;
    }
    .input-box {
      position: relative;
      height: 60px;
      background-color: rgb(247, 247, 247);
      border-radius: 30px;
      font-size: 30px;
      line-height: 60px;

      .close{
        position: absolute;
        right:20px;
        top:15px;
        z-index: 50;
      }
      .icon {
        position: absolute;
        left: 10px;
        top: 50%;
        font-size: 30px;
        transform: translateY(-50%);
        z-index: 2;
      }
      input {
        position: absolute;
        left: 0;
        top: 0;
        border-radius: 30px;
        background-color: transparent;
        display: block;
        width: 100%;
        outline: none;
        border: 0;
        padding-left: 70px;
        z-index: 1;
      }
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
  .van-pull-refresh {
    width: 100%;
  }
  .banner {
    padding: 10px 20px;
    box-sizing: border-box;

    div {
      border-radius: 30px;
    }
    .banner-img {
      width: 100%;
      height: 300px;
      background-size: cover;
      background-repeat: no-repeat;
    }
  }
  .listen {
    padding: 20px;
    box-sizing: border-box;
    .item {
      position: relative;
      text-align: center;
    }
    .red-bg {
      margin: 0 auto;
      padding-top: 20px;
      box-sizing: border-box;
      display: block;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background-color: rgb(254, 36, 31);
      color: white;
      font-size: 60px;
    }
    .day {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -120%);
      font-size: 20px;
      color: white;
    }
    .text {
      font-size: 30px;
      color: rgb(103, 103, 103);
      margin-top: 20px;
    }
  }
  .song-list {
    padding: 20px;
    box-sizing: border-box;
    margin-top: 20px;
    border-top: 1px solid rgb(232, 232, 232);
    padding-bottom: 150px;
    // overflow: hidden;

    .title1 {
      margin-top: 10px;
      font-weight: 600;
      color: rgb(49, 49, 50);
    }
    .title2 {
      padding: 15px;
      border-radius: 30px;
      border: 1px solid rgb(229, 229, 229);
      color: rgb(65, 65, 66);
      font-size: 30px;
    }

    .cover {
      display: block;
      width: 100%;
      height: auto;
    }
    .list {
      flex-wrap: wrap;
      margin-top: 10px;
    }
    .item {
      flex: 0 0 30%;
      margin-top: 10px;
      margin-right: 20px;
    }
    .name {
      width: 100%;
      height: 80px;
      line-height: 40px;
      color: rgb(54, 54, 56);
      font-size: 35px;
    }
  }
  .recommend {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: white;
    z-index: 5;
    overflow-y: auto;
    // padding-top: 60px;
  }

  .showRecommend-enter-active,
  .showRecommend-leave-active {
    transition: all 0.3s linear;
  }

  .showRecommend-enter,
  .showRecommend-leave-to {
    left: 100%;
  }

  .showRecommend-enter-to,
  .showRecommend-leave {
    left: 0;
  }
}
</style>