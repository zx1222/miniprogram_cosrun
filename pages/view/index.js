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
            activity_id: '',
            item: {},
            cosrun_id: '',
            is_vote: false,
            is_yet: false,
            iphone_type: '',
            loading: true,
            is_open: false,
            notice_content: '',
            scrollHeight: height,
            is_share: false,
            poster: ''
      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function(options) {
            if (options.notice_content) {
                  this.setData({
                        notice_content: options.notice_content
                  })
            } else {
                  this.setData({
                        notice_content: app.globalData.rules[3],
                  })
            }
            this.setData({
                  cosrun_id: options.id,
                  iphone_type: app.globalData.iphone_type
            })
            if (options.activity_id) {
                  this.setData({
                        activity_id: options.activity_id
                  })
            } else {
                  this.setData({
                        activity_id: app.globalData.activity_id
                  })
            }
            if (options.is_share) {
                  this.setData({
                        is_share: true
                  })
            }
      },


      //保存图片
      saveImg: function(e) {
            var _this = this;
            wx.getSetting({
                  success: (res) => {
                        console.log(res.authSetting['scope.writePhotosAlbum'])
                        wx.authorize({
                              scope: 'scope.writePhotosAlbum',
                              success: (res) => {
                                    console.log("授权成功");
                                    this.downloadFile()
                              },
                              fail: function() {
                                    wx.openSetting({
                                          success: (res) => {
                                                if (!res.authSetting["scope.writePhotosAlbum"] || !res.authSetting["scope.writePhotosAlbum"]) {}
                                          }
                                    })
                              }
                        })
                  }
            })
      },

      downloadFile: function() {
            var imgUrl = this.data.poster;
            console.log(imgUrl)
            //图片地址
            wx.downloadFile({
                  url: imgUrl,
                  success: function(res) {
                        console.log('s')
                        // 下载成功后再保存到本地
                        wx.saveImageToPhotosAlbum({
                              //返回的临时文件路径，下载后的文件会存储到一个临时文件
                              filePath: res.tempFilePath,
                              success: function(res) {
                                    console.log('aa')
                                    wx.showModal({
                                          title: '提示',
                                          content: '成功保存图片',
                                          success: function(res) {
                                                if (res.confirm) {

                                                } else if (res.cancel) {}
                                          }
                                    })
                              }
                        })
                  },
                  fail: function(err) {
                        console.log(err)
                  }
            })
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
      togglePopup: function() {
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
                  } else {
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
      getData: function() {
            let url = `${app.globalData.baseUrl}/vote/detail`
            const data = {
                  id: this.data.cosrun_id
            }
            http.request(url, data).then((res) => {
                  this.setData({
                        item: this.formatData(res.data),
                        loading: false,
                        poster: res.data.voteUser.run_share_poster
                  })
                  wx.hideLoading();
            })
      },
      formatData:function(data){
            let resultData=data
            if (resultData.voteUser.member_id<10){
                  resultData.voteUser.member_id = '00' + resultData.voteUser.member_id
            }
            if (resultData.voteUser.member_id >= 10 && resultData.voteUser.member_id < 100){
                  resultData.voteUser.member_id = '0' + resultData.voteUser.member_id
            }
            return resultData
      },

      /**
       * 用户点击右上角分享
       */
      onShareAppMessage: function(res) {
            if (res.from === 'button') {

            }
            return {
                  title: 'COSRUN幻装跑',
                  path: `/pages/view/index?id=${this.data.cosrun_id}&&activity_id=${this.data.activity_id}&&notice_content=${this.data.notice_content}&&is_share=1`,
                  imageUrl: '../../assets/images/share-cover.jpg'
            }
      }
})