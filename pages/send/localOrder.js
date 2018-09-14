// pages/send/localOrder.js
const ip = getApp().globalData.ip;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiArray: [],
    region: [
      { "city": "成都市", "district": ['双流区', '武侯区'] },
      { "city": "徐州市", "district": ['泉山区', '九里区'] },
    ],
    multiIndex: [0, 0],
    customItem: '全部',
    localaddress: '四川大学江安校区',
    site: "四川大学江安校区",
    usertoken: "",
    userName: "可达鸭",
    userTel: "13813471348",
    index: 0,
    userAddr: ["四川大学江安校区1", "四川大学江安校区2", "四川大学江安校区3"],
    selectedAddr: "",
    street: ""
  },
  //地区选择
  bindRegionChange: function (e) {
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    var that = this;
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        data.multiArray[1] = that.data.region[data.multiIndex[0]].distants;
        data.multiIndex[1] = 0;
        break;
    }
    this.setData(data);
  },
  //地址选择
  bindAddrChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  /**
   * 输入街道地址
   */
  inputStreet: function (e) {
    this.setData({
      street: e.detail.value
    })
  },  
  /**
   * 表单提交
   */
  orderSubmit: function (e) {
    var that = this;
    var formData = e.detail.value;
    var addr = this.data.userAddr[formData.sendAddr];
    var sphone = formData.sendPhone;
    var rphone = formData.recPhone;
    var index = that.data.multiIndex;
    var array = that.data.multiArray;
    var telpattern = /^(13|14|15|18)[0-9]{9}$/;
    if (!telpattern.test(sphone) || !telpattern.test(rphone)) {
      wx.showToast({
        title: '电话号码不正确',
        icon: 'none'
      });
      return false;
    } else if (formData.sendName.length == 0 || formData.recName.length == 0) {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none  '
      });
      return false;

    } else {
      formData.sendAddr = addr;
      formData.recAddr = array[0][index[0]] + array[1][index[1]] + this.data.street;
      formData.postAddr = that.data.localaddress;
      console.log(formData);
      wx.request({
        url: ip + 'user/send',
        data: formData,
        method: "POST",
        header: {
          'Content-Type': 'application/json',
          "token": that.data.usertoken
        },
        success: function (res) {
          if (res.data.error.code == 0) {
            wx.showToast({
              title: '添加成功',
              icon: 'none'
            });
            wx.navigateBack({
              delta: 1
            })
          }else{
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
      })   
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    this.setData({
      localaddress:options.site
    })

    wx.getStorage({
      key: 'token',
      success: function (res) {
        that.setData({
          usertoken: res.data
        });
        const token = res.data;
        //获取寄件人信息
        wx.request({
          url: ip + 'user/getUserInfo',
          header: {
            "token": res.data
          },
          success: (res) => {
            var result = res.data;
            if (result.error.code == 0) {
              that.setData({
                userName: result.data.userName,
                userTel: result.data.Tel,
                
              })
            }
          }
        })
        //获取地区列表
        wx.request({
          url: ip + 'userAddr/getList',
          header: {
            "token": res.data
          },
          success: (res) => {
            if (res.data.error.code == 0) {
              that.setData({
                userAddr: res.data.data.city + res.data.data.distant + res.data.data.detail
              });
            }
          }
        });
        //获取地区列表，并初始化地区选择器
        wx.request({
          url: ip + 'index/getRegionInfo',
          header: {
            "token": res.data
          },
          success: (res) => {
            if (res.data.error.code == 0) {
              that.setData({
                region: res.data.data
              });
              var city = [];
              var regionList = that.data.region;
              for (var obj in regionList) {
                city.push(regionList[obj].cityName);
              }
              //console.log(city);
              var cityandregion = [];
              cityandregion.push(city);
              cityandregion.push(regionList[0].distants);
              that.setData({
                multiArray: cityandregion
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