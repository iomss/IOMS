<template>
  <div class="app-container">

    <el-divider content-position="left">分中心运维考核权重表</el-divider>
    <el-table
      v-loading="tableData.listLoading"
      :data="tableData.list"
      border
      fit
      highlight-current-row
      style="width: 100%;margin-bottom: 66px;"
      size="small"
    >
      <el-table-column
        label="分中心运维考核指标名称"
        prop="name"
      />
      <el-table-column
        label="权重"
        prop="score"
      />
      <el-table-column
        label="更新时间"
        prop="createTime"
      />

      <el-table-column
        label="更新人"
        prop="username"
      />
      <el-table-column
        label="备注"
        prop="note"
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

    <el-divider content-position="left" class="el-divider-top">隧道所运维考核权重表</el-divider>

    <el-table
      v-loading="tableData.listLoading"
      :data="tableData.list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      size="small"
    >
      <el-table-column
        label="隧道所运维考核指标名称"
        prop="name"
      />
      <el-table-column
        label="权重"
        prop="score"
      />
      <el-table-column
        label="更新时间"
        prop="createTime"
      />

      <el-table-column
        label="更新人"
        prop="username"
      />
      <el-table-column
        label="备注"
        prop="note"
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

    <edit-weight v-if="editWeightVisible" ref="editWeight" />

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

import editWeight from './components/edit_weight'

export default {
  components: {
    editWeight
  },
  data() {
    return {
      editWeightVisible: false,

      tableData: {
        list: [{
          name: '监控系统',
          score: 1,
          createTime: '2019/09/02',
          username: '管理员',
          note: ''
        }],
        listLoading: false
      }
    }
  },
  methods: {
    handleView() {
      this.editWeightVisible = true
      this.$nextTick(() => {
        this.$refs.editWeight.init()
      })
    }
  }
}
</script>
