<template>
    <div class="search" v-show="isSearch">
        <div class="hot-box" v-show="state==0">
             <div class="title" v-if="historyArr.length>0">
                <span>搜索历史</span>
                <span class="clear-btn" @click='clearHistory'>清空记录</span>
            </div>
             
            <div class="hot-word-list">
                <div class="hot-word-item" v-for="(item,index) in historyArr" :key="index" :data-keyword="item.first" @click="search">{{item}}</div>
            </div>
            <div class="title">热门搜索</div>
            <div class="hot-word-list">
                <div class="hot-word-item" v-for="(item,index) in hotWords" :key="index" :data-keyword="item.first" @click="search">{{item.first}}</div>
            </div>
        </div>
        <div class="search-recommend" v-show="state==1">
            <div class="search-btn" :data-keyword="keyWords" @click="search">搜索“{{keyWords}}”</div>
            <div class="recommend-box">
                <div class="recommend-item" v-for="(item,index) in recommendWord" :key="index" :data-keyword="item.keyword" @click="search">
                    <span class="icon-glass"></span>
                    <span class="keyword">{{item.keyword}}</span>
                </div>
            </div>
        </div>
        <div class="result-box" v-show="state==2">
            <div class="type">
                <span class="type-item" :class="type==1?'selected':''" data-type="1" @click="selectType">单曲</span>
                <span class="type-item" :class="type==10?'selected':''" data-type="10" @click="selectType">专辑</span>
                <span class="type-item" :class="type==100?'selected':''" data-type="100" @click="selectType">歌手</span>
                <span class="type-item" :class="type==1000?'selected':''" data-type="1000" @click="selectType">歌单</span>
            </div>
            <!-- 单曲 -->
            <div class="type-one-result" v-show="type==1">
                <div class="result-item" v-for="(item,index) in singList" :key="index" :data-id="item.id" @click="play($event,item)">
                    <div class="name">{{item.name}}</div>
                    <div class="singer">{{singerContact(item.artists)}}</div>
                </div>
            </div>
            <!-- 专辑 -->
            <div class="type-two-result" v-show="type==10">
                <div class="result-item clearfix" v-for="(item,index) in albums" :key="index" :data-id="item.id" @click="toSongList">
                    <img class="cover fl" :src="item.blurPicUrl" alt>
                    <div class="info fl">
                        <div class="name">{{item.name}}</div>
                        <div class="singer">{{item.artist.name}}</div>
                    </div>
                </div>
            </div>
            <!-- 歌手 -->
            <div class="type-three-result" v-show="type==100">
                <div class="result-item clearfix" v-for="(item,index) in artists" :key="index">
                    <img class="cover fl" :src="item.picUrl" alt>
                    <div class="info fl">
                        <div class="singer">{{item.name}}</div>
                    </div>
                </div>
            </div>
            <!-- 歌单 -->
            <div class="type-four-result" v-show="type==1000">
                <div class="result-item clearfix" v-for="(item,index) in playlists" :key="index" :data-id="item.id" @click="toSongList">
                    <img class="cover fl" :src="item.coverImgUrl" alt>
                    <div class="info fl">
                        <div class="name">{{item.name}}</div>
                        <div class="other">
                            <span class="count">{{item.trackCount}}首音乐 </span>
                            <span class="create">by {{item.creator.nickname}} </span>
                            <span class="play-num">播放{{calNum(item.playCount)}}次</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import utils from "../utils/utils.js";
