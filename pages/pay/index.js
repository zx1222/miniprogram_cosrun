// pages/view/index.js
const app = getApp()
import * as http from '../../utils/promise.js'

Page({

      /**
       * 页面的初始数据
       */
      data: {
            run_file_name: '../../assets/images/photo-default.png',
            poster: '',
            pay_success: false,
            is_cash: '2',
            id: '',
            run_type:'',
            activity_id: '',
            has_photo:false,
            // 是否提示
            is_open:true,
            callback_success:false
      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function(options) {
            this.setData({
                  is_cash: app.globalData.is_cash,
                  id: options.id,
                  activity_id: app.globalData.activity_id,
                  run_type:options.run_type
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
            // setTimeout(()=>{
            //       if (this.data.is_open&& !this.data.callback_success) {
            //             wx.showModal({
            //                   title: '提示',
            //                   content: '请保证填写的个人资料真实有效，一经填写，不得再次修改',
            //             })
            //       }
            // },400)
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

      //保存图片
      saveImg: function(e) {　　
            var _this = this;　　
            wx.getSetting({
                  success: (res) => {
                        wx.authorize({
                              scope: 'scope.writePhotosAlbum',
                              success: (res) => {
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
            //图片地址
            wx.downloadFile({
                  url: imgUrl,
                  success: function(res) {
                        // 下载成功后再保存到本地
                        wx.saveImageToPhotosAlbum({
                              //返回的临时文件路径，下载后的文件会存储到一个临时文件
                              filePath: res.tempFilePath,
                              success: function(res) {
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
                  }
            })
      },

      pay: function() {
            let url = `${app.globalData.baseUrl}/run/start-pay`
            const _this = this
            http.request(url, {
                  id: this.data.id,
                  run_type:this.data.run_type,
                  activity_id: this.data.activity_id
            }, 'POST').then((res) => {
                  const data = res.data
                  wx.requestPayment({
                        'timeStamp': data.timeStamp,
                        'nonceStr': data.nonceStr,
                        'package': data.package,
                        'signType': 'MD5',
                        'paySign': data.paySign,
                        'success': function(res) {
                              _this.setData({
                                    is_open:false,
                                    callback_success:true
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
                              // let sign_info = wx.getStorageSync('sign_info')
                              // sign_info.sign_list[app.globalData.activity_index].count = parseInt(sign_info.sign_list[app.globalData.activity_index].count) + 1
                              // wx.setStorageSync('sign_info', sign_info)
                              // app.globalData.user_sign_count = wx.getStorageSync('sign_info').sign_list[app.globalData.activity_index].count
                        },
                        'fail': function(res) {
                              wx.showToast({
                                    title: '支付失败',
                                    icon: 'none',
                                    duration: 1600
                              })
                            setTimeout(()=> {
                                  wx.navigateBack({
                                                delta: 1
                                          })
                            },1600)
                        }
                  })
            })
      },
      getPoster: function() {
            const url = `${app.globalData.baseUrl}/run/poster`
            const data = {
                  id: this.data.id,
            }
            http.request(url, data).then((res) => {
                  this.setData({
                        poster: res.data
                  })
            })
      },
      /**
       * 用户点击右上角分享
       */
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