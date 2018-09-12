import * as commonMethod from '../assets/js/common.js'

function pay(){
      wx.requestPayment({
            'timeStamp': new Date().getTime(),
            'nonceStr': commonMethod.randomString(16),
            'package': '',
            'signType': 'MD5',
            'paySign': '',
            'success': function (res) {
            },
            'fail': function (res) {
            }
      })
}