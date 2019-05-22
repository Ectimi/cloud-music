<template>
    <div class="list">
        <div class="list-head">
            <span class="icon-play icon"></span>
            <span class="play-btn" @click="playAll">播放全部</span>
            <span class="num">（共{{tracks.length}}首）</span>
            <span class="collect-btn fr" v-show="!isMine">
                <span v-show="!collected" @click="collect">+收藏({{calNum(playList.subscribedCount)}})</span>
                <span v-show="collected&&!isMine" @click="collect">取消收藏</span>
            </span>
        </div>
        <div class="list-item" v-for="(item,index) in tracks" :key="index" :data-id="item.id" :data-index="index" @click="play">
            <div class="index">{{index+1}}</div>
            <div class="sing">
                <div class="name">{{item.name}}</div>
                <div class="singer">{{singerContact(item.ar)}}</div>
            </div>
            <div class="icon-elli more"></div>
        </div>
    </div>
</template>
<script>
import { mapState } from "vuex";
export default {
    name: "List",
    props: ["playList", "tracks"],
    data() {
        return {};
    },
    computed: {
        ...mapState(['currentUser']),
        id() {
            return this.$route.params.id
        },
        collected() {
            let len = this.currentUser.collectedList.length;
            for (let i = 0; i < len; i++) {
                if (this.currentUser.collectedList[i].id == this.id) {
                    return true;
                }
            }
            return false;
        },
        isMine() {
            let len = this.currentUser.createdList.length;
            for (let i = 0; i < len; i++) {
                if (this.currentUser.createdList[i].id == this.id) {
                    return true;
                }
            }
            return false;
        }
    },
    methods: {
        calNum(num) {
            return num > 10000 ? Math.floor(num / 10000) + "万" : num;
        },
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
        play(e) {
            this.$store.commit("show");
            this.$store.state.index = e.currentTarget.dataset.index;
            this.$set(
                this.$store.state.currentMusic,
                "id",
                e.currentTarget.dataset.id
            );
            this.$store.state.currentPlayList = this.playList.tracks;
            this.$store.dispatch("getSingData", this);
            this.$store.state.isPlaying = true;
        },
        playAll() {
            this.$store.commit("show");
            this.$store.state.currentPlayList = this.playList.tracks;
            this.$store.state.index = 0
            this.$set(
                this.$store.state.currentMusic,
                "id",
                this.$store.state.currentPlayList[0].id
            );

            this.$store.dispatch("getSingData", this);
            this.$store.state.isPlaying = true;
        },
        collect() {
            let timestamp = new Date().getTime();
            if (this.collected) {
                let cancelUrl = `/apiplaylist/subscribe?t=2&id=${this.id}&timestamp=${timestamp}`;
                this.axios.get(cancelUrl).then(res => {
                    console.log('取消收藏')
                    this.$store.dispatch('getUserList', this);
                })
            } else {
                let collectUrl = `/apiplaylist/subscribe?t=1&id=${this.id}&timestamp=${timestamp}`;
                this.axios.get(collectUrl).then(res => {
                    console.log('收藏')
                    this.$store.dispatch('getUserList', this);
                })
            }
        }
    },
};
</script>
<style lang="scss" scoped>
.list {
    .list-head {
        position: relative;
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

        .num {
            font-size: 30px;
            color: rgb(165, 165, 165);
        }

        .collect-btn {
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            display: inline-block;
            height: 80px;
            line-height: 80px;
            padding: 0 15px;
            font-size: 30px;
            color: white;
            border-radius: 40px;
            background-color: rgb(254, 34, 28);
        }
    }

    .list-item {
        width: 100%;
        display: flex;
        margin-top: 20px;
    }

    .index {
        flex: 0 0 10%;
        width: 10%;
        text-align: center;
        display: table-cell;
        vertical-align: middle;
    }

    .sing {
        flex: 1;
        width: 70%;
        margin-left: 10px;
    }

    .name {
        width: 100%;
        color: rgb(54, 54, 56);
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    .singer {
        margin-top: 15px;
        font-size: 35px;
        color: rgb(165, 165, 165);
    }

    .singer {
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
</style>