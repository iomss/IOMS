<template>
  <div class="app-container">
    <el-form v-show="isShowSearch" :inline="true" :model="formData" class="demo-form-inline" size="small">
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
        <el-button type="primary" @click="add">新建审核单</el-button>
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
      <el-table-column label="编号" prop="positionId" sortable="custom" align="center" />
      <el-table-column label="管理单位" prop="positionName" align="center" />
      <el-table-column label="被考核单位数量" prop="positionCount" align="center" />
      <el-table-column label="考核时间" prop="assessmentTime" align="center" :formatter="formatterDate" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="small"
            class="btn-xs"
            type="primary"
            @click="handleView(scope.$index, scope.row)"
          ><i class="el-icon-document" /></el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="table.total>0" :total="table.total" :page.sync="formData.pageNumber" :limit.sync="formData.pageSize" @pagination="getList" />

    <statistics v-if="addVisible" ref="statistics" />
    <query v-if="queryVisible" ref="query" />
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

import statistics from './components/examination-statistics'
import query from './components/examination-query'
import pagination from '@/components/Pagination'

export default {
  name: 'MaintenanceSuperviseExaminationInquire',
  components: {
    pagination,
    statistics,
    query
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

        total: 0
      },

      companyAllList: [],

      addVisible: false,
      queryVisible: false
    }
  },
  mounted() {
    this.companyAll()
  },
  methods: {
    getList() {
      this.table.listLoading = true
      this.$axios.get(`/api/InternalAssessment/Group?pageNumber=${this.formData.pageNumber}&pageSize=${this.formData.pageSize}&beginDate=${this.formData.beginTime}&endDate=${this.formData.endTime}`).then(res => {
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
    onSubmit() {
      this.formData.beginTime = this.formData.date.length !== 0 ? this.formatterDate(1, 1, this.formData.date[0]) : ''
      this.formData.endTime = this.formData.date.length !== 0 ? this.formatterDate(1, 1, this.formData.date[1]) : ''

      this.getList()
    },
    // 刷新
    onRefresh() {
      this.getList()
    },
    // 新建审核单
    add() {
      this.addVisible = true
      this.$nextTick(() => {
        this.$refs.statistics.init()
      })
    },
    // 跳转页面
    handleView(index, row) {
      const data = {
        positionId: row.positionId,
        beginDate: this.formData.beginTime,
        endDate: this.formData.endTime
      }
      this.queryVisible = true
      this.$nextTick(() => {
        this.$refs.query.init(data)
      })
    },
    // 关闭添加组件
    closeDialog() {
      this.addVisible = false
      this.queryVisible = false
    }
  }
}
</script>
