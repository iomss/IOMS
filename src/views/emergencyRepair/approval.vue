<template>
  <div class="app-container">

    <el-form v-show="isShowSearch" :inline="true" :model="formData" class="demo-form-inline" size="small">

      <!-- <el-form-item label="审批人">
        <el-input v-model="formData.user" placeholder="审批人" />
      </el-form-item> -->

      <el-form-item label="状态">
        <el-select v-model="formData.region" placeholder="状态">
          <el-option label="全部" value="" />
          <el-option label="待审批" value="2" />
          <el-option label="已批准" value="3" />
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
      </div>

      <div class="columns-right pull-right">
        <el-button icon="el-icon-search" plain type="info" size="small" @click="showSearchForm" />
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
      @sort-change="sortChange"
    >
      <el-table-column label="编号" prop="id" sortable="custom" align="center" />
      <el-table-column label="状态" prop="isEmergency" align="center">
        <template slot-scope="scope">
          <a v-if="scope.row.emergencyState == 'Record'" href="javascript:;" style="color: #1890ff;">暂存</a>
          <a v-if="scope.row.emergencyState == 'Pending'" href="javascript:;" style="color: #1890ff;">待审批</a>
          <a v-if="scope.row.emergencyState == 'PendingSubCenter'" href="javascript:;" style="color: #1890ff;">待分中心审批</a>
          <a v-if="scope.row.emergencyState == 'PendingNetCenter'" href="javascript:;" style="color: #1890ff;">待路网中心审批</a>
          <a v-if="scope.row.emergencyState == 'PendingLeader'" href="javascript:;" style="color: #1890ff;">待领导审批</a>
          <a v-if="scope.row.emergencyState == 'Applied'" href="javascript:;" style="color: #13ce66;">已批准</a>
          <a v-if="scope.row.emergencyState == 'Rejected'" href="javascript:;" style="color: #ff4949">驳回</a>
        </template>
      </el-table-column>
      <el-table-column label="紧急情况" prop="isEmergency" align="center">
        <template slot-scope="scope">
          <a href="javascript:;">{{ scope.row.isEmergency===true?'紧急':'一般' }}</a>
        </template>
      </el-table-column>
      <el-table-column label="工程名称" prop="engineering" align="center" />
      <el-table-column label="报修单位" prop="reportUnit.name" align="center" />
      <el-table-column label="接报单位" prop="receiveUnit.name" align="center" />
      <el-table-column label="报修时间" prop="reportTime" align="center" :formatter="formatterDate" />

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="small"
            class="btn-xs"
            type="danger"
            @click="handleView(scope.$index, scope.row)"
          ><i class="el-icon-document-checked" /></el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="table.total>0" :total="table.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <approval-view v-if="viewVisible" ref="approvalView" />

  </div>
</template>

<style>

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
</style>

<script>

// https://blog.csdn.net/qq_29384639/article/details/80700882
import approvalView from './components/approvalView'

import pagination from '@/components/Pagination'

export default {
  components: {
    pagination,
    approvalView
  },

  data() {
    return {

      isShowSearch: false,
      addVisible: false,
      viewVisible: false,

      listQuery: {
        page: 1,
        limit: 10
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

      formData: {
        user: '',
        beginTime: '',
        endTime: '',
        state: '',
        date: []
      }

    }
  },
  mounted() {
    this.getList()
  },
  methods: {

    sortChange() {

    },

    getList() {
      this.table.listLoading = true

      this.$axios.get(`/api/EmergencyRequisition?state=${2}&beginTime=${this.formData.beginTime}&endTime=${this.formData.endTime}`).then(res => {
        this.table.listLoading = false
        this.table.list = res.data
        this.table.total = res.data.length
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

    statusFilter() {

    },

    /**
           * 显示查询条件
           * @return {[type]} [description]
           */
    showSearchForm() {
      this.isShowSearch = !this.isShowSearch
    },

    // 添加页面
    addPage() {
      this.addVisible = true
      this.$nextTick(() => {
        this.$refs.add.init()
      })
    },

    /**
           * 处理显示试图
           * @return {[type]} [description]
           */
    handleView(index, row) {
      if (row) {
        this.viewVisible = true
        this.$nextTick(() => {
          this.$refs.approvalView.init(row.id)
        })
      }
    },

    onSubmit() {
      this.formData.beginTime = this.formData.date.length !== 0 ? this.formatterDate(1, 1, this.formData.date[0]) : ''
      this.formData.endTime = this.formData.date.length !== 0 ? this.formatterDate(1, 1, this.formData.date[1]) : ''

      this.onRefresh()
    },

    /**
     * 刷新
     * @return {[type]} [description]
     */
    onRefresh() {
      this.getList()
    }
  }
}
</script>
