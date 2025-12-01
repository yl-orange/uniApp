'use strict'
const uniID = require('uni-id-common')
const createConfig = require('uni-config-center')

const uniIDConfig = createConfig({
  pluginId: 'uni-id'
})

exports.main = async (event, context) => {
  const uniIDIns = uniID.createInstance({
    context,
    config: uniIDConfig.config()
  })

  const { code, inviteCode } = event

  if (!code) {
    return {
      errCode: 'PARAM_MISSING',
      errMsg: '缺少微信登录 code 参数'
    }
  }

  try {
    const loginResult = await uniIDIns.loginByWeixin({
      code,
      inviteCode,
      needPermission: false
    })

    return loginResult
  } catch (error) {
    return {
      errCode: 'WEIXIN_LOGIN_FAILED',
      errMsg: error.message || '微信登录失败',
      error
    }
  }
}
