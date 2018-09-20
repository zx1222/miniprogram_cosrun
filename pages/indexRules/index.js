// pages/indexRules/index.js
const app = getApp()
const device = wx.getSystemInfoSync()
import * as http from '../../utils/promise.js'
const height = device.windowHeight
Page({

      /**
       * 页面的初始数据
       */
      data: {
            banner_index: '',
            banner: {},
            activity_name:'',
            scrollHeight: height,
            is_comico_disabled: false,
            is_run_disabled: false,
            is_perform_disabled: false,

      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function(options) {
            this.setData({
                  banner: app.globalData.banners[options.index],
                  activity_name: app.globalData.activity_name,
                  banner_index: options.index
            })
            wx.setNavigationBarTitle({
                  title: `COS RUN${this.data.activity_name}`
            })
            this.setData({
                  is_comico_disabled: app.globalData.is_comico_disabled,
                  is_run_disabled: app.globalData.is_run_disabled,
                  is_perform_disabled: app.globalData.is_perform_disabled,
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
      backhome:function(){
            wx.navigateBack({
                  delta: 1
            })
      },
      scrollNoticeContent: function (e) {
            if (e.detail.scrollHeight - this.data.scrollHeight * 0.34 <= e.detail.scrollTop + 30) {
                  this.setData({
                        read: true
                  })
            }
      },
      /**
       * 用户点击右上角分享
       */
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