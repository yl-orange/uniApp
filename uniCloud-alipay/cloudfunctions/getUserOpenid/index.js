'use strict'

exports.main = async (event, context) => {
  const { uid } = event

  if (!uid) {
    return {
      errCode: 'PARAM_MISSING',
      errMsg: '缺少 uid 参数'
    }
  }

  try {
    const db = uniCloud.database()
    const userRes = await db.collection('uni-id-users').doc(uid).get()

    if (!userRes.data || userRes.data.length === 0) {
      return {
        errCode: 'USER_NOT_FOUND',
        errMsg: '用户不存在'
      }
    }

    const openid = userRes.data[0]?.wx_openid?.['mp-weixin']

    if (!openid) {
      return {
        errCode: 'OPENID_NOT_FOUND',
        errMsg: '未找到微信 openid'
      }
    }

    return {
      openid
    }
  } catch (error) {
    return {
      errCode: 'GET_OPENID_FAILED',
      errMsg: error.message || '获取 openid 失败'
    }
  }
}
