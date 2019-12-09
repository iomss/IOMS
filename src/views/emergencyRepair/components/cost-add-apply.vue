<template>
  <!-- 应急抢修申请表 -->
  <el-dialog title="" :visible.sync="applyVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="80%" center>
    <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small" style="text-align:right;">
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
      :key="applicationTable.tableKey"
      v-loading="applicationTable.listLoading"
      :data="applicationTable.list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      size="mini"
      class="table-applicationform"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="80" align="center" />

      <el-table-column label="序号" type="index" width="50" align="center" />
      <el-table-column label="编号" prop="id" align="center" />
      <el-table-column label="工程名称" prop="engineering" align="center" />
      <el-table-column label="报修单位" prop="reportUnit.name" align="center" />
      <el-table-column label="接报单位" prop="receiveUnit.name" align="center" />
      <el-table-column label="报修时间" prop="createTime" align="center" :formatter="formatterDate" />
    </el-table>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="small" @click="onSubmitOk">确定</el-button>
      <el-button size="small" @click="applyVisible = false">取 消</el-button>
    </span>

  </el-dialog>
</template>
<script>
export default {
  name: 'ConstAddApply',
  data: function() {
    return {
      applyVisible: false,
      formInline: {
        date: ''
      },
      applicationTable: {
        listLoading: false,
        list: []
      },
      multipleSelection: [],

      form: {

        beginTime: '', // 报修时间晚于
        endTime: '' //  报修时间早于
      }

    }
  },
  methods: {
    init() {
      this.applyVisible = true

      this.getList()
    },

    getList() {
      this.$axios.get(`/api/EmergencyRequisition?state=${3}&beginTime=${this.form.beginTime}&endTime=${this.form.endTime}`).then(res => {
        this.applicationTable.list = res.data
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

    // 查询
    onSubmit() {
      if (this.formInline.date.length === 0) {
        this.$message.error('请选择日期')

        return
      }

      this.form.beginTime = this.formatterDate(1, 1, this.formInline.date[0])
      this.form.endTime = this.formatterDate(1, 1, this.formInline.date[1])

      this.getList()
    },
    onSubmitOk() {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请选择申请单')

        return
      }

      this.applyVisible = false

      // 给 父组件传值
      this.$emit('func', this.multipleSelection)
    },
    // 获取选中的值
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>
