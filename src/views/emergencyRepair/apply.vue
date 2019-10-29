<template>
  <div class="app-container">

    <el-form v-show="isShowSearch" :inline="true" :model="formInline" class="demo-form-inline" size="small">

      <el-form-item label="审批人">
        <el-input v-model="formInline.user" placeholder="审批人" />
      </el-form-item>

      <el-form-item label="状态">
        <el-select v-model="formInline.region" placeholder="状态">
          <el-option label="全部" value="shanghai" />
          <el-option label="待审批" value="beijing" />
          <el-option label="已批准" value="beijing" />
        </el-select>
      </el-form-item>

      <el-form-item label="报修时间">
        <el-col :span="24">
          <el-date-picker
            v-model="formInline.date1"
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
        <el-button type="info" size="small" icon="el-icon-refresh" />
        <el-button type="primary" size="small" icon="el-icon-plus" @click="addPage" />
        <!-- <el-button type="danger" size="small" icon="el-icon-delete" /> -->
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
      <!-- <el-table-column type="selection" :selectable="checkTypeIsSelect" /> -->

      <el-table-column label="编号" prop="id" sortable="custom" align="center" />
      <el-table-column label="状态" prop="isEmergency" align="center">
        <template slot-scope="scope">
          <a v-if="scope.row.emergencyState == 'Record'" href="javascript:;" style="color: #1890ff;">暂存</a>
          <a v-if="scope.row.emergencyState == 'Pending'" href="javascript:;" style="color: #1890ff;">待审批</a>
          <a v-if="scope.row.emergencyState == 'PendingSubCenter'" href="javascript:;" style="color: #1890ff;">待分中心审批</a>
          <a v-if="scope.row.emergencyState == 'PendingNetCenter'" href="javascript:;" style="color: #1890ff;">待路网中心审批</a>
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
            type="primary"
            @click="handleView(scope.$index, scope.row)"
          ><i class="el-icon-document" /></el-button>
          <el-button
            v-if="scope.row.emergencyState == 'Record'"
            size="small"
            class="btn-xs"
            type="danger"
            @click="handleViewDel(scope.$index, scope.row)"
          ><i class="el-icon-delete" /></el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="table.total>0" :total="table.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <add v-if="addVisible" ref="add" />
    <apply-view v-if="viewVisible" ref="applyView" />

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
import add from './components/add'
import applyView from './components/applyView'

import pagination from '@/components/Pagination'

export default {
  components: {
    pagination,
    add,
    applyView
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

      formInline: {
        user: '',
        region: '',
        date1: '',
        date2: ''
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
      this.$axios.get('/api/EmergencyRequisition').then(res => {
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
      this.viewVisible = true
      this.$nextTick(() => {
        this.$refs.applyView.init(row.id)
      })
    },

    // 删除
    handleViewDel(index, row) {
      this.$confirm('是否要删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete('/api/EmergencyRequisition/' + row.id).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })

          this.getList()
        })
      }).catch(() => {

      })
    },

    onSubmit() {

    },

    checkTypeIsSelect() {
      return true
    }

  }
}
</script>
