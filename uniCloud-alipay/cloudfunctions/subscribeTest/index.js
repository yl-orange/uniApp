// 引入uni-subscribemsg公共模块
const UniSubscribemsg = require('uni-subscribemsg');
// 初始化实例
let uniSubscribemsg = new UniSubscribemsg({
	dcloudAppid: "你项目的dcloudAppid",
	provider: "weixin-h5", // 注意，这里是weixin-h5
});
// 发送模板消息
let res = await uniSubscribemsg.sendTemplateMessage({
	touser: "用户openid",
	template_id: "消息模板id",
	url: "https://uniapp.dcloud.net.cn", // 用户点击消息后跳转的链接地址
	data: {
		first: {
			value: "您购买的套餐已到期!",
			color: "#666666"
		},
		keyword1: {
			value: "test@qq.com",
			color: "#666666"
		},
		keyword2: {
			value: "阿里云空间",
			color: "#666666"
		},
		keyword3: {
			value: "2023-12-21 15:30:20",
			color: "#666666"
		},
		remark: {
			value: "请及时续费",
			color: "#666666"
		}
	}
});
