export default {
    getNumNoRepeat(max, count) {
        let arr = [];
        while (count) {
            var num = Math.floor(Math.random() * max);
            if (arr.indexOf(num) < 0) {
                arr.push(num);
                count--;
            }
        }
        return arr;
    },
    verifyEmpty(value) {
        let reg = /^\s*$/g;
        if (reg.test(value) || value == null || value == "") {
            return true;
        }
        return false;
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
    downLoadMix(vue,url, name) {
        vue.axios({
            method: 'get',
            url,
            // 必须显式指明响应类型是一个Blob对象，这样生成二进制的数据，才能通过window.URL.createObjectURL进行创建成功
            responseType: 'blob',
        }).then((res) => {
            if (!res) {
                return
            }
            // 将lob对象转换为域名结合式的url
            let blobUrl = window.URL.createObjectURL(res.data)
            let link = document.createElement('a')
            document.body.appendChild(link)
            link.style.display = 'none'
            link.href = blobUrl
            // 设置a标签的下载属性，设置文件名及格式，后缀名最好让后端在数据格式中返回
            link.download = name+'.mp3'
            // 自触发click事件
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(blobUrl);
        })
    },
     //时间格式化
    formatTime(timeStamp, fmt) {
        let date = new Date(timeStamp);
        let o = {
            "M+": date.getMonth() + 1, //月份 
            "d+": date.getDate(), //日 
            "h+": date.getHours(), //小时 
            "m+": date.getMinutes(), //分 
            "s+": date.getSeconds(), //秒 
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
            "S": date.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
}