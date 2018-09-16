// pages/runRules/index.js
const app = getApp()
Page({

      /**
       * 页面的初始数据
       */
      data: {
            activity_time: {},
            is_run_disabled:false,
            is_cos_disabled: false,
            is_sign_up:true,
            is_sign_end:false,
            is_activity_start:true,
            timenow:'',
            notice_content:'',
            is_true_unpay_order:2
      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function(options) {
            const data = {
                  activity_sign_start: this.formatDate(app.globalData.activity_time.activity_sign_start),
                  activity_sign_end: this.formatDate(app.globalData.activity_time.activity_sign_end),
                  run_activity_start: this.formatDate(app.globalData.activity_time.run_activity_start),
            }
            this.setData({
                  timenow : Date.parse(new Date())/1000,
                  activity_time: data,
                  is_true_unpay_order:app.globalData.is_true_unpay_order
            })
            if (app.globalData.activity_time.activity_sign_start > this.data.timenow ){
                  this.setData({
                        is_sign_up: false,
                        is_sign_end: true,
                        is_activity_start: false
                  })
            }
            if (app.globalData.activity_time.activity_sign_end > this.data.timenow && this.data.timenow >=app.globalData.activity_time.activity_sign_start) {
                  this.setData({
                        is_sign_up: true,
                        is_sign_end: true,
                        is_activity_start: false
                  })
            }
            if (app.globalData.activity_time.activity_sign_end <=this.data.timenow) {
                  this.setData({
                        is_sign_up: false,
                        is_sign_end: true,
                        is_activity_start: true
                  })
            }
            const project = app.globalData.project
            if (project.indexOf('2') != -1){
                  this.setData({
                        is_run_disabled:true
                  })
            }
            else{
                  this.setData({
                        is_run_disabled: false
                  })
            }

            if (project.indexOf('4') != -1 || project.indexOf('2') == -1) {
                  this.setData({
                        is_cos_disabled: true
                  })
            }
            this.setData({
                  notice_content: app.globalData.rules[8]
            })
      },
      turnToUploads:function(e){
            if (!e.currentTarget.dataset.disabled) {
                  wx.redirectTo({
                        url: '/pages/uploads/index',
                  })
            }
      },
      turnToSIgn: function (e) {
            if (!e.currentTarget.dataset.disabled){
                  wx.redirectTo({
                        url: '/pages/runSign/index',
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
      formatDate: function(time) {
            const date = new Date(time * 1000);
            let year = date.getFullYear(),
                  month = date.getMonth() + 1, //月份是从0开始的
                  day = date.getDate(),
                  hour = date.getHours(),
                  min = date.getMinutes(),
                  sec = date.getSeconds();

            const newTime = year + '/' +
                  month + '/' +
                  day;
            return newTime;
      },

      /**
       * 用户点击右上角分享
       */
      onShareAppMessage: function() {

      }
})