'use strict';
const uniPush = uniCloud.getPushManager({appId:"__UNI__B62FF0C"})
exports.main = async (event, context) => {
	return await uniPush.sendMessage({
		"push_clientid": "",
		"title": "这是通知标题",	
		"content": "这是通知内容",
		"payload": {
			"text":"??????"
		}
	})
};