<!-- 资产管理页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <h4>清单管理</h4>
            <div class="tools">
              <el-button type="primary" plain size="small" @click="exportdata()">导出数据</el-button>
            </div>
            <div class="toolsrt">
              <el-form ref="form" :model="formSearch">
                <el-select v-model="formSearch.system" clearable placeholder="系统名称" size="small">
                  <el-option key="1" label="单选" value="1" />
                  <el-option key="2" label="多选" value="2" />
                </el-select>
                <el-select v-model="formSearch.source" clearable placeholder="来源" size="small">
                  <el-option key="1" label="单选" value="1" />
                  <el-option key="2" label="多选" value="2" />
                </el-select>
                <el-input v-model="formSearch.name" placeholder="设备名称" size="small" />
                <el-button type="primary" plain size="small" @click="search()">查询</el-button>
              </el-form>
            </div>
          </div>
          <div class="content">
            <el-table :data="tableData" stripe border style="width: 100%" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="40" />
              <el-table-column label="系统名称" prop="version" width="150">
                <template slot-scope="scope">
                  <span v-for="(item,index) in scope.row.answer" :key="index" style="margin-right:8px;">{{ item===1?"A":item===2?"B":item===3?"C":"D" }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="year" label="设备种类" width="90" />
              <el-table-column prop="unit" label="责任期内数量" width="150" />
              <el-table-column prop="num" label="责任期外数量" width="150" />
              <el-table-column prop="time" label="设备小计" width="100" />
              <el-table-column prop="state" label="备注" width="100" />
              <el-table-column prop="state" label="来源" width="100" />
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
      formSearchShow: false,
      formSearch: {
        name: '',
        year: '',
        system: ''
      },
      multipleSelection: false, // 表单选中行
      tableData: [],
      removeData: []
    }
  },
  computed: {},
  mounted() {
  },
  methods: {
    search() {
      // 点击右上角查询方法
    },
    exportdata() {
      // 导出方法
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>
<style lang='scss' scoped>
.header {
  width: 100%;
}

.tools {
  margin: 10px 0px;
  width: 29%;
  display: inline-block;
}
.toolsrt {
  width: 70%;
  display: inline-block;
  text-align: right;
}
.search {
  width: 450px;
  position: absolute;
  right: 0;
  z-index: 4;
}
.content {
  .el-table th,
  .el-table td {
    padding: 5px;
  }
}
.el-input {
  display: inline-block;
  width: 30%;
}
</style>
