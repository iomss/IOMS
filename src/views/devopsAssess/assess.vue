<template>
  <div class="app-container">

    <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">

      <el-form-item label="单位">
        <el-select v-model="formInline.region" placeholder="状态">
          <el-option label="全部" value="shanghai" />
          <el-option label="待审批" value="beijing" />
          <el-option label="已批准" value="beijing" />
        </el-select>
      </el-form-item>

      <el-form-item label="考核日期">
        <el-col :span="24">
          <el-date-picker
            v-model="formInline.date1"
            type="datetimerange"
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

      <el-table-column label="指标名称" prop="sos" align="center" />
      <el-table-column label="统计指标" prop="name" align="center" />
      <el-table-column label="指标得分" prop="company" align="center" />
      <el-table-column label="权重" prop="company_2" align="center" />
      <el-table-column label="加权得分(指标得分*权重)" prop="company_2" width="200" align="center" />

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="small"
            class="btn-xs"
            type="danger"
            @click="handleEditView(scope.$index, scope.row)"
          ><i class="el-icon-edit" /></el-button>
        </template>
      </el-table-column>

    </el-table>

    <editAssess v-if="editAssessVisible" ref="editAssess" />

    <pagination v-show="table.total>0" :total="table.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>
<style>
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

import pagination from '@/components/Pagination'
import editAssess from './components/edit_assess'

export default {
  components: {
    pagination,
    editAssess
  },
  data() {
    return {
      editAssessVisible: false,

      listQuery: {
        page: 1,
        limit: 10
      },

      formInline: {
        user: '',
        region: '',
        date1: '',
        date2: ''
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
        total: 20
      }
    }
  },
  methods: {
    getList() {

    },
    sortChange() {

    },

    /**
		* 点击打开编辑页面
		* @return {[type]} [description]
		*/
    handleEditView() {
      this.editAssessVisible = true

      this.$nextTick(() => {
        this.$refs.editAssess.init()
      })
    },
    onSubmit() {

    }
  }
}
</script>
