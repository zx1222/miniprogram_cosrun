//index.js
//获取应用实例
const app = getApp()
import * as http from '../../utils/promise.js'
import getSystemInfo from '../../utils/getSystemInfo.js'


Page({
      data: {
            is_run:1,
            is_mask_show: false,
            activity_id: '',
            activity_name: '',
            user_sign_count: 0,
            iphone_type: '',
            systemInfo: {},
            imgUrls: [
                  '../../assets/images/banner-voteHide.png',
                  '../../assets/images/banner-voteHide.png',
                  '../../assets/images/banner-voteHide.png'
            ],
            banner_path: [],
            logo: '',
            indicatorDots: false,
            autoplay: true,
            interval: 2000,
            duration: 1000,
            circular: true,
            imgheights: [],
            //图片宽度 
            imgwidth: 750,
            current: 0,

            is_comico_disabled: false,
            is_run_disabled: false,
            is_perform_disabled: false,

            is_open: false,
            // 有待支付订单
            is_true_unpay_order:2

      },
      //事件处理函数
      bindViewTap: function() {
            wx.navigateTo({
                  url: '../logs/logs'
            })
      },
      onLoad: function(options) {
            console.log(options)
            if (options.id) {
                  app.globalData.activity_id = options.id
            }
            if (options.name) {
                  app.globalData.activity_name = options.name
                  this.setData({
                        activity_name: app.globalData.activity_name
                  })
                  wx.setNavigationBarTitle({
                        title: `COS RUN${this.data.activity_name}`
                  })
            }
            this.setData({
                  activity_id: app.globalData.activity_id,
                  iphone_type: app.globalData.iphone_type,
            })

            // 用户中心报名数量
            let sign_list = wx.getStorageSync('sign_info').sign_list
            let sign_info = {
                  sign_list: []
            }
            if (typeof(sign_list) == "undefined") {
                  wx.setStorageSync('sign_info', sign_info)
            }
            sign_list = wx.getStorageSync('sign_info').sign_list

            // if (sign_list.length != 0) {
            //       sign_list.forEach((item, index) => {
            //             if (parseInt(item.activity_id) == this.data.activity_id) {
            //                   wx.setStorageSync('activity_index', index)
            //                   console.log('当前活动存储过')
            //                   app.globalData.activity_index = wx.getStorageSync('activity_index')
            //                   app.globalData.user_sign_count = parseInt(item.count)
            //                   this.setData({
            //                         user_sign_count: app.globalData.user_sign_count
            //                   })
            //                   console.log(app.globalData.user_sign_count)
            //             }
            //       })
            //       if (!sign_list.some(({
            //                   activity_id
            //             }) => activity_id == this.data.activity_id)) {
            //             console.log('当前活动未存储过')
            //             let sign_info = wx.getStorageSync('sign_info')
            //             sign_info.sign_list.push({
            //                   activity_id: this.data.activity_id,
            //                   count: 0
            //             })
            //             wx.setStorageSync('sign_info', sign_info)
            //       }
            // } else {
            //       sign_info.sign_list.push({
            //             activity_id: this.data.activity_id,
            //             count: 0
            //       })
            //       wx.setStorageSync('sign_info', sign_info);
            //       app.globalData.user_sign_count = 0
            // }
      },
      clearSession: function() {
            wx.removeStorageSync('sign_info')
      },
      
      onShow: function() {
            // 报名了但是没有选择是否报名幻装
            // this.setData({
            //       user_sign_count: app.globalData.user_sign_count
            // })

            if (wx.getStorageSync('isReady')) {
                  if (app.globalData.is_first == '1') {
                        this.setData({
                              is_mask_show: true
                        })
                  }
                  this.initActivity();
            } else {
                  wx.setStorageSync('isReady', true)
                  if (app.globalData.is_first == '1') {
                        this.setData({
                              is_mask_show: true
                        })
                  }
                  app.readyCallback = () => {
                        this.initActivity();
                  };
            }
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
      },
      checkPayment:function(){
            if (this.data.is_true_unpay_order == 1) {
                  wx.showModal({
                        title: '提示',
                        content: '你所报的竞速跑尚未支付报名费用，请前往个人中心支付完成报名',
                        success: (res) => {
                              if (res.confirm) {
                                    wx.navigateTo({
                                          url: '/pages/user/userInfoList/index?type=2',
                                    })
                              } else if (res.cancel) {
                              }
                        }
                  })
            }
      },

      turnToUser: function() {
            let sign_info = wx.getStorageSync('sign_info')
            sign_info.sign_list[app.globalData.activity_index].count = 0
            wx.setStorageSync('sign_info', sign_info)
            // app.globalData.user_sign_count = 0
      },
      formatRules: function() {
            let rules = app.globalData.rules;
            const rulesList = new Array(9);
            const indexArr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
            for (var index = 0; index < rulesList.length; index++) {
                  rulesList[index] = ''
                  for (const index_i in rules) {
                        if (parseInt(rules[index_i].notice_type) == (index + 1)) {
                              rulesList[index] = rules[index_i].notice_content;
                        }
                  }
            }
            app.globalData.rules = rulesList
      },

      imageLoad: function(e) {
            //获取图片真实宽度
            var imgwidth = e.detail.width,
                  imgheight = e.detail.height,
                  //宽高比
                  ratio = imgwidth / imgheight;
            //计算的高度值
            var viewHeight = 750 / ratio;
            var imgheight = viewHeight
            var imgheights = this.data.imgheights
            //把每一张图片的高度记录到数组里
            imgheights.push(imgheight)
            this.setData({
                  imgheights: imgheights,
            })
      },
      bindchange: function(e) {
            this.setData({
                  current: e.detail.current
            })
      },
      formatBannerData: function(data, key) {
            const dataArr = []
            for (const index in data) {
                  dataArr.push(data[index][key])
            }
            return dataArr
      },
      initActivity: function() {
            console.log('进入initActivity')
            let url = `${app.globalData.baseUrl}/activity/index`
            const data = {
                  id: this.data.activity_id
            }
            http.request(url, data).then((res) => {
                  app.globalData.banners = res.data.banner
                  if (res.data.activity.activity_logo) {
                        this.setData({
                              logo: res.data.activity.activity_logo,
                              banner_urls: this.formatBannerData(res.data.banner, 'banner_url'),
                              banner_path: this.formatBannerData(res.data.banner, 'banner_path')
                        })
                  }
                  app.globalData.activity_time = {
                        activity_sign_start: res.data.activity.activity_sign_start,
                        activity_sign_end: res.data.activity.activity_sign_end,
                        run_activity_start: res.data.activity.run_activity_start,
                  }
                  app.globalData.activity_is_run=res.data.activity.activity_is_run
                  app.globalData.user_sign_count = res.data.counts
                 this.setData({
                       is_run:app.globalData.activity_is_run,
                       user_sign_count: res.data.counts,
                 })
                  app.globalData.project = res.data.project
                  app.globalData.solgan_run_time = res.data.activity.run_activity_logo
                  app.globalData.run_activity_start = this.formatDate(res.data.activity.run_activity_start)
                  app.globalData.is_cash = res.data.activity.activity_is_cash
                  app.globalData.rules = res.data.rules
                  app.globalData.is_activity_start = res.data.activity.is_activity_start
                  app.globalData.is_sign_up = res.data.activity.is_sign_up
                  app.globalData.is_sign_end = res.data.activity.is_sign_end
                  app.globalData.activity_is_comico = res.data.activity.activity_is_comico
                  app.globalData.activity_is_perform = res.data.activity.activity_is_perform
                  app.globalData.activity_is_run = res.data.activity.activity_is_run
                  app.globalData.run_number_limit = res.data.run_number_limit
                  app.globalData.rules = res.data.activity.rules
                  this.formatRules();

                  // if (res.data.is_true_unpay_order == '1') {
                  //       app.globalData.is_true_unpay_order = 1
                  //       this.setData({
                  //             is_true_unpay_order:1
                  //       })
                  //       wx.setStorageSync('is_true_unpay_order', 1)
                  //       if (wx.getStorageSync('is_true_unpay_order') == '1') {
                  //             this.setData({
                  //                   user_sign_count: this.data.user_sign_count + 1
                  //             })
                  //       }
                  // } else {
                  //       app.globalData.is_true_unpay_order = 2
                  //       wx.setStorageSync('is_true_unpay_order', 0)
                  // }
                  if (res.data.is_unpay_order == '1') {
                        wx.showModal({
                              title: '提示',
                              content: '你所报的竞速跑尚未支付报名费用，请前往个人中心支付完成报名',
                              success: (res) => {
                                    const url = `${app.globalData.baseUrl}/person/tips-pay`
                                    const data = {
                                          type: 1
                                    }
                                    if (res.confirm) {
                                          http.request(url, data).then((res) => {})
                                          wx.navigateTo({
                                                url: '/pages/user/userInfoList/index?type=2',
                                          })
                                    } else if (res.cancel) {
                                          http.request(url, data).then((res) => {})
                                    }
                              }
                        })
                  }

                  if (res.data.project.indexOf('2') != -1 && res.data.is_cosplay == '2') {
                        wx.showModal({
                              title: '提示',
                              content: '您已经报名幻装跑 但是还没有选择是否幻装 请去选择',
                              success: (res) => {
                                    const url = `${app.globalData.baseUrl}/person/tips-pay`
                                    const data = {
                                          type: 2
                                    }
                                    if (res.confirm) {
                                          http.request(url, data).then((res) => {})
                                          wx.navigateTo({
                                                url: '/pages/user/userInfoList/index?type=2',
                                          })
                                    } else if (res.cancel) {
                                          http.request(url, data).then((res) => {})
                                    }
                              }
                        })
                  }
                  if (res.data.project.indexOf('1') != -1 || app.globalData.is_sign_up == '2' || app.globalData.activity_is_comico == '2' || app.globalData.is_sign_end == '1') {
                        app.globalData.is_comico_disabled=true
                        this.setData({
                              is_comico_disabled: true,
                        })
                  }

                  if ((res.data.project.indexOf('2') != -1 && res.data.project.indexOf('4') != -1) || app.globalData.is_sign_up == '2' || app.globalData.activity_is_run == '2' || app.globalData.is_sign_end == '1' || app.globalData.run_number_limit == '1') {
                        app.globalData.is_run_disabled = true
                        this.setData({
                              is_run_disabled: true,
                        })
                  }
                  if (res.data.project.indexOf('3') != -1 || app.globalData.is_sign_up == '2' || app.globalData.activity_is_perform == '2' || app.globalData.is_sign_end == '1') {
                        app.globalData.is_perform_disabled = true
                        this.setData({
                              is_perform_disabled: true,
                        })
                  }
            })
      },
      formatDate: function(time) {
            const date = new Date(time * 1000);
            let year = date.getFullYear(),
                  month = date.getMonth() + 1, //月份是从0开始的
                  day = date.getDate(),
                  hour = date.getHours(),
                  min = date.getMinutes(),
                  sec = date.getSeconds();
            let flag = '上午'
            if (hour > 12) {
                  flag = '下午'
                  hour = hour - 12
            }
            if (min < 10) {
                  min = '0' + min
            }

            const newTime = year + '.' +
                  month + '.' +
                  day + flag + hour + ":" + min;
            return newTime;
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
      hideMask: function() {
            this.setData({
                  is_mask_show: false
            })
            wx.setStorageSync('is_first', '2')
            app.globalData.is_first = wx.getStorageSync('is_first')
      },
      onShareAppMessage: function(res) {
            if (res.from === 'button') {

            }
            return {
                  title: 'COSRUN幻装跑',
                  path: '/pages/home/index',
                  imageUrl: '../../assets/images/share-cover.jpg'
            }
      },


      clear: function() {
            wx.removeStorageSync('isReady')
      }
})