<template>
        <view class="content">
                <image class="logo" src="/static/logo.png"></image>
                <view class="text-area">
                        <text class="title">{{title}}</text>
                </view>
                <view class="actions">
                        <button type="primary" class="subscribe-btn" @click="requestSubscribe">订阅通知</button>
                        <text class="hint">点击按钮，打开微信小程序订阅授权并选择允许。</text>
                </view>
        </view>
</template>

<script>
        export default {
                data() {
                        return {
                                title: 'Hello',
                                tmplIds: ['WhDz7V9NVqZi6Fo3K0-CB7TJuOlU21LhOlo9YaoXsc8']
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
                                        success: (res) => {
                                                const accepted = Object.values(res).some((item) => item === 'accept')
                                                uni.showToast({
                                                        title: accepted ? '订阅成功' : '未订阅通知',
                                                        icon: accepted ? 'success' : 'none'
                                                })
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

        .hint {
                font-size: 24rpx;
                color: #666;
                text-align: center;
                line-height: 1.5;
        }
</style>
