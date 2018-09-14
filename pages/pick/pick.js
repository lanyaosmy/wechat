// pages/pick/pick.js
const ip = getApp().globalData.ip;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab:0,
    showModal: false,
    notReceList:[

    ],
    transList:[

    ],
    receList:[
    ],
    usertoken:"",
    picUrl: "../images/qrcode.jpg",
    location: "",
    filePath:""
  },
  //确认收件
  confirmRece:function(e){
    var ip = getApp().globalData.ip;
    var that=this;
    var oid = e.currentTarget.dataset.id;
    var relist=that.data.notReceList;
    wx.showModal({
      title: '确认收件',
      content: '是否确认收件？',
      showCancel:true,
      success:function(res){
        if(res.confirm){
          wx.request({
            url: ip+'/logistics/updateStatus',
            data:{
              orderNum:oid
            },
            header: {
              "token": that.data.usertoken
            },
            success: function (res) {
              if (res.data.error.code == 0) {
                //刷新待签收列表
                wx.request({
                  url: ip + 'user/recGoods/notRecv/get',
                  header: {
                    "token": that.data.usertoken
                  },
                  success: function (res) {
                    if (res.data.error.code === 0) {
                      that.setData({
                        notReceList: res.data.data
                      });
                    } else {
                      wx.showToast({
                        title: res.data.error.message,
                        icon: 'none'
                      })
                    }
                  },
                  fail: function (res) {
                    console.log(res)
                  }
                });
              } else {
                wx.showToast({
                  title: res.error.message,
                  icon: 'none'
                })
              }
            }
          })
        }
      }
    })
  },
  /**
   * 显示二维码
   */
  showCode: function (e) {
    var that = this;
    var oid = e.currentTarget.dataset.id;
    wx.request({
      url: ip+'user/getRecvInfo',
      method: "GET",
      data:{
        orderNum:oid
      },
      header: {
        "token": that.data.usertoken
      },
      success:function(res){
        console.log(res.data);
        if (res.data.error.code == 0) {
          that.setData({
            filePath: ip+res.data.data.qrcode,
            location:res.data.data.loc
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
        } else {
          wx.showToast({
            title: res.error.message,
            icon: 'none'
          })
        }

      },
      fail: function (res) {
        console.log(res)
      }
    })
    this.setData({
      showModal: true
    });
  },
  preventTouchMove: function () {
  },
  onConfirm: function () {
    this.setData({
      showModal: false
    });
  },
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  switchNav: function (e) {

    var that = this;
    var ip = getApp().globalData.ip;
    var current = e.currentTarget.dataset.current;
    if (this.data.currentTab === current) {
      return false;
    } else {
      //待签收
      if(current==0){
        wx.request({
          url: ip+'user/recGoods/notRecv/get',
          header:{
            "token": that.data.usertoken
          },
          success:function(res){
              if(res.data.error.code===0){
                that.setData({
                    notReceList:res.data.data
                });
              }else{
                wx.showToast({
                  title: res.data.error.message,
                  icon: 'none'
                })
              }
          },
          fail:function(res){
            console.log(res)
          }
        });
      }
      //运输中
      if (current ==1) {
        wx.request({
          url: ip+'user/recGoods/transport/get',
          header: {
            "token": that.data.usertoken
          },
          success: function (res) {
            //console.log(res.data);
            if (res.data.error.code === 0) {
              that.setData({
                transList: res.data.data
              });
            } else {
              wx.showToast({
                title: res.data.error.message,
                icon: 'none'
              })
            }
          },
          fail: function (res) {
            console.log(res)
          }
        })
      }
      //已签收
      if (current ==2) {
        wx.request({
          url: ip+'user/recGoods/haveRecv/get',
          header: {
            "token": that.data.usertoken
          },
          success: function (res) {
            //console.log(res.data)
            if (res.data.error.code == 0) {
              that.setData({
                receList: res.data.data
              });
            }
          },
          fail: function (res) {
            console.log(res)
          }
        })
      }
      that.setData({
        currentTab:current
      })
    }
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
          usertoken:res.data
        });
        wx.request({
          url: ip + 'user/recGoods/notRecv/get',
          header: {
            "token": res.data
          },
          success: function (res) {
            if (res.data.error.code === 0) {
              that.setData({
                notReceList: res.data.data
              });
            } else {
              wx.showToast({
                title: res.data.error.message,
                icon: 'none'
              })
            }
          },
          fail: function (res) {
            console.log(res)
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