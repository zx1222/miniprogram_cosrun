// pages/user/userInfoView/index.js
const app = getApp()
import * as http from '../../../utils/promise.js'

Page({

      /**
       * 页面的初始数据
       */
      data: {
            // 通知类型 是否为未审核通过通知
            notice_type: '1',
            id: '',
            item: {},
            iphone_type:'',
            activity_id:'',
            run_id:''
      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function(options) {
            this.setData({
                  id: options.id,
                  iphone_type: app.globalData.iphone_type,
            })
            const data = {
                  id: options.id
            }
            const url = `${app.globalData.baseUrl}/person/notice-detail`;
            http.request(url, data).then((res) => {
                  this.setData({
                        item: res.data,
                        activity_id: res.data.activity.activity_id,
                        run_id: res.data.notice.run_id
                  })
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

      /**
       * 用户点击右上角分享
       */
      onShareAppMessage: function (res) {
            if (res.from === 'button') {

            }
            return {
                  title: 'COSRUN幻装跑',
                  path: '/pages/home/index',
                  imageUrl: '../../../assets/images/share-cover.jpg'
            }
      }
})