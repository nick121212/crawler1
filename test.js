let loupans = [
    // "http://sh.fang.anjuke.com/",
    "http://sh.fang.anjuke.com/loupan/all/p3/",
    "http://sh.fang.anjuke.com/loupan/all/",
    "http://sh.fang.anjuke.com/loupan/jiading/",
    "http://sh.fang.anjuke.com/loupan/jiading/p2/",
    "http://sh.fang.anjuke.com/loupan/3748734634.html",
    "http://sh.fang.anjuke.com/loupan/canshu-3748734634.html",
    "http://sh.fang.anjuke.com/loupan/huxing-3748734634.html",
    "http://sh.fang.anjuke.com/loupan/xiangce-3748734634.html",
    "http://sh.fang.anjuke.com/loupan/xiangce-131001/ybj.html",
    "http://sh.fang.anjuke.com/loupan/xiangce-131001/sjt.html",
    "http://sh.fang.anjuke.com/loupan/xiangce-131001/xgt.html",
    "http://sh.fang.anjuke.com/loupan/xiangce-131001/ght.html",
    "http://sh.fang.anjuke.com/loupan/xiangce-131001/ptt.html",
    "http://sh.fang.anjuke.com/loupan/xiangce-131001/wzt.html",
];

for (let key in loupans) {
    let loupan = loupans[key];
    let regex = /\/loupan(?:\/?)/i;
    // let regex = /\/loupan[\/?[a-z]*\/?(?:p\d+\/?|\/?)|[canshu|xiangce|huxing|]-\d+\/?[ybj|sjt|xgt|ght|ptt|wzt].html]/i;

    console.log(loupan, "-------", regex.test(loupan));
    console.log(loupan.match(regex));
}

let brokers = [
    "http://shanghai.anjuke.com/tycoon/",
    "http://shanghai.anjuke.com/tycoon/pudong/",
    "http://shanghai.anjuke.com/tycoon/j2",
    "http://huanxindichan.anjuke.com/gongsi-jjr-21890/",
    "http://shenzhoufangcha.anjuke.com/gongsi-jjr-13622/",
    "http://zhushangbudongc.anjuke.com/gongsi-jjr-11157/",
    "http://dulijingjiren11.anjuke.com/gongsi-jjr-9906/",
    "http://woaiwojia19.anjuke.com/gongsi-jjr-33388/",
    "http://changyuandichan.anjuke.com/gongsi-jjr-4137/",
    "http://fumeilai.anjuke.com/gongsi-jjr-1782/",
    "http://jiaxinfangchan.anjuke.com/gongsi-jjr-454/",
    "http://hengtongdichan.anjuke.com/gongsi-jjr-5558/",
    "http://hanchangfangcha1.anjuke.com/gongsi-jjr-23350/"
];