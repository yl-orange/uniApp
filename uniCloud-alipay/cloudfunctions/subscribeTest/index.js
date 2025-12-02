'use strict';
const {
	log
} = require('console');
const UniSubscribemsg = require('uni-subscribemsg');

exports.main = async (event, context) => {
	let uniSubscribemsg = new UniSubscribemsg({
		dcloudAppid: "__UNI__B62FF0C",
		provider: "weixin-mp", // 小程序订阅消息
	});

	const db = uniCloud.database()
	const user = await db.collection('uni-id-users')
		.doc('692e576e680a13cada57e24f') // 这才是 uid / _id
		.get()

	const openid = user.data[0]['wx_openid']['mp-weixin']

	let res = await uniSubscribemsg.sendSubscribeMessage({
		touser: openid, // 小程序用户 openid
		template_id: "WhDz7V9NVqZi6Fo3K0-CB7TJuOlU21LhOlo9YaoXsc8",
		page: "pages/index/index",
		miniprogram_state: "formal", // developer / trial / formal
		lang: "zh_CN",
		data: {
			thing1: { // 活动名称
				value: "年末霸王餐抽奖"
			},
			thing3: { // 温馨提示
				value: "恭喜中奖，请在今晚21:00前到店核销～"
			}
		}
	});

	log("发送消息通知", res);
};