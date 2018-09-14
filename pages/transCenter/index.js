// pages/receiver/index.js
const ip = getApp().globalData.ip;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    receivelist: [
    ],
    sendlist: [
    ],
    _hide:1,
    usertoken:""
  },
  /**
   * 切换到配送中列表
   */
  changeToSend:function(e){
    var that=this;
    wx.request({
      url: ip +'cityReceiver/getSendingList',
      header: {
        "token": that.data.usertoken
      },
      success:function(res){
        var result = res.data;
        if (result.error.code == 1) {
          that.setData({
            receivelist: result.data
          });
        } else {
          wx.showToast({
            title: result.error.message,
            icon: 'none'
          })
        }
      },
      fail: (res) => {
        wx.showToast({
          title: '获取失败，请检查网络',
          icon: 'none'
        })
      }
    });
    this.setData({
      _hide:1
    })
  },
  /**
   * 切换到未配送列表
   */
  changeToRece: function (e) {
    var that = this;
    wx.request({
      url: ip + 'cityReceiver/getReceivedList',
      header: {
        "token": that.data.usertoken
      },
      success: function (res) {
        var result = res.data;
        if (result.error.code == 0) {
          that.setData({
            sendlist: result.data
          });
        } else {
          wx.showToast({
            title: '获取失败，请检查网络',
            icon: 'none'
          })
        }
      },
      fail: (res) => {
        wx.showToast({
          title: '获取失败，请检查网络',
          icon: 'none'
        })
      }
    });
    this.setData({
      _hide: 0
    })
  },
  /**
   * 扫码收件
   */
  scanToRece:function(){
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        var result = {};
        result.data = res.result;
        result = JSON.stringify(result);
        wx.request({
          url: ip + 'cityReceiver/pickup',
          data: result,
          method: "POST",
          header: {
            'Content-Type': 'application/json',
            "token": that.data.usertoken
          },
          success: function (res) {
            if (res.data.error.code == 1) {
              //显示下一站地点
              wx.showModal({
                title: '下一站地点',
                content: res.data.data,
                showCancel: false
              });
              //刷新配送列表
              wx.request({
                url: ip + 'cityReceiver/getReceivedList',
                header: {
                  "token": that.data.usertoken
                },
                success: function (res) {
                  var result = res.data;
                  if (result.error.code == 0) {
                    that.setData({
                      receivelist: result.data
                    });
                  } else {
                    wx.showToast({
                      title: result.error.message,
                      icon: 'none'
                    })
                  }
                },
                fail: (res) => {
                  wx.showToast({
                    title: '获取失败，请检查网络',
                    icon: 'none'
                  })
                }
              });
            }else{
              wx.showToast({
                title: res.data.error.message,
                icon: 'none'
              });
            }
          },
          fail: (res) => {
            wx.showToast({
              title: '获取失败，请检查网络',
              icon: 'none'
            });
          }
        })
      }
    })
  },
  /**
   * 扫码配送
   */
  scanToSend: function () {
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        var result = {};
        result.data = res.result;
        result = JSON.stringify(result);
        wx.request({
          url: ip + 'sendStaff/confirm',
          data: result,
          method: "POST",
          header: {
            'Content-Type': 'application/json',
            "token": that.data.usertoken
          },
          success: function (res) {
            if (res.data.error.code == 1) {
              //显示下一站地点
              wx.showModal({
                title: '下一站地点',
                content: res.data.data,
                showCancel: false
              });
              //刷新配送列表
              wx.request({
                url: ip + 'cityReceiver/getReceivedList',
                header: {
                  "token": that.data.usertoken
                },
                success: function (res) {
                  var result = res.data;
                  if (result.error.code == 0) {
                    that.setData({
                      sendlist: result.data
                    });
                  } else {
                    wx.showToast({
                      title: '获取失败，请检查网络',
                      icon: 'none'
                    })
                  }
                },
                fail: (res) => {
                  wx.showToast({
                    title: '获取失败，请检查网络',
                    icon: 'none'
                  })
                }
              });
            } else {
              wx.showToast({
                title: '获取失败，请检查网络',
                icon: 'none'
              });
            }
          },
          fail: (res) => {
            wx.showToast({
              title: '获取失败，请检查网络',
              icon: 'none'
            });
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    wx.getStorage({
      key: 'token',
      success: function (res) {
        that.setData({
          usertoken: res.data
        });
        wx.request({
          url: ip + 'cityReceiver/getReceivedList',
          header: {
            "token": res.data
          },
          success: function (res) {
            var result = res.data;
            
            if (result.error.code == 0) {
              that.setData({
                receivelist: result.data
              });
            } else {
              wx.showToast({
                title: res.data.error.message,
                icon: 'none'
              })
            }

          },
          fail: (res) => {
            wx.showToast({
              title: '获取失败，请检查网络',
              icon: 'none'
            })
          }
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})