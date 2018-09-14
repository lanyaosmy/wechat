//index.js
//获取应用实例
const app = getApp()
const ip = getApp().globalData.ip;
Page({
  data: {
    notReceList:[
    ],
    transportList: [
    ],
    receivedList: [
    ],
    showModal:true,
    showMain:true,
    searchResult: [
      
    ],
    usertoken:"",
    orderid:""
  },
  //订单号输入
  inputOrder:function(e){
    this.setData({
      orderid:e.detail.value
    })
  },
  //输入框失去焦点显示订单列表
  searchBlur:function(e){
    this.setData({
      showMain: true
    })
  },
  //根据订单号搜索
  searchOrder:function(e){
    var that=this;
    //console.log(that.data.usertoken);
    if (that.data.orderid.length==0){
      wx.showToast({
        title: '请输入订单号',
        icon:'none'
      })
    }else{
      wx.request({
        url: ip + 'index/search',
        data: { orderNum: that.data.orderid },
        header: {
          "token": that.data.usertoken
        },
        success: function (res) {
          if (res.data.error.code == 0) {
            that.setData({
              searchResult: res.data.data
            });
          } else {
            wx.showToast({
              title: res.data.error.message,
              icon: 'none'
            })
          }
        }
      })
      
      this.setData({
        showMain: false
      });
      this.setData({
        orderid: ""
      })
    }

  },
  preventTouchMove: function () {
  },
  //模态框点击确定
  onConfirm:function(){
    this.setData({
      showModal: false
    });
  },
  //待签收切换
  checkReceive:function(e){
    wx.switchTab({
      url: '../pick/pick',
    })
  },
  //扫描二维码
  scanQRCode:function(e){
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res.result)
      }
    })
  },
  onLoad: function () {
    var that = this;
    wx.getStorage({
      key: 'token',
      success: function (res) {
        that.setData({
          usertoken: res.data
        });
        //获取主页列表
        wx.request({
          url: ip + 'index/get',
          header: {
            token: res.data
          },
          success: (res) => {
            //console.log(res.data);
            if (res.data.error.code == 0) {
              //console.log(res.data.data.notReceList)
              that.setData({
                notReceList: res.data.data.notReceList,
                transportList: res.data.data.transportList,
                receivedList: res.data.data.receivedList
              });
            } else {
              wx.showToast({
                title: '获取信息失败，请检查网络',
                icon: 'none'
              });
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
    var that = this;
    wx.getStorage({
      key: 'token',
      success: function (res) {
        that.setData({
          usertoken: res.data
        });
        //获取主页列表
        wx.request({
          url: ip + 'index/get',
          header: {
            token: res.data
          },
          success: (res) => {
            //console.log(res.data);
            if (res.data.error.code == 0) {
              //console.log(res.data.data.notReceList)
              that.setData({
                notReceList: res.data.data.notReceList,
                transportList: res.data.data.transportList,
                receivedList: res.data.data.receivedList
              });
            } else {
              wx.showToast({
                title: '获取信息失败，请检查网络',
                icon: 'none'
              });
            }
          }
        })
      }

    });
  }
})
