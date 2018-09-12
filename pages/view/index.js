// pages/view/index.js
const app = getApp()

const device = wx.getSystemInfoSync()
import * as http from '../../utils/promise.js'
const height = device.windowHeight

Page({

      /**
       * 页面的初始数据
       */
      data: {
            activity_id:'',
            item: {},
            cosrun_id: '',
            is_vote: false,
            is_yet:false,
            iphone_type:'',
            loading:true,
            is_open:false,
            notice_content:'',
            scrollHeight: height,
            is_share:false
      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function(options) {
            if (options.notice_content) {
                  this.setData({
                        notice_content: options.notice_content
                  })
            }
            else{
                  this.setData({
                        notice_content: app.globalData.rules[3],
                  })
            }
            this.setData({
                  cosrun_id: options.id,
                  iphone_type: app.globalData.iphone_type
            })
            if (options.activity_id){
                  this.setData({
                        activity_id: options.activity_id
                  })
            }
            else{
                  this.setData({
                        activity_id: app.globalData.activity_id
                  })
            }
            if(options.is_share){
                  this.setData({
                        is_share:true
                  })
            }
       

      },

      /**
       * 生命周期函数--监听页面初次渲染完成
       */
      onReady: function() {},

      /**
       * 生命周期函数--监听页面显示
       */
      onShow: function() {
         this.getData();
            wx.showLoading({
                  title: '加载中',
            })
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
      togglePopup: function () {
            this.setData({
                  is_open: !this.data.is_open
            })
      },
      vote: function() {
            let url = `${app.globalData.baseUrl}/vote/vote`
            const data = {
                  id: this.data.cosrun_id,
                  activity_id: this.data.activity_id
            }
            http.request(url, data, 'POST').then((res) => {
                  if (res.data.id) {
                        this.setData({
                              is_vote: true
                        })
                        this.getData();
                        setTimeout(() => {
                              this.setData({
                                    is_vote: false
                              })
                        }, 1700)
                  }
                  else{
                        // this.setData({
                        //       is_yet: true
                        // })
                        // setTimeout(() => {
                        //       this.setData({
                        //             is_yet: false
                        //       })
                        // }, 1700)
                  }
            })
      },
      getData:function(){
            let url = `${app.globalData.baseUrl}/vote/detail`
            const data = {
                  id: this.data.cosrun_id
            }
            http.request(url, data).then((res) => {
                  this.setData({
                        item: res.data,
                        loading:false
                  })
                  wx.hideLoading();
            })
      },

      /**
       * 用户点击右上角分享
       */
      onShareAppMessage: function (res) {
            if (res.from === 'button') {

            }
            return {
                  title: 'COSRUN幻装跑',
                  path: `/pages/view/index?id=${this.data.cosrun_id}&&activity_id=${this.data.activity_id}&&notice_content=${this.data.notice_content}&&is_share=1`,
                  imageUrl: '../../assets/images/share-cover.jpg'
            }
      }
})