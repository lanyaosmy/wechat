// pages/user/tel.js
const ip = getApp().globalData.ip;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userTel:"",
    _focus:0,
    usertoken:""
  },
  inputfocus:function(e){
      this.setData({
        _focus:1
      })
  },
  inputblur: function (e) {
    this.setData({
      _focus: 0
    })
  },
  setTel:function(e){
    this.setData({
      tel:e.detail.value
    })
  },
  submitTel:function(e){
    var that=this;
    var phone = this.data.tel;
    var phonetel = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/; 
    if(!phonetel.test(phone)){
      wx.showToast({
        title: '手机号有误！',
        icon: 'none',
        duration: 1500
      })
      return false; 
    }
    //console.log(this.data.tel)
    wx.request({
      url: ip+'user/updatePhone',
      data:{
        phone: that.data.userTel
      },
      header: {
        "token": that.data.usertoken
      },
      success:(res)=>{
        if(res.data.error.code==0){
          wx.showToast({
            title: '修改成功',
            icon: 'none'
          })
          wx.navigateBack({
            delta: 1
          })
        }else{
          wx.showToast({
            title: '修改失败',
            icon: 'none'
          })
        }

      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that=this;
      //获取token
      wx.getStorage({
        key: 'token',
        success: function (res) {
          that.setData({
            usertoken: res.data
          })
          //获取寄件人信息
          wx.request({
            url: ip + 'user/getUserInfo',
            header: {
              "token": res.data
            },
            success: (res) => {
              var result = res.data;
              //console.log(result);
              if (result.error.code == 0) {
                that.setData({
                  userTel: result.data.userTel,
                })
              }
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