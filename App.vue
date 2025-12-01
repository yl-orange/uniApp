<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			uni.onPushMessage((res) => {
				console.log("收到推送消息：", res) //监听推送消息
				// 假设推送主体在 res.data 或 res.data.payload 里，你可以按你的实际结构调整
				const msg = res.data && (res.data.content || res.data.payload || JSON.stringify(res.data))

				uni.showModal({
					title: '收到推送',
					content: typeof msg === 'string' ? msg : JSON.stringify(msg),
					showCancel: false
				})
			})
			uni.getPushClientId({
				success: (res) => {
					const push_clientid = res.cid
					console.log('小程序 push_clientid =', push_clientid)

					// 已登录的话，上报给云端进行绑定
					const token = uni.getStorageSync('uni_id_token')
					if (token) {
						uniCloud.callFunction({
							name: 'bindPushCid',
							data: {
								push_clientid
							}
						})
					}
				},
				fail: (err) => {
					console.error('获取 push_clientid 失败', err)
				}
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>