import * as echarts from '../../ec-canvas/echarts';
import geoJson from './mapData.js';

const app = getApp();

function setOption(chart, xdata) {
  var customSettings = [];
  var colorSet = ["white","#ffaa85","#ff7b69","#cc2929","#8c0d0d","#8c0d0d"];
  var color;
  xdata.forEach(function (item, index) {
    color = colorSet[Math.floor(Math.log(item.total.nowConfirm)/Math.log(4))]
    customSettings.push({
        name: item.name,
        itemStyle: {
            areaColor: color
        }
    })
  })
  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: "#FFF",
      padding: [
        10,  // 上
        15, // 右
        8,  // 下
        15, // 左
      ],
      extraCssText: 'box-shadow: 2px 2px 10px rgba(21, 126, 245, 0.35);',
      textStyle: {
        fontFamily: "'Microsoft YaHei', Arial, 'Avenir', Helvetica, sans-serif",
        color: '#005dff',
        fontSize: 12,
      },
      formatter: `{b}\n现存确诊:{c}`
    },
    geo: [
      {
        // 地理坐标系组件
        map: "china",
        roam: false, // 可以缩放和平移
        aspectScale: 0.8, // 比例
        layoutCenter: ["50%", "38%"], // position位置
        layoutSize: 370, // 地图大小，保证了不超过 370x370 的区域
        label: {
          // 图形上的文本标签
          normal: {
            show: true,
            textStyle: {
              color: "rgba(0, 0, 0, 0.9)",
              fontSize: '8'
            }
          },
          emphasis: { // 高亮时样式
            color: "#333"
          }
        },
        regions: customSettings
      }
    ],
    series: [
      {
        type: 'map',
        mapType: 'china',
        geoIndex: 0,
        roam: false, // 鼠标是否可以缩放
        label: {
          normal: {
            show: true
          },
          emphasis: {
            show: true
          }
        },
        data: xdata.map((ele,ind)=>{
          return {name:ele.name,value:ele.total.nowConfirm}
        })
      }]
  };
  chart.setOption(option)
}

/**
 * 全国疫情分布地图
 */

Page({
  data: {
    ec:{
      lazyLoad:true
    },
    lower:true
  },
  onReady() {
  },
  onLoad(){
    this.eComponent = this.selectComponent('#mychart-dom-area');
    this.getOption();
  },
  initChart: function (xdata) {   
    this.eComponent.init((canvas, width, height) => {
        const chart = echarts.init(canvas, null, {
            width: width,
            height: height
        });
        canvas.setChart(chart);
        echarts.registerMap('china', geoJson);  // 绘制中国地图
        setOption(chart, xdata)
        this.chart = chart;
        return chart;
    })
  },
  getOption: function () {        //这一步其实就要给图表加上数据
    var _this = this;
    wx.request({
        url: 'https://view.inews.qq.com/g2/getOnsInfo?name=disease_h5',
        method: 'GET',
        header: {
            "Content-Type": "application/json"
        },
        success:function(res){
          var covid = JSON.parse(res.data.data)
          console.log(covid)
          _this.initChart(covid.areaTree[0].children);
          _this.setData({
            covidData:covid
          })
          wx.setStorageSync("covid", covid);
          wx.hideLoading();
        }
    }) 
  },
  showLower(){
    var _this = this
    wx.showToast({
      title: '加载中',
      icon: 'none',
      image: '',
      duration: 1500,
      mask: true
    });
    this.setData({
      lower:!_this.data.lower
    })
    wx.hideToast();
  }
});
