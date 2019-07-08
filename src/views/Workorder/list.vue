<!-- 我的工作页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <h4>我的工作</h4>
          </div>
          <div class="content">
            <el-table :data="tableData" stripe border style="width: 100%" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="40" />
              <el-table-column prop="id" label="序号" width="60" />
              <el-table-column label="操作" width="80">
                <template slot-scope="scope">
                  <span v-for="(item,index) in scope.row.answer" :key="index" style="margin-right:8px;">{{ item===1?"A":item===2?"B":item===3?"C":"D" }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="detail" label="维修单编号" width="120" />
              <el-table-column prop="questionType" label="设备位置" width="200" />
              <el-table-column prop="year" label="设备种类" width="90" />
              <el-table-column prop="number" label="设备编码" width="100" />
              <el-table-column prop="recommendedTime" label="故障类型" width="100" />
              <el-table-column prop="globalCorrectRate" label="故障描述" width="200" />
              <el-table-column prop="level" label="故障时间" width="120" />
              <el-table-column prop="analysis" label="报修人" width="90" />
              <el-table-column prop="tips" label="报修时间" width="90" />
              <el-table-column prop="tips" label="录入人" width="90" />
              <el-table-column prop="tips" label="录入时间" width="90" />
              <el-table-column prop="tips" label="维修员" width="90" />
              <el-table-column prop="tips" label="状态" width="90" />
              <el-table-column prop="tips" label="附加状态" width="130" />
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button style="display:block;margin-left:0;margin-bottom:5px;" size="mini" type="success" @click="showInfo(scope.row)">详情</el-button>
                  <el-button style="display:block;margin-left:0;margin-bottom:5px;" size="mini" type="primary" @click="UpdateStage(scope.row)">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
// import page from '@/components/page.vue'
export default {
  components: {
    // page
  },
  data() {
    return {
      formSearch: {
        unit: '',
        position: '',
        sort: '',
        owner: '',
        starttime: ''
      },
      tableData: [],
      multipleSelection: '' // 表单选中行
    }
  },
  computed: {},
  mounted() {
    // this.initData(1)
    // this.getOptionsYears()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    showInfo(val) { // 点击详情按钮
      this.$router.push('/Asset/Info' + val)
    },
    UpdateStage(val) { // 点击编辑按钮
      this.$router.push('/Asset/Info' + val)
    }
  }
}
</script>
<style lang='scss' scoped>
.header {
  width: 100%;
}
.content {
  margin-top: 30px;
  .el-table th,
  .el-table td {
    padding: 5px;
  }
}
</style>
