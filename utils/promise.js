const app = getApp()
import * as commonMethod from '../assets/js/common.js'

export function request(url, params, method) {
      const appid = 'miinno.com'
      const secret = '123456'
      const version = 'api/v1'
      const timestamp = new Date().getTime()
      const a = appid + 'APPID' + secret + 'SECRET' + timestamp
      const sign = commonMethod.sha1(appid + 'APPID' + secret + 'SECRET' + timestamp)
      const token = sign + '.' + timestamp + '.' + version
      let promise = new Promise(function(resolve, reject) {
            wx.request({
                  url: url,
                  data: params,
                  header: {
                        'X-Token-With': token,
                        'Authorization': `Miinno ${wx.getStorageSync('access_token')}`
                  },
                  method: method || 'GET',
                  success: function(res) {
                        //     app.globalData.netWorkData = res.data
                        resolve(res);
                        console.log(res)
                        if (res.data.error) {

                              wx.showModal({
                                    title: '提示',
                                    content: res.data.error.message,
                                    success: function(res) {
                                          if (res.confirm) {

                                          } else if (res.cancel) {}
                                    }
                              })
                        }
                  }
            })
      });
      return promise
}



module.exports = {
      request: request,
}