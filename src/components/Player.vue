<template>
    <div class="player" ref="player">
        <!-- 背景 -->
        <div class="bg" :style="{backgroundImage:bg}"></div>
        <audio :src="musicSrc" ref="audio" autoplay></audio>
        <!-- 顶部标题 -->
        <div class="top">
            <div class="icon-arrow-left icon" @click="showPlayer"></div>
            <div class="info">
                <div class="title">{{currentMusic.name}}</div>
                <div class="singer">{{currentMusic.singer}}</div>
            </div>
        </div>
        <!-- 转盘 -->
        <div class="disk" :class="$store.state.isPlaying?'playing':''" :style="{backgroundImage:bg}" v-show="showDisk" @click="showDiskOrLyric"></div>
        <!-- 歌词 -->
        <div class="lyric-wrapper" ref="lyricWrapper" @click="showDiskOrLyric" @touchstart="touchLyric">
            <div class="lyric-box" v-show="!showDisk">
                <div class="placeholder" ref="placeholder"></div>
                <div class="lyric-item" ref="lyricItem" v-for="(item,index) in lyric" :key="index">{{item.context}}</div>
            </div>
        </div>
        <!-- 相关操作 -->
        <div class="operation">
            <div class="operation-item like " :class="currentMusic.id?(isLike(currentMusic.id)?'icon-like-red':'icon-Like'):'icon-Like'" @click="likeSong"></div>
            <div class="operation-item download icon-download" @click="download"></div>
            <div class="operation-item icon-comment" @click="showComment"></div>
            <div class="operation-item more icon-more_if" @click="showMoreCtr"></div>
        </div>
        <!-- 进度条 -->
        <div class="progress-box">
            <div class="current-time time" ref="time">{{currentTime}}</div>
            <div class="progress" ref="progress">
                <!-- 滑块 -->
                <div id="mask" class="mask" ref="mask"></div>
                <!-- 激活进度层 -->
                <div id="activeProgress" class="active-progress" ref="activeProgress"></div>
                <!-- 绑定事件层 -->
                <div id="layer" class="layer" ref="layer" v-show="currentMusic.id!=''"></div>
            </div>
            <div class="ent-tiem time">{{endTime}}</div>
        </div>
        <!-- 按钮 -->
        <div class="btn-box">
            <div class="btn-item">
                <span :class="{'icon-sort-play':playType==0,'icon-ramdon-play':playType==1,'icon-cycle-play':playType==2}" @click="switchMode"></span>
            </div>
            <div class="btn-item">
                <span class="icon-pre" @click="switchSing('pre')"></span>
            </div>
            <div class="btn-item">
                <span :class="{'icon-stop':$store.state.isPlaying,'icon-play':!$store.state.isPlaying}" @click="musicSwitch"></span>
            </div>
            <div class="btn-item">
                <span class="icon-next" @click="switchSing('next')"></span>
            </div>
            <div class="btn-item">
                <span class="icon-Music-Playlist" @click="showList"></span>
            </div>
        </div>
        <!-- 播放列表 -->
        <div class="play-list" ref="playList">
            <div class="list-top" @click="switchMode">
                <span class="icon" :class="{'icon-sort-play':playType==0,'icon-ramdon-play':playType==1,'icon-cycle-play':playType==2}"></span>
                <span>{{playType==0?'顺序播放':playType==1?'随机播放':'循环播放'}}</span>
            </div>
            <div class="list-wrapper" ref="listWrapper">
                <div>
                    <div class="list-item" v-for="(item,index) in playList" :key="index" :class="index==$store.state.index?'current':''" ref="listItem" :data-id="item.id" :data-index="index" @click="changeSing">
                        <span class="icon icon-SOUND-PLUS" v-show="index==$store.state.index"></span>
                        <span class="name">{{item.name}}</span>
                        <span class="singer">- {{singerContact(item.ar||item.artists)}}</span>
                        <span class="icon-close del" @click="delSing"></span>
                    </div>
                </div>
                <div class="list-bottom" @click="showList">关闭</div>
            </div>
        </div>
        <transition name="moreControll">
            <div class="more-controll" v-show="showMoreControll">
                <div class="top">
                    <img :src="currentMusic.bg" alt="" class="cover">
                    <div class="other">
                        <div class="name">{{currentMusic.name}}</div>
                        <div class="singer">{{currentMusic.singer}}</div>
                    </div>
                </div>
                <div class="collect item">
                    <img src="../../public/images/collect.png" alt="">
                    <span>收藏到歌单</span>
                </div>
                <div class="similar item" @click="toSimilar">
                    <img src="../../public/images/music.png" alt="">
                    <span>相似推荐</span>
                </div>
                <div class="item">
                    <img src="../../public/images/singer.png" alt="">
                    <span>歌手：{{currentMusic.singer}}</span>
                </div>
                <div class="close" @click="showMoreCtr">关闭</div>
            </div>
        </transition>
        <transition name="comment">
            <Comment class="comment" v-show="sComment" @showComment="showComment"></Comment>
        </transition>
    </div>
