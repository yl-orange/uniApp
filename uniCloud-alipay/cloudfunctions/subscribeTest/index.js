'use strict';
const UniSubscribemsg = require('uni-subscribemsg');

exports.main = async (event, context) => {
  let uniSubscribemsg = new UniSubscribemsg({
    dcloudAppid: "__UNI__B62FF0C",
    provider: "weixin-mp", // ✅ 小程序订阅消息用 weixin-mp
  });

  let res = await uniSubscribemsg.sendSubscribeMessage({
    touser: "", // 小程序用户的 openid
    template_id: "WhDz7V9NVqZi6Fo3K0-CB7TJuOlU21LhOlo9YaoXsc8",
    page: "pages/index/index", // 小程序内页面
    miniprogram_state: "formal", // developer/trial/formal
    lang: "zh_CN",
    data: {
      // key 名要和订阅模板里的字段对上，比如 name1、time2 之类
      name1: { value: "张三" },
      time2: { value: "2023-12-21 15:30:20" },
      // ...
    }
  });
};
