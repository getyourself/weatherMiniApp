import * as echarts from '../../ec-canvas/echarts';

let chart = null;let chart2 = null;
var app =  getApp();
var qurl = 'https://www.tianqiapi.com/api?version=v1&appid=23035354&appsecret=PGgTiHl1&city='+ wx.getStorageSync("cityNow")
function setOption(chart, xdata, ydata) {
  var option = {
    title: {
      text: '  未来一周天气变化',
      textStyle:{
        color:"#FFFFFF",
        fontSize:16,
        fontWeight:"normal"
      },
      textAlign:'auto'
    },
  tooltip: {
      trigger: 'axis',
      show:true,
      formatter:'{a0}: {c0}\n{a1}: {c1}\n{a2}: {c2}'
  },
  xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xdata.map((ele,ind)=>{
        return ind===0?("今天"):ele.week
      }),
      axisLine:{
        lineStyle:{
          color:"#FFFFFF"
        }
      }
  },
  yAxis: [{
      min:function(value){
        return value.min
      },
      type: 'value',
      axisLabel: {
          formatter: '{value}'
      },
      name:"气温(℃)",
      nameLocation:"end",
      axisLine:{
        lineStyle:{
          color:"#FFFFFF"
        }
      }
  },{
    name:"",
    type: 'value',
    axisLine:{
      lineStyle:{
        color:"#FFFFFF"
      }
    }
  }],
  series: [
      {
          name: '平均气温',
          type: 'line',
          data: ydata.map((ele,ind)=>{
            return {
              value:ele.tem.replace("℃","")
            }
          }),
          smooth:true,
          symbol:"none"
      },
      {
          name:"风向",
          type:'line',
          yAxisIndex:1,
          data: ydata.map((ele,ind)=>{
            return {
              value:ele.win[0]+ele.win_speed.replace("<","小于")
            }
          })
      },
      {
        name:"天气",
        type:'line',
        yAxisIndex:1,
        data: ydata.map((ele,ind)=>{
          return  {
            value:ele.wea
          }
        })
      }
  ]
  };
  chart.setOption(option)
}
function setOption2(chart, xdata, ydata) {
  var nowData = ydata[0].hours.concat(ydata[1].hours).filter((ele,ind)=>{
    if(parseInt(ele.day.match(/[\u4e00-\u9fa5](\d{2})[\u4e00-\u9fa5]/)[1]) >= new Date().getHours() || parseInt(ele.day.match(/\d{2}/)[0]) > new Date().getDate()){
      return true
    }
  });
  function getMarkLine(ind){
      return [{
        symbol:"none",
        lineStyle:{
          color:"white"
        },
        coord:[ind,0]
      },{
        symbol:"none",
        lineStyle:{
          color:"white"
        },
        coord:[ind,parseInt(nowData[ind].tem.replace("℃",""))]
      }
    ]
  }
  var option = {
    title: {
      text: ''
    },
    grid:{
      left:20,
      top:30,
      right:20,
      bottom:40
    },
    xAxis: {
        type: 'category',
        show:true,
        boundaryGap:false,
        data: nowData.map((ele,ind)=>{
          return ele.day.match(/[\u4e00-\u9fa5](\d{2})[\u4e00-\u9fa5]/)[1]+"时"+"\n"+ele.wea
        }),
        axisLine:{
          show:false,
          lineStyle:{
            color:"#FFFFFF"
          }
        },
        "axisTick":{     
          "show":false
        },
    },
    yAxis: [{
        type: 'value',
        show:false 
    }],
    series: [
        {
            name: '气温',
            type: 'line',
            data: nowData.map((ele,ind)=>{
              return ele.tem.replace("℃","")
            }),
            smooth:false,
            itemStyle : { normal: {
              label : {show: true},
              lineStyle:{
                color:"white"
              },
              color:"white"
            }},
            markLine:{/*显示虚线*/
                data: [...new Array(nowData.length).keys()].map((ele,index)=>{
                  return getMarkLine(index)
                })
              }
        }
    ]
  };
  chart.setOption(option)
}
Page({
  data: {
    weather:[],
    rain:false,
    three:[],
    ec:{
      lazyLoad:true
    },
    ec2:{
      lazyLoad:true
    },
    weatherInShortTerm:""
  },
  switch(){
    var that = this;
    wx.navigateTo({
      url: '/pages/city/city?style='+this.data.weather[0].wea_img,
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {cityData:that.data.weather[0],cityName:that.data.location})
      }
    })
  },
  configure(){
    wx.openSetting({})
  },  
  initChart: function (xdata, ydata) {   
    this.eComponent.init((canvas, width, height) => {
        const chart = echarts.init(canvas, null, {
            width: width,
            height: height
        });
        setOption(chart, xdata, ydata)
        this.chart = chart;
        return chart;
    });
    this.eComponent2.init((canvas, width, height) => {
      const chart2 = echarts.init(canvas, null, {
          width: width,
          height: height
      });
      setOption2(chart2, xdata, ydata)
      this.chart2 = chart2;
      return chart2;
  });
  },
  getOption: function () {        //这一步其实就要给图表加上数据
    var _this = this;
    wx.request({
        url: 'https://www.tianqiapi.com/api?version=v1&appid=73667599&appsecret=PGgTiHl1&city='+ wx.getStorageSync("cityNow"),    //接口地址
        method: 'POST',
        header: {
            "Content-Type": "application/json"
        },
        success:function(res){
          console.log(res)
            _this.initChart(res.data.data,res.data.data);
            _this.setData({
              weather:res.data.data,
              location:res.data.city,
              rain:res.data.data[0].wea.includes("雨"),
              three:res.data.data.slice(0,3),
              temperature:res.data.data[0].tem.replace("℃",""),
              weatherInShortTerm:res.data.data[0].hours.filter((element)=> {
                if (parseInt(element.day.match(/[\u4e00-\u9fa5](\d{2})[\u4e00-\u9fa5]/)[1]) >= new Date().getHours()||parseInt(element.day.match(/\d{2}/))>new Date().getDate()){
                  console.log(element.wea)
                  return true
                }
              })[0].wea
            })
            var weatherStyle = {yun:'#5F9EA0',yu:'#19363f',qing:'#23b7e5',yin:'#191970',lei:'#19363f'}
            wx.setNavigationBarColor({
              frontColor: '#ffffff',
              backgroundColor: weatherStyle[res.data.data[0].wea_img]
            }); 
            console.log(app.globalData)
            if(!app.globalData.cities.includes(res.data.city)){
              app.globalData.cities.push(res.data.city)
            }
            
        }
    })  
  },
  onLoad() {
    this.eComponent = this.selectComponent('#mychart-dom-bar');
    this.eComponent2 = this.selectComponent('#mychart-dom-bar2');
    this.getOption();
  },
  onShow(){
    qurl = 'https://www.tianqiapi.com/api?version=v1&appid=23035354&appsecret=PGgTiHl1&city='+ wx.getStorageSync("cityNow");
    this.getOption();
  },
  onPullDownRefresh: function () {
    this.getOption();
  }
});
