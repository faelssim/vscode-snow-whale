// import axios from 'axios';
import {
    YD_APP_KEY,
    YD_APP_SECRET,
    XZ_APP_SECRET,
    XZ_APP_CITY,
    JH_NBA_KEY,
    QQ_KEY,
} from '../config/key.config';
import WeatherAssets from '../config/weather.config';

function truncate(q){
    var len = q.length;
    if(len<=20) return q;
    return q.substring(0, 10) + len + q.substring(len-10, len);
}

const vm = new Vue({
    el: '#app',
    data: {
        langs: Object.freeze([
            { label: '英语', value: 'en' },
            { label: '德语', value: 'de' },
            { label: '法语', value: 'fr' },
            { label: '日语', value: 'ja' },
            { label: '荷兰语', value: 'nl' },
            { label: '俄语', value: 'ru' },
            { label: '西班牙语', value: 'es' },
            { label: '阿拉伯语', value: 'ar' },
            { label: '简中', value: 'zh-CHS' },
            { label: '繁中', value: 'zh-CHT' },
        ]),
        text: '',
        toLang: 'en',
        translationText: [],
        weatherInfo: {},
        path: '../images/0@2x.png',
        WeatherAssets,
        commentInfo: {},
        aphorism: '',
        userInfo: {},
        qqInfo: {
            avatar: `http://q1.qlogo.cn/g?b=qq&nk=${QQ_KEY}&s=100&t=1547904810`
        },
        talkInfo: {
            msg: '',
            data: [],
            code: ''
        }
    },
    mounted: function () {
        this.getUserInfo();
        this.getWeatherInfo();
        this.getHotComments();
        this.getAphorism();
        this.getBingYingImage();
        this.getQQInfo();
        this.getQQTalk();
    },
    methods: {
        onTranslate() {
            const lang = 'zh';
            if (this.text) {
                this.requestBaiduService(this.text, 'auto', this.toLang);
            }
        },
        requestBaiduService(text, from, to) {
            const salt = (new Date).getTime();
            const curtime = Math.round(new Date().getTime()/1000);
            const str = YD_APP_KEY + truncate(text) + salt + curtime + YD_APP_SECRET;
            const sign = CryptoJS.SHA256(str).toString(CryptoJS.enc.Hex);
            $.ajax({
                url: 'https://openapi.youdao.com/api',
                type: 'post',
                dataType: 'jsonp',
                data: {
                    q: text,
                    appKey: YD_APP_KEY,
                    salt: salt,
                    from: from,
                    to: to,
                    sign: sign,
                    signType: "v3",
                    curtime: curtime,
                },
                success: (data) => {
                    console.log(data);
                    const {
                        translation
                    } = data;
                    this.translationText = translation;
                } 
            })
        },
        getUserInfo() {
            $.ajax({
                url: 'https://api.gumengya.com/Api/UserInfo',
                type: 'post',
                dataType: 'json',
                data: {
                    format : 'json',
                },
                success: (res) => {
                    this.userInfo = res.data;
                }
            })
        },
        getWeatherInfo() {
            $.ajax({
                url: `https://api.seniverse.com/v3/weather/now.json?key=${XZ_APP_SECRET}&location=${XZ_APP_CITY}&language=zh-Hans&unit=c`,
                type: 'get',
                success: (data) => {
                    this.weatherInfo = data.results[0];
                }
            })
        },
        getHotComments() {
            $.ajax({
                url: 'https://api.gumengya.com/Api/HotComments',
                type: 'post',
                dataType: 'json',
                async: false, 
                data: {
                    format : 'json',
                },
                success: (res) => {
                    // 状态码 200 表示请求成功
                    if(res.code == 200){
                        this.commentInfo = res.data;
                    }else{
                        console.log(res)
                    }
                }
            })
        },
        getAphorism() {
            $.ajax({
                url: 'https://api.gumengya.com/Api/YiYan',
                type: 'post',
                dataType: 'json',
                data: {
                    format : 'json',
                },
                success: (res) => {
                    this.aphorism = res.data.text;
                }
            })
        },
        getBingYingImage() {
            // https://api.gumengya.com/Api/BingImg?format=image
        },
        getQQInfo() {
            $.ajax({
                url: `https://api.pearktrue.cn/api/qq/query.php`,
                type: 'get',
                dataType: 'json',
                data: {
                    qq: QQ_KEY
                },
                success: (res) => {
                    if (res.code === 200) {
                        Object.keys(res.data).map(key => {
                            this.$set(this.qqInfo, key, res.data[key]);
                        });
                    }
                    // this.qqInfo.nickname = res.code === 200 ? res.qqnicheng : '未获取';
                },
            })
        },
        getQQTalk() {
            $.ajax({
                url: 'https://www.yuanxiapi.cn/api/ssid/',
                type: 'GET',
                dataType: 'json',
                data: {
                    qq: QQ_KEY
                },
                success: (res) => {
                    console.log(res);
                    this.talkInfo.code = res.code;
                    if (res.code === '0') {
                        this.talkInfo.data = res.data;
                    } else {
                        this.talkInfo.msg = res.msg;
                    }
                }
            })
        }
    }
});