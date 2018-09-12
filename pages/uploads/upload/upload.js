import WeCropper from '../../../assets/tools/we-cropper/we-cropper.js'
const app = getApp()
import * as http from '../../../utils/promise.js'

import * as commonMethod from '../../../assets/js/common.js'
const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 50

Page({
      data: {
            cropperOpt: {
                  activity_id: '',
                  id: 'cropper',
                  user_id: '',
                  from: '',
                  width,
                  height,
                  scale: 2.5,
                  zoom: 8,
                  cut: {
                        x: (width - 300) / 2,
                        y: (height - 300) / 2,
                        width: 320,
                        height: 260
                  }
            }
      },
      touchStart(e) {
            this.wecropper.touchStart(e)
      },
      touchMove(e) {
            this.wecropper.touchMove(e)
      },
      touchEnd(e) {
            this.wecropper.touchEnd(e)
      },
      getCropperImage() {
            const appid = 'miinno.com'
            const secret = '123456'
            const version = 'api/v1'
            const timestamp = new Date().getTime()
            const a = appid + 'APPID' + secret + 'SECRET' + timestamp
            const sign = commonMethod.sha1(appid + 'APPID' + secret + 'SECRET' + timestamp)
            const token = sign + '.' + timestamp + '.' + version

            this.wecropper.getCropperImage((avatar) => {
                  if (avatar) {
                        console.log('user_id:,' + this.data.user_id)
                        console.log(this.data.user_id == '')
                        if (this.data.user_id != "") {
                              console.log('aaa')

                              //  获取到裁剪后的图片
                              wx.uploadFile({
                                    url: `${app.globalData.baseUrl}/run/upload`,
                                    //url:'http://192.168.0.189/repos/cn_acg-plus_cosrun/web/v1/run/upload',
                                    filePath: avatar,
                                    header: {
                                          'X-Token-With': token,
                                          'Authorization': `Miinno ${wx.getStorageSync('access_token')}`
                                    },
                                    name: 'file',
                                    formData: {
                                          id: this.data.user_id,
                                          activity_id: this.data.activity_id
                                    },
                                    success: (res) => {
                                          const data = JSON.parse(res.data)
                                          console.log(data)
                                          if (data.id) {
                                                wx.redirectTo({
                                                      url: `../index?avatar=${avatar}&&id=${this.data.user_id}`
                                                })
                                          }
                                    },
                                    fail: function(res) {
                                          console.log(res)
                                    }
                              })
                        } else {
                              console.log('vvv')
                              //  获取到裁剪后的图片
                              wx.uploadFile({
                                    url: `${app.globalData.baseUrl}/run/upload`,
                                    //url:'http://192.168.0.189/repos/cn_acg-plus_cosrun/web/v1/run/upload',
                                    filePath: avatar,
                                    header: {
                                          'X-Token-With': token,
                                          'Authorization': `Miinno ${wx.getStorageSync('access_token')}`
                                    },
                                    name: 'file',
                                    formData: {
                                          activity_id: this.data.activity_id
                                    },
                                    success: (res) => {
                                          const data = JSON.parse(res.data)
                                          console.log(data)
                                          if (data.id) {
                                                wx.redirectTo({
                                                      url: `../index?avatar=${avatar}&&from=${this.data.from}`
                                                })
                                          }
                                    },
                                    fail: function(res) {
                                          console.log(res)
                                    }
                              })
                        }

                  } else {
                        console.log('获取图片失败，请稍后重试')
                  }
            })
      },
      uploadTap() {
            const self = this
            wx.chooseImage({
                  count: 1, // 默认9
                  sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                  sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                  success(res) {
                        const src = res.tempFilePaths[0]
                        //  获取裁剪图片资源后，给data添加src属性及其值
                        self.wecropper.pushOrign(src)
                  }
            })
      },
      onLoad(options) {
            const {
                  cropperOpt
            } = this.data
            console.log(options)

            this.setData({
                  user_id: options.id,
                  from: options.from
            })
            if (options.activity_id) {
                  this.setData({
                        activity_id: options.activity_id
                  })
            }
            if (options.src) {
                  cropperOpt.src = options.src
                  new WeCropper(cropperOpt)
                        .on('ready', (ctx) => {})
                        .on('beforeImageLoad', (ctx) => {
                              wx.showToast({
                                    title: '上传中',
                                    icon: 'loading',
                                    duration: 20000
                              })
                        })
                        .on('imageLoad', (ctx) => {
                              wx.hideToast()
                        })
                        .on('beforeDraw', (ctx, instance) => {})
                        .updateCanvas()
            }
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