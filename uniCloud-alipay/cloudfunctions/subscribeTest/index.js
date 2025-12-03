'use strict';
const {log} = require('console');
const UniSubscribemsg = require('uni-subscribemsg');

exports.main = async (event, context) => {

    // 从url中获取信息
    // const query = event.queryStringParameters
    // log('query内容:', query);
    // const openid = query.openid;
    // if (!openid) {
    //     log('缺少 openid');
    //     return {
    //         statusCode: 400,
    //         body: 'missing openid in query',
    //     };
    // }

    // 从body中获取信息
    log('body内容:', event.body);
    const body = JSON.parse(event.body)
    const openid = body.openid;
    const templateId = body.templateId;

    let uniSubscribemsg = new UniSubscribemsg({
            dcloudAppid: "__UNI__B62FF0C",
            provider: "weixin-mp",
        }
    );

    /**
     * 发送通知消息
     */
    let res = await uniSubscribemsg.sendSubscribeMessage({
        touser: openid,
        template_id: templateId,
        page: "pages/index/index",
        miniprogram_state: "formal", // developer,trial,formal
        lang: "zh_CN",
        data: body.data
    });

    log("发送消息通知", res);
};