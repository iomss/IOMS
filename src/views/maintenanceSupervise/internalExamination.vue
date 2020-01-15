<template>
  <div class="app-container">

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
      show-summary
      style="width: 100%;"
      size="small"
    >
      <el-table-column label="编号" prop="id" sortable="custom" align="center" />
      <el-table-column label="指标名称" prop="name" align="center" />
      <el-table-column label="权重系数" prop="weight" align="center" />
      <el-table-column label="更新时间" prop="updateTime" align="center" :formatter="formatterDate" />
      <el-table-column label="更新人" prop="createUser.name" align="center" />
      <el-table-column label="备注" prop="remark" align="center" />
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

    <setUp v-if="addVisible" ref="setUp" />
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

import setUp from './components/internal-setUp'
import pagination from '@/components/Pagination'

export default {
  name: 'MaintenanceSuperviseInternalExamination',
  components: {
    pagination,
    setUp
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

      companyAllList: [],

      addVisible: false
    }
  },
  mounted() {
    this.companyAll()
    this.getList()
  },
  methods: {
    getList() {
      this.table.listLoading = true
      this.$axios.get(`/api/AssessmentWeight?pageNumber=${this.formData.pageNumber}&pageSize=${this.formData.pageSize}&type=${'internal'}`).then(res => {
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
    // 跳转页面
    handleView(index, row) {
      this.addVisible = true
      this.$nextTick(() => {
        this.$refs.setUp.init(row.id)
      })
    },
    // 关闭添加组件
    closeDialog() {
      this.addVisible = false
    }
  }
}
</script>
