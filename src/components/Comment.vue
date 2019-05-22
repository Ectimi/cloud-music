<template>
    <div class="comment">
        <div class="top">
            <span class="icon-arrow-left icon" @click="showComment"></span>
            评论({{currentMusic.totalComment}})
        </div>
        <div class="title">精彩评论</div>
        <div class="comment-list">
            <div class="comment-item" v-for="(item,index) in currentMusic.hotComments" :key="index">
                <img :src="item.user.avatarUrl" class="avatar">
                <div class="detail clearfix">
                    <div class="user fl">
                        <div class="nick-name">{{item.user.nickname}}</div>
                        <div class="time">{{timestampToTime(item.time)}}</div>
                    </div>
                    <div class="like fr">
                        <span class="like-count">{{item.likedCount}}</span>
                        <span class="icon-Like-2"></span>
                    </div>
                    <div class="content fr">{{item.content}}</div>
                </div>
            </div>
        </div>
        <div class="divide"></div>
         <div class="title">最新评论</div>
        <div class="comment-list">
            <div class="comment-item" v-for="(item,index) in currentMusic.normalComments" :key="index">
                <img :src="item.user.avatarUrl" class="avatar">
                <div class="detail clearfix">
                    <div class="user fl">
                        <div class="nick-name">{{item.user.nickname}}</div>
                        <div class="time">{{timestampToTime(item.time)}}</div>
                    </div>
                    <div class="like fr">
                        <span class="like-count">{{item.likedCount}}</span>
                        <span class="icon-Like-2"></span>
                    </div>
                    <div class="content fr">{{item.content}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
    name: "Comment",
    data() {
        return {

        }
    },
    computed: {
        ...mapState(['currentMusic'])
    },
    methods: {
        showComment() {
            this.$emit('showComment')
        },
        timestampToTime(timestamp) {
            var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear();
            var M = date.getMonth() + 1;
            var D = date.getDate();
            return Y + "年" + M + "月" + D;
        },
    }
};
</script>
<style lang="scss" scoped>
.comment {
  overflow-y:auto;
  
    .top {
        position: sticky;
        width: 100%;
        height: 80px;
        top:0px;
        left:0;
        line-height: 80px;
        text-align: center;
        background-color: #fff;
            
        .icon {
            position: absolute;
            top: 50%;
            left: 20px;
            transform: translateY(-50%);
            font-size: 50px;
        }
    }
    .title{
      font-size:35px;
      margin:20px 0;
      padding-left:20px;
    }
    .divide{
        height: 30px;
    }
    .comment-list {
        width: 100%;

        .comment-item {
            display: flex;
            margin-top:30px;
            padding-right:20px;
            .avatar {
                flex: 0 0 100px;
                display: block;
                width: 100px;
                height: 100px;
                border-radius: 50%;
                margin:0 20px;
            }

            .other {
                flex: 1;
            }
            .detail{
                width:90%;
            }
            .like{
              font-size:30px;
              color:#B1ACAC;
            }
            .like-count{
              margin-right:15px;
            }

            .nick-name {
              font-size:35px;
                color: rgb(109, 109, 109);
            }
            .time{
              margin-top:15px;
              font-size:30px;
              color:#B1ACAC;
            }
            .content{
              width:100%;
              margin-top:25px;
              font-size:32px;
              line-height:50px;
              color:rgb(53, 53, 54);
            }
        }
    }
}
</style>