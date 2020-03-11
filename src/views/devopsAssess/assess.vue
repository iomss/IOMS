<template>
  <div class="app-container">

    <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">

      <el-form-item label="单位">
        <el-cascader
          v-model="formInline.positionId"
          :options="formInline.companyOptions"
          :props="{ expandTrigger: 'hover', value: 'id', label: 'name' }"
        />
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
      </el-form-item>

    </el-form>

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
      :summary-method="getSummaries"
      @sort-change="sortChange"
    >

      <el-table-column label="指标名称" prop="assessmentWeight.name" align="center" />
      <el-table-column label="统计指标" prop="equipmentIntegrityRate" align="center">
        <template slot-scope="scope">
          {{ scope.row.equipmentIntegrityRate?((scope.row.equipmentIntegrityRate * 100) +'%') : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="指标得分" prop="rateScore" align="center" />
      <el-table-column label="权重" prop="weight" align="center" />
      <el-table-column label="加权得分(指标得分*权重)" prop="score" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.score.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" align="center" />

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.equipmentIntegrityRate == null"
            size="small"
            class="btn-xs"
            type="danger"
            @click="handleEditView(scope.$index, scope.row)"
          ><i class="el-icon-edit" /></el-button>
        </template>
      </el-table-column>

    </el-table>

    <editAssess v-if="editAssessVisible" ref="editAssess" @refreshtabledata="onSubmit" />

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

import editAssess from './components/edit_assess'

export default {
  name: 'DevopsAssessAssess',
  components: {
    editAssess
  },
  data() {
    return {
      editAssessVisible: false,

      formInline: {
        positionId: '',
        companyOptions: [],
        date: ''
      },

      table: {
        tableKey: 0,
        listLoading: false,
        list: [],
        total: 20
      }

    }
  },
  mounted() {
    this.treeCompanyDataList()
  },
  methods: {

    /**
     * 获取单位信息
     * @return {[type]} [description]
     */
    treeCompanyDataList() {
      this.$axios.get('/api/Tree/Position/All?secondThird=true').then(res => {
        this.formInline.companyOptions = res
      })
    },

    getList(formData) {
      if (!formData) return

      this.table.listLoading = true
      this.$axios.post('/api/AssessmentRecord', formData).then(res => {
        // this.table.total = res.totalCount;
        this.table.listLoading = false
        this.table.list = res.assessmentRecordItems
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
          sums[index] = '总分'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value)) && (index === 3 || index === 4)) {
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

    sortChange() {

    },

    /**
		* 点击打开编辑页面
		* @return {[type]} [description]
		*/
    handleEditView(index, rows) {
      this.editAssessVisible = true
      this.$nextTick(() => {
        this.$refs.editAssess.init(rows.id)
      })
    },

    /**
     * 提交查询
     * @return {[type]} [description]
     */
    onSubmit() {
      if (this.formInline.positionId.length <= 0) {
        this.$message.error('需要选择查询单位')
        return
      }

      if (this.formInline.date.length <= 0) {
        this.$message.error('请选择查询日期')
        return
      }

      this.getList({
        positionId: this.formInline.positionId[1],
        beginDate: this.formInline.date[0],
        endDate: this.formInline.date[1]
      })
    }
  }
}
</script>
