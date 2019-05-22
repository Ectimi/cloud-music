<template>
  <div class="recommend">
    <!-- <div class="top">
      <span class="icon-arrow-left icon" @click="show"></span>
      <span class="text">每日推荐</span>
      <span class="icon-playing icon"></span>
    </div> -->
    <TopTitle :title="'每日推荐'" :fn="show"></TopTitle>
    <div class="list">
      <div class="list-head">
        <span class="icon-play icon"></span>
        <span class="play-btn">播放全部</span>
      </div>
      <div class="list-item" v-for="(item,index) in recommendList" :key="index" :data-id="item.id" :data-index="index" @click="play">
        <img class="cover" :src="item.album.picUrl" alt>
        <div class="sing">
          <div class="name">{{item.name}}</div>
          <div class="singer">{{singerContact(item.artists)}} - {{item.album.name}}</div>
        </div>
        <div class="icon-elli more"></div>
      </div>
    </div>
  </div>
</template>

<script>
import TopTitle from './TopTitle.vue'
export default {
  name: "Recommend",
  data() {
    return {
      recommendList: []
    };
  },
  components:{
    TopTitle
  },
  methods: {
    singerContact(arr) {
      let len = arr.length;
      let str = "";
      for (let i = 0; i < len; i++) {
        if (i != len - 1) {
          str += arr[i].name + " /";
        } else {
          str += arr[i].name;
        }
      }
      return str;
    },
    show() {
      this.$emit("show");
    },
     play(e) {
      this.$store.commit("show");
      this.$store.state.index = e.currentTarget.dataset.index;
      this.$set(
        this.$store.state.currentMusic,
        "id",
        e.currentTarget.dataset.id
      );
      this.$store.state.currentPlayList = this.recommendList;
      this.$store.dispatch("getSingData", this);
      this.$store.state.isPlaying = true;
    },
  },
  created() {
    let recommendUrl = "/api/recommend/songs";
    this.axios.get(recommendUrl).then(res => {
      this.recommendList = res.data.recommend;
      console.log(this.recommendList);
    });
  }
};
</script>

<style lang="scss" scoped>
.recommend {
  .list {
    padding-bottom: 150px;
    .list-head {
      height: 100px;
      line-height: 100px;

      .icon {
        margin-left: 20px;
        font-size: 60px;
        vertical-align: middle;
      }

      .play-btn {
        font-weight: 600;
        margin-left: 15px;
        vertical-align: middle;
      }
    }

    .list-item {
      display: flex;
      margin-top: 10px;
      .cover {
        display: block;
        flex: 0 0 10%;
        width: 15%;
        height: 130px;
        margin-left: 20px;
      }
      .sing {
        flex: 0 0 70%;
        width: 70%;
        margin-left: 20px;
      }
      .name {
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .singer {
        margin-top: 20px;
        font-size: 30px;
        color: rgb(165, 165, 165);
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .more {
        flex: 0 0 10%;
        width: 10%;
        margin-left: 20px;
      }
    }
  }
}
</style>