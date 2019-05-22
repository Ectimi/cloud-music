<template>
  <div class="song-list init-pos">
    <div class="bg" :style="{backgroundImage:bgUrl}"></div>
    <TopTitle class="top" :title="'歌单'" :fn="pre"></TopTitle>
    <div class="info clearfix">
      <img :src="playList.coverImgUrl" class="fl cover">
      <div class="fl other">
        <div class="name elli">{{playList.name}}</div>
        <div class="author clearfix">
          <img class="fl avatar" :src="creator.avatarUrl" alt>
          <div class="fl author-name">
            {{creator.nickname}}
            <span class="icon-right-arrow"></span>
          </div>
        </div>
        <div class="des elli" @click="show">{{playList.description}}</div>
      </div>
    </div>
    <van-row class="btn-box">
      <van-col span="5" offset="2">
        <div class="icon-comment icon"></div>
        <div class="text">{{calNum(playList.commentCount)}}</div>
      </van-col>
      <van-col span="5">
        <div class="icon-share icon"></div>
        <div class="text">{{calNum(playList.shareCount)}}</div>
      </van-col>
      <van-col span="5">
        <div class="icon-download icon"></div>
        <div class="text">下载</div>
      </van-col>
      <van-col span="5">
        <div class="icon-multi-select icon"></div>
        <div class="text">多选</div>
      </van-col>
    </van-row>
    <List :playList='playList' :tracks='tracks'></List>
    <!-- 歌单描述 -->
    <div class="list-des" v-show="showListDes">
      <div class="bg" :style="{backgroundImage:bgUrl}"></div>
      <div class="info">
        <span class="icon-close close fr" @click="show"></span>
        <span class="clearfix"></span>
        <img class="cover" :src="playList.coverImgUrl"></img>
        <div class="title">{{playList.name}}</div>
         <div class="detail">
            <div class="tag">
              <span>标签：</span>
              <span class="tag-text" v-for="(item,index) in playList.tags" :key="index">{{item}}</span>
            </div>
            <div class="content">{{playList.description}}</div>
        </div>
      </div>
     
    </div>
  </div>
</template>

<script>
import List from '../components/List.vue'
import TopTitle from '../components/TopTitle.vue'
export default {
  name: "SongList",
  data() {
    return {
      playList: {},
      bgUrl: "",
      tracks: [],
      creator: {},
      showListDes:false
    };
  },
  components:{
    List,
    TopTitle
  },
  methods: {
    pre() {
      this.$router.go(-1);
    },
    calNum(num) {
      return num > 10000 ? Math.floor(num / 10000) + "万" : num;
    },
    show(){
      this.showListDes=!this.showListDes;
    }
  },
  created() {
    let songListDetailUrl = "api/playlist/detail?id=" + this.$route.params.id;
    this.axios.get(songListDetailUrl).then(res => {
      this.playList = res.data.playlist;
      this.tracks = res.data.playlist.tracks;
      this.bgUrl = `url('${res.data.playlist.coverImgUrl}')`;
      this.creator = res.data.playlist.creator;
      console.log(this.playList);
    });
  }
};
</script>

<style lang="scss" scoped>
.song-list {
  position: relative;
  .bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 50%;
    box-shadow: 15px 15px 50px 50px rgb(24, 23, 23) inset;
    background-size: contain;
    background-position: center center;
    z-index: 10;
    filter: blur(70px) brightness(.8);
  }
  .top {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 15;
    width: 100%;
    color: white;
    display: flex;
    padding: 20px;
    box-sizing: border-box;
    font-size: 45px;
    background-color: transparent;
  }
  .info {
    position: absolute;
    top: 100px;
    left: 0;
    width: 100%;
    z-index: 15;
    padding: 0 30px;
    box-sizing: border-box;
    color: white;
    .cover {
      display: block;
      width: 40%;
      height: 300px;
    }
    .other {
      width: 50%;
      height: 80px;
      margin-left: 30px;
    }
    .avatar {
      display: block;
      width: 80px;

      border-radius: 50%;
    }
    .name {
      max-height: 100px;
      line-height: 50px;
      font-weight: 600;
    }
    .author {
      margin-top: 20px;
    }
    .author-name {
      width: calc(100% - 90px);
      font-size: 30px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      margin-left: 10px;
      line-height: 80px;
      color: rgb(241, 238, 241);
    }
    .des {
      margin-top: 20px; 
      font-size: 30px;
      max-height: 90px;
      line-height: 50px;
      color: rgb(241, 238, 241);
    }
  }
  .btn-box {
    position: absolute;
    width: 100%;
    top: 450px;
    z-index: 15;
    div {
      color: white;
      text-align: center;
    }
    .text {
      font-size: 35px;
      margin-top: 10px;
    }
    .icon {
      font-size: 55px;
    }
  }
  .list {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 15;
    width: 100%;
    height: 60%;
    background-color: white;
    border-top-left-radius: 40px;
    border-top-right-radius: 40px;
    overflow-y: auto;
    padding-bottom: 10px;
  }
  .list-des{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
    z-index: 100;

    .bg{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        filter: blur(100px) brightness(.5);
        z-index: 1;
    }

    .info{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
    }

    .cover{
      display: block;
      width:400px;
      height: 400px;
      margin:130px auto 40px;
    }

    .title{
      text-align: center;
    }

    .detail{
      padding:20px;
      box-sizing: border-box;
      border-top: 1px solid rgb(82, 78, 72);
      margin-top: 40px;
    }

    .tag{
      margin-top: 20px;
      color:rgb(232, 232, 232);
    }
    .tag-text{
      margin:0 10px;
      padding:5px 15px;
      border-radius: 25px;
      font-size: 30px;
      background-color: rgb(84, 81, 73);
      font-weight: 500;
    }
    .content{
      height: 600px;
      margin-top: 40px;
      overflow-y: auto;
      font-size: 33px;
      line-height: 50px;
      color:rgb(232, 232, 232);
    }
    .close{
      display: inline-block;
      margin-top: 20px;
      font-size: 60px;
    }
  }
}
</style>