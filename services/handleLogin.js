// 登录
const app = getApp()
import * as commonMethod from '../assets/js/common.js'

export function checkSession() {
      // 先验证本应用 session，没有的话要求登录
      let access_token = wx.getStorageSync('access_token');
      if (!access_token) {
            console.log('session 已过期');
            return Promise.reject(new Error('No access_token'));
      } else {
            console.log('session 未过期');
            wx.setStorageSync('isReady', true)
      }

      return new Promise((resolve, reject) => {
            wx.checkSession({
                  success() {
                        resolve(access_token);
                  },
                  fail() {
                        wx.setStorageSync('isReady', false)
                        reject('Weixin Session expired');
                  },
            });
      });
}

export function login() {
      return new Promise((resolve, reject) => {
                  wx.login({
                        success(res) {
                              resolve(res);
                              wx.setStorageSync('access_token', res.data)
                        },
                        fail(error) {
                              wx.removeStorage({
                                    key: 'access_token'
                              });
                              reject(error);
                        },
                  });
            })
            .then(res => {
                  if (!res || !res.code) {
                        throw new Error('用户登录失败。' + res.errMsg);
                  } else {
                        const params = {
                              appid: 'wxdc41a6ac2e1bcd06',
                              grant_type: 'authorization_code',
                              js_code: res.code,
                              secret: '85369ef07a115a9a2adea00534d30316'
                        }
                        return loginServer(params)
                              .then((res) => {
                                    console.log(res)
                                    console.log('login server success')
                                    wx.setStorageSync('access_token', res.data.member);
                                    wx.setStorageSync('is_first', res.data.is_first);
                                    console.log(wx.getStorageSync('is_first'))
                              })
                  }
            })
}

export function loginServer(params) {
      const appid = 'miinno.com'
      const secret = '123456'
      const version = 'api/v1'
      const timestamp = new Date().getTime()
      const a = appid + 'APPID' + secret + 'SECRET' + timestamp
      const sign = commonMethod.sha1(appid + 'APPID' + secret + 'SECRET' + timestamp)
      const token = sign + '.' + timestamp + '.' + version

      let promise = new Promise(function(resolve, reject) {
            wx.request({
                  //  url:'http://192.168.0.189/20180507/cn_acg-plus_cosrun/web/v1/login/login',
                  url: `https://cosrun.sindcorp.net/v1/login/login`,
                  data: params,
                  header: {
                        'X-Token-With': token,
                  },
                  method: 'POST',
                  success: function(res) {
                        resolve(res);
                  },
                  fail: function(err) {
                        reject(err);
                  }
            })
      })
      return promise
}
