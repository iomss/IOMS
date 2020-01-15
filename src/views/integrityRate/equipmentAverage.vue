<template>
  <div class="app-container">

    <el-form v-show="isShowSearch" :inline="true" :model="formData" class="demo-form-inline" size="small">

      <el-form-item label="报修位置">
        <el-select v-model="formData.positionId" placeholder="状态">
          <el-option label="全部" value="" />
          <el-option v-for="item in companyAllList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="报修时间">
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

    <div class="filter-container">
      <div class="toolbar pull-left">
        <el-button type="info" size="small" icon="el-icon-refresh" @click="onRefresh" />
        <!-- <el-button type="primary" size="small" icon="el-icon-plus" @click="addPage" /> -->
        <!-- <el-button type="danger" size="small" icon="el-icon-delete" /> -->
      </div>

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
      <el-table-column label="编号" prop="model.id" sortable="custom" align="center" />
      <el-table-column label="设备名称" prop="model.name" align="center" />
      <el-table-column label="品牌" prop="brand.name" align="center" />
      <el-table-column label="型号" prop="model.name" align="center" />
      <el-table-column label="设备数量" prop="count" align="center" />
      <el-table-column label="故障次数" prop="orderCount" align="center" />
      <el-table-column label="完好率" prop="rate" align="center" :formatter="intactRate" />
      <el-table-column label="意见" prop="receiveUnit.name" align="center" />
    </el-table>

    <pagination v-show="table.total>0" :total="table.total" :page.sync="formData.pageNumber" :limit.sync="formData.pageSize" @pagination="getList" />
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
     width: 100%;
     height: 400px;
      margin-top: 50px;
    }
</style>

<script>

import pagination from '@/components/Pagination'

export default {
  name: 'IntegrityRateEquipmentAverage',
  components: {
    pagination
  },
  data() {
    return {
      isShowSearch: true,
      formData: {
        positionId: '',
        beginTime: '',
        endTime: '',
        date: [],
        pageSize: 10,
        pageNumber: 1
      },

      table: {
        tableKey: 0,
        listLoading: false,
        list: [],

        total: 0,

        tableColumns: [
          { field: 'id', title: '编号', sortable: 'custom' },
          { field: 'status', title: '状态' },
          { field: 'sos', title: '紧急情况' },
          { field: 'name', title: '工程名称' },
          { field: 'company', title: '报修单位' },
          { field: 'company_2', title: '接报单位' },
          { field: 'createTime', title: '报修时间' }
        ]
      },

      companyAllList: []
    }
  },
  mounted() {
    this.companyAll()
    this.getList()
  },
  methods: {
    getList() {
      this.table.listLoading = true
      this.$axios.get(`/api/OperationStatistic/GetEquipmentBrandRate?pageNumber=${this.formData.pageNumber}&pageSize=${this.formData.pageSize}&positionId=${this.formData.positionId}&beginTime=${this.formData.beginTime}&endTime=${this.formData.endTime}`).then(res => {
        this.table.list = res.data
        this.table.total = res.totalCount
        this.table.listLoading = false
      })
    },

    // 获取所有单位
    companyAll() {
      this.$axios.get(`/api/Tree/Position/All?startLevel=${2}&endLevel=${4}`).then(res => {
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
    intactRate(row, column, cellValue) {
      if (cellValue !== null) {
        return (cellValue * 100).toFixed(2) + '%'
      } else {
        return ''
      }
    },
    onSubmit() {
      this.formData.beginTime = this.formData.date.length !== 0 ? this.formatterDate(1, 1, this.formData.date[0]) : ''
      this.formData.endTime = this.formData.date.length !== 0 ? this.formatterDate(1, 1, this.formData.date[1]) : ''

      this.getList()
    },
    // 刷新
    onRefresh() {
      this.getList()
    }
  }
}
</script>
