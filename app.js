import * as handleLogin from './services/handleLogin'

App({
      isReady: wx.getSystemInfoSync('isReady'),
      readyCallback: null,
      globalData: {
            // 当前活动是否有跑步
            activity_is_run:1,
            // 跑步开始时间
            run_activity_start: '',
            is_first: wx.getStorageSync('is_first'),
            user_sign_count: 0,
            // 当前活动在存储中的index
            activity_index:0,
            // 判断苹果手机型号
            activity_id: '',
            activity_name:'',
            iphone_type: '',
            userInfo: null,
            access_token: '',
            // baseUrl:'http://192.168.0.189/20180507/cn_acg-plus_cosrun/web/v1',
            baseUrl: 'https://cosrun.sindcorp.net/v1',
            netWorkData: null,
            rules: [],
            is_activity_start: false,
            activity_is_comico: 1,
            activity_is_perform: 1,
            activity_is_run: 1,
            run_number_limit:2,
            // 是否开始报名 1是 2否
            is_sign_up: 2,
            // 是否结束报名 1是 2否
            is_sign_end: 1,
            // 活动是否开始
            is_activity_start: 2,
            // 1 不存在未审核 2存在未审核
            // is_examine: 1,

            banners: [],

            // 当前活动是否返现 1返现 2不返现
            is_cash: '2',
            // 有待支付订单 1存在 2不存在
            is_unpay_order:2,
            is_true_unpay_order:2,
            activity_time:{},
            project:[],
            solgan_run_time:''
      },
      onLaunch: function() {
            let info = wx.getSystemInfoSync();
            if (info.SDKVersion < '1.6.3') {
                  wx.showModal({
                        title: '提示',
                        content: '您的基础库版本过低，无法正常使用本小程序。请升级您的微信。',
                        success: function(res) {
                              if (res.confirm) {

                              } else if (res.cancel) {}
                        }
                  })
            }
            // 展示本地存储能力
            var logs = wx.getStorageSync('logs') || []
            logs.unshift(Date.now())
            wx.setStorageSync('logs', logs)

            handleLogin.checkSession()
                  .then((res) => {

                  })
                  .catch(() => {
                        wx.setStorageSync('isReady', false)
                        wx.removeStorageSync('access_token')
                        handleLogin.login()
                              .then(() => {
                                    wx.setStorageSync('isReady', true)
                                    if (this.readyCallback) {
                                          this.readyCallback();
                                    }
                              });
                  })

            // 获取用户信息
            wx.getSetting({
                  success: res => {
                        if (res.authSetting['scope.userInfo']) {}
                  }
            })
      }
})