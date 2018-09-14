// pages/login/register.js
const ip = getApp().globalData.ip;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pwd:"",
    tel:"",
    repwd:"",
    _user:0,
    _checkpwd:0
  },
  rePassword:function(e){
    this.setData({
      repwd:e.detail.value
    })
    if(this.data.repwd!=this.data.pwd){
      this.setData({
        _checkpwd: 1
      })
    } else {
      this.setData({
        _checkpwd: 0
      })
    }
  },
  setPassword: function (e) {
    this.setData({
      pwd: e.detail.value
    })
  },
  setPhone: function (e) {
    this.setData({
      tel: e.detail.value
    })
    var telpattern = /^(13|14|15|18)[0-9]{9}$/;
    if (!telpattern.test(this.data.tel)) {
      this.setData({
        _user: 1
      })
    }else{
      this.setData({
        _user: 0
      })
    }
  },
  //提交注册表单
  registersubmit:function(e){
    var formData = e.detail.value;
    var that=this;
    var tel=this.data.tel;
    var password=this.data.pwd;
    var repassword=this.data.repwd;
    var telpattern = /0?(13|14|15|18)[0-9]{9}/;
    if(tel==""||password==""||repassword==""){
      wx.showToast({
        title: '不能为空',
        icon: 'loading',
        duration: 1500
      })
      return false;
    }else if(that.data._user!=0||that.data._checkpwd!=0){
      wx.showToast({
        title: '信息未填写完整',
        duration: 1500
      })
      return false;   
    }else{
      wx.request({
        url: ip+'regist/user',
        data: formData,
        method:"POST",
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {   
          console.log(res.data.data)
          if(res.data.error==1){
            wx.showToast({
              title: '注册成功',
            })
          }else{
            wx.showToast({
              title: res.data.error.message,
              icon:'none'
            })
          }
        }
      })  
      that.setData({
        tel:"",
        pwd:"",
        repwd:""
      })
      wx.navigateBack({
        delta:1
      })
    }

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