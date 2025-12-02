<template>
    <view class="content">
        <image class="logo" src="/static/logo.png"></image>
        <view class="text-area">
            <text class="title">{{ title }}</text>
        </view>
        <view class="actions">
            <button type="primary" class="subscribe-btn" @click="requestSubscribe">订阅通知</button>
            <text class="hint">点击按钮，打开微信小程序订阅授权并选择允许。</text>
            <button type="primary" class="login-btn" :loading="loggingIn" @click="weixinLogin">微信一键登录</button>
            <view v-if="token" class="result">
                <text>UID：{{ uid }}</text>
                <text>Token：{{ token }}</text>
                <text>过期时间：{{ tokenExpired }}</text>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            title: 'Hello',
            tmplIds: ['WhDz7V9NVqZi6Fo3K0-CB7TJuOlU21LhOlo9YaoXsc8'],
            token: '',
            tokenExpired: '',
            uid: '',
            loggingIn: false
        }
    },
    onLoad() {

    },
    methods: {
        requestSubscribe() {
            // #ifdef MP-WEIXIN
            if (!this.tmplIds || this.tmplIds.length === 0) {
                uni.showToast({
                    title: '请先配置模板 ID',
                    icon: 'none'
                })
                return
            }
            uni.requestSubscribeMessage({
                tmplIds: this.tmplIds,
                success: async (res) => {
                    const accepted = Object.values(res).some((item) => item === 'accept')
                    uni.showToast({
                        title: accepted ? '订阅成功' : '未订阅通知',
                        icon: accepted ? 'success' : 'none'
                    })

                    if (accepted) {
                        await this.showOpenidAfterSubscribe()
                    }
                },
                fail: (err) => {
                    console.error('requestSubscribeMessage fail', err)
                    uni.showToast({
                        title: '订阅失败，请稍后重试',
                        icon: 'none'
                    })
                }
            })
            // #endif
            // #ifndef MP-WEIXIN
            uni.showToast({
                title: '当前平台暂不支持订阅消息',
                icon: 'none'
            })
            // #endif
        },
        async weixinLogin() {
            // #ifdef MP-WEIXIN
            if (this.loggingIn) return
            this.loggingIn = true

            try {
                // 1. 获取微信小程序 code
                const loginRes = await new Promise((resolve, reject) => {
                    uni.login({
                        provider: 'weixin',
                        success: resolve,
                        fail: reject
                    })
                })

                // 2. 通过 uni-id-co 登录
                const uniIdCo = uniCloud.importObject('uni-id-co')

                let res
                try {
                    res = await uniIdCo.loginByWeixin({
                        code: loginRes.code,
                    })
                } catch (err) {
                    console.error('loginByWeixin error >>>', err)
                    console.error('errMsg:', err && (err.errMsg || err.message))
                    console.error('stack:', err && err.stack)
                    return // 一般这里结束，防止下面用到一个 undefined 的 res
                }

                if (res.errCode) {
                    throw new Error(res.errMsg || '登录失败')
                }

                // 注意：uni-id-co 把 token 放在 newToken 里
                const {token, tokenExpired} = res.newToken || {}

                this.token = token
                this.tokenExpired = tokenExpired
                this.uid = res.uid

                uni.setStorageSync('uni_id_token', token)
                uni.setStorageSync('uni_id_token_expired', tokenExpired)

                uni.showToast({
                    title: '登录成功',
                    icon: 'success'
                })
            } catch (error) {
                console.error('weixinLogin error', error)
                uni.showToast({
                    title: error.message || '微信登录失败',
                    icon: 'none'
                })
            } finally {
                this.loggingIn = false
            }
            // #endif

            // #ifndef MP-WEIXIN
            uni.showToast({
                title: '请在微信小程序中使用一键登录',
                icon: 'none'
            })
            // #endif
        },
        async showOpenidAfterSubscribe() {
            if (!this.uid) {
                uni.showToast({
                    title: '请先登录再获取 openid',
                    icon: 'none'
                })
                return
            }

            uni.showLoading({
                title: '获取 openid...'
            })

            // try {
            //     const {result} = await uniCloud.callFunction({
            //         name: 'getUserOpenid',
            //         data: {
            //             uid: this.uid
            //         }
            //     })

            //     const {openid, errMsg} = result || {}

            //     if (!openid) {
            //         throw new Error(errMsg || '未能获取 openid')
            //     }

            //     console.log('当前 openid:', openid)
            //     uni.showToast({
            //         title: `openid: ${openid}`,
            //         icon: 'none',
            //         duration: 4000
            //     })
            // } catch (error) {
            //     console.error('showOpenidAfterSubscribe error', error)
            //     uni.showToast({
            //         title: error.message || '获取 openid 失败',
            //         icon: 'none'
            //     })
            // } finally {
            //     uni.hideLoading()
            // }
        }
    }
}
</script>

<style>
.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.logo {
    height: 200rpx;
    width: 200rpx;
    margin-top: 200rpx;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 50rpx;
}

.text-area {
    display: flex;
    justify-content: center;
}

.title {
    font-size: 36rpx;
    color: #8f8f94;
}

.actions {
    margin-top: 60rpx;
    width: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20rpx;
}

.subscribe-btn {
    width: 100%;
}

.login-btn {
    width: 100%;
}

.hint {
    font-size: 24rpx;
    color: #666;
    text-align: center;
    line-height: 1.5;
}

.result {
    display: flex;
    flex-direction: column;
    gap: 10rpx;
    width: 100%;
    word-break: break-all;
    font-size: 26rpx;
    color: #333;
}
</style>
