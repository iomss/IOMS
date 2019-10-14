<template>
  <div class="app-container">

    <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">

      <el-form-item label="单位">
        <el-select v-model="formInline.type" placeholder="请选择单位">
          <el-option v-for="item in selectOptions" :key="item.index" :value="item.value" :label="item.label" />
        </el-select>
      </el-form-item>

      <el-form-item label="考核日期">
        <el-col :span="24">
          <el-date-picker
            v-model="formInline.date"
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
        prop="position.name"
      />
      <el-table-column
        label="总评分"
        prop="avgScore"
      />
      <el-table-column
        label="考评日期"
        prop="updateTime"
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

    <pagination v-show="tableData.total>0" :total="tableData.total" :page.sync="formInline.pageNumber" :limit.sync="formInline.pageSize" @pagination="getList" />

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

      selectOptions: [{
        label: '全部',
        value: '',
        index: 1
      }, {
        label: '分中心',
        value: 'SubCenter',
        index: 2
      }, {
        label: '隧道所',
        value: 'TunnelOffice',
        index: 3
      }],

      listQuery: {
        page: 1,
        limit: 10
      },

      tableData: {
        list: [{
          position: {
            name: ''
          },
          avgScore: 0,
          updateTime: ''
        }],
        listLoading: false,
        total: 0
      },

      formInline: {
        type: '',
        beginDate: '',
        endDate: '',
        orderBy: 'positionId',
        pageSize: 10,
        pageNumber: 1,

        date: []
      }
    }
  },
  mounted() {
    var nowDate = new Date()

    this.formInline.date = [nowDate, nowDate]

    this.formInline.beginDate = this.$utils.formatTime(nowDate.getTime(), 'Y-M-D')
    this.formInline.endDate = this.$utils.formatTime(nowDate.getTime(), 'Y-M-D')

    this.getList()
  },
  methods: {

    /**
     * 查询所有汇总考核
     * @return {[type]} [description]
     */
    getList() {
      var queryString = this.$utils.objectToString(this.formInline)

      this.tableData.listLoading = true
      this.$axios.get('/api/AssessmentRecord/Avg' + queryString).then(res => {
        this.tableData.list = res.data
        this.tableData.total = res.totalCount
        this.tableData.listLoading = false
      })
    },

    /**
     * 查询表格数据
     * @return {[type]} [description]
     */
    onSubmit() {
      if (this.formInline.date.length <= 0) {
        this.$message.error('请选择查询日期')
        return
      }

      this.formInline.beginDate = this.$utils.formatTime(this.formInline.date[0], 'Y-M-D  ')
      this.formInline.endDate = this.$utils.formatTime(this.formInline.date[1], 'Y-M-D')

      this.getList()
    },
    onExport() {

    },
    handleView(index, rows) {
      this.roadFractionVisible = true

      this.$nextTick(() => {
        this.$refs.roadFraction.init(rows.positionId, rows.avgScore, this.formInline.beginDate, this.formInline.endDate)
      })
    }
  }
}
</script>
