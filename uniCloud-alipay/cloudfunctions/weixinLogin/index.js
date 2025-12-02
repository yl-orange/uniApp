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
    const weixinOAuthConfig = uniIDConfig.config()?.['mp-weixin']?.oauth?.weixin || {}
    const { appid, appsecret } = weixinOAuthConfig

    if (!appid || !appsecret) {
      throw new Error('未配置微信小程序 appid 或 appsecret')
    }

    // 通过 jscode2session 获取 openid 与 session_key
    const jscode2SessionUrl = 'https://api.weixin.qq.com/sns/jscode2session'
    const { data: sessionData } = await uniCloud.httpclient.request(jscode2SessionUrl, {
      method: 'GET',
      dataType: 'json',
      data: {
        appid,
        secret: appsecret,
        js_code: code,
        grant_type: 'authorization_code'
      }
    })

    if (sessionData.errcode) {
      throw new Error(sessionData.errmsg || '微信登录失败')
    }

    const { openid, session_key: sessionKey, unionid } = sessionData
    const db = uniCloud.database()
    const userCollection = db.collection('uni-id-users')
    const openidField = 'wx_openid.mp-weixin'

    // 查询现有用户
    let userRecord = await userCollection.where({ [openidField]: openid }).get()
    let uid

    if (userRecord.data && userRecord.data.length > 0) {
      uid = userRecord.data[0]._id

      // 更新 session_key 和 unionid
      await userCollection.doc(uid).update({
        wx_session_key: {
          'mp-weixin': sessionKey
        },
        unionid: unionid || userRecord.data[0].unionid
      })
    } else {
      const newUser = {
        wx_openid: {
          'mp-weixin': openid
        },
        wx_session_key: {
          'mp-weixin': sessionKey
        },
        unionid: unionid,
        my_invite_code: inviteCode
      }

      const addRes = await userCollection.add(newUser)
      uid = addRes.id
    }

    const tokenRes = await uniIDIns.createToken({
      uid,
      needPermission: false
    })

    return {
      ...tokenRes,
      uid
    }
  } catch (error) {
    return {
      errCode: 'WEIXIN_LOGIN_FAILED',
      errMsg: error.message || '微信登录失败',
      error
    }
  }
}
