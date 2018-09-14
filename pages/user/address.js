// pages/user/address.js
const ip = getApp().globalData.ip;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addrList: [
    ],
    multiArray: [],
    region: [
      { "city": "成都市", "district": ['双流区', '武侯区'] },
      { "city": "徐州市", "district": ['泉山区', '九里区'] },
    ],
    multiIndex: [0, 0],
    street:"",
    customItem: '全部',
    usertoken:""
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
  //输入街道地址
  inputstreet:function(e){
    this.setData({
      street:e.detail.value
    })
  },
  //删除地址
  deleteaddr:function(e){
    //console.log(e.currentTarget.dataset.id)
    var delid = e.currentTarget.dataset.id;
    var list=this.data.addrList
    var that=this;
    wx.request({
      url: ip+'userAddr/delete/'+delid,
      header:{
        "token": that.data.usertoken
      },
      success:(res)=>{
        if(res.data.error.code==1){
          for (let i = 0; i < list.length; i++) {
            if (list[i].addrId === delid) {
              list.splice(i, 1);
            }
          }
          this.setData({
            addrList: list
          });
          wx.showToast({
            title: '删除成功',
            icon:'none'
          });
        }else{
          wx.showToast({
            title: '删除失败',
            icon:"none"
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
  },
  //新增地址
  submitaddr:function(e){
    var that=this;
    var index = that.data.multiIndex;
    var array = that.data.multiArray;
    var newStreet=that.data.street;
    var newaddr = { "city": array[0][index[0]], "distant": array[1][index[1]],"detail": newStreet};

 
    wx.request({
      url: ip+'userAddr/add',
      method:"POST",
      data:newaddr,
      header: {
        'Content-Type': 'application/json',
        "token": that.data.usertoken
      },
      success:function(res){
        if(res.data.error.code==1){
          wx.request({
            url: ip + 'userAddr/getList',
            header: {
              "token": that.data.usertoken
            },
            success: (res) => {
              if (res.data.error.code == 1) {
                that.setData({
                  addrList: res.data.data
                });
              }else{
                wx.showToast({
                  title: res.data.error.message,
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
          });
        }else{
          wx.showToast({
            title: '添加失败',
            icon: 'none'
          })
        }
      }
    })
  },
  bindRegionChange:function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.getStorage({
      key: 'token',
      success: function (res) {
        that.setData({
          usertoken: res.data
        });
        const token = res.data;
        //获取地区列表
        wx.request({
          url: ip + 'userAddr/getList',
          header: {
            "token": res.data
          },
          success: (res) => {
            if (res.data.error.code == 1) {
              that.setData({
                addrList: res.data.data
              });
            }
          }
        });
        //初始化地区选择器
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