// pages/logistics/logistics.js
const ip = getApp().globalData.ip;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    _hide:0,
    goodsName:"",
    id:"",
    transdata:[
    ],
    picUrl:"",
    location:"",
    usertoken:""
  },
  /**
   * 显示二维码
   */
  showCode: function (){
    var that=this;
    var oid=this.data.id;
    wx.request({
      url: ip+'user/getRecvInfo',
      method: "GET",
      data: {
        orderNum: oid
      },
      header: {
        "token": that.data.usertoken
      },
      success: function (res) {
        if (res.data.error.code == 0) {
          that.setData({
            picUrl: ip+res.data.data.qrcode,
            location: res.data.data.loc
          })
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options.orderNum);
    var that=this;
    that.setData({
      id: options.orderNum
    });
    var oid = options.orderNum;
    this.setData({
      _hide:options.show
    });
    //获取token
    wx.getStorage({
      key: 'token',
      success: function (res) {
        that.setData({
          usertoken: res.data
        });
        //获取物流信息列表
        wx.request({
          url: ip + 'logistics/get',
          method: "GET",
          data: {
            orderNum: oid
          },
          header: {
            "token": res.data
          },
          success: function (res) {
            //console.log(res.data);
            if (res.data.error.code == 0) {
              that.setData({
                transdata: res.data.data.trackInfoList,
                goodsName: res.data.data.goodName
              })
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