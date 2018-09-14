// pages/send/chooseSite.js
const ip = getApp().globalData.ip;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item:[
      {
        "id": 1,
        "belongcityid": 1,
        "detail": "乌鲁木齐市金牛区寄件取件点"
      },
      {
        "id": 2,
        "belongcityid": 1,
        "detail": "乌鲁木齐市武侯区寄件取件点"
      },
      {
        "id": 3,
        "belongcityid": 1,
        "detail": "乌鲁木齐市朝阳区寄件取件点"
      },
      {
        "id": 4,
        "belongcityid": 1,
        "detail": "乌鲁木齐市双流区寄件取件点"
      }
    ],
    choosedValue:"",
    token: "",
    localaddress:""
  },
  //单选按钮设置
  radioChange:function(e){
    this.setData({
      choosedValue:e.detail.value
    })
  },
  //确认选择
  confirmSite:function(){
    var that=this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      site: that.data.choosedValue
    });
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options.addr);
    this.setData({
      localaddress:options.addr
    })
    var that = this;
    //获取token
    wx.getStorage({
      key: 'token',
      success: function (res) {
        that.setData({
          usertoken:res.data
        });
        var result = {};
        result.data = options.addr;
        result = JSON.stringify(result);
        //获取附件站点列表
        wx.request({
          url: ip+'locationAddress/getNearSite',
          method:"POST",
          data:result,
          header: {
            'Content-Type': 'application/json',
            "token": res.data
          },
          success: function (res) {
            that.setData({
              item: res.data.data
            })
          }
        })
      }
    })

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