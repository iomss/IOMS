<!--审核人员工作页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <h4>审核人员-我的工作</h4>
            <div class="tools">
              <el-button type="primary" size="small" @click="creatework()">新建报修单</el-button>
              <el-button type="primary" size="small" @click="checkwork()">批量审核</el-button>
              <el-button type="danger" size="small" @click="deletework()">删除</el-button>
            </div>
            <div class="select">
              <el-select v-model="formSearch.unit" clearable placeholder="工单状态" size="small">
                <el-option key="0" label="全部" value="0" />
                <el-option key="1" label="单选" value="1" />
                <el-option key="2" label="多选" value="2" />
              </el-select>
            </div>
            <div class="toolsrt">
              <el-input v-model="searchMessage" placeholder="请输入查询内容" size="small" />
              <el-button type="primary" size="small" @click="searchData()">查询</el-button>
            </div>
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
              <el-table-column prop="questionType" label="资产位置" width="200" />
              <el-table-column prop="year" label="资产种类" width="90" />
              <el-table-column prop="number" label="资产编码" width="100" />
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
              <el-table-column prop="tips" label="代维状态" width="130" />
              <el-table-column prop="tips" label="报修等级" width="130" />
              <el-table-column prop="tips" label="更新时间" width="130" />
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <!-- 工单可审核 -->
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
      tableData: [],
      multipleSelection: '', // 表单选中行
      formSearch: {},
      searchMessage: ''
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
      // this.$router.push('/Asset/Info' + val)
    },
    UpdateStage(val) { // 点击编辑按钮
      // this.$router.push('/Asset/Info' + val)
    },
    checkwork() { // 批量验收按钮

    },
    creatework() { // 新建报修单按钮

    },
    deletework() { // 删除按钮

    },
    searchData() { // 查询

    }
  }
}
</script>
<style lang='scss' scoped>
.header {
  width: 100%;
  .select {
    margin: 10px 0px;
    width: 49%;
    display: inline-block;
    .el-form {
      width: 200px;
    }
  }
  .toolsrt {
    width: 50%;
    display: inline-block;
    .el-input {
      display: inline-block;
      width: 200px;
    }
  }
}
.content {
  .el-table th,
  .el-table td {
    padding: 5px;
  }
}
</style>
