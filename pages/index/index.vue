<template>
        <view class="content">
                <image class="logo" src="/static/logo.png"></image>
                <view class="text-area">
                        <text class="title">{{title}}</text>
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
                
                      // 2. 调用云函数 weixinLogin 处理登录
                      const { result } = await uniCloud.callFunction({
                        name: 'weixinLogin',
                        data: {
                          code: loginRes.code
                          // 如果有邀请注册，可以再传 inviteCode
                        }
                      })

                      if (result.errCode) {
                        throw new Error(result.errMsg || '登录失败')
                      }

                      const { token, tokenExpired, uid } = result

                      this.token = token
                      this.tokenExpired = tokenExpired
                      this.uid = uid
                
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
