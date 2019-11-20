<template>
  <div class="app-container">
    <el-form v-show="isShowSearch" :inline="true" :model="formData" class="demo-form-inline" size="small">
      <el-form-item label="设备位置">
        <el-cascader
          v-model="equipmentValue"
          :props="optionProps"
          :options="equipmentList"
          @change="handleChange"
        />
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
      <div id="report" class="chart-box" style="width: 100%;height: 450px;" />
      <div id="proportion" class="chart-box" style="height: 400px;" />
    </div>
    <el-table
      :key="table.tableKey"
      v-loading="table.listLoading"
      :data="table.list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      size="small"
    >
      <el-table-column label="工单号" prop="assetCode" sortable="custom" align="center" />
      <el-table-column label="报修设备" prop="equipment.name" align="center" />
      <el-table-column label="维修等级" prop="repairLevel.name" align="center" />
      <el-table-column label="报修故障" prop="equipmentFault.name" align="center" />
      <el-table-column label="维修过程" prop="description" align="center" />
      <el-table-column label="维修人" prop="checkUser.name" align="center" />
    </el-table>
    <pagination v-show="table.total>0" :total="table.total" :page.sync="formData.pageNumber" :limit.sync="formData.pageSize" @pagination="tableList" />
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
import pagination from '@/components/Pagination'

export default {
  components: {
    pagination
  },
  data() {
    return {
      isShowSearch: true,
      formData: {
        equipmentId: '',
        positionId: '',
        beginTime: '',
        endTime: '',
        date: [new Date(), new Date()],
        pageSize: 10,
        pageNumber: 1
      },
      charts: '',
      fault: '',
      companyAllList: [],
      optionProps: {
        value: 'id',
        label: 'name',
        children: 'children'
      },
      equipmentList: [],
      equipmentValue: [],
      table: {
        tableKey: 0,
        listLoading: false,
        list: [],

        total: 0
      }
    }
  },
  mounted() {
    this.companyAll()
    this.equipment()
  },
  methods: {
    draw(id, dataAxis, dataAjax, dataId) {
      this.charts = echarts.init(document.getElementById(id))

      this.charts.showLoading({
        text: '图表加载中'
      })

      const option = {
        title: {
          text: '故障分析统计'
        },

        tooltip: {},
        legend: {
          data: ['维修次数']
        },
        grid: { left: '10%', bottom: '28%' },
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

      // 点击柱状图 获取饼图和表格
      this.charts.on('click', (params) => {
        this.formData.equipmentId = dataId[params.dataIndex]
        this.tableList()
        this.system()
      })
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
          formatter: '{b} : {c}%'
        },
        legend: {
          orient: 'vertical',
          x: 'right',
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
    // 柱状图查询
    histogram() {
      this.$axios.get(`/api/OperationStatistic/GetEquipmentCount?positionId=${this.formData.positionId}&beginTime=${this.formData.beginTime}&endTime=${this.formData.endTime}`).then(res => {
        const dataAxis = res.map(item => { return item.name })
        const dataAjax = res.map(item => { return item.value })
        const dataId = res.map(item => { return item.id })

        this.draw('report', dataAxis, dataAjax, dataId)
        // 定时关闭 加载动画
        setTimeout(() => {
          this.charts.hideLoading()
        }, 1000)
      })
    },
    // 饼图统计
    system(id) {
      this.$axios.get(`/api/OperationStatistic/GetEquipmentFaultCount?equipmentId=${this.formData.equipmentId}&beginTime=${this.formData.beginTime}&endTime=${this.formData.endTime}`).then(res => {
        const dataAxis = res.map(item => { return item.name })

        this.proportion('proportion', dataAxis, res)

        // 定时关闭 加载动画
        setTimeout(() => {
          this.charts.hideLoading()
          this.fault.hideLoading()
        }, 1000)
      })
    },
    // 表格统计
    tableList(id) {
      this.table.listLoading = true
      this.$axios.get(`/api/OperationStatistic/GetEquipmentOrder?&equipmentId=${this.formData.equipmentId}&pageNumber=${this.formData.pageNumber}&pageSize=${this.formData.pageSize}&beginTime=${this.formData.beginTime}&endTime=${this.formData.endTime}`).then(res => {
        this.table.list = res.data
        this.table.total = res.totalCount
        this.table.listLoading = false
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
    // 获取设备
    equipment() {
      this.$axios.get(`/api/Tree/Position/All`).then(res => {
        this.equipmentList = res
      })
    },
    // 选择设备位置
    handleChange(val) {
      // 获取选择的id
      const last = val[val.length - 1]
      this.formData.positionId = last
    },
    onSubmit() {
      this.formData.beginTime = this.formData.date.length !== 0 ? this.formatterDate(1, 1, this.formData.date[0]) : ''
      this.formData.endTime = this.formData.date.length !== 0 ? this.formatterDate(1, 1, this.formData.date[1]) : ''

      this.histogram()
    }
  }
}
</script>
