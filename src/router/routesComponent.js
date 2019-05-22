export default {
    Login: r => require(['@/views/Login'], r),
    Index: r => require(['@/views/Index'], r),
    Discover: r => require(['@/views/Discover'], r),
    Mine: r => require(['@/views/Mine'], r),
    Account: r => require(['@/views/Account'], r),
    SongList: r => require(['@/views/SongList'], r),
    SongListSquare: r => require(['@/views/SongListSquare'], r),
    Ranking: r => require(['@/views/Ranking'], r),
    Similar:r=> require(['@/views/Similar'],r),
    Radio:r=> require(['@/views/Radio'],r),
    RadioDetail:r=> require(['@/views/RadioDetail'],r)
}