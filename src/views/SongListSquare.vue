<template>
    <div class="song-list-square init-pos">
        <router-view></router-view>
        <TopTitle :title="'歌单广场'" :fn="pre"></TopTitle>
        <div class="tab">
            <div class="tab-item" v-for="(item,index) in hotCategroy" :key="index" :class="selected==index?'selected':''" :data-cat="item.name" :data-index="index" @click="getShowList">{{item.name}}</div>
            <img class="more" src="../../public/images/more.png" @click="showAll">
        </div>
        <!-- <div class="listView" ref="listView">
      <div class="list" ref="list">
          <van-loading class="loading" color="white" v-if="topLoading" />
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
        <van-loading class="loading" color="white" v-if="bottomLoading" />
      </div>
    </div>-->
        <ListView :cat="currentType"></ListView>
        <transition name="showAllType">
            <div class="all-type" v-show="showAllType">
                <TopTitle :title="'所有歌单'" :fn="showAll"></TopTitle>
                <div class="cate-list" v-for="(item,index) in catlist.categories" :key="index">
                    <div class="clearfix">
                        <div class="cate-name">{{item}}</div>
                        <div class="cate-item" v-for="(val,ind) in categories[index]" :key="ind" :data-cate="val.name" @click="showDeatil">
                            <img class="hot" src="../../public/images/hot.png" alt v-show="val.hot">
                            <span class="cate-text">{{val.name}}</span>
                            <!-- <div class="hot" v-show="val.hot">hot</div> -->
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="showTypeDeatail">
            <div class="type-detail" v-show="showTypeDeatail">
                <TopTitle :title="currentType" :fn="showDeatil"></TopTitle>
                <ListView :cat="currentType"></ListView>
            </div>
        </transition>
    </div>
</template>
<script>
import BScroll from "better-scroll";
import ListView from "../components/ListView.vue";
import TopTitle from '../components/TopTitle.vue'
import { Loading } from "vant";

export default {
    name: "SongListSquare",
    data() {
        return {
            topLoading: false,
            bottomLoading: false,
            selected: 0,
            //热门分类
            hotCategroy: [],
            //推荐歌单
            recommendList: [],
            //歌单分类
            catlist: [],
            //展示在list的列表
            showList: [],
            showAllType: false,
            showTypeDeatail: false,
            //请求数据条数
            limit: 12,
            currentType: "推荐"
        };
    },
    components: {
        [Loading.name]: Loading,
        ListView,
        TopTitle
    },
    computed: {
        categories() {
            let arr = [];
            for (let key in this.catlist.categories) {
                arr[key] = new Array();
            }
            this.catlist.sub.map((value, index) => {
                arr[value.category].push(value);
            });
            return arr;
        }
    },
    methods: {
        pre() {
            this.$router.go(-1);
        },

        //切换类型
        getShowList(e) {
            let cat = e.currentTarget.dataset.cat;
            this.limit = 30;
            this.selected = e.currentTarget.dataset.index;
            this.currentType = cat;
        },
        initData() {
            //热门分类关键字
            const hotCategroytURL = "/api/playlist/hot";
            //推荐歌单
            const recommendListURL = `/api/top/playlist?limit=${
        this.limit
      }&order=hot`;
            //歌单分类
            const catlistURL = "/api/playlist/catlist";

            this.axios
                .all([
                    this.axios.get(hotCategroytURL),
                    this.axios.get(recommendListURL),
                    this.axios.get(catlistURL)
                ])
                .then(
                    this.axios.spread((hotCategroyRes, recommendListRes, catlistRes) => {
                        this.hotCategroy = [{ name: "推荐" }, ...hotCategroyRes.data.tags];
                        this.recommendList = recommendListRes.data.playlists;
                        this.catlist = catlistRes.data;
                        //默认显示推荐列表
                        this.showList = this.recommendList;
                        console.log(this.hotCategroy);
                        console.log(this.recommendList);
                        console.log(this.catlist);

                        this.topLoading = false;
                        this.bottomLoading = false;
                    })
                );
        },
        showAll() {
            this.showAllType = !this.showAllType;
        },
        showDeatil(e) {
            if (!this.showTypeDeatail) {
                this.currentType = e.currentTarget.dataset.cate;
            }
            this.showTypeDeatail = !this.showTypeDeatail;
        },
        toSongList(e) {
            this.$router.push({ path: "/songlist/" + e.currentTarget.dataset.id });
        }
    },
    created() {
        this.initData();
    }
};
</script>
<style lang="scss" scoped>
.song-list-square {
    position: relative;
    background-image: linear-gradient(to bottom,
        rgb(158, 163, 174),
        rgb(215, 214, 223),
        rgb(254, 254, 254),
        rgb(254, 254, 254));

    .top {
        position: sticky;
        left: 0;
        top: 0;
        width: 100%;
        display: flex;
        padding: 20px;
        box-sizing: border-box;
        font-size: 45px;
        background-color: transparent;

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

    .tab {
        height: 50px;
        margin-top: 20px;
        width: 80%;
        overflow-x: scroll;
        white-space: nowrap;
        padding: 10px 20px;
        z-index: 20;

        .tab-item {
            display: inline-block;
            text-align: center;
            margin-right: 20px;
            line-height: 50px;
            color: rgb(50, 50, 52);
        }

        .more {
            position: absolute;
            right: 60px;
            top: 125px;
            display: block;
            width: 30px;
            height: 30px;
        }

        .selected {
            color: rgb(254, 58, 58);
        }
    }

    ::-webkit-scrollbar {
        width: 0;
        height: 0;
        background-color: transparent;
    }

    .listView {
        height: 100%;
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
            z-index: 30;

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
            height: 30px;
            margin: 20px;
            text-align: center;
            font-size: 30px;
            background-color: rgb(247, 247, 247);
            border-radius: 30px;
            padding: 20px 0;

        }

        .cate-text {
            margin-left: 3px;
            vertical-align: middle;
        }

        .hot {
            display: inline-block;
            width: 25px;
            height: 30px;
            vertical-align: middle;
        }
    }

    .type-detail {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: white;
        z-index: 40;
    }

    .showAllType-enter-active,
    .showAllType-leave-active,
    .showTypeDeatail-enter-active,
    .showTypeDeatail-leave-active {
        transition: all 0.3s linear;
    }

    .showAllType-enter,
    .showAllType-leave-to,
    .showTypeDeatail-enter,
    .showTypeDeatail-leave-to {
        left: 100%;
    }

    .showAllType-enter-to,
    .showAllType-leave,
    .showTypeDeatail-enter-to,
    .showTypeDeatail-leave {
        left: 0;
    }
}
</style>