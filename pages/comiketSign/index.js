//index.js
//获取应用实例
const app = getApp()
import * as http from '../../utils/promise.js'

Page({
      data: {
            // 1男2女
            gender: 0,
            comico_name: {
                  value: '',
                  valid: true
            },
            comico_phone: {
                  value: '',
                  valid: true
            },
            is_sign: false,
            notice_content:'',
            activity_id:''
      },
      //事件处理函数
      bindViewTap: function() {
            wx.navigateTo({
                  url: '../logs/logs'
            })
      },
      onLoad: function() {},
      onShow:function(){
            this.setData({
                  notice_content:app.globalData.rules[0],
                  activity_id: app.globalData.activity_id
            })
      },
      selectGender: function(e) {
            this.setData({
                  gender: e.currentTarget.dataset.id
            })
      },
      submit: function(e) {
            const url = `${app.globalData.baseUrl}/comico/enroll`
            let data = e.detail.value
            data = Object.assign(data, {
                  comico_sex: this.data.gender,
                  activity_id: this.data.activity_id
            })
          
            this.validForm(data)
            if (this.data.flag) {
                  http.request(url, data, 'POST').then((res) => {
                        if (res.data.id ) {
                              this.setData({
                                    is_sign: true
                              })
                              // let sign_info = wx.getStorageSync('sign_info')
                              // sign_info.sign_list[app.globalData.activity_index].count = parseInt(sign_info.sign_list[app.globalData.activity_index].count) + 1
                              // wx.setStorageSync('sign_info', sign_info)
                              // app.globalData.user_sign_count = wx.getStorageSync('sign_info').sign_list[app.globalData.activity_index].count
                        }
                  })
            }
      },
      validForm: function(data) {
            var reg_phone = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
            if (data.comico_sex==0){
                  wx.showModal({
                        title: '提示',
                        content: '请选择性别',
                  })
                  this.setData({
                        flag: false
                  })
            }
            if (data.comico_name == '') {
                  this.setData({
                        comico_name: {
                              valid: false,
                              name: ''
                        },
                        flag: false
                  })
            }
            if (!reg_phone.test(data.comico_phone)) {
                  this.setData({
                        comico_phone: {
                              valid: false,
                              value: ''
                        },
                        flag: false
                  })
            }
            if (data.comico_name != '' && reg_phone.test(data.comico_phone) && data.comico_sex!=0) {
                  this.setData({
                        flag: true
                  })
            }
      },
      backhome:function(){
            wx.navigateBack({
                  delta: 1
            })
      },
      onShareAppMessage: function (res) {
            if (res.from === 'button') {
            }
            return {
                  title: 'COSRUN幻装跑',
                  path: '/pages/home/index',
                  imageUrl: '../../assets/images/share-cover.jpg'
            }
      }
})