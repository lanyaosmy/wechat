// pages/send/order.js
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
const ip = getApp().globalData.ip;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiArray: [],
    region:[
    ],
    multiIndex: [0, 0],
    customItem: '全部',
    localaddress:'四川大学江安校区',
    site:"",
    usertoken:"",
    userName: "可达鸭",
    userTel: "13813471348",
    index:0,
    userAddr: [],
    selectedAddr:"",
    street:""
  },
  //地区选择
  bindRegionChange: function (e) {
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    var that=this;
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
  bindAddrChange:function(e){
    this.setData({
      index: e.detail.value
    })
  },
  /**
   * 选择站点
   */
  chooseSite:function(e){
    var that=this;
    wx.navigateTo({
      url: 'chooseSite?addr='+that.data.localaddress,
    })
  },
  /**
   * 输入街道地址
   */
  inputStreet:function(e){
    this.setData({
      street:e.detail.value
    })
  },  
  /**
   * 表单提交
   */
  orderSubmit:function(e){
    var that=this;
    var formData=e.detail.value;
    var addr = this.data.userAddr[formData.sendAddr];
    var sphone=formData.sendPhone;
    var rphone=formData.recPhone;
    var index=that.data.multiIndex;
    var array = that.data.multiArray;
    var telpattern = /^(13|14|15|18)[0-9]{9}$/;
    if (!telpattern.test(sphone) || !telpattern.test(rphone)){
      wx.showToast({
        title: '电话号码不正确',
        icon:'none'
      });
      return false;
    } else if (formData.sendName.length == 0 || formData.recName.length==0){
      wx.showToast({
        title: '姓名不能为空',
        icon:'none  '
      });
      return false;
      
    }else{  
      formData.sendAddr = addr;
      formData.recAddr = array[0][index[0]] + array[1][index[1]]+ this.data.street;
      formData.postAddr =that.data.site;
      //console.log(formData); 
      wx.request({
        url: ip+'user/send',
        data: formData,
        method: "POST",
        header: {
          'Content-Type': 'application/json',
          "token": that.data.usertoken
        },
        success: function (res) {
          //console.log(res);   
          if(res.data.error.code == 0){
            wx.showToast({
              title: '添加成功',
              icon:'none',
              duration:2000
            });
            wx.navigateBack({
              delta: 1
            });
          }else{
            wx.showToast({
              title: '添加失败',
              icon: 'none'
            });
          }

        }
      })  
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取token
    wx.getStorage({
      key: 'token',
      success: function (res) {
        that.setData({
          usertoken:res.data
        });
        const token=res.data;
        // 实例化腾讯地图API核心类
        qqmapsdk = new QQMapWX({
          key: '3CGBZ-ZPNW3-JGX3L-YCAVW-ZP7RH-TXFY7'
        });
        //获取当前位置坐标
        wx.getLocation({
          type: 'wgs84',
          success: function (res) {
            //根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
            qqmapsdk.reverseGeocoder({
              location: {
                latitude: res.latitude,
                longitude: res.longitude
              },
              success: function (addressRes) {

                var addr = addressRes.result.formatted_addresses.recommend;
                var indexaddr = addr.substring(0, addr.indexOf("区") + 1);
                that.setData({
                  localaddress: indexaddr
                });

                var result = {};
                result.data = indexaddr;
                result = JSON.stringify(result);
                //获取附件站点列表
                wx.request({
                  url: ip + 'locationAddress/getNearSite',
                  method: "POST",
                  data: result,
                  header: {
                    'Content-Type': 'application/json',
                    "token": token
                  },
                  success: function (res) {
                    that.setData({
                      site: res.data.data[0].detail
                    })
                  }
                })

              }
            });
          }
        });
        //获取寄件人信息
        wx.request({
          url: ip + 'user/getUserInfo',
          header: {
            "token": token
          },
          success: (res) => {
            var result = res.data;
            if (result.error.code == 0) {
              that.setData({
                userName: result.data.userName,
                userTel: result.data.userTel,
                userAddr: result.data.addersses
              })
            }
          }
        });
        //获取地区列表，并初始化地区选择器
        wx.request({
          url: ip + 'index/getRegionInfo',
          header: {
            "token": token
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
            }else{
              wx.showToast({
                title: '获取地区失败',
                icon: 'none'
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