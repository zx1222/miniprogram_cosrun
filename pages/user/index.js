// pages/user/index.js
const app = getApp()
import * as http from '../../utils/promise.js'

Page({

      /**
       * 页面的初始数据
       */
      data: {
            iphone_type:'',
            count: '0',
            diffuse_counts:0,
            perform_counts:0,
            run_counts:0,
            is_examine: 1,
            is_cash:'2',
            activity_id:'',
            from:'',
      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function(options) {
            console.log(options)
            if (options.from){
                  this.setData({
                        from: options.from
                  })
            }
      },

      /**
       * 生命周期函数--监听页面初次渲染完成
       */
      onReady: function() {
            this.setData({
                  iphone_type: app.globalData.iphone_type
            })
      },

      /**
       * 生命周期函数--监听页面显示
       */
      onShow: function() {
            this.setData({
                  is_cash:app.globalData.is_cash,
                  activity_id: app.globalData.activity_id,
            })
            const url = `${app.globalData.baseUrl}/person/notice-counts`
            http.request(url).then((res) => {
                  this.setData({
                        count: res.data.counts,
                        diffuse_counts: res.data.diffuse_counts,
                        perform_counts: res.data.perform_counts,
                        run_counts: res.data.run_counts
                  })
            })
      },
      backhome:function(){
            console.log(this.data.from)
            if (this.data.from!=''){
                  wx.redirectTo({
                        url: '/pages/home/index',
                  })
            }
            else{
                  wx.redirectTo({
                        url: '/pages/index/index',
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
                  imageUrl: '../../assets/images/share-cover.jpg'
            }
      }
})