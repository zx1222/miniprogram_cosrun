//index.js
//获取应用实例
const app = getApp()
const device = wx.getSystemInfoSync()
import * as http from '../../utils/promise.js'
const height = device.windowHeight
Page({
      data: {
            activity_id: '',
            half_limitr: '',
            number_limit: '',
            read: false,
            // toView: 'red',
            scrollTop: 0,
            scrollHeight: height,
            // 1男2女
            gender: 0,
            // 跑步开始时间
            run_activity_start: '',
            name: {
                  value: '',
                  valid: true
            },
            idCard: {
                  value: '',
                  valid: true
            },
            birthday: {
                  value: '1995-06',
                  selected: false,
                  valid: false
            },
            address: {
                  value: '',
                  valid: true
            },
            contact: {
                  value: '',
                  valid: true
            },
            verification: {
                  value: '',
                  valid: true
            },
            country: {
                  dataArr: [],
                  index: 0,
                  selected: false,
                  valid: false
            },
            blood: {
                  dataArr: ['A', 'B', 'AB', 'O'],
                  index: 0,
                  selected: false,
                  valid: false
            },
            run_size: {
                  dataArr: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
                  index: 0,
                  selected: false,
                  valid: false
            },
            certificates_type: {
                  dataArr: ['身份证', '军官证', '护照'],
                  index: 0,
                  selected: false,
                  valid: false
            },
            run_emergency_name: {
                  value: '',
                  valid: true
            },
            run_emergency_contact: {
                  value: '',
                  valid: true
            },
            run_type: 1,
            // is_cosplay: '1',

            is_run_open: true,
            is_cos_open: false,
            // valid_code: '',
            flag: false,
            countdown: false,
            countdown_num: 60,
            valid: true,
            notice_content_run: '',
            notice_content_cos: '',
            iphone_type: '',
            checked: false,

            // 报名成功信息
            sign_success: false,
            resultData: {},
            solgan_run_time:''
      },
      //事件处理函数
      bindViewTap: function() {
            wx.navigateTo({
                  url: '../logs/logs'
            })
      },
      checkboxChange: function(e) {
            if (e.detail.value.length != 0) {
                  this.setData({
                        checked: true
                  })
            } else {
                  this.setData({
                        checked: false
                  })
            }
      },
      onLoad: function() {
            if (wx.getStorageSync('countryArr').length > 0) {
                  this.setData({
                        country: {
                              dataArr: wx.getStorageSync('countryArr'),
                              index: 0,
                              selected: false,
                              valid: false
                        }
                  })
            } else {
                  this.getCountry();
            }
            this.setData({
                  activity_id: app.globalData.activity_id,
                  solgan_run_time: app.globalData.solgan_run_time,
                  iphone_type: app.globalData.iphone_type,
            })
      },
      onShow: function() {
            this.setData({
                  notice_content_run: app.globalData.rules[1],
                  notice_content_cos: app.globalData.rules[6],
                  iphone_type: app.globalData.iphone_type,
                  run_activity_start: app.globalData.run_activity_start,
            })
            const data = {
                  activity_id: this.data.activity_id
            }
            let url = `${app.globalData.baseUrl}/run/number-limits`
            http.request(url, data, 'GET').then((res) => {
                  this.setData({
                        half_limit: res.data.half_limit,
                        number_limit: res.data.number_limit
                  })
                  if (res.data.half_limit == '1') {
                        this.setData({
                              run_type: 1
                        })
                  }
                  if (res.data.number_limit == '1') {
                        this.setData({
                              run_type: 2
                        })
                  }
            })
      },
      bindBirthdayChange: function(e) {
            this.setData({
                  birthday: {
                        value: e.detail.value,
                        selected: true,
                        valid: true
                  }
            })
      },
      bindCountryChange: function(e) {
            this.setData({
                  country: {
                        dataArr: this.data.country.dataArr,
                        index: e.detail.value,
                        selected: true,
                        valid: true
                  },
            })
      },
      bindBloodChange: function(e) {
            this.setData({
                  blood: {
                        dataArr: this.data.blood.dataArr,
                        index: e.detail.value,
                        selected: true,
                        valid: true
                  },
            })
      },
      bindSizeChange: function(e) {
            this.setData({
                  run_size: {
                        dataArr: this.data.run_size.dataArr,
                        index: e.detail.value,
                        selected: true,
                        valid: true
                  },
            })
      },
      certificatesTypeChange: function(e) {
            this.setData({
                  certificates_type: {
                        dataArr: this.data.certificates_type.dataArr,
                        index: e.detail.value,
                        selected: true,
                        valid: true
                  },
            })
      },
      selectGender: function(e) {
            this.setData({
                  gender: e.currentTarget.dataset.id
            })
      },
      selectType: function(e) {
            if (this.data.half_limit == '1') {
                  this.setData({
                        run_type: 1
                  })
            }
            if (this.data.number_limit == '1') {
                  this.setData({
                        run_type: 2
                  })
            }
            if (this.data.half_limit == '2' && this.data.number_limit == '2') {
                  this.setData({
                        run_type: e.currentTarget.dataset.id
                  })
            }

      },
      // selectCos: function(e) {
      //       this.setData({
      //             is_cosplay: e.currentTarget.dataset.id
      //       })
      // },
      submit: function(e) {
            let url = `${app.globalData.baseUrl}/run/enroll`
            var data = e.detail.value
            let run_country = this.data.country.dataArr[this.data.country.index].name

            data = Object.assign(data, {
                  run_type: this.data.run_type,
                  // is_cosplay: this.data.is_cosplay,
                  run_sex: this.data.gender,
                  run_country_id: parseInt(this.data.country.index) + 1,
                  run_country: run_country,
                  run_blood: parseInt(this.data.blood.index) + 1,
                  run_size: parseInt(this.data.run_size.index) + 1,
                  certificates_type: parseInt(this.data.certificates_type.index) + 1,
                  activity_id: this.data.activity_id
            })
            this.setData({
                  name: {
                        valid: true,
                        value: data.run_name
                  },
                  idCard: {
                        value: data.run_idcard,
                        valid: true
                  },
                  run_emergency_name: {
                        value: data.run_emergency_name,
                        valid: true
                  },
                  run_emergency_contact: {
                        value: data.run_emergency_phone,
                        valid: true
                  },
                  address: {
                        value: data.run_address,
                        valid: true
                  },
            })
            console.log(data)

            this.validForm(data)

            if (this.data.flag) {
                  http.request(url, data, 'POST').then((res) => {
                        const id = res.data.id
                        const resData = res
                        if (res.data.run_data) {
                              this.setData({
                                    sign_success: true,
                                    resultData: res.data.run_data
                              })
                        }
                  })
            }
      },
      validForm: function(data) {
            var reg_contact = /^[1][3,4,5,7,8][0-9]{9}$/;
            var reg_card = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            if (data.run_sex == 0) {
                  wx.showModal({
                        title: '提示',
                        content: '请选择性别',
                  })
                  this.setData({
                        flag: false
                  })
            }
            if (data.run_name == '') {
                  this.setData({
                        name: {
                              valid: false,
                              value: ''
                        },
                        flag: false
                  })
            }
            if (data.run_idcard == '') {
                  this.setData({
                        idCard: {
                              valid: false,
                              value: ''
                        },
                        flag: false
                  })
            }
            if (!this.data.birthday.selected) {
                  this.setData({
                        birthday: {
                              value: '',
                              selected: false,
                              valid: true
                        },
                        flag: false
                  })
            }
            if (!this.data.country.selected) {
                  this.setData({
                        country: {
                              dataArr: this.data.country.dataArr,
                              index: 0,
                              selected: false,
                              valid: true
                        },
                        flag: false
                  })
            }
            if (!this.data.blood.selected) {
                  this.setData({
                        blood: {
                              dataArr: this.data.blood.dataArr,
                              index: 0,
                              selected: false,
                              valid: true
                        },
                        flag: false
                  })
            }
            if (!this.data.certificates_type.selected) {
                  this.setData({
                        certificates_type: {
                              dataArr: this.data.certificates_type.dataArr,
                              index: 0,
                              selected: false,
                              valid: true
                        },
                        flag: false
                  })
            }
            if (!this.data.run_size.selected) {
                  this.setData({
                        run_size: {
                              dataArr: this.data.run_size.dataArr,
                              index: 0,
                              selected: false,
                              valid: true
                        },
                        flag: false
                  })
            }
            if (data.run_address == '') {
                  this.setData({
                        address: {
                              valid: false,
                              value: ''
                        },
                        flag: false
                  })
            }
            if (!reg_contact.test(data.run_phone)) {
                  this.setData({
                        contact: {
                              valid: false,
                              value: ''
                        },
                        flag: false
                  })
            }
            if (!reg_contact.test(data.run_emergency_phone)) {
                  this.setData({
                        run_emergency_contact: {
                              valid: false,
                              value: ''
                        },
                        flag: false
                  })
            }
            if (data.run_emergency_name == '') {
                  this.setData({
                        run_emergency_name: {
                              valid: false,
                              value: ''
                        },
                        flag: false
                  })
            }
            if (!this.data.verification.valid || this.data.verification.value == '' || this.data.verification.value.length != 6) {
                  this.setData({
                        verification: {
                              valid: false,
                              value: ''
                        }
                  })
            }
            if (data.run_name != '' && data.idCard != '' && data.run_birthday != '' && this.data.country.selected && this.data.blood.selected && this.data.certificates_type.selected && this.data.run_size.selected && data.run_address != '' && reg_contact.test(data.run_phone) && reg_contact.test(data.run_emergency_phone) && data.run_emergency_name != '' && this.data.verification.valid && this.data.verification.value != '' && this.data.verification.value.length == 6 && data.run_sex != 0) {
                  this.setData({
                        flag: true
                  })
            }
      },
      toggleRunPopup: function() {
            if (this.data.checked) {
                  this.setData({
                        is_run_open: !this.data.is_run_open
                  })
            }
      },
      toggleCosPopup: function() {
            this.setData({
                  is_cos_open: !this.data.is_cos_open
            })
      },
      getCountry: function() {
            let url = `${app.globalData.baseUrl}/run/country`
            http.request(url, 'GET').then((res) => {
                  this.setData({
                        country: {
                              dataArr: res.data,
                              index: 0,
                              selected: false,
                              valid: false
                        },
                  })
                  wx.setStorageSync('countryArr', this.data.country.dataArr);
            })
      },

      getValidCode: function() {
            let url = `${app.globalData.baseUrl}/run/captcha`
            const data = {
                  mobile_number: this.data.contact.value
            }
            const reg_contact = /^[1][3,4,5,7,8][0-9]{9}$/;
            if (!reg_contact.test(this.data.contact.value)) {
                  this.setData({
                        contact: {
                              valid: false,
                              value: ''
                        }
                  })
            } else {
                  http.request(url, data, 'POST').then((res) => {
                        this.setData({
                              countdown: true
                        })
                        var timer = setInterval(() => {
                              this.setData({
                                    countdown_num: this.data.countdown_num - 1
                              })
                              if (this.data.countdown_num == 0) {
                                    this.setData({
                                          countdown: false,
                                          countdown_num: 60
                                    })
                                    clearInterval(timer)
                              }
                        }, 1000)
                  })
            }
      },
      verification_phone: function(e) {
            this.setData({
                  contact: {
                        valid: false,
                        value: e.detail.value
                  }
            })
      },
      verification_code: function(e) {
            if (e.detail.value.length != 6) {
                  this.setData({
                        verification: {
                              value: '',
                              valid: false,
                        }
                  })
            }
      },
      bindVerificationInput: function(e) {
            let code=e.detail.value
            if (code.length == 6) {
                  const url = `${app.globalData.baseUrl}/run/verification`
                  const data = {
                        mobile_number: this.data.contact.value,
                        valid_code: code
                  }
                  http.request(url, data, 'POST').then((res) => {
                        if (res.data.error) {
                              console.log('验证失败')
                              this.setData({
                                    verification: {
                                          valid: false,
                                          value: ''
                                    }
                              })
                        } else {
                              console.log('验证成功')
                              this.setData({
                                    verification: {
                                          valid: true,
                                          value: code
                                    }
                              })
                        }
                  })
            }
      },

      scroll: function(e) {
            this.setData({
                  scrollTop: e.detail.scrollTop,
            })
      },
      confirmRunInfo: function(e) {
            if (e.currentTarget.dataset.id == '1') {
                  wx.redirectTo({
                        url: `/pages/pay/index?id=${this.data.resultData.run_id}&&run_type=${this.data.run_type}`,
                  })
            } else {
                  this.setData({
                        sign_success: false,
                        countdown: false,
                        verification: {
                              valid: true,
                              value: ''
                        },
                        flag: false
                  })
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