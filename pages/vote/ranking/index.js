//index.js
//获取应用实例
const app = getApp()
const device = wx.getSystemInfoSync()
import * as http from '../../../utils/promise.js'
const height = device.windowHeight

Page({
      data: {
            activity_id: '',
            inputShowed: false,
            keywords: '',
            is_vote: false,
            is_open: false,
            voteList: [],
            notice_content: '',
            // 刷新
            refresh_status: 0,
            // 分页
            loading_more: false,
            loadmore_end: false,
            currentPage: 1,
            pageSize: 20,

            noData: false,
            loading: true,
            index: 0,
            scrollHeight: height,
      },
      //事件处理函数
      bindViewTap: function () {
            wx.navigateTo({
                  url: '../logs/logs'
            })
      },
      onLoad: function () {

      },
      formSubmit: function (e) {
            this.getData();
      },
      onShow: function () {
            this.setData({
                  notice_content: app.globalData.rules[3],
                  activity_id: app.globalData.activity_id
            })
            this.getData();
      },
      showInput: function () {
            this.setData({
                  inputShowed: true
            });
      },
      hideInput: function () {
            this.setData({
                  keywords: "",
                  inputShowed: false
            });
            this.getData();
      },
      clearInput: function () {
            this.setData({
                  keywords: ""
            });
            this.getData();
      },
      inputTyping: function (e) {
            this.setData({
                  keywords: e.detail.value,
                  openRegion: false
            });
      },
      getData: function () {
            let url = `${app.globalData.baseUrl}/vote/list`
            const data = {
                  limits: this.data.pageSize,
                  page: this.data.currentPage,
                  keywords: this.data.keywords,
                  activity_id: this.data.activity_id,
                  sort: 1
            }
            http.request(url, data).then((res) => {
                  this.setData({
                        loading: false
                  })
                  this.setData({
                        voteList: res.data.items
                  })
            })
      },
      vote: function (e) {
            this.setData({
                  cosrun_id: e.currentTarget.dataset.id
            })
            let url = `${app.globalData.baseUrl}/vote/vote`
            const data = {
                  id: this.data.cosrun_id,
                  activity_id: this.data.activity_id
            }
            http.request(url, data, 'POST').then((res) => {
                  if (res.data.id) {
                        let voteList = this.data.voteList
                        voteList[this.data.index].run_votes = voteList[this.data.index].run_votes + 1
                        this.setData({
                              is_vote: true,
                              voteList: voteList
                        })
                        setTimeout(() => {
                              this.setData({
                                    is_vote: false
                              })
                        }, 1700)
                  }
            })
      },
      scroll: function (e) {
     
      },

      // 分页上拉加载
      reachBottom: function () {
            let _this = this
            const url = `${app.globalData.baseUrl}/vote/list`
            let voteList = this.data.voteList;
            let newVoteList = []
            let data = {
                  limits: this.data.pageSize,
                  page: _this.data.currentPage + 1,
                  keywords: this.data.keywords,
                  activity_id: this.data.activity_id,
                  sort: 1
            }
            if (!this.data.loadmore_end) {
                  this.setData({
                        loading_more: true
                  })
                  http.request(url, data).then((res) => {
                        console.log(res)
                        newVoteList = res.data.items
                        if (newVoteList.length < this.data.pageSize) {
                              _this.setData({
                                    loadmore_end: true
                              })
                        }
                        setTimeout(function () {
                              _this.setData({
                                    currentPage: _this.data.currentPage + 1,
                                    voteList: voteList.concat(newVoteList),
                                    loading_more: false
                              })
                        }, 300)
                  });
            }
      },
      togglePopup: function () {
            this.setData({
                  is_open: !this.data.is_open
            })
      },
      onShareAppMessage: function (res) {
            if (res.from === 'button') {

            }
            return {
                  title: 'COSRUN幻装跑',
                  path: '/pages/home/index',
                  imageUrl: '../../../assets/images/share-cover.jpg'
            }
      }
})