import * as echarts from '../../ec-canvas/echarts';
import geoJson from './mapData.js';

const app = getApp();

/**
 * 生成1000以内的随机数
 */
function randomData() {
  return Math.round(Math.random() * 1000);
}

function setOption(chart, xdata) {
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
      formatter: `{b}\n现存:{c}`
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
        itemStyle: {
          // 图形上的地图区域
          normal: {
            borderColor: "rgba(0,0,0,0.2)",
            areaColor: "#005dff"
          }
        }
      }
    ],
    toolbox: {
      show: true,
      orient: 'vertical',
      left: 'right',
      top: 'center',
      feature: {
        dataView: { readOnly: false },
        restore: {},
        saveAsImage: {}
      }
    },
    visualMap: {
      min: 800,
      max: 50000,
      text: ['High', 'Low'],
      realtime: false,
      calculable: true,
      inRange: {
        color: ['lightskyblue', 'yellow', 'orangered']
      }
    },
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
          return {name:ele.provinceShortName,value:ele.currentConfirmedCount}
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
  },
  onReady() {
  },
  onLoad(){
    this.eComponent = this.selectComponent('#mychart-dom-area');
    this.getOption();
    wx.showLoading({
      title: "加载中",
      mask: true
    });
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
        url: 'http://api.tianapi.com/txapi/ncovcity/index?key=d89f7e3012c413d6196130dfafdd3d0f',
        method: 'GET',
        header: {
            "Content-Type": "application/json"
        },
        success:function(res){
          console.log(res)
          _this.initChart(res.data.newslist);
          wx.hideLoading();
        }
    })  
  },
});
