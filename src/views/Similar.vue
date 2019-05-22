<template>
    <div class="similar init-pos">
        <!-- <div class="top">
            <span class="icon-arrow-left icon" @click="pre"></span>相似推荐
        </div> -->
        <TopTitle :title="'相似推荐'" :fn="pre"></TopTitle>
        <div class="play-list">
            <div class="title">包含这首歌的歌单</div>
            <div class="list-box">
                <div class="list-item" v-for="(item,index) in list" :key="index" :data-id="item.id" @click="toSongList">
                    <img class="cover" :src="item.coverImgUrl"></img>
                    <div class="name elli-one">{{item.name}}</div>
                    <div class="author elli-one">
                        <span class="icon-account icon"></span>
                        <span class="nick-name">{{item.creator.nickname}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="divide"></div>
        <div class="song-list">
            <div class="title">喜欢这首歌的人也听</div>
            <div class="song-box">
                <div class="song-item" v-for="(item,index) in songs" :key="index" :data-id="item.id" @click="play($event,item)">
                    <div class="name">{{item.name}}</div>
                    <div class="singer">{{singerContact(item.artists)}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import TopTitle from '../components/TopTitle.vue'
export default {
    name: 'Similar',
    components: {
        TopTitle
    },
    data() {
        return {
            list: [],
            songs: []
        }
    },
    methods: {
        pre() {
            this.$router.go(-1);
        },
        //拼接歌手
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
        toSongList(e) {
            this.$router.push({ path: "/songlist/" + e.currentTarget.dataset.id });
        },
        play(e, item) {
            this.$store.commit("show");
            this.$store.state.currentPlayList.splice(this.$store.state.index + 1, 0, item);
            this.$store.state.index = this.$store.state.index + 1;
            this.$set(
                this.$store.state.currentMusic,
                "id",
                e.currentTarget.dataset.id
            );
            this.$store.dispatch("getSingData", this);
            this.$store.state.isPlaying = true;
        },
    },
    created() {
        let id = this.$store.state.currentMusic.id;
        //相似歌单
        let similarListUrl = '/api/simi/playlist?id=' + id;
        //相似音乐
        let similarSongUrl = '/api/simi/song?id=' + id;

        this.axios.all([this.axios.get(similarListUrl), this.axios.get(similarSongUrl)]).then(this.axios.spread((listRes, songRes) => {
            this.list = listRes.data.playlists;
            this.songs = songRes.data.songs;
            console.log(listRes.data)
            console.log(songRes.data)
        }))
    }
}
</script>
<style lang="scss" scoped>
.similar {
    background-color: #fff;

    .title {
        margin: 20px;
        font-size: 35px;
        color: rgb(49, 49, 50);
        font-weight: 600;
    }

    .play-list {
        padding: 0 20px;
        box-sizing: border-box;

        .list-box {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
        }

        .list-item {
            flex: 0 0 30%;
            width: 30%;
            margin: 10px;
        }

        .cover {
            display: block;
            width: 100%;
            height: auto;
        }

        .elli-one {
            width: 100%;
        }

        .name {
            margin-top: 20px;
            font-size: 35px;
            color: rgb(52, 52, 53);
        }

        .nick-name,
        .icon {
            margin-top: 15px;
            font-size: 30px;
            color: rgb(155, 155, 155);
        }

        .nick-name {
            margin-left: 10px;
        }
    }

    .divide {
        height: 20px;
        background-color: rgb(247, 247, 247);
    }

    .song-box {
        width: calc(100% - 40px);
        margin: 20px auto;
        border-top: 1px solid rgb(212, 212, 212);

        .song-item {
            margin-top: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #EEEAEE;
        }

        :nth-last-child(1) {
            border: 0;
        }

        .name {
            font-size: 38px;
        }

        .singer {
            margin-top: 15px;
            font-size: 32px;
            color: rgb(155, 155, 155);
        }
    }
}
</style>