</template>
<script>
import BScroll from "better-scroll";
import { mapState } from "vuex";
import Comment from "../components/Comment.vue";
import utils from '../utils/utils.js'

export default {
    name: "Player",
    data() {
        return {
            playType: 0,
            currentTime: "00:00",
            //播放模式 0：顺序  1：随机  2：循环
            playType: 0,
            showDisk: false,
            //当前歌词行
            currentLyricLine: 0,
            scrollTop: 0,
            //显示播放列表
            showPlayList: false,
            //显示评论
            sComment: false,
            showMoreControll: false
        };
    },
    components: {
        Comment
    },
    methods: {
        toSimilar() {
            this.$router.push({ path: '/similar' });
            this.showMoreCtr();
            this.$store.commit("show");
        },
        showPlayer() {
            this.$store.commit("show");
        },
        showDiskOrLyric() {
            this.showDisk = !this.showDisk;
        },
        showMoreCtr() {
            if (this.currentMusic.id != "") {
                this.showMoreControll = !this.showMoreControll;
            }
        },
        showComment() {
            this.sComment = !this.sComment;
        },
        showList() {
            if (this.currentMusic.id != "") {
                this.showPlayList = !this.showPlayList;
                let playList = this.$refs.playList;
                playList.style.transition = "all .3s linear";
                if (this.showPlayList) {
                    playList.style.bottom = 0;
                } else {
                    playList.style.bottom = "-100%";
                }
                this.listScroll.refresh();
                this.listScroll.scrollToElement(
                    this.$refs.listItem[this.$store.state.index],
                    100,
                    true,
                    true
                );
            }
        },
        download(){
            utils.downLoadMix(this,this.currentMusic.src,this.currentMusic.name)
        },
        likeSong(e) {
            if (e.currentTarget.classList.contains('icon-Like')) {
                let likeUrl = `/api/like?id=${this.currentMusic.id}&like=false`;
                this.axios.get(likeUrl).then(res => {
                    console.log('喜欢了该歌曲')
                    console.log(res)
                })
            } else {
                let likeUrl = `/api/like?id=${this.currentMusic.id}&like=true`;
                this.axios.get(likeUrl).then(res => {
                    console.log('取消喜欢了该歌曲')
                    console.log(res)
                })
            }
            this.$store.dispatch('getUserList', this)
        },
        //判断当前歌曲是否已经喜欢
        isLike(id) {
            if (this.currentUser.likeArr) {
                let len = this.currentUser.likeArr.length;
                for (let i = 0; i < len; i++) {
                    if (id == this.currentUser.likeArr[i].id) {
                        return true;
                    }
                }
                return false;
            } else {
                let likeId = this.currentUser.createdList[0].id;
                let songListDetailUrl = "api/playlist/detail?id=" + likeId;
                let likeArr;
                this.axios.get(songListDetailUrl).then(res => {
                    likeArr = res.data.playlist.tracks;
                    this.$set(this.currentUser, 'likeArr', likeArr);
                    let len = likeArr.length;
                    for (let i = 0; i < len; i++) {
                        if (id == likeArr[i].id) {
                            return true;
                        }
                    }
                    return false;
                });
            }
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
        //时间转换
        timeConversion(time) {
            let m = Math.floor(time / 60);
            let s = Math.floor(time % 60);
            m = m >= 10 ? m : "0" + m;
            s = s >= 10 ? s : "0" + s;
            return m + ":" + s;
        },
        //切换播放模式
        switchMode() {
            this.playType = ++this.playType % 3;
        },
        //拖动进度条
        moveProgressMask(e) {
            let audio = this.$refs.audio;
            let x = e.touches[0].pageX;
            let mask = this.$refs.mask;
            let activeProgress = this.$refs.activeProgress;
            let maskWidth = parseInt(getComputedStyle(mask).width);
            let progressWidth = parseInt(getComputedStyle(this.$refs.progress).width);
            let offsetX = parseInt(getComputedStyle(this.$refs.time).width);
            let minX = -maskWidth / 2;
            let maxX = progressWidth - maskWidth / 2;
            let left = x - offsetX - maskWidth / 2;
            left = left <= minX ? minX : left >= maxX ? maxX : left;
            mask.style.left = left + "px";

            let percent = (x - offsetX) / progressWidth;
            let activeProgressWidth =
                percent * progressWidth > progressWidth ?
                progressWidth :
                percent * progressWidth;
            activeProgress.style.width = activeProgressWidth + "px";

            audio.currentTime = percent * this.currentMusic.duration;

            let temp = [];

            this.lyric.map(item => {
                temp.push(Math.abs(parseFloat(item.time) - audio.currentTime));
            });
            let index = temp.indexOf(Math.min.apply(null, temp));
            this.currentLyricLine = index;
            this.lineHeight(this.currentLyricLine);
            
        },
        //更新当前歌词行
        updatedCurrentLyricLine() {
            let audio = this.$refs.audio;
            let currentTime = audio.currentTime;
            if (this.lyric[this.currentLyricLine] && this.currentLyricLine < this.lyric.length - 1) {
                if (this.lyric[this.currentLyricLine].time <= currentTime ) {
                    this.lineHeight(this.currentLyricLine);
                    this.currentLyricLine++;
                }
            }
        },
        //歌词滚动
        scrollMonitor() {
            if (this.lyric.length > 0) {
                this.lyricScroll.scrollToElement(
                    this.$refs.lyricItem[this.currentLyricLine],
                    300,
                    true,
                    true
                );
            }
        },
        //高亮当前歌词行
        lineHeight(index) {
            this.$refs.lyricItem.forEach(item => {
                item.classList.remove("currentLine");
            });
            if (this.$refs.lyricItem[index]) {
                this.$refs.lyricItem[index].classList.add("currentLine");
            }
        },
        //实时更新进度条、时间
        updateMonitor() {
            let audio = this.$refs.audio;
            let mask = this.$refs.mask;
            let activeProgress = this.$refs.activeProgress;
            let percent = audio.currentTime / this.currentMusic.duration;
            let maskWidth = parseInt(getComputedStyle(mask).width);
            let progressWidth = parseInt(getComputedStyle(this.$refs.progress).width);
            this.currentTime = this.timeConversion(audio.currentTime);
            mask.style.left = progressWidth * percent - maskWidth / 2 + "px";
            activeProgress.style.width = progressWidth * percent + "px";
        },
        //音频监听
        audioMonitor() {
            let audio = this.$refs.audio;
            audio.addEventListener("timeupdate", this.updateMonitor);
            audio.addEventListener("timeupdate", this.scrollMonitor);
            audio.addEventListener("timeupdate", this.updatedCurrentLyricLine);
            audio.onplay = () => {
                this.$store.state.isPlaying = true;
            };
            audio.onpause = () => {
                this.$store.state.isPlaying = false;
                if (
                    this.$store.state.naturalPause &&
                    audio.currentTime >= this.currentMusic.duration
                ) {
                    if (this.playType == 0) {
                        this.switchSing("next");
                    } else if (this.playType == 1) {
                        this.random();
                    } else if (this.playType == 2) {
                        this.$store.state.index = this.$store.state.preIndex;
                    }
                    this.getSingData();
                }
            };
        },

        //下一首
        next() {
            let max = this.$store.state.currentPlayList.length - 1;
            this.$store.state.index =
                Number(this.$store.state.index) + 1 > max ?
                0 :
                Number(this.$store.state.index) + 1;
        },
        //上一首
        pre() {
            let max = this.$store.state.currentPlayList.length - 1;
            this.$store.state.index =
                Number(this.$store.state.index) - 1 < 0 ?
                max :
                Number(this.$store.state.index) - 1;
        },
        //随机
        random() {
            let max = this.$store.state.currentPlayList.length - 1;
            let random = Math.floor(Math.random() * (max + 1));
            this.$store.state.preIndex = this.$store.state.index;
            this.$store.state.index = random;
        },
        //获取歌曲信息
        getSingData() {
            this.$set(
                this.$store.state.currentMusic,
                "id",
                this.$store.state.currentPlayList[this.$store.state.index].id
            );
            this.$store.dispatch("getSingData", this);
            this.$refs.audio.src = this.currentMusic.src;
        },
        //切换歌曲，上一首、下一首
        switchSing(type) {
            this.currentLyricLine = 0;
            if (this.currentMusic.id != "") {
                if (this.playType == 0 || this.playType == 2) {
                    if (type == "next") {
                        this.next();
                    } else if (type == "pre") {
                        this.pre();
                    }
                } else if (this.playType == 1) {
                    if (type == "next" || !this.$store.state.preIndex) {
                        this.random();
                    } else if (type == "pre") {
                        if (this.$store.state.preIndex) {
                            this.$store.state.index = this.$store.state.preIndex;
                        }
                    }
                }
                this.getSingData();
            }
        },
        //音乐开关
        musicSwitch() {
            if (this.currentMusic.id != "") {
                let audio = this.$refs.audio;
                this.$store.state.isPlaying = !this.$store.state.isPlaying;
                this.$store.state.naturalPause = !this.$store.state.naturalPause;
                if (this.$store.state.isPlaying) {
                    audio.play();
                    return;
                }
                audio.pause();
            }
        },
        //初始化歌词滚动
        initScroll() {
            if (!this.lyricScroll || !this.listScroll) {
                this.lyricScroll = new BScroll(this.$refs.lyricWrapper, {
                    click: true
                });
                this.listScroll = new BScroll(this.$refs.listWrapper, {
                    click: true
                });
            } else {
                this.lyricScroll.refresh();
                this.listScroll.refresh();
            }
        },
        //触摸歌词
        touchLyric() {
            let audio = this.$refs.audio;
            let lyricWrapper = this.$refs.lyricWrapper;
            audio.removeEventListener("timeupdate", this.scrollMonitor);
            lyricWrapper.addEventListener("touchend", () => {
                let t = setTimeout(() => {
                    audio.addEventListener("timeupdate", this.scrollMonitor);
                    clearTimeout(t);
                    t = null;
                }, 1000);
            });
        },
        //在播放列表切换歌曲
        changeSing(e) {
            let id = e.currentTarget.dataset.id;
            if (!e.target.classList.contains('del')) {
                if (id != this.currentMusic.id) {
                    this.$store.state.index = e.currentTarget.dataset.index;
                    this.$set(this.$store.state.currentMusic, "id", id);
                    this.$store.dispatch("getSingData", this);
                    this.currentLyricLine = 0;
                    this.showList();
                }
            }

        },
        delSing() {
            this.$store.state.currentPlayList.splice(this.$store.state.index, 1);
            this.$store.state.index = -1;
        }
    },
    computed: {
        ...mapState(["currentMusic", "currentUser"]),
        //是否显示播放界面
        show() {
            return this.$store.state.showPlayer;
        },
        //音乐src
        musicSrc() {
            return this.currentMusic.src;
        },
        //背景
        bg() {
            return `url('${this.currentMusic.bg}')`;
        },
        //歌曲时长
        endTime() {
            if (this.currentMusic.id != "") {
                return this.timeConversion(this.currentMusic.duration);
            } else {
                return "00:00";
            }
        },
        playList() {
            return this.$store.state.currentPlayList;
        },
        //歌词
        lyric() {
            let lyricArr = [];
            if (this.currentMusic.lyric != "暂无歌词") {
                let tempArr = this.currentMusic.lyric.split("\n");
                tempArr.forEach((value, index) => {
                    let time = value.substring(
                        value.indexOf("[") + 1,
                        value.indexOf("]")
                    );
                    lyricArr.push({
                        time: (
                            time.split(":")[0] * 60 +
                            parseFloat(time.split(":")[1])
                        ).toFixed(3),
                        context: value.substring(value.indexOf("]") + 1, value.length)
                    });
                });
                for (let i = 0; i < lyricArr.length; i++) {
                    if (lyricArr[i].time == "NaN") {
                        lyricArr.splice(i, 1);
                        i--;
                    }
                }
            } else {
                lyricArr.push({ context: "暂无歌词" });
            }
            return lyricArr;
        }
    },
    watch: {
        show(newVal, oldVal) {
            let player = this.$refs.player;
            player.style.transition = "all .3s linear";
            if (this.show) {
                player.style.left = 0;
            } else {
                player.style.left = "130%";
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initScroll();
            let audio = this.$refs.audio;
            let mask = this.$refs.mask;
            let layer = this.$refs.layer;
            layer.addEventListener("touchstart", e => {
                this.moveProgressMask(e);
            });
            layer.addEventListener("touchmove", e => {
                this.moveProgressMask(e);
            });

            audio.oncanplay = () => {
                this.$set(this.$store.state.currentMusic, "duration", audio.duration);
                this.audioMonitor();
            };
            audio.ondurationchange=()=>{
                this.currentLyricLine=0;
            }
        });
    },
    created() {}
};
</script>
<style lang="scss" scoped>
.player {
    position: absolute;
    left: 110%;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 200;
    background-color: rgb(112, 110, 110);
    color: white;

    .bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        background-size: cover;
        background-position: center center;
        background-repeat: no-repeat;
        overflow: hidden;
        transform: scale(1.1);
        filter: blur(60px);
    }

    .bg::after {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: hsla(0, 0, 50%, 0.3);
    }

    .top {
        display: flex;
        margin-top: 20px;

        .icon {
            flex: 0 0 10%;
            margin-left: 20px;
            font-size: 60px;
        }

        .info {
            flex: 0 0 80%;
            width: 80%;
            text-align: center;
        }

        .title {
            width: 100%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }

        .singer {
            margin-top: 15px;
            color: rgb(245, 236, 236);
            font-size: 30px;
        }
    }

    .disk {
        position: absolute;
        width: 500px;
        height: 500px;
        left: 50%;
        top: 40%;
        margin: -250px;
        border-radius: 50%;
        border: 12px solid rgb(161, 160, 137);
        background-size: cover;
        background-position: center center;
        background-repeat: no-repeat;

        &.playing {
            animation: rotateDisk 7s linear infinite;
        }
    }

    .lyric-wrapper {
        position: absolute;
        width: 500px;
        height: 800px;
        left: 50%;
        top: 15%;
        transform: translateX(-50%);
        overflow: hidden;

        .placeholder {
            height: 500px;
        }

        .lyric-item {
            margin: 15px;
            text-align: center;
            font-size: 35px;
            line-height: 50px;
            color: #8A8787;
        }

        .currentLine {
            color: white;
        }
    }

    .operation {
        display: flex;
        margin-top: 1000px;

        .operation-item {
            flex: 0 0 25%;
            text-align: center;
            font-size: 60px;
        }
    }

    .progress-box {
        margin-top: 100px;
        display: flex;
        width: 100%;
        height: 30px;

        .time {
            flex: 0 0 20%;
            text-align: center;
            font-size: 25px;
            line-height: 30px;
        }

        .progress {
            flex: 1;
            position: relative;
            height: 6px;
            background-color: rgb(110, 108, 104);
            margin-top: 13px;
        }

        .active-progress {
            position: absolute;
            top: 0;
            left: 0;
            width: 0;
            height: 100%;
            background-color: rgb(165, 162, 162);
            z-index: 1;
        }

        .mask {
            position: absolute;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: white;
            left: -10px;
            top: -10px;
            z-index: 2;
        }

        .layer {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 3;
        }
    }

    .btn-box {
        display: flex;
        margin-top: 70px;

        .btn-item {
            flex: 0 0 20%;
            text-align: center;
            font-size: 55px;
        }

        span {
            line-height: 72px;
        }

        .icon-stop,
        .icon-play {
            font-size: 80px;
        }
    }

    .more-controll {
        position: absolute;
        left: 0;
        bottom: 0;
        background-color: rgb(241, 238, 238);
        width: 100%;
        height: 30%;
        padding: 20px;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        border-top-left-radius: 30px;
        border-top-right-radius: 30px;
        z-index: 5;
        color: black;

        .top {
            display: flex;

            .cover {
                display: block;
                width: 100px;
                height: 100px;
            }

            .other {
                flex: 1;
                margin-left: 20px;

                .singer {
                    color: rgb(157, 157, 157);
                }
            }
        }

        .item {
            margin: 30px 0;
            height: 50px;

            span {
                vertical-align: top;
                line-height: 50px;
            }


            img {
                display: inline-block;
                width: 50px;
                height: auto;
                margin-right: 20px;
            }
        }

        .close {
            width: 100%;
            height: 70px;
            line-height: 70px;
            text-align: center;
        }
    }

    .play-list {
        position: absolute;
        left: 0;
        bottom: -100%;
        background-color: rgb(241, 238, 238);
        width: 100%;
        height: 60%;
        border-top-left-radius: 30px;
        border-top-right-radius: 30px;
        z-index: 5;
        color: black;

        .icon {
            margin-right: 20px;
            font-size: 40px;
            vertical-align: middle;
        }

        .list-top {
            padding: 20px 20px 0;
            font-size: 35px;
            height: 80px;
            line-height: 60px;
            box-sizing: border-box;
        }

        .list-item {
            position: relative;
            margin-top: 15px;
            margin-left: 25px;
            padding-bottom: 10px;
            padding-right: 100px;
            width: 100%;
            height: 70px;
            line-height: 70px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            border-bottom: 1px solid rgb(212, 211, 211);
            box-sizing: border-box;

            .name {
                font-size: 35px;
                color: rgb(26, 25, 25);
            }

            .singer {
                font-size: 30px;
                color: rgb(95, 94, 94);
            }

            &.current span {
                color: red;
            }

            .del {
                position: absolute;
                top: 0;
                right: 50px;
            }
        }

        .list-wrapper div .list-item:last-of-type {
            border: 0;
        }

        .list-bottom {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 70px;
            text-align: center;
            line-height: 70px;
            background-color: rgb(241, 238, 238);
        }

        .list-wrapper {
            height: calc(100% - 200px);
            overflow: hidden;
            padding-bottom: 50px;
        }
    }

    .comment {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: white;
        color: black;
        z-index: 300;
    }

    .moreControll-enter-active,
    .moreControll-leave-active {
        transition: all 0.3s linear;
    }

    .moreControll-enter,
    .moreControll-leave-to {
        bottom: -100%;
    }

    .moreControll-enter-to,
    .moreControll-leave {
        left: 0;
    }

    .comment-enter-active,
    .comment-leave-active {
        transition: all 0.2s linear;
    }

    .comment-enter,
    .comment-leave-to {
        left: 100%;
    }

    .comment-enter-to,
    .comment-leave {
        left: 0;
    }

    @keyframes rotateDisk {
        0% {
            transform: rotateZ(0deg);
        }

        100% {
            transform: rotateZ(360deg);
        }
    }
}
</style>