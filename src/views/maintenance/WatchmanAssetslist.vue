<!-- 值班人员-工单报修-资产列表页面 -->
<template>
  <div>
    <el-row>
      <el-col :span="6">
        tree
      </el-col>
      <el-col :span="18">
        <div class="panel">
          <div class="header">
            <h4>资产列表</h4>
            <div class="select">
              <el-button type="primary" plain size="small" @click="selectstate(0)">硬件</el-button>
              <el-button type="primary" plain size="small" @click="selectstate(1)">软件</el-button>
            </div>
            <div class="content">
              <el-table :data="tableData" stripe border style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="40" />
                <el-table-column prop="id" label="序号" width="60" />
                <el-table-column label="状态" width="80">
                  <template slot-scope="scope">
                    <span v-for="(item,index) in scope.row.answer" :key="index" style="margin-right:8px;">{{ item===1?"A":item===2?"B":item===3?"C":"D" }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="detail" label="设备名称" width="90" />
                <el-table-column prop="questionType" label="品牌" width="90" />
                <el-table-column prop="year" label="型号" width="90" />
                <el-table-column prop="number" label="位置" width="70" />
                <el-table-column prop="recommendedTime" label="维修次数" width="100" />
                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button style="display:block;margin-left:0;margin-bottom:5px;" size="mini" type="success" @click="showerror(scope.row)">报修</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
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
      multipleSelection: '', // 表单选中行id
      removeData: null
    }
  },
  computed: {},
  mounted() {
    // this.initData(1)
    // this.getOptionsYears()
  },
  methods: {
    selectstate(val) { // 硬件软件按钮筛选
      console.log(val)
    },
    handleSelectionChange(val) { // 表单选中行
      this.multipleSelection = val
    },
    showerror(data) { // 列表单行报修方法
      console.log(data)
      this.$router.push({
        name: 'WatchmanDispatch'
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.header {
  width: 100%;
}
.select {
  width: 40%;
  display: inline-block;
}
.tools {
  width: 30%;
  display: inline-block;
}
.toolsrt {
  width: 20%;
  display: inline-block;
  text-align: right;
}
.search {
  width: 450px;
  position: absolute;
  right: 0;
  z-index: 4;
  .el-input {
    display: inline-block;
    width: 49%;
  }
  .el-select {
    margin-bottom: 5px;
    .el-input {
      width: 100%;
    }
  }
}
.content {
  margin-top: 30px;
  .el-table th,
  .el-table td {
    padding: 5px;
  }
}
</style>
