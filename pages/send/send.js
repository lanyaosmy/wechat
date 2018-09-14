// pages/send/send.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    site:"四川大学"
  },
  //扫一扫寄件
  changeScan:function(e){
    var that=this;
    wx.scanCode({
      success: (res) => {
        console.log(res.result)
        //获取快递点的名称，用户信息
        wx.navigateTo({
          url: 'localOrder?site='+that.data.site,
        })
      }
    })
  },
  //上门寄件
  changeVisit: function (e) {
    var that = this;
    wx.navigateTo({
      url: 'order',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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