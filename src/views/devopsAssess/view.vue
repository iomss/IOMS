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
        <el-button type="danger" @click="onExport">导出</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="tableData.listLoading"
      :data="tableData.list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      size="small"
    >
      <el-table-column type="selection" />

      <el-table-column
        label="运维管理单位"
        prop="name"
      />
      <el-table-column
        label="总评分"
        prop="score"
      />
      <el-table-column
        label="考评日期"
        prop="createTime"
      />

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

    <roadFraction v-if="roadFractionVisible" ref="roadFraction" />

    <pagination v-show="tableData.total>0" :total="tableData.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

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

.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
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
import pagination from '@/components/Pagination'
import roadFraction from './components/road_fraction'

export default {
  components: {
    pagination,
    roadFraction
  },
  data() {
    return {
      roadFractionVisible: false,

      listQuery: {
        page: 1,
        limit: 10
      },
      tableData: {
        list: [{
          name: '湟源中心',
          score: 62,
          createTime: '2019-10-09'
        }],
        listLoading: false,
        total: 0
      },
      formInline: {
        region: '',
        date1: ''
      }
    }
  },
  methods: {
    getList() {

    },
    onSubmit() {

    },
    onExport() {

    },
    handleView() {
      this.roadFractionVisible = true
      this.$nextTick(() => {
        this.$refs.roadFraction.init()
      })
    }
  }
}
</script>
