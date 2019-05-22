import utils from '../utils/utils.js'
export default {
    //获取用户歌单
    getUserList({ state }, that) {
        let userSongListUrl =
            "/api/user/playlist?uid=" + state.currentUser.id;

        let createdArr = [];
        let collectedArr = []
        that.axios.get(userSongListUrl).then(res => {
            res.data.playlist.forEach(item => {
                if (item.creator.userId == state.currentUser.id) {
                    createdArr.push(item);
                } else {
                    collectedArr.push(item);
                }
            });
            state.currentUser.createdList = createdArr;
            state.currentUser.collectedList = collectedArr;
        });
    },
    //获取播放歌曲的信息
    getSingData({ state }, that) {
        let id = state.currentMusic.id;
        //用来获取歌曲详情，如 封面、时长等
        let singDetailUrl = '/api/song/detail?ids=' + id;
        //用来获取音乐播放链接
        let singSrcUrl = "/api/song/url?id=" + id;
        //用来获取歌词
        let singLyricUrl = '/api/lyric?id=' + id;
        //用来获取评论
        let commentUrl = `/api/comment/music?id=${id}&limit=30`;
        that.axios.all([that.axios.get(singDetailUrl), that.axios.get(singSrcUrl), that.axios.get(singLyricUrl), that.axios.get(commentUrl)])
            .then(that.axios.spread((detailRes, srcRes, lyricRes, commentRes) => {
                that.$set(state.currentMusic, "src", srcRes.data.data[0].url);
                that.$set(state.currentMusic, "bg", detailRes.data.songs[0].al.picUrl);
                that.$set(state.currentMusic, "name", detailRes.data.songs[0].name);
                that.$set(state.currentMusic, "singer", utils.singerContact(detailRes.data.songs[0].ar));
                that.$set(state.currentMusic, "totalComment", commentRes.data.total);
                that.$set(state.currentMusic, "hotComments", commentRes.data.hotComments);
                that.$set(state.currentMusic, "normalComments", commentRes.data.comments);

                if (lyricRes.data.nolyric) {
                    that.$set(state.currentMusic, 'lyric', '暂无歌词')
                } else {
                    that.$set(state.currentMusic, 'lyric', lyricRes.data.lrc.lyric)
                }
                console.log(commentRes.data);
            }))
    }
}