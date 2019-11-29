<template>
  <div class="app-container">

    <el-form v-show="isShowSearch" :inline="true" :model="formData" class="demo-form-inline" size="small">

      <el-form-item label="位置列表">
        <el-button style="width: 194px;" plain @click="centerDialogVisible = true">{{ positionName }}</el-button>
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
      <div id="proportion" class="chart-box" style="width: 500px;height: 400px;margin: 50px auto 0px;" />
    </div>

    <!-- 设备位置 -->
    <el-dialog
      title="位置列表"
      :visible.sync="centerDialogVisible"
      width="40%"
      center
    >
      <el-tree
        ref="treeForm"
        class="filter-tree"
        :data="companyAllList"
        show-checkbox
        node-key="id"
        check-strictly
        accordion
        :props="defaultProps"
        @check-change="handleClick"
      />
    </el-dialog>

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
      centerDialogVisible: false,
      formData: {
        positionId: '',
        beginTime: '',
        endTime: '',
        date: [new Date(), new Date()]
      },
      charts: '',
      fault: '',
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      companyAllList: [],
      systemAllList: [],
      positionName: '请选择设备位置'
    }
  },
  mounted() {
    this.companyAll()
    this.systemAll()
  },
  methods: {
    draw(id, dataAxis, dataAjax) {
      this.charts = echarts.init(document.getElementById(id))

      this.charts.showLoading({
        text: '图表加载中'
      })

      const option = {
        title: {
          text: '位置故障统计分析'
        },

        tooltip: {},
        legend: {
          data: ['维修次数']
        },
        grid: { left: '10%', bottom: '20%' },
        toolbox: {
          show: true,
          feature: {
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: [
          {
            type: 'category',
            data: dataAxis,
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
            data: dataAjax,
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
    // 比例
    proportion(id, dataAxis, res) {
      this.fault = echarts.init(document.getElementById(id))

      this.fault.showLoading({
        text: '图表加载中'
      })

      const option = {
        title: {
          text: '故障比例',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        legend: {
          bottom: 10,
          left: 'center',
          data: dataAxis
        },
        series: [
          {
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: res,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      this.fault.setOption(option)
    },
    // 图表统计
    system() {
      this.$axios.get(`/api/OperationStatistic/GetUnitCount?positionId=${this.formData.positionId}&beginTime=${this.formData.beginTime}&endTime=${this.formData.endTime}`).then(res => {
        const dataAxis = res.map(item => { return item.name })
        const dataAjax = res.map(item => { return item.value })

        this.draw('report', dataAxis, dataAjax)
        this.proportion('proportion', dataAxis, res)

        // 定时关闭 加载动画
        setTimeout(() => {
          this.charts.hideLoading()
          this.fault.hideLoading()
        }, 1000)
      })
    },
    // 获取所有单位
    companyAll() {
      this.$axios.get(`/api/Tree/Position/All?startLevel=${2}`).then(res => {
        this.companyAllList = res
      })
    },
    // 获取所有系统
    systemAll() {
      this.$axios.get(`/api/Meta/System?topLevel=${true}`).then(res => {
        this.systemAllList = res.data
      })
    },
    // 选择 设备位置
    handleClick(data, checked, node) {
      if (checked === true) {
        // 默认不选择 最后一级
        if (data.children !== null) {
          this.formData.positionId = data.id
          this.positionName = data.name
          this.centerDialogVisible = false
          this.$refs.treeForm.setCheckedNodes([data])
        } else {
          this.$message.error('不能选择最后一级')
          this.$refs.treeForm.setChecked(data, false)
        }
      }
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
