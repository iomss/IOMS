<!-- 备品备件大屏展示 -->
<template>
  <div :style="backgroundpng">
    <div id="Title" data-options="region:'north'" style="height: 60px;">
      <h1 align="center" style="margin: 10px;color:white;font-size：36px">备品备件数据可视化分析</h1>
    </div>
    <div style="height: 240px;" data-options="region:'center'">
      <li style="width:35%;float:left;list-style: none; ">
        <div id="GetSpareSystemCount" data-options="region:'west'" style="height: 240px;box-sizing:border-box;border: 1px solid #084B8A;" />
      </li>
      <li style="box-sizing:border-box; list-style: none;  width:30%; float:left;">
        <div>
          <span style="text-align: center;display:block;color:yellow" v-html="GetSpareStockWares" />
          <div style="height: 210px;box-sizing:border-box;border: 1px solid #084B8A;margin: 5px;" data-options="region:'center'">
            <div id="GetSpareVulnerabil" style="height: 195px;" />
          </div>
        </div>
      </li>
      <li style=" box-sizing:border-box;border: 1px solid #084B8A; list-style: none; width:35%;float:right;">
        <div id="GetSpareChangeTimes" data-options="region:'east'" style="height: 240px;" />
      </li>
    </div>
    <div style="height:300px;" data-options="region:'south'">
      <li style="width:45%;float:left;list-style: none; ">
        <div id="GetSpareBill" data-options="region:'center'" style="height: 300px;box-sizing:border-box;border: 1px solid #084B8A;margin: 5px;" />
      </li>
      <li style="height:300px; width:55%;float:right;">
        <div id="GetSpareStayCount" data-options="region:'west'" style="height: 300px;box-sizing:border-box;border: 1px solid #084B8A;margin: 5px;">
          <h1 align="center" style="margin:0px;color:#6CC3FB;font-size:18px;fontWeight:bolder;">备品备件在用设备统计分析</h1>
          <ul v-for=" v in list.slice(0,5)" :key="v.name">
            <li style="position:relative;float:left;margin:10px 20px 20px 50px;">
              <img src="@/assets/haidong.png">
              <span style="position: absolute; top: 1px; left: 0px;color:white;font-size:12px"> {{ v.name }} </span>
              <span style="position: absolute; top: 50px; left: 0;color:white;font-size:12px"> 在用设备{{ v.value }}套 </span>
            </li>
          </ul>
          <ul v-for=" v in list.slice(5,10)" :key="v.name">
            <li style="position:relative;float:left;margin:10px 20px 20px 50px;">
              <img src="@/assets/haidong.png">
              <span style="position: absolute; top: 1px; left: 0px;color:white;font-size:12px">{{ v.name }}</span>
              <span style="position: absolute; top: 50px; left: 0;color:white;font-size:12px"> 在用设备{{ v.value }}套 </span>
            </li>
          </ul>
        </div>
      </li>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import backgroundimg from '@/assets/spare.png'
export default {
  name: 'StockView',
  data() {
    return {
      backgroundpng: {
        backgroundImage: 'url(' + backgroundimg + ')',
        padding: '0px',
        backgroundRepeat: 'no-repeat',
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: '0',
        left: '0',
        backgroundSize: '100% 100%' // cover
      },
      list: [],
      GetSpareStockWares: {},
      isShowSearch: true,
      formData: {
        top: '',
        positionId: '',
        beginTime: '',
        endTime: '',
        date: [new Date(), new Date()]
      },
      companyAllList: []
    }
  },
  mounted() {
    this.Getdata()
  },
  methods: {
    GetSpareSystemCount() {
      this.$axios.get('/api/SpareStatistics/GetSpareSystemCount').then(res => {
        // 基于准备好的dom，初始化echarts实例
        const charts = echarts.init(document.getElementById('GetSpareSystemCount'))
        // 绘制图表
        charts.setOption({
          title: {
            text: '各系统备件统计分析', // 主标题
            x: 'center', // x轴方向对齐方式
            textStyle: // 主标题文本样式
          { 'fontSize': 18,
            'fontWeight': 'bolder',
            'color': '#6CC3FB' }
          },
          tooltip: {
            trigger: 'item',
            formatter: ' {a} <br/>{b} : {c} ({d}%)'
          },
          series: [
            {
              name: '备件系统',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: res,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                normal: {
                  color: function(params) {
                    // 自定义颜色
                    var colorList = [
                      '#00FFFF', '#00FF00', '#FFFF00', '#FF8C00', '#FF0000', '#FE8463'
                    ]
                    return colorList[params.dataIndex]
                  }
                }
              }
            }
          ]
        })
      })
    },
    GetSpareChangeTimes() {
      this.$axios.get('/api/SpareStatistics/GetSpareChangeTimes').then(res => {
        const dataAxis = res.map(item => { return item.name })
        const dataAjax = res.map(item => { return (item.value) })
        // 定时关闭 加载动画
        setTimeout(() => {
          this.charts.hideLoading()
        }, 1000)
        // 基于准备好的dom，初始化echarts实例
        const myChart = echarts.init(document.getElementById('GetSpareChangeTimes'))
        // 绘制图表
        myChart.setOption({
          title: {
            text: '备品备件更换频次top10', // 主标题
            x: 'center', // x轴方向对齐方式
            textStyle: // 主标题文本样式
          { 'fontSize': 18,
            'fontWeight': 'bolder',
            'color': '#6CC3FB' }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'value',
              textStyle: {
                color: 'white' // 这里用参数代替了
              },
              data: dataAjax,
              interval: 0,
              boundaryGap: [0, 0.01]
            }
          ],
          yAxis: {
            data: dataAxis,
            axisLabel: {
              show: true,
              interval: 0,
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              textStyle: {
                color: 'white' // 这里用参数代替了
              }
            }
          },
          series: [
            {
              name: name,
              type: 'bar',
              data: dataAjax,
              barGap: '-100%',
              barCategoryGap: '40%',
              itemStyle: {
                normal: {
                  color: '#427aff'
                }
              }
            }
          ]
        })
      })
    },
    GetSpareVulnerabil() {
      this.$axios.get('/api/SpareStatistics/GetSpareVulnerabil').then(res => {
        // const dataAxis = res.map(item => { return item.name })
        // const dataAjax = res.map(item => { return (item.value) })
        // 定时关闭 加载动画
        setTimeout(() => {
          this.charts.hideLoading()
        }, 1000)
        // 基于准备好的dom，初始化echarts实例
        const myChart = echarts.init(document.getElementById('GetSpareVulnerabil'))
        // 绘制图表
        myChart.setOption({
          title: {
            text: '备品备件易损易耗统计分析', // 主标题
            textStyle: // 主标题文本样式
          { 'fontSize': 18,
            'fontWeight': 'bolder',
            'color': '#6CC3FB' },
            x: 'center' // x轴方向对齐方式
          },
          tooltip: {
            trigger: 'item',
            formatter: ' {a} <br/>{b} : {c} ({d}%)'
          },
          series: [
            {
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: res,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                normal: {
                  color: function(params) {
                    // 自定义颜色
                    var colorList = [
                      '#FFC100', '#9DC937'
                    ]
                    return colorList[params.dataIndex]
                  }
                }
              }
            }
          ]
        })
      })
    },
    GetSpareBill() {
      this.$axios.get('/api/SpareStatistics/GetSpareBill').then(res => {
        const dataAxis = res.map(item => { return item.name })
        const dataAjax = res.map(item => { return (item.value) })
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('GetSpareBill'))
        // 绘制图表
        myChart.setOption({
          title: {
            text: '出入库统计', // 主标题
            x: 'center', // x轴方向对齐方式
            textStyle: // 主标题文本样式
          { 'fontSize': 18,
            'fontWeight': 'bolder',
            'color': '#6CC3FB' }
          },
          color: ['#3398DB'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: dataAxis,
              axisTick: {
                alignWithLabel: true
              },
              axisLabel: {
                color: 'white',
                interval: 0
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              axisLabel: {
                color: 'white',
                interval: 0
              }
            }
          ],
          series: [
            {
              type: 'bar',
              barWidth: '60%', itemStyle: {
                normal: {
                  color: function(params) {
                    var colorList = ['#FC6D57', '#FCE003', '#9DC937']
                    return colorList[params.dataIndex]
                  }
                }
              },
              data: dataAjax
            }
          ]
        })
      })
    },
    GetSpareStayCount() {
      this.$axios.get('/api/SpareStatistics/GetSpareStayCount').then(res => {
        this.list = res
      })
    },
    GetSpareStockWare() {
      this.$axios.get('/api/SpareStatistics/GetSpareStockWare').then(res => {
        this.GetSpareStockWares = '备品备件总资产数:' + res.assetsCount + '&nbsp&nbsp&nbsp' + '总金额' + res.total + '万元'
      })
    },
    Getdata() {
      this.GetSpareSystemCount()
      this.GetSpareStayCount()
      this.GetSpareStockWare()
      this.GetSpareChangeTimes()
      this.GetSpareVulnerabil()
      this.GetSpareBill()
    }
  }
}
</script>
