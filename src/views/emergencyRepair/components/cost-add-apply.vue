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
    >
      <el-table-column type="selection" width="80" align="center" />

      <el-table-column label="序号" prop="id" width="50" align="center" />
      <el-table-column label="编号" prop="number" align="center" />
      <el-table-column label="报修单位" prop="name" align="center" />
      <el-table-column label="接报单位" prop="company_2" align="center" />
      <el-table-column label="报修时间" prop="createTime" align="center" />
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
        data: ''
      },
      applicationTable: {
        listLoading: false,
        list: [{
          id: 1,
          number: 222,
          name: '家堡东收费站',
          company_2: '韵家口分中心',
          createTime: '2019-10-02'
        }]
      }
    }
  },
  methods: {
    init() {
      this.applyVisible = true
    },

    onSubmit() {

    },
    handleChange() {

    }
  }
}
</script>
