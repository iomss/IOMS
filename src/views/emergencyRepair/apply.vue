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
        <el-button type="danger" size="small" icon="el-icon-delete" />
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
      <el-table-column type="selection" />

      <el-table-column label="编号" prop="id" sortable="custom" align="center" />

      <el-table-column label="状态" prop="status" class-name="status-col" />

      <el-table-column label="紧急情况" prop="sos" align="center" />
      <el-table-column label="工程名称" prop="name" align="center" />
      <el-table-column label="报修单位" prop="company" align="center" />
      <el-table-column label="接报单位" prop="company_2" align="center" />
      <el-table-column label="报修时间" prop="createTime" align="center" :formatter="formatterDate" />

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="small"
            class="btn-xs"
            type="danger"
            @click="handleView(scope.$index, scope.row)"
          ><i class="el-icon-document" /></el-button>
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
        list: [{
          id: 10,
          status: '正常',
          sos: '无',
          name: '工程名称',
          company: '报修单位',
          company_2: '接报单位'
        }],

        total: 20,

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
  methods: {

    sortChange() {

    },

    getList() {

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
    handleView() {
      this.viewVisible = true
      this.$nextTick(() => {
        this.$refs.applyView.init()
      })
    },

    onSubmit() {

    }

  }
}
</script>