import { Tab, Tabs } from "vant";
export default {
    name: "Search",
    props: ["keyWords", "isInput", "isSearch"],
    data() {
        return {
            //热门搜索
            hotWords: [],
            historyArr:[],
            //搜索建议
            recommendWord: [],
            result: null,
            isEnter: false,
            active: 0,
            // 0:搜索框为空 1：搜索框不为空  2：点击搜索
            state: 0,
            //  1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单
            type: 1,
            //搜索结果
            singList: [], //单曲
            albums: [], //专辑
            artists: [], //歌手
            playlists: [] //歌单
        };
    },
    components: {
        [Tab.name]: Tab,
        [Tabs.name]: Tabs
    },
    watch: {
        keyWords(newVal, oldVal) {
            if (newVal && !utils.verifyEmpty(newVal)) {
                this.state = 1;
                this.singList = [];
                this.albums = [];
                this.artists = [];
                this.playlists = [];

                let searchRecommendUrl = `/api/search/suggest?keywords= ${
          this.keyWords
        }&type=mobile`;

                this.axios.get(searchRecommendUrl).then(res => {
                    this.recommendWord = res.data.result.allMatch;
                    console.log(res.data);
                });
            } else if (utils.verifyEmpty(newVal)) {
                this.state = 0;
                this.recommendWord = [];
            }
        }
    },
    methods: {
        search(e) {
            let keyword=e.currentTarget.dataset.keyword;
            this.isEnter = true;
            this.recommendWord = [];
            this.loadData(this.type, keyword);
            this.$emit("changeKeyWords", keyword);
            if(localStorage.getItem('searchHistory')){
                let historyArr=JSON.parse(localStorage.getItem('searchHistory'));
                if(historyArr.indexOf(keyword)<0){
                    historyArr.push(keyword)
                    localStorage.setItem('searchHistory', JSON.stringify(historyArr));
                    this.historyArr=historyArr;
                }
            }else{
                let arr=[];
                arr.push(keyword);
                localStorage.setItem('searchHistory', JSON.stringify(arr));
                this.historyArr=arr;
            }
        },
        clearHistory(){
            this.historyArr=[];
            localStorage.removeItem('searchHistory');
        },
        loadData(type, keyword) {
            let searchUrl = `/api/search?type=${type}&keywords= ${keyword}`;
            this.axios.get(searchUrl).then(res => {
                this.state = 2;
                if (this.type == 1) {
                    this.singList = res.data.result.songs;
                } else if (this.type == 10) {
                    this.albums = res.data.result.albums;
                } else if (this.type == 100) {
                    this.artists = res.data.result.artists;
                } else if (this.type == 1000) {
                    this.playlists = res.data.result.playlists;
                }
                console.log(res.data);
            });
        },
        singerContact(arr) {
            let str = "";
            arr.map((item, index) => {
                if (index < arr.length - 1) {
                    str += item.name + "/";
                } else {
                    str += item.name;
                }
            });
            return str;
        },
        selectType(e) {
            let type = e.currentTarget.dataset.type;
            if (type == 1) {
                this.type = 1;
                if (this.singList.length == 0) {
                    this.loadData(this.type, this.keyWords);
                }
            } else if (type == 10) {
                this.type = 10;
                if (this.albums.length == 0) {
                    this.loadData(this.type, this.keyWords);
                }
            } else if (type == 100) {
                this.type = 100;
                if (this.artists.length == 0) {
                    this.loadData(this.type, this.keyWords);
                }
            } else if (type == 1000) {
                this.type = 1000;
                if (this.playlists.length == 0) {
                    this.loadData(this.type, this.keyWords);
                }
            }
        },
        play(e, item) {
            this.$store.commit("show");
            this.$store.state.currentPlayList.splice(this.$store.state.index + 1, 0, item);
            this.$store.state.index = this.$store.state.index +1;
            this.$set(
                this.$store.state.currentMusic,
                "id",
                e.currentTarget.dataset.id
            );
            this.$store.dispatch("getSingData", this);
            this.$store.state.isPlaying = true;
        },
        calNum(num) {
            return num > 10000 ? Math.floor(num / 10000) + "万" : num;
        },
        toSongList(e) {
            this.$router.push({ path: "/songlist/" + e.currentTarget.dataset.id });
        }
    },
    created() {
        // localStorage.removeItem('searchHistory')
        const hotWordUrl = "/api/search/hot";
        this.axios.get(hotWordUrl).then(res => {
            this.hotWords = res.data.result.hots;
        });

        let url = '/api/album?id=10473';
        this.axios.get(url).then(res => {
            console.log(res.data)
        })

        if(localStorage.getItem('searchHistory')){
            this.historyArr=JSON.parse(localStorage.getItem('searchHistory'))
        }
    }
};
</script>
<style lang="scss" scoped>
.search {
    width: 100%;
    height: calc(100% - 200px);
    background-color: white;
    overflow-y: auto;

    .hot-box {
        padding: 20px;

        .title {
            font-size: 35px;
        }

        .clear-btn{
            font-size: 25px;
            color: grey;
            margin-left: 70%;
        }

        .hot-word-item {
            margin: 20px;
            display: inline-block;
            padding: 20px;
            border-radius: 35px;
            font-size: 30px;
            background-color: rgb(250, 248, 243);
        }
    }

    .search-recommend {
        padding-left: 40px;

        .search-btn {
            height: 50px;
            line-height: 50px;
            border-bottom: 1px solid rgb(240, 236, 236);
            padding-bottom: 10px;
            font-size: 35px;
            color: rgb(4, 50, 100);
        }
    }

    .recommend-box {
        font-size: 35px;

        .recommend-item {
            width: 100%;
            padding-bottom: 20px;
        }

        span {
            display: inline-block;
            height: 80px;
            line-height: 90px;
        }

        .icon {
            display: inline-block;
        }

        .keyword {
            display: inline-block;
            width: 93%;
            margin-left: 20px;
            border-bottom: 1px solid rgb(240, 236, 236);
        }
    }

    .result-box {

        //  padding-top: 20px;
        .title {
            font-size: 35px;
        }

        .type {
            position: fixed;
            width: 100%;
            padding-bottom: 10px;
            display: flex;
            justify-content: space-between;
            background-color: white;
            z-index: 60;
        }

        .type-item {
            flex: 1;
            text-align: center;
        }

        .selected {
            color: rgb(255, 68, 68);
        }
    }

    .type-one-result {
        padding-top: 50px;

        .name,
        .singer {
            width: 90%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }

        .name {
            font-size: 35px;
        }

        .singer {
            margin-top: 10px;
            font-size: 30px;
        }

        .result-item {
            border-bottom: 1px solid rgb(250, 248, 243);
            padding: 20px;
        }
    }

    .type-two-result {
        padding: 50px 0 20px 20px;

        .result-item {
            margin-top: 20px;
        }

        .cover {
            display: block;
            width: 15%;
            height: 120px;
        }

        .info {
            width: 80%;
            margin-left: 20px;
            line-height: 40px;
        }

        .name,
        .singer {
            width: 100%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }

        .name {
            font-size: 35px;
        }

        .singer {
            margin-top: 20px;
            font-size: 30px;
            color: rgb(133, 133, 126);
        }
    }

    .type-three-result {
        padding: 50px 0 20px 20px;

        .result-item {
            margin-top: 20px;
        }

        .cover {
            display: block;
            width: 130px;
            height: 130px;
            border-radius: 50%;
        }

        .info {
            height: 130px;
            line-height: 130px;
            margin-left: 20px;
        }
    }

    .type-four-result {
        padding: 50px 0 20px 20px;

        .result-item {
            margin-top: 20px;
        }

        .cover {
            display: block;
            width: 15%;
            height: 110px;
        }

        .info {
            width: 80%;
            height: 110px;
            line-height: 45px;
            margin-left: 20px;
        }

        .other {
            margin-top: 20px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            font-size: 30px;
            color: rgb(133, 133, 126);
        }

        .name {
            font-size: 35px;
            color: rgb(9, 50, 95);
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }

    }
}
</style>