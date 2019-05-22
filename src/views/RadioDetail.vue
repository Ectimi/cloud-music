<template>
    <div class="radio-detail init-pos">
        <div class="bg" :style="{backgroundImage:bg}"></div>
        <TopTitle class="top" :title="'电台'" :fn="pre"></TopTitle>
        <div class="name">{{data.name}}</div>
        <div class="tab-box" ref="tabBox">
            <div class="tab-title-box">
                <div class="tab-title" :class="active==0?'active':''" @click="switchTab">
                    <span class="text">详情</span>
                    <span class="line"></span>
                </div>
                <div class="tab-title" :class="active==1?'active':''" @click="switchTab">
                    <span class="text">节目</span>
                    <span class="line"></span>
                </div>
            </div>
              <div class="detail-box" ref='detailBox'>
                <div class="anchor clearfix">
                    <div class="text">主播</div>
                    <img class="avatar fl" :src="dj.avatarUrl"></img>
                    <div class="info fl">
                        <div class="nickname elli-one">{{dj.nickname}}</div>
                        <div class="desc elli-one">{{data.desc}}</div>
                    </div>
                </div>
                <div class="radio-desc">
                    <div class="text">电台内容简介</div>
                    <div class="content">{{data.desc}}</div>
                </div>
            </div>
            <div class="program-box" ref="programBox">
                <div class="program-item clearfix" v-for="(item,index) in programs " :key="index">
                    <div class="index fl">{{count-index}}</div>
                    <div class="info fl">
                        <div class="program-name elli">{{item.name}}</div>
                        <span class="create-time">{{item.createTime}}</span>
                        <img class="play-img img" src="../../public/images/play.png"></img>
                        <span class="listener-count">{{item.listenerCount}}</span>
                        <img class="time-img img" src="../../public/images/time.png"></img>
                        <span class="duration">{{timeConversion(item.duration)}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import TopTitle from "../components/TopTitle.vue";
import utils from '../utils/utils.js'
export default {
    name: 'RadioDetail',
    data() {
        return {
            data: {},
            dj: {},
            active: 0,
            programs: [],
            count: '',
            scrollTop:0
        }
    },
    computed: {
        bg() {
            return `url(${this.data.picUrl})`
        }
    },
    components: {
        TopTitle,
    },
    methods: {
        pre() {
            this.$router.go(-1);
        },
         //时间转换
        timeConversion(time) {
            let m = Math.floor(time /3600% 60);
            let s = Math.floor(time /60% 60);
            m = m >= 10 ? m : "0" + m;
            s = s >= 10 ? s : "0" + s;
            return m + ":" + s;
        },
        switchTab(){
        	let detailBox=this.$refs.detailBox;
        	let programBox=this.$refs.programBox;
        	let tabBox=this.$refs.tabBox;
        	this.active=this.active==0?1:0;
			detailBox.style.transition='all .3s linear';
			programBox.style.transition='all .3s linear';
        	if(this.active==1){
                tabBox.scrollTop=this.scrollTop;
				detailBox.style.left='-100%';
				programBox.style.left=0;
				tabBox.style.overflowY='auto';
        	}else if(this.active==0){
                this.scrollTop=tabBox.scrollTop;
                tabBox.scrollTop=0;
        		detailBox.style.left=0;
				programBox.style.left='100%';
				tabBox.style.overflowY='hidden';
        	}
        }
    },
    created() {
        let id = this.$route.params.id;
        let detailUrl = '/api/dj/detail?rid=' + id;
        let programUrl = `/api/dj/program?rid=${id}&limit=40`
        this.axios.all([this.axios.get(detailUrl), this.axios.get(programUrl)]).then(this.axios.spread((detailRes, programRes) => {
            this.data = detailRes.data.djRadio;
            this.dj = detailRes.data.djRadio.dj;
            this.count = programRes.data.count;
            let temp = programRes.data.programs;
            temp.map(item => {
                item.createTime = utils.formatTime(item.createTime, 'MM-dd')
            })
            this.programs = temp;

            console.log(detailRes.data);
            console.log(this.programs)
        }))

    }
}
</script>
<style lang="scss" scoped>
.radio-detail {
    position: relative;

    .bg {
        position: absolute;
        width: 100%;
        height: 60%;
        background-size: cover;
        background-repeat: no-repeat;
        z-index: -1;
    }

    .top {
        background-color: transparent;
        color: white;

        span.line {
            background-color: white !important;
        }
    }

    .name {
        margin-top: 70%;
        margin-left: 30px;
        font-weight: 600;
        color: white;
    }

    .tab-box {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        min-height: 50%;
        border-radius: 40px;
        background-color: white;
        overflow-y: auto;
    }

    .tab-title-box {
    	position: sticky;
    	top:0;
    	left: 0;
        display: flex;
        justify-content: center;
        background-color: #fff;
        z-index: 10;

        .tab-title {
            position: relative;
            flex: 0 0 50%;
            height: 60px;
            line-height: 60px;
            text-align: center;
        }

        .line {
            position: absolute;
            left: 50%;
            bottom: 0;
            margin-left: -50px;
            height: 2px;
            width: 100px;
        }

        .active .text {
            color: red;
        }

        .active .line {
            background-color: red;
        }
    }

    .detail-box,
    .program-box {
        position: absolute;
        top: 75px;
        width: 100%;
        overflow-y: auto;
    }
	
	.detail-box{
		left: 0;
	}
	 .program-box{
	 	left:100%;
	 }
    .anchor {
        margin-top: 20px;

        .text {
            font-weight: 600;
            font-size: 40px;
            padding: 20px;
        }

        .avatar {
            display: block;
            width: 130px;
            height: 130px;
            border-radius: 50%;
            margin: 0 20px;
        }

        .info {
            padding-top: 20px;
            width: 80%;
            ;
        }

        .desc {
            margin-top: 20px;
            font-size: 35px;
            color: #656363;
        }
    }

    .radio-desc {
        padding: 20px;
        box-sizing: border-box;
        font-size: 35px;

        .text {
            font-weight: 600;
            margin: 20px 0;
        }

        .content {
            line-height: 50px;
            color: #656363;
        }
    }

    .program-item {
        width: 100%;
        height: 150px;
        padding: 10px 20px;
        box-sizing: border-box;

        .index{
        	color:rgb(153, 153, 153);
        	line-height: 150px;
        }
        .info{
        	width: 85%;
        	margin-left: 40px;
        }

        .program-name{
        	width: 100%;
        	max-height: 80px;
        	font-size: 35px;
        	line-height: 80px;
        }
        .create-time,.listener-count,.duration{
        	font-size: 30px;
        	color:rgb(153, 153, 153);
        }
        .img{
        	display: inline-block;
        	width: 30px;
        	height: 30px;

        	margin-left: 20px;
        	margin-right: 10px;
        }
    }
}
</style>