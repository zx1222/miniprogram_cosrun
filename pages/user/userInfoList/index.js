// pages/user/userInfoList/index.js
const app = getApp()
import * as http from '../../../utils/promise.js'

Page({

      /**
       * 页面的初始数据
       */
      data: {
            activity_id: '',
            iphone_type: app.globalData.iphone_type,
            type: '',
            slideUp: true,
            index: '',
            list: [],
            loading: true,
            notice_content: '',
            invite_counts: '0',
            poster: '',
            qrCodeList: [],
            is_qrcode_open: false,
            qrCode: ''
      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function(options) {
            console.log(options)
            this.setData({
                  type: options.type,
                  activity_id: app.globalData.activity_id
            })

            if (this.data.type == '1') {
                  wx.setNavigationBarTitle({
                        title: 'COS RUN次元趴报名信息'
                  })
            }
            if (this.data.type == '2') {
                  wx.setNavigationBarTitle({
                        title: 'COS RUN幻装跑报名信息'
                  })
            }
            if (this.data.type == '3') {
                  wx.setNavigationBarTitle({
                        title: 'COS RUN次元趴报名信息'
                  })
            }
            if (this.data.type == '4') {
                  wx.setNavigationBarTitle({
                        title: '通知消息'
                  })
            }
            if (this.data.type == '5') {
                  wx.setNavigationBarTitle({
                        title: '邀请返现'
                  })
            }
            if (this.data.type == '6') {
                  wx.setNavigationBarTitle({
                        title: '常见问题'
                  })
            }
            if (this.data.type == '7') {
                  wx.setNavigationBarTitle({
                        title: '号码布'
                  })
            }
      },

      /**
       * 生命周期函数--监听页面初次渲染完成
       */
      onReady: function() {

      },

      /**
       * 生命周期函数--监听页面显示
       */
      onShow: function() {
            this.setData({
                  iphone_type: app.globalData.iphone_type,
            })
            const data = {
                  type: this.data.type
            }
            if (this.data.type == '1') {
                  this.getList(data)
            }
            if (this.data.type == '2') {
                  this.getList(data)
            }
            if (this.data.type == '3') {
                  this.getList(data)
            }
            if (this.data.type == '4') {
                  const url = `${app.globalData.baseUrl}/person/notice`;
                  http.request(url).then((res) => {
                        this.setData({
                              list: res.data,
                              loading: false
                        })
                  })
            }
            if (this.data.type == '5') {
                  const url = `${app.globalData.baseUrl}/person/invitation`;
                  http.request(url).then((res) => {
                        if (res.data.invitation_count) {
                              this.setData({
                                    invite_counts: res.data.invitation_count,
                                    poster: res.data.run_poster,
                                    loading: false
                              })
                        } else {
                              this.setData({
                                    loading: false
                              })
                        }
                  })
            }
            if (this.data.type == '6') {
                  const url = `${app.globalData.baseUrl}/person/question`;

                  http.request(url).then((res) => {
                        this.setData({
                              list: this.formatList(res.data),
                              loading: false
                        })
                  })
            }
            if (this.data.type == '7') {
                  const url = `${app.globalData.baseUrl}/person/check-in`;
                  this.setData({
                        loading: false
                  })
            }
      },

      /**
       * 生命周期函数--监听页面隐藏
       */
      onHide: function() {

      },

      /**
       * 生命周期函数--监听页面卸载
       */
      onUnload: function() {

      },
      getList: function(data) {
            const url = `${app.globalData.baseUrl}/person/info`;
            http.request(url, data).then((res) => {
                  this.setData({
                        list: this.formatData(res.data),
                        loading: false
                  })
            })
      },
      downloadFile_rules: function() {
            const downloadTask = wx.downloadFile({
                  url: 'https://cosrun.sindcorp.net/cosrun_img/COS RUN Race.docx', //仅为示例，并非真实的资源
                  success: function(res) {
                        console.log(res)
                        if (res.statusCode === 200) {
                              wx.saveFile({
                                    tempFilePath: res.tempFilePath,
                                    success: function(res) {
                                          var savedFilePath = res.savedFilePath
                                          wx.openDocument({
                                                filePath: savedFilePath,
                                                success: function(res) {
                                                      console.log('打开文档成功')
                                                }
                                          })
                                    }
                              })
                        }
                  }
            })
            downloadTask.onProgressUpdate((res) => {
                  console.log('下载进度', res.progress)
                  console.log('已经下载的数据长度', res.totalBytesWritten)
                  console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
            })
      },
      preview_greement: function () {
            wx.previewImage({
                  current: 'https://cosrun.sindcorp.net/cosrun_img/matchStatement.png', // 当前显示图片的http链接
                  urls: ['https://cosrun.sindcorp.net/cosrun_img/matchStatement.png']
            })
      },
      toggleSlide: function(e) {
            const index = e.currentTarget.dataset.index
            const list = this.data.list
            list[index].slideUp = !list[index].slideUp
            this.setData({
                  list: list
            })
      },
      formatList(list) {
            list.forEach(function(item, index) {
                  item.slideUp = true
            })
            return list
      },
      formatDate1: function(time) {
            const date = new Date(time * 1000);
            const year = date.getFullYear(),
                  month = date.getMonth() + 1, //月份是从0开始的
                  day = date.getDate(),
                  hour = date.getHours(),
                  min = date.getMinutes(),
                  sec = date.getSeconds();
            const newTime = year + '.' + month + '.' +
                  day;
            return newTime;
      },
      formatDate2: function(time) {
            const date = new Date(time * 1000);
            const year = date.getFullYear(),
                  month = date.getMonth() + 1, //月份是从0开始的
                  day = date.getDate(),
                  hour = date.getHours(),
                  min = date.getMinutes(),
                  sec = date.getSeconds();
            const newTime = month + '.' +
                  day;
            return newTime;
      },
      formatDate3: function(time) {
            const date = new Date(time * 1000);
            let year = date.getFullYear(),
                  month = date.getMonth() + 1, //月份是从0开始的
                  day = date.getDate(),
                  hour = date.getHours(),
                  min = date.getMinutes(),
                  sec = date.getSeconds();
            let flag = '上午'
            if (hour > 12) {
                  flag = '下午'
                  hour = hour - 12
            }
            if (min < 10) {
                  min = '0' + min
            }

            const newTime = year + '.' +
                  month + '.' +
                  day + flag + hour + ":" + min;
            return newTime;
      },
      formatDate4: function(time) {
            const date = new Date(time * 1000);
            let year = date.getFullYear(),
                  month = date.getMonth() + 1, //月份是从0开始的
                  day = date.getDate(),
                  hour = date.getHours(),
                  min = date.getMinutes(),
                  sec = date.getSeconds();
            if (min < 10) {
                  min = '0' + min
            }

            const newTime = hour + ":" + min;
            return newTime;
      },
      formatData: function(data) {
            let resData = data
            resData.forEach((item) => {
                  item.activity_start = this.formatDate1(item.activity_start)
                  item.activity_end = this.formatDate1(item.activity_end)
                  item.activity.run_activity_start = this.formatDate1(item.activity.run_activity_start)
                  item.activity.run_activity_end = this.formatDate2(item.activity.run_activity_end)
                  item.activity.activity_start = this.formatDate1(item.activity.activity_start)
                  item.activity.activity_end = this.formatDate2(item.activity.activity_end)
                  item.activity.run_check_start_time = this.formatDate3(item.activity.run_check_start_time)
                  item.activity.run_check_end_time = this.formatDate4(item.activity.run_check_end_time)
            })
            return resData
      },
      pay: function(e) {
            const index = e.currentTarget.dataset.index
            let url = `${app.globalData.baseUrl}/run/start-pay`
            const _this = this

            _this.setData({
                  is_open: false,
                  callback_success: true
            })
            const data = {
                  id: _this.data.list[index].run_id,
                  run_type: _this.data.list[index].run_type,
                  activity_id: _this.data.list[index].activity_id
            }

            http.request(url, data, 'POST').then((res) => {
                  const data = res.data
                  wx.requestPayment({
                        'timeStamp': data.timeStamp,
                        'nonceStr': data.nonceStr,
                        'package': data.package,
                        'signType': 'MD5',
                        'paySign': data.paySign,
                        'success': function(res) {
                              _this.setData({
                                    is_open: false,
                                    callback_success: true
                              })

                              if (_this.data.is_cash == '1') {
                                    _this.getPoster();
                              }
                              wx.showToast({
                                    title: '支付成功',
                                    icon: 'success',
                                    duration: 1800
                              })
                              setTimeout(function() {
                                    _this.setData({
                                          pay_success: true
                                    })
                              }, 1800)
                        },
                        'fail': function(res) {
                              wx.showToast({
                                    title: '支付失败',
                                    icon: 'none',
                                    duration: 2000
                              })
                        }
                  })
            })
      },
      turnToCos: function(e) {
            const index = e.currentTarget.dataset.index
            let url = `${app.globalData.baseUrl}/run/start-pay`
            wx.redirectTo({
                  url: `/pages/uploads/index?id=${this.data.list[index].run_id}&&activity_id=${this.data.list[index].activity.activity_id}&&from=list`,
            })
      },
      turnToRules:function(){
            wx.redirectTo({
                  url: '/pages/runRules/index',
            })
      },
      get_comico_code: function(e) {
            const index = e.currentTarget.dataset.index
            console.log(index)
            const url = `${app.globalData.baseUrl}/person/diffuse-detail`;
            const data = {
                  id: this.data.list[index].comico_id
            }
            http.request(url, data).then((res) => {
                  this.setData({
                        is_qrcode_open: true,
                        qrCode: res.data.code_url
                  })
                  console.log(res)
            })
      },
      toggleQrcodePopup: function() {
            this.setData({
                  is_qrcode_open: false,
            })
      },
      onShareAppMessage: function(res) {
            if (res.from === 'button') {

            }
            return {
                  title: 'COSRUN幻装跑',
                  path: '/pages/home/index',
                  imageUrl: '../../../assets/images/share-cover.jpg'
            }
      }
})