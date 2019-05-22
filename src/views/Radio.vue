<template>
    <div class="radio init-pos">
        <TopTitle :title="'电台推荐'" :fn="pre"></TopTitle>
        <div class="type-box">
            <div class="type-item">
                <img class="type-img" src="../../public/images/radio.png"></img>
                <div class="type-name">电台分类</div>
            </div>
            <div class="type-item">
                <img class="type-img" src="../../public/images/radio-rank.png"></img>
                <div class="type-name">电台排行</div>
            </div>
            <div class="type-item">
                <img class="type-img" src="../../public/images/pay.png"></img>
                <div class="type-name">付费精品</div>
            </div>
            <div class="type-item">
                <img class="type-img" src="../../public/images/course.png"></img>
                <div class="type-name">音乐课堂</div>
            </div>
        </div>
        <div class="divide"></div>
        <div class="recommend-box">
            <div class="recommend">
                <div class="title">电台推荐</div>
                <div class="recommend-item" v-for="(item,index) in todayRecommends" :key="index" :data-id="item.id" @click="toRadioDetail">
                    <img class="cover" :src="item.picUrl"></img>
                    <div class="name elli">{{item.name}}</div>
                </div>
            </div>
            <div class="cate-recommend recommend" v-for="(item,index) in cateRecommend">
                <div class="title" :data-id="item.categoryId">{{item.categoryName}}
                    <span class="icon-arrow-left arrow"></span>
                </div>
                <div class="recommend-item" v-for="(val,ind) in item.radios" :key="ind" :data-id="val.id" @click="toRadioDetail">
                    <img class="cover" :src="val.picUrl"></img>
                    <div class="name elli">{{val.name}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import TopTitle from '../components/TopTitle.vue'
export default {
    name: '',
    data() {
        return {
            todayRecommends: [],
            cateRecommend: []
        }
    },
    components: {
        TopTitle

    },
    methods: {
        pre() {
            this.$router.go(-1);
        },
        toRadioDetail(e){
            this.$router.push({path:'/radiodetail/'+e.currentTarget.dataset.id});
        }
    },
    created() {
        let perferedUrl = '/api/dj/today/perfered';
        let cateRecommendUrl = 'api/dj/category/recommend';
        this.axios.all([this.axios.get(perferedUrl), this.axios.get(cateRecommendUrl)]).then(this.axios.spread((perferedRes, cateRes) => {
            this.todayRecommends = perferedRes.data.data;
            this.cateRecommend=cateRes.data.data;
            console.log(this.todayRecommends)
            console.log(this.cateRecommend);
        }))

    }
}
</script>
<style lang="scss" scoped>
.radio {
    overflow-y: auto;
    .type-box {
        display: flex;
        margin: 20px;

        .type-item {
            display: 1;
            width: 25%;
        }

        .type-img {
            display: block;
            width: 50%;
            margin: 0 auto;
        }

        .type-name {
            margin-top: 15px;
            font-size: 33px;
            text-align: center;
            color: rgb(50, 50, 50);
        }
    }

    .divide {
        width: 100%;
        height: 1px;
        background-color: rgb(245, 245, 245);
    }

    .recommend {
        padding: 20px;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }

    .arrow{
        display: inline-block;
        transform: rotateZ(180deg);
        vertical-align: middle;
        line-height: 40px;
    }

    .title {
        display: block;
        width: 100%;
        height: 40px;
        margin: 10px 5px;
        font-weight: 600;
    }

    .recommend-item {
        flex: 0 0 30%;
        width: 30%;
        margin-right: 3%;

        .cover {
            display: block;
            width: 100%;
            height: auto;
        }

        .name {
            width: 100%;
            margin-top: 10px;
            font-size: 35px;
            color: rgb(83, 83, 84);
            line-height: 40px;

        }
    }
}
</style>