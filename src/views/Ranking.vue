<template>
  <div class="ranking init-pos">
    <TopTitle :title="'排行榜'" :fn="pre"></TopTitle>
    <div class="ranking-list">
      <div class="title">官方榜</div>
      <div class="item" v-for="(item,index) in officalList" :key="index" :data-id="item.id" @click="toSongList">
        <img class="cover" :src="item.coverImgUrl">
        <div class="info">
          <div class="item" v-for="(val,ind) in item.tracks" :key="ind">
            <span>{{ind+1+'.'}}</span>
            <span class="name">{{val.first}}</span>
            <span class="singer">- {{val.second}}</span>
          </div>
        </div>
      </div>
      <div class="title">推荐榜</div>
      <div class="list">
        <div class="list-item" v-for="(item,index) in recommendList" :key="index" :data-id="item.id" @click="toSongList">
          <img :src="item.coverImgUrl" alt class="cover">
          <div class="name elli">{{item.name}}</div>
        </div>
      </div>
       <div class="title">更多榜单</div>
      <div class="list">
        <div class="list-item" v-for="(item,index) in moreList" :key="index" :data-id="item.id" @click="toSongList">
          <img :src="item.coverImgUrl" alt class="cover">
          <div class="name elli">{{item.name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopTitle from "../components/TopTitle.vue";
export default {
  name: "Ranking",
  data() {
    return {
      list: {},
      //新声榜
      newVoiceList: [],
      //官方榜
      officalList: [],
      //推荐榜
      recommendList: [],
      //更多榜单
      moreList:[]
    };
  },
  components: {
    TopTitle
  },
  methods: {
    pre() {
      this.$router.go(-1);
    },
    toSongList(e) {
      this.$router.push({ path: "/songlist/" + e.currentTarget.dataset.id });
    },
  },
  created() {
    let rankingUrl = "/api/toplist/detail";
    this.axios.get(rankingUrl).then(res => {
      res.data.list.forEach(item => {
        if (item.name == "新声榜") {
          this.newVoiceList = item;
        } else if (item.tracks.length > 0) {
          this.officalList.push(item);
        } else if (item.name.match(/云音乐/g) && item.tracks.length == 0) {
          this.recommendList.push(item);
        }else{
            this.moreList.push(item);
        }
        if (!this.list[item.name]) {
          this.list[item.name] = [];
          this.list[item.name].push(item);
        } else {
          this.list[item.name].push(item);
        }
      });
      console.log(res.data);
    });
  }
};
</script>

<style lang="scss" scoped>
.ranking {
    overflow-y: scroll;
  .ranking-list {
    padding: 0 5%;
    box-sizing: border-box;
    
    .title {
      margin-top: 20px;
      font-weight: 600;
    }
    .item {
      margin-top: 20px;
      display: flex;
    }
    .cover {
      display: block;
      flex: 0 0 25%;
      width: 25%;
      height: 200px;
    }
    .info {
      flex: 1;
      padding-top: 15px;
      color: rgb(32, 32, 32);
      margin-left: 10px;
      font-size: 35px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .name {
      margin-left: 5px;
    }
    .list {
      display: flex;
      flex-wrap: wrap;
      justify-content:space-between;
    }
    .list-item {
      flex: 0 0 30%;
      width: 30%;
    //   margin-right: 3%;
      margin-top: 20px;
      .cover {
        display: block;
        width: 100%;
        height: 250px;
      }
      .name {
        height: 80px;
        margin-top: 10px;
        font-size: 35px;
        line-height: 40px;
      }
    }
  }
}
</style>