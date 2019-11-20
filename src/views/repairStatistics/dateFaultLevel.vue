<template>
  <div class="app-container">

    <el-form v-show="isShowSearch" :inline="true" :model="formData" class="demo-form-inline" size="small">

      <el-form-item label="单位名称">
        <el-select v-model="formData.state" placeholder="状态">
          <el-option label="全部" value="" />
          <el-option v-for="item in companyAllList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="选择时间">
        <el-col :span="24">
          <el-date-picker
            v-model="formData.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          />
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <div class="chart">
      <div id="report" class="chart-box" style="width: 100%;height: 400px;" />
    </div>

  </div>

</template>

<style scoped>

    .filter-container{
        overflow: hidden;
    }
    .toolbar .el-button{
      margin-left:2px;
    }
    .pull-left{
      float : left;
    }
    .pull-right{
      float : right;
    }
    .btn-xs{
      padding: 1px 5px;
      font-size: 11px;
      line-height: 1.5;
      border-radius: 2px;

      box-shadow: none;
      border: 1px solid transparent;
    }

    .chart{
      width: 100%;
      height: 100%;
    }
    .chart-box{
      margin-top: 50px;
    }
</style>

<script>

import echarts from 'echarts'

export default {
  data() {
    return {
      isShowSearch: true,
      formData: {
        positionId: '',
        beginTime: '',
        endTime: '',
        date: [new Date(), new Date()]
      },
      dataAxis: [],
      dataAjax: [],
      charts: '',
      fault: '',
      companyAllList: []
    }
  },
  mounted() {
    this.companyAll()
  },
  methods: {
    draw(id) {
      this.charts = echarts.init(document.getElementById(id))

      this.charts.showLoading({
        text: '图表加载中'
      })

      const option = {
        title: {
          text: '故障量-日期分布图'
        },

        tooltip: {},
        legend: {
          data: ['维修次数']
        },
        toolbox: {
          show: true,
          feature: {
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        grid: { left: '10%', bottom: '20%' },
        xAxis: [
          {
            type: 'category',
            data: this.dataAxis,
            axisLabel: {
              interval: 0,
              rotate: 40
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '维修次数',
            type: 'bar',
            data: this.dataAjax,
            barGap: '-100%',
            barCategoryGap: '40%',
            itemStyle: {
              normal: {
                color: '#427aff'
              }
            },
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            }
          }
        ]
      }
      this.charts.setOption(option)
    },

    // 图表统计
    system() {
      this.$axios.get(`/api/OperationStatistic/GetDateCount?positionId=${this.formData.positionId}&beginTime=${this.formData.beginTime}&endTime=${this.formData.endTime}`).then(res => {
        this.dataAxis = res.map(item => { return item.name })
        this.dataAjax = res.map(item => { return item.value })

        this.draw('report')

        // 定时关闭 加载动画
        setTimeout(() => {
          this.charts.hideLoading()
        }, 1000)
      })
    },

    // 获取所有单位
    companyAll() {
      this.$axios.get(`/api/Tree/Position/All?startLevel=${2}&endLevel=${2}`).then(res => {
        this.companyAllList = res
      })
    },

    // 日期时间格式化
    formatterDate(row, column, cellValue) {
      if (cellValue !== null) {
        return this.$moment(cellValue).format('YYYY-MM-DD')
      } else {
        return cellValue
      }
    },

    onSubmit() {
      this.formData.beginTime = this.formData.date.length !== 0 ? this.formatterDate(1, 1, this.formData.date[0]) : ''
      this.formData.endTime = this.formData.date.length !== 0 ? this.formatterDate(1, 1, this.formData.date[1]) : ''

      this.system()
    }
  }
}
</script>
