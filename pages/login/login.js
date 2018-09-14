// pages/login/login.js
const ip = getApp().globalData.ip;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },  
  //跳转到注册页
  register:function(e){
    wx.navigateTo({
      url: 'register',
    })
  },
  //提交表单
  loginsubmit: function(e){
      var formData = e.detail.value;
      var phone=e.detail.value.phone;
      var pwd=e.detail.value.password;
      if(phone.length==0||pwd.length==0){
        wx.showToast({
          title: '用户名和密码不能为空',
          icon: 'none',
          duration: 1500
        }) 
      }else{
        wx.request({
          url: ip+'login',
          data: formData,
          method: "POST",
          header: {
            'Content-Type': 'application/json'
          },
          success: function (res) {
            var result=res.data;
            //console.log(result)
            if(result.error.code == 1){
                //token保存在本地
              wx.setStorage({
                key: "token",
                data: result.data.token
              })
              if(result.data.userType=="user"){
                wx.reLaunch({
                  url: '../index/index',
                });
              }else if (result.data.userType == "staff") {
                if(result.data.staffType == 1){
                  wx.reLaunch({
                    url: '../transCenter/index'
                  });
                }
                if (result.data.staffType == 2){
                  wx.reLaunch({
                    url: '../lastLocation/index'
                  });
                }
              }
            }else{
              wx.showToast({
                title: result.error.message,
                icon: 'none',
                duration: 1500
              }) 
            }
          },
          fail:(res)=>{
            wx.showToast({
              title: res.errMsg,
              icon:'none'
            })
          }
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