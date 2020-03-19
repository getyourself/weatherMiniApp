// pages/city/city.js
var app =  getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cities:[],hotCity:['北京','上海','广州','深圳','珠海',"佛山",'南京',"苏州",'厦门','南宁','成都','长沙',"福州",'杭州','武汉',"青岛",'西安','太原','石家庄','沈阳','重庆','天津','贵州','温州','郑州'],
    isChoosed:[]
  },
  searchCity(e){
    var newList = app.globalData.cities;
    if(!newList.includes(e.detail.value)){
      newList.unshift(e.detail.value);
      this.setData({
        cities:newList
      })
      app.globalData.cities.unshift(e.detail.value)
      wx.setStorage({
        key: 'cityNow',
        data: e.detail.value
      });
    }
    wx.switchTab({
      url: '/pages/bar/index'
    });
    console.log(app,this.data)
  },
  useNewCity(e){
    console.log(e.currentTarget.dataset.city)
    if(!app.globalData.cities.includes(e.currentTarget.dataset.city)){
      app.globalData.cities.unshift(e.currentTarget.dataset.city)
    }
    wx.setStorage({
      key: 'cityNow',
      data: e.currentTarget.dataset.city
    });
    wx.switchTab({
      url: '/pages/bar/index'
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    //天气页面传送数据
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      console.log(data)
    })
    this.setData({
      isChoosed:this.data.hotCity.map((ele,index)=>{
        if(app.globalData.cities.includes(ele)){
          return true
        } else{
          return false
        }
      }),
      weather:options.style,
      cities:app.globalData.cities
    })
    //同步样式
    var weatherStyle = {yun:'#5F9EA0',yu:'#19363f',qing:'#23b7e5',yin:'#191970',lei:'#19363f'}
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: weatherStyle[options.style],
      animation: {
        duration: 0,
        timingFunc: 'linear'
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  }
})