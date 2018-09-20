//index.js
//获取应用实例
const app = getApp()
const device = wx.getSystemInfoSync()
import * as http from '../../utils/promise.js'
const height = device.windowHeight

Page({
      data: {
            activity_id: '',
            read: false,
            notice_content_perform: '',
            noticeHeight: height * 0.54 * 0.57,
            perform_show: {
                  value: '',
                  valid: true
            },
            perform: {
                  dataArr: ['宅舞', '舞台剧', '走秀'],
                  index: 0,
                  selected: false,
                  valid: false
            },
            performer_duration: {
                  dataArr: ['5分钟', '8分钟', '10分钟'],
                  index: 0,
                  selected: false,
                  valid: false
            },
            perform_player: {
                  value: '',
                  valid: true
            },
            perform_contact: {
                  value: '',
                  valid: true
            },
            performer_performers: {
                  value: '',
                  valid: true
            },
            performer_team: {
                  value: '',
                  valid: true
            },
            performer_remark: '',
            is_open: false,
            is_perform_open: true,
            flag: false,
            notice_content: '',
            checked: false
      },
      //事件处理函数
      bindViewTap: function() {
            wx.navigateTo({
                  url: '../logs/logs'
            })
      },
      onLoad: function() {},
      onShow: function() {
            this.setData({
                  notice_content: app.globalData.rules[2],
                  notice_content_perform: app.globalData.rules[5],
                  activity_id: app.globalData.activity_id
            })
      },
      bindPerformChange: function(e) {
            this.setData({
                  perform: {
                        dataArr: this.data.perform.dataArr,
                        index: e.detail.value,
                        selected: true,
                        valid: true
                  },
            })
      },
      bindperformerDurationChange: function(e) {
            this.setData({
                  performer_duration: {
                        dataArr: this.data.performer_duration.dataArr,
                        index: e.detail.value,
                        selected: true,
                        valid: true
                  },
            })
      },
      checkboxChange: function (e) {
            if (e.detail.value.length != 0) {
                  this.setData({
                        checked: true
                  })
            }
            else {
                  this.setData({
                        checked: false
                  })
            }
      },
      submit: function(e) {
            let url = `${app.globalData.baseUrl}/perform/enroll`
            var data = e.detail.value
            data.perform_type = parseInt(data.perform_type) + 1
          
            data = Object.assign({
                  performer_duration: parseInt(this.data.performer_duration.index)+1,
                  activity_id: this.data.activity_id
            }, data)
            this.validForm(data)

            if (this.data.flag) {
                  http.request(url, data, 'POST').then((res) => {
                        if (res.data.id) {
                              this.setData({
                                    is_open: true
                              })

                              // let sign_info = wx.getStorageSync('sign_info')
                              // sign_info.sign_list[app.globalData.activity_index].count = sign_info.sign_list[app.globalData.activity_index].count + 1
                              // wx.setStorageSync('sign_info', sign_info)
                              // app.globalData.user_sign_count = wx.getStorageSync('sign_info').sign_list[app.globalData.activity_index].count
                        }
                  })
            }
      },
      validForm: function(data) {
            var reg_contact = /^[1][3,4,5,7,8][0-9]{9}$/;
            if (data.perform_show == '') {
                  this.setData({
                        perform_show: {
                              valid: false,
                              name: ''
                        },
                        flag: false
                  })
            }
            if (!this.data.perform.selected) {
                  this.setData({
                        perform: {
                              dataArr: this.data.perform.dataArr,
                              index: 0,
                              selected: false,
                              valid: true
                        },
                        flag: false
                  })
            }
            if (!this.data.performer_duration.selected) {
                  this.setData({
                        performer_duration: {
                              dataArr: this.data.performer_duration.dataArr,
                              index: 0,
                              selected: false,
                              valid: true
                        },
                        flag: false
                  })
            }
            if (data.perform_player == '') {
                  this.setData({
                        perform_player: {
                              valid: false,
                              value: ''
                        },
                        flag: false
                  })

            }
            if (!reg_contact.test(data.perform_phone)) {
                  this.setData({
                        perform_contact: {
                              valid: false,
                              value: ''
                        },
                        flag: false
                  })
            }
            if (data.performer_performers == '' || !/^\d+$/.test(data.performer_performers)) {
                  this.setData({
                        performer_performers: {
                              valid: false,
                              value: ''
                        },
                        flag: false
                  })
            }
            if (data.performer_team == '') {
                  this.setData({
                        performer_team: {
                              valid: false,
                              value: ''
                        },
                        flag: false
                  })
            }
            if (data.perform_show != '' && data.perform_player != '' && reg_contact.test(data.perform_phone) && data.performer_performers != '' && data.performer_team != '' && this.data.perform.selected && this.data.performer_duration.selected) {
                  this.setData({
                        flag: true
                  })
            }
      },
      togglePerformPopup: function() {
            if (this.data.checked) {
                  this.setData({
                        is_perform_open: false
                  })
            }
      },
      backhome: function() {
            wx.navigateBack({
                  delta: 1
            })
      },
      onShareAppMessage: function(res) {
            if (res.from === 'button') {

            }
            return {
                  title: 'COSRUN幻装跑',
                  path: '/pages/home/index',
                  imageUrl: '../../assets/images/share-cover.jpg'
            }
      }
})