<template>
  <div class="app-container">

    <el-form v-show="isShowSearch" :inline="true" :model="formInline" class="demo-form-inline" size="small">

      <el-form-item label="项目名或报修单位">
        <el-input v-model="formInline.text" placeholder="项目名或报修单位" />
      </el-form-item>

      <el-form-item label="状态">
        <el-select v-model="formInline.state" placeholder="状态">
          <el-option label="全部" value="0" />
          <el-option label="暂存" value="1" />
          <el-option label="待审批" value="2" />
          <el-option label="已批准" value="3" />
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
        <el-button type="info" size="small" icon="el-icon-refresh" @click="onRefresh" />
        <el-button type="primary" size="small" icon="el-icon-plus" @click="addPage" />
        <el-button type="danger" size="small" icon="el-icon-delete" @click="onDelPage" />
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
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" />

      <el-table-column label="编号" prop="id" sortable="custom" align="center" />

      <el-table-column label="状态" prop="emergencyState" class-name="status-col" :formatter="statusFilter" />

      <el-table-column label="工程名称" prop="emergencyRequisition.engineering" align="center" />
      <el-table-column label="抢修单位" prop="emergencyRequisition.repairUnit.name" align="center" />
      <el-table-column label="报修单位" prop="emergencyRequisition.reportUnit.name" align="center" />
      <el-table-column label="录入人" prop="createUser.name" align="center" />
      <el-table-column label="录入时间" prop="createTime" align="center" :formatter="formatterDate" />

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="small"
            class="btn-xs"
            type="danger"
            @click="handleView(scope.$index, scope.row)"
          ><i class="el-icon-document" /></el-button>

          <el-button
            v-if="scope.row.emergencyState == 'Record'"
            size="small"
            class="btn-xs"
            type="danger"
            @click="handleEditView(scope.$index, scope.row)"
          ><i class="el-icon-edit" /></el-button>

        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="table.total>0" :total="table.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="addPagingData" />

    <acceptanc-add v-if="addVisible" ref="add" @func="onRefresh" />
    <acceptance-view v-if="viewVisible" ref="acceptanceView" />

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
import acceptancAdd from './components/acceptance-add'
import acceptanceView from './components/acceptance-view'

import pagination from '@/components/Pagination'

export default {
  name: 'EmergencyRepairAcceptance',
  components: {
    pagination,
    acceptancAdd,
    acceptanceView
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
        total: 0,
        list: []
      },
      emergencyState: [],
      multipleSelection: [],

      formInline: {
        text: '',
        state: '',
        date1: '',
        beginTime: '',
        endTime: '',
        pageSize: 10,
        pageNumber: 1
      }

    }
  },
  mounted() {
    this.getOrderStatus()
    this.getList()
  },
  methods: {

    sortChange() {

    },

    /**
     * 获取订单状态
     * @return {[type]} [description]
     */
    getOrderStatus() {
      this.$axios.get('api/Enum/EmergencyState').then(res => {
        this.emergencyState = res
      })
    },

    /**
     * 获取列表数据
     * @return {[type]} [description]
     */
    getList() {
      var queryString = this.$utils.objectToString(this.formInline)
      this.table.listLoading = true
      this.$axios.get('/api/EmergencyAcceptance' + queryString).then(res => {
        this.table.list = res.data
        this.table.total = res.totalCount
        this.table.listLoading = false
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
     * 状态筛选
     * @param  {[type]} row       [description]
     * @param  {[type]} column    [description]
     * @param  {[type]} cellValue [description]
     * @return {[type]}           [description]
     */
    statusFilter(row, column, cellValue) {
      if (cellValue !== null) {
        for (var i = 0, len = this.emergencyState.length; i < len; i++) {
          if (this.emergencyState[i]['key'] === cellValue) {
            return this.emergencyState[i]['description']
          }
        }
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
     * 添加分页数据
     * @param {[type]} val [description]
     */
    addPagingData(val) {
      this.formInline.pageNumber = val.page
      this.getList()
    },

    /**
     * 处理显示试图
     * @return {[type]} [description]
     */
    handleView(index, rows) {
      this.viewVisible = true
      this.$nextTick(() => {
        this.$refs.acceptanceView.init(rows.id)
      })
    },

    /**
     * 处理编辑试图
     * @param  {[type]} index [description]
     * @param  {[type]} rows  [description]
     * @return {[type]}       [description]
     */
    handleEditView(index, rows) {
      this.addVisible = true
      this.$nextTick(() => {
        this.$refs.add.initEdit(rows.id)
      })
    },

    /**
     * 提交数据
     * @return {[type]} [description]
     */
    onSubmit() {
      if (this.formInline.date1.length >= 1) {
        this.formInline.beginTime = this.$utils.formatTime(this.formInline.date1[0], 'Y-M-D')
        this.formInline.endTime = this.$utils.formatTime(this.formInline.date1[1], 'Y-M-D')
      }

      this.onRefresh()
    },

    /**
     * 刷新页面
     * @return {[type]} [description]
     */
    onRefresh() {
      this.getList()
    },

    /**
     * 删除列表数据
     * @return {[type]} [description]
     */
    onDelPage() {
      if (this.multipleSelection.length <= 0) {
        this.$message.error('请选择要删除的数据')
        return
      }
      if (this.multipleSelection.length >= 2) {
        this.$message.error('一次只能删除一条数据')
        return
      }

      this.$confirm('确认删除?').then(_ => {
        this.handleDeleteList()
      }).catch(_ => {})
    },

    /**
     * 处理删除列表数据
     * @return {[type]} [description]
     */
    handleDeleteList() {
      this.$axios.delete('api/EmergencyAcceptance/' + this.multipleSelection[0]['id']).then(res => {
        this.onRefresh()
      })
    },

    /**
     * 处理选择
     * @param  {[type]} val [description]
     * @return {[type]}     [description]
     */
    handleSelectionChange(val) {
      this.multipleSelection = val
    }

  }
}
</script>
