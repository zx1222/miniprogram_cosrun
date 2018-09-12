// pages/home/index.js
const app = getApp()
import * as http from '../../utils/promise.js'
import getSystemInfo from '../../utils/getSystemInfo.js'

Page({

      /**
       * 页面的初始数据
       */
      data: {
            systemInfo: {},
            is_open: false,
            btn_home1_id: '',
            btn_home2_id: '',
            activityList: [],
            activity_end: '',
            is_unpay_order: '2',
            iphone_type: '',
      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function(options) {
            this.setData({
                  activity_end: this.formatDate2(this.data.activity_end)
            })
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
            if (wx.getStorageSync('isReady')) {
                  this.initActivity();

            } else {
                  wx.setStorageSync('isReady', true)
                  app.readyCallback = () => {
                        this.initActivity();
                  };
            }

            const is_sign = wx.getStorageSync('is_sign')

            // 查询用户是否授权
            wx.getSetting({
                  success: (res) => {
                        if (res.authSetting['scope.userInfo']) {
                              this.setData({
                                    is_open: false
                              })
                        } else {
                              this.setData({
                                    is_open: true
                              })
                        }
                  }
            })

            // 查询手机型号
            getSystemInfo().then((res) => {
                  if (res.screenHeight == 812 && res.pixelRatio == 3) {
                        app.globalData.iphone_type = 'iPhone X'
                  }
                  if (res.screenWidth == 375 && res.screenHeight == 667 && res.pixelRatio == 2) {
                        app.globalData.iphone_type = 'iPhone 6'
                  }
                  if (res.screenWidth == 320 && res.screenHeight == 568 && res.pixelRatio == 2) {
                        app.globalData.iphone_type = 'iPhone 5'
                  }

                  this.setData({
                        systemInfo: res,
                        iphone_type: app.globalData.iphone_type
                  })
            })
      },
      initActivity: function() {
            let url = `${app.globalData.baseUrl}/activity/lists`
            http.request(url).then((res) => {
                  this.formatData(res.data.activity)
                  app.globalData.is_unpay_order = res.data.is_unpay_order
                  this.setData({
                        activityList: res.data.activity,
                        is_unpay_order: app.globalData.is_unpay_order
                  })
                  if (this.data.is_unpay_order == '1') {
                        wx.showModal({
                              title: '提示',
                              content: '您有待支付订单 请前去支付',
                              success: (res)=> {
                                    const url = `${app.globalData.baseUrl}/person/tips-pay`
                                    const data={
                                          type:1
                                    }
                                    if (res.confirm) {
                                          http.request(url, data).then((res) => {
                                          })
                                          wx.navigateTo({
                                                url: '/pages/user/userInfoList/index?type=2',
                                          })
                                    } else if (res.cancel) {
                                          http.request(url, data).then((res) => {
                                          })
                                    }
                              }
                        })
                  }
            })
      },
      // 获取用户信息
      onGotUserInfo: function(e) {
            const url = `${app.globalData.baseUrl}/person/user-info`
            const data = Object.assign(e.detail, {
                  appid: 'wxdc41a6ac2e1bcd06'
            })
            if (data.errMsg == 'getUserInfo:ok') {
                  wx.setStorageSync('getUserInfo', true);
                  this.setData({
                        is_open: !this.data.is_open
                  })
                  http.request(url, data, 'POST').then((res) => {
                        if (res.data.id) {
                              wx.showToast({
                                    title: '授权成功',
                                    icon: 'success',
                                    duration: 1400
                              })
                        }
                  })
            }
      },

      turnToIndex: function(e) {
            if (!e.currentTarget.dataset.disabled) {
                  wx.navigateTo({
                        url: `/pages/index/index?id=${e.currentTarget.dataset.id}&&name=${e.currentTarget.dataset.name}`,
                  })
            }
      },

      formatDate1: function(time) {
            const date = new Date(time * 1000);
            const year = date.getFullYear(),
                  month = date.getMonth() + 1, //月份是从0开始的
                  day = date.getDate(),
                  hour = date.getHours(),
                  min = date.getMinutes(),
                  sec = date.getSeconds();
            const newTime1 = month + '.' +
                  day
            return newTime1;
      },
      formatDate2: function(time) {
            const date = new Date(time * 1000);
            const year = date.getFullYear(),
                  month = date.getMonth() + 1, //月份是从0开始的
                  day = date.getDate(),
                  hour = date.getHours(),
                  min = date.getMinutes(),
                  sec = date.getSeconds();
            const newTime = month + '月' +
                  day + '日';
            return newTime;
      },
      formatData: function(data) {
            let resData = data
            resData.forEach((item) => {
                  item.activity_start = this.formatDate1(item.activity_start)
                  item.activity_end = this.formatDate1(item.activity_end)
                  item.activity_sign_start = this.formatDate2(item.activity_sign_start)
                  item.activity_sign_end = this.formatDate2(item.activity_sign_end)
            })
            return resData
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

      /**
       * 页面相关事件处理函数--监听用户下拉动作
       */
      onPullDownRefresh: function() {

      },

      /**
       * 页面上拉触底事件的处理函数
       */
      onReachBottom: function() {

      },


      /**
       * 用户点击右上角分享
       */
      onShareAppMessage: function() {
            if (res.from === 'button') {

            }
            return {
                  title: 'COSRUN幻装跑',
                  path: '/pages/home/index',
                  imageUrl: '../../assets/images/share-cover.jpg'
            }
      }
})