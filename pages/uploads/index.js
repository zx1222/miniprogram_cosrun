// pages/uploads/index.js
const app = getApp()
import * as http from '../../utils/promise.js'
import * as commonMethod from '../../assets/js/common.js'

const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 50

Page({

      /**
       * 页面的初始数据
       */
      data: {
            is_cosplay: 0,
            notice_content: '',
            src: '',
            id: '',
            from: '',
            activity_id: '',
            activity_name: '',
            notice_content_cos: '',
            run_file_name: '',
            scrollHeight: height,
      },
      upload() {
            const appid = 'miinno.com'
            const secret = '123456'
            const version = 'api/v1'
            const timestamp = new Date().getTime()
            const sign = commonMethod.sha1(appid + 'APPID' + secret + 'SECRET' + timestamp)
            const token = sign + '.' + timestamp + '.' + version
            wx.chooseImage({
                  count: 1, // 默认9
                  sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
                  sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                  success: (res) => {
                        const src = res.tempFilePaths[0]

                        // if (this.data.id != "") {id

                        //  获取到裁剪后的图片
                        wx.uploadFile({
                              url: `${app.globalData.baseUrl}/run/upload`,
                              //url:'http://192.168.0.189/repos/cn_acg-plus_cosrun/web/v1/run/upload',
                              filePath: src,
                              header: {
                                    'X-Token-With': token,
                                    'Authorization': `Miinno ${wx.getStorageSync('access_token')}`
                              },
                              name: 'file',
                              formData: {
                                    id: this.data.id,
                                    activity_id: this.data.activity_id
                              },
                              success: (res) => {
                                    const data = JSON.parse(res.data)
                                    this.setData({
                                          src: src,
                                          run_file_name: data.run_file_name
                                    })
                              },
                              fail: function(res) {
                                    wx.showToast({
                                          title: '上传失败',
                                          icon: 'none',
                                          duration: 1200
                                    })
                              }
                        })
                  }
            })
      },
      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function(options) {
            console.log(options)
            if (options.id) {
                  this.setData({
                        id: options.id
                  })
            }
            if (options.from) {
                  this.setData({
                        from: options.from,
                        is_cosplay: 1
                  })
            }
            if (options.activity_id) {
                  this.setData({
                        activity_id: options.activity_id
                  })
            } else {
                  this.setData({
                        activity_id: app.globalData.activity_id
                  })
            }

            wx.setNavigationBarTitle({
                  title: 'COS RUN幻装跑'
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
            this.setData({
                  activity_name: app.globalData.activity_name
            })
            if (this.data.is_cosplay == 0) {
                  wx.showModal({
                        title: '提示',
                        content: '报名幻装跑步免费 无需再支付任何费用',
                        success: function(res) {
                              if (res.confirm) {

                              } else if (res.cancel) {}
                        }
                  })
            }

            if (app.globalData.rules.length != 0) {
                  this.setData({
                        notice_content: app.globalData.rules[4]
                  })
            }
            this.setData({
                  notice_content_cos: app.globalData.rules[6],
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

      submit: function() {
            if (this.data.src != '') {
                  const url = `${app.globalData.baseUrl}/run/image-save`;
                  const data = {
                        id: this.data.id,
                        run_file_name: this.data.run_file_name,
                        activity_id: this.data.activity_id
                  }
                  console.log(data)
                  http.request(url, data, 'POST').then((res) => {
                        console.log(res)
                        if (res.data.id) {
                              console.log('save成功')
                              wx.showToast({
                                    title: '提交成功',
                                    icon: 'success',
                                    duration: 1200
                              })
                              setTimeout(() => {
                                    if (this.data.from == '') {
                                          console.log('from normal')
                                          wx.navigateBack({
                                                delta: 1
                                          })
                                          // wx.redirectTo({
                                          //       url: `/pages/index/index?id=${this.data.activity_id}&&name=${this.data.activity_name}`,
                                          // })
                                    }
                                    if (this.data.from == 'list') {
                                          console.log('from list')
                                          wx.navigateBack({
                                                delta: 1
                                          })
                                    }
                                    if (this.data.from == 'detail') {
                                          console.log('from detail')
                                          wx.navigateBack({
                                                delta: 3
                                          })
                                    }
                              }, 1300)
                        }
                  })
            } else {
                  wx.showModal({
                        title: '提示',
                        content: '请先上传照片',
                        success: function(res) {
                              if (res.confirm) {} else if (res.cancel) {}
                        }
                  })
            }
      },
      selectCosplay: function(e) {
            if (e.currentTarget.dataset.id == '1') {
                  this.setData({
                        is_cosplay: 1
                  })
            }
            if (e.currentTarget.dataset.id == '2') {
                  if (this.data.from == '') {
                        wx.redirectTo({
                              url: `/pages/index/index?id=${this.data.activity_id}&&name=${this.data.activity_name}`,
                        })
                  }
                  if (this.data.from == 'list') {
                        wx.navigateBack({
                              delta: 1
                        })
                  }
                  if (this.data.from == 'detail') {
                        wx.navigateBack({
                              delta: 3
                        })
                  }
            }
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