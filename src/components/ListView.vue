<template>
  <div class="listView" ref="listView">
    <div class="list" ref="list">
      <van-loading class="loading" color="white" v-if="topLoading"/>
      <div
        class="list-item"
        v-for="(item,index) in showList"
        :key="index"
        :data-id="item.id"
        @click="toSongList"
      >
        <img class="cover" :src="item.coverImgUrl" alt>
        <div class="name elli">{{item.name}}</div>
      </div>
      <van-loading class="loading" color="white" v-if="bottomLoading"/>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import { Loading } from "vant";
export default {
  name: "ListView",
  props: ["url", "cat"],
  data() {
    return {
      showList: "",
      topLoading: false,
      bottomLoading: false,
      limit: 15
    };
  },
  components: {
    [Loading.name]: Loading
  },
  watch: {
    cat(newVal, oldVal) {
      if (newVal !== oldVal) {
        console.log(1);
        this.loadData(newVal);
      }
    }
  },
  methods: {
    initScroll() {
      if (!this.listScroll) {
        this.listScroll = new BScroll(this.$refs.listView, {
          click: true
        });
        this.listScroll.on("touchEnd", pos => {
          let viewHeight = parseInt(
            getComputedStyle(this.$refs.listView).height
          );
          let listHeight = parseInt(getComputedStyle(this.$refs.list).height);
          let scrollY = pos.y;
          //上滑加载
          if (pos.y < viewHeight - listHeight) {
            this.bottomLoading = true;
            this.limit += this.limit;
            this.loadData(this.cat);
            window.scrollTo(0, scrollY);
          }
          //下滑刷新
          else if (pos.y > 30) {
            this.topLoading = true;
            this.limit = 12;
            if (this.cat == "推荐") {
              this.initData();
            } else {
              this.loadData(this.cat);
            }
          }
        });
      } else {
        this.listScroll.refresh();
      }
    },
    initData() {
      const recommendListURL = `/api/top/playlist?limit=${
        this.limit
      }&order=hot`;
      this.axios.get(recommendListURL).then(res => {
        this.showList = res.data.playlists;
        this.topLoading=false;
      });
    },
    loadData(cat) {
      if (cat == "推荐") {
        this.axios
          .get(`/api/top/playlist?limit=${this.limit}&order=hot`)
          .then(res => {
            this.showList = res.data.playlists;
            this.bottomLoading = false;
            this.topLoading = false;
          });
      } else {
        const typeUrl =
          `/api/top/playlist?limit=${this.limit}&order=hot&cat=` + cat;
        this.axios.get(typeUrl).then(res => {
          this.showList = res.data.playlists;
          this.bottomLoading = false;
          this.topLoading = false;
        });
      }
    },
    toSongList(e) {
      this.$router.push({ path: "/songlist/" + e.currentTarget.dataset.id });
    }
  },
  created() {
    this.initData();
    this.$nextTick(() => {
      this.initScroll();
    });
  },
  updated() {
    this.$nextTick(() => {
      this.listScroll.refresh();
    });
  },
};
</script>

<style lang="scss" scoped>
.listView {
  height: 85%;
  overflow: hidden;
}
.list {
  display: flex;
  flex-wrap: wrap;
  padding: 0 20px;
  box-sizing: border-box;
  margin-top: 20px;
  .loading {
    width: 100%;
    height: 50px;
  }
  .list-item {
    flex: 0 0 30%;
    width: 30%;
    margin: 12px;
    margin-top: 10px;
  }
  .cover {
    display: block;
    border-radius: 20px;
    width: 100%;
    height: 230px;
  }
  .name {
    width: 100%;
    height: 80px;
    margin-top: 15px;
    line-height: 40px;
    font-size: 35px;
    color: rgb(65, 65, 66);
  }
}
.all-type {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  overflow-y: auto;

  .top {
    position: sticky;
    left: 0;
    top: 0;
    width: 100%;
    display: flex;
    padding: 20px;
    box-sizing: border-box;
    font-size: 45px;
    background-color: white;
    z-index: 100;
    .icon {
      flex: 0 0 5%;
      width: 5%;
    }
    .text {
      flex: 1;
      color: rgb(37, 38, 41);
      text-align: center;
    }
  }
  .cate-list {
    margin-top: 50px;
    padding: 0 20px;
  }
  .cate-name {
    padding-left: 10px;
    font-size: 35px;
    font-weight: 600;
  }
  .cate-item {
    position: relative;
    float: left;
    width: 20%;
    margin: 20px;
    text-align: center;
    font-size: 30px;
    background-color: rgb(247, 247, 247);
    border-radius: 30px;
    padding: 20px 0;
  }
  .hot {
    position: absolute;
    left: 10px;
    top: 15px;
    display: block;
    width: 30px;
  }
}

.showAllType-enter-active,
.showAllType-leave-active {
  transition: all 0.3s linear;
}
.showAllType-enter,
.showAllType-leave-to {
  left: 100%;
}

.showAllType-enter-to,
.showAllType-leave {
  left: 0;
}
</style>