<template>
  <div class="app-container">

    <el-divider content-position="left">分中心运维考核权重表</el-divider>
    <el-table
      v-loading="tableData.listLoading"
      :data="tableData.list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      size="small"
      show-summary
      :summary-method="getSummaries"
    >
      <el-table-column
        label="分中心运维考核指标名称"
        prop="name"
      />

      <el-table-column
        label="权重"
        prop="weight"
      >
        <template slot-scope="scope">{{ scope.row.weight }}</template>
      </el-table-column>

      <el-table-column
        label="更新时间"
        prop="updateTime"
        :formatter="formatterDate"
      />

      <el-table-column
        label="更新人"
        prop="createUser.name"
      />
      <el-table-column
        label="备注"
        prop="remark"
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

    <pagination :hide-on-single-page="true" :total="tableData.total" :page.sync="tableDataQueryData.pageNumber" :limit.sync="tableDataQueryData.pageSize" @pagination="getSubCenterData" />

    <el-divider content-position="left" class="el-divider-top">隧道所运维考核权重表</el-divider>

    <el-table
      v-loading="tunnelOfficeTableData.listLoading"
      :data="tunnelOfficeTableData.list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      size="small"
      show-summary
      :summary-method="getSummaries"
    >
      <el-table-column
        label="隧道所运维考核指标名称"
        prop="name"
      />

      <el-table-column
        label="权重"
        prop="weight"
      />

      <el-table-column
        label="更新时间"
        prop="updateTime"
        :formatter="formatterDate"
      />

      <el-table-column
        label="更新人"
        prop="createUser.name"
      />
      <el-table-column
        label="备注"
        prop="remark"
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
    <pagination :hide-on-single-page="true" :total="tunnelOfficeTableData.total" :page.sync="tunnelOfficeQueryData.pageNumber" :limit.sync="tunnelOfficeQueryData.pageSize" @pagination="getTunnelOfficeData" />

    <edit-weight v-if="editWeightVisible" ref="editWeight" @refreshtabledata="refreshAllTabel" />

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

import editWeight from './components/edit_weight'

export default {
  name: 'DevopsAssessWeight',
  components: {
    editWeight,
    pagination
  },
  data() {
    return {
      editWeightVisible: false,

      tableData: {
        listLoading: false,
        total: 0,
        list: [{
          system: {
            name: ''
          },
          createUser: {
            name: ''
          },
          weight: '',
          updateTime: '',
          remark: ''
        }]
      },

      tableDataQueryData: {
        type: 'SubCenter',
        desc: false,
        pageNumber: 1,
        pageSize: 20
      },

      tunnelOfficeTableData: {
        listLoading: false,
        total: 0,
        list: [{
          system: {
            name: ''
          },
          createUser: {
            name: ''
          },
          weight: '',
          updateTime: '',
          remark: ''
        }]
      },

      tunnelOfficeQueryData: {
        type: 'TunnelOffice',
        desc: false,
        pageNumber: 1,
        pageSize: 20
      }
    }
  },
  mounted() {
    this.getSubCenterData()
    this.getTunnelOfficeData()
  },
  methods: {
    /**
     * 日期格式化
     * @param  {[type]} row       [description]
     * @param  {[type]} column    [description]
     * @param  {[type]} cellValue [description]
     * @return {[type]}           [description]
     */
    formatterDate(row, column, cellValue) {
      if (cellValue !== null) {
        return this.$moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
      } else {
        return cellValue
      }
    },
    /**
     * 获取分中心数据
     * @return {[type]} [description]
     */
    getSubCenterData() {
      this.tableData.listLoading = true

      var queryData = this.$utils.objectToString(this.tableDataQueryData)

      this.$axios.get('/api/AssessmentWeight' + queryData).then(res => {
        this.tableData.list = res.data
        this.tableData.listLoading = false
        this.tableData.total = res.totalCount
      })
    },

    /**
     * 获取隧道所运维考核
     * @return {[type]} [description]
     */
    getTunnelOfficeData() {
      this.tunnelOfficeTableData.listLoading = true
      var queryData = this.$utils.objectToString(this.tunnelOfficeQueryData)

      this.$axios.get('/api/AssessmentWeight' + queryData).then(res => {
        this.tunnelOfficeTableData.list = res.data
        this.tunnelOfficeTableData.listLoading = false
        this.tunnelOfficeTableData.total = res.totalCount
      })
    },

    /**
     * 点击编辑权重信息
     * @param  {[type]} index [description]
     * @param  {[type]} rows  [description]
     * @return {[type]}       [description]
     */
    handleView(index, rows) {
      this.editWeightVisible = true
      this.$nextTick(() => {
        this.$refs.editWeight.init(rows.id)
      })
    },

    /**
     * 自定义返回合计
     * @return {[type]} [description]
     */
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value)) && (index === 1)) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)

          sums[index] = sums[index].toFixed(2)
        } else {
          sums[index] = ''
        }
      })
      return sums
    },

    refreshAllTabel() {
      this.getSubCenterData()
      this.getTunnelOfficeData()
    }

  }
}
</script>
