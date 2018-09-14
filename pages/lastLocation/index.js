// pages/lastLocation/index.js
const ip = getApp().globalData.ip;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _hide:0,
    notReceList:[
    ],
    notSendList:[
    ],
    notPickList:[
    ],
    usertoken:"",
    picUrl:"",
    filePath:"",
    location:"物流二维码",
    showModal:false
  },
  preventTouchMove: function () {
  },
  onConfirm: function () {

    this.setData({
      showModal: false
    });
  },
  /**
   * 切换到未配送列表
   */
  changeToSend: function (e) {
    var that = this;
    wx.request({
      url: ip+'receiver/firstLocation/getReceivedList',
      header: {
        "token": that.data.usertoken
      },
      success: function (res) {
        var result = res.data;
        if (result.error.code == 1) {
          that.setData({
            notSendList: result.data
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
      _hide: 1
    })
  },
  /**
   * 切换到未揽收列表
   */
  changeToRece: function (e) {
    var that = this;
    wx.request({
      url: ip+'receiver/firstLocation/getUnreceivedList',
      header: {
        "token": that.data.usertoken
      },
      success: function (res) {
        var result=res.data;
        if(result.error.code==1){
          that.setData({
            notReceList: result.data
          });
        }else{
          wx.showToast({
            title: '获取失败，请检查网络',
            icon:'none'
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
   * 切换到未取件列表
   */
  changeToPick:function(){
    var that=this;
    wx.request({
      url: ip + 'receiver/lastLocation/getUnfetchedList',
      header: {
        "token": that.data.usertoken
      },
      success: function (res) {
        var result = res.data;
        if (result.error.code == 1) {
          that.setData({
            notPickList: result.data
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
        })
      }
    });
    this.setData({
      _hide: 2
    })
  },
  /**
   * 扫码收件
   */
  scanToRece: function () {
    var that = this;
    var code;
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        var result = {};
        result.data = res.result;
        result = JSON.stringify(result);
        wx.request({
          url: ip +'receiver/lastLocation/pickup',
          data: result,
          method: "POST",
          header: {
            'Content-Type': 'application/json',
            "token": that.data.usertoken
          },
          success: function (res) {
            //显示包裹编码
            wx.showModal({
              title: '包裹编码',
              content: res.data.data+'',
              showCancel: false
            });
            if(res.data.error.code == 1){
              code = res.data.data;
              
            }else{
              wx.showToast({
                title: res.data.error.message,
                icon: 'none'
              })
            }

          }
        })
      }
    });

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
          url: ip+'sendStaff/confirm',
          data: result,
          method: "POST",
          header: {
            'Content-Type': 'application/json',
            "token": that.data.usertoken
          },
          success: function (res) {
            if(res.data.error.code==1){
              wx.showModal({
                title: '下一站地址',
                content: "发往："+res.data.data,
                showCancel: false
              });
              wx.request({
                url: ip + 'receiver/firstLocation/getReceivedList',
                header: {
                  "token": that.data.usertoken
                },
                success: function (res) {
                  var result = res.data;
                  if (result.error.code == 1) {
                    that.setData({
                      notSendList: result.data
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
            }else{
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
   * 用户取件
   */
  scanToPick: function () {
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        var result = {};
        result.data = res.result;
        result = JSON.stringify(result);
        wx.request({
          url: ip+'receiver/lastLocation/getReceiveCode',
          data: result,
          method: "POST",
          header: {
            'Content-Type': 'application/json',
            "token": that.data.usertoken
          },
          success: function (res) {
            if(res.data.error.code==1){
              wx.showModal({
                title: '包裹编码',
                content: res.data.data+'',
                showCancel: false
              });
            }else{
              wx.showToast({
                title: '获取失败，请检查网络',
                icon: 'none'
              });
            }
            
          },
          fail:(res)=>{
            wx.showToast({
              title: '获取失败，请检查网络',
              icon: 'none'
            });
          }
        })
      }
    })
  },
  //确认揽收
  confirmReceive:function(e){
    var delid = e.currentTarget.dataset.id;
    var that=this;
    //console.log(delid);
    wx.showModal({
      title: '确认信息',
      content: "确认已揽收到包裹？",
      success: function (res) {
        var result = {};
        result.data = delid;
        result = JSON.stringify(result);
        if (res.confirm) {
          wx.request({
            url: ip +'receiver/firstLocation/pickup',
            method:"POST",
            data:result,
            header:{
              "token":that.data.usertoken
            },
            success:function(res){
              if(res.data.error.code==1){
                that.setData({
                  filePath: ip + res.data.data
                });
                wx.downloadFile({
                  url: that.data.filePath,
                  header: {
                    "token": that.data.usertoken
                  },
                  success: function (res) {
                    if (res.statusCode === 200) {
                      that.setData({
                        picUrl: res.tempFilePath
                      });
                    }
                  }
                })
                that.setData({
                  showModal: true
                });
                //刷新未配送列表
                changeToSend();
              }else{
                wx.showToast({
                  title: "揽收失败",
                  icon: 'none'
                });
              }
              
            }
          });
        }
      },
      fail:(res)=>{
        wx.showToast({
          title: '获取失败，请检查网络',
          icon: 'none'
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'token',
      success: function (res) {
        that.setData({
          usertoken: res.data
        });
        wx.request({
          url: ip+'receiver/firstLocation/getUnreceivedList',
          header: {
            "token": res.data
          },
          success: function (res) {
            var result = res.data;
            if (result.error.code == 1) {
              that.setData({
                notReceList: result.data
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