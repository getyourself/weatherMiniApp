//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    weather:[],location:"",rain:false,three:[]
  },
  switch(){
    wx.navigateTo({
      url: '/pages/city/city',
    })
  },
  configure(){
    wx.openSetting({})
  },  
  onLoad: function () {
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success(res){
        console.log(res);
        wx.request({
          url: 'http://www.tianqiapi.com/api?version=v1&appid=23035354&appsecret=8YvlPNrz',
          method: 'GET',
          success: function(result) {
            console.log(result)
            that.setData({
              weather:result.data.data,
              location:result.data.city,
              rain:/\u96e8/.test(result.data.data[0].hours[1].wea)||/\u96e8/.test(result.data.data[0].hours[0].wea),
              three:result.data.data.slice(0,3)
            })
          },
          fail: function(res) {
            console.log("请求失败")
          }
        })
      }
    })
  }
})
