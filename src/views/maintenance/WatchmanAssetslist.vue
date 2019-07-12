<!-- 值班人员-工单报修-资产列表页面 -->
<template>
  <div>
    <el-row>
      <el-col :span="6">
        <treeselect v-model="treeselect" :multiple="true" :options="treeData" />
      </el-col>
      <el-col :span="18">
        <div class="panel">
          <div class="header">
            <div class="tools">
              <el-button type="primary" size="small" @click="showerror()">报修</el-button>
            </div>
            <div class="select">
              <el-select v-model="formSearch.unit" clearable placeholder="所属系统" size="small">
                <el-option key="0" label="全部" value="0" />
                <el-option key="1" label="单选" value="1" />
                <el-option key="2" label="多选" value="2" />
              </el-select>
            </div>
            <div class="toolsrt">
              <el-input v-model="searchMessage" placeholder="请输入查询内容" size="small" />
              <el-button type="primary" size="small" @click="searchData()">查询</el-button>
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
                <el-table-column prop="detail" label="资产编码" width="90" />
                <el-table-column prop="questionType" label="资产名称" width="90" />
                <el-table-column prop="year" label="品牌" width="90" />
                <el-table-column prop="number" label="型号" width="70" />
                <el-table-column prop="number" label="所属系统" width="70" />
                <el-table-column prop="number" label="安装位置" width="70" />
                <el-table-column prop="recommendedTime" label="报修次数" width="100" />
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
import Treeselect from '@riophae/vue-treeselect'
export default {
  components: {
    Treeselect
  },
  data() {
    return {
      tableData: [],
      treeData: [],
      treeselect: '',
      multipleSelection: '', // 表单选中行id
      removeData: null,
      formSearch: {}, // 筛选所属系统数据
      searchMessage: '' // 查询内容
    }
  },
  computed: {},
  mounted() {
    this.getData()
  },
  methods: {
    // 获取数据
    getData() {
      this.$axios.get('/api/Meta/Position', { params: this.positionFormSearce }).then(res => {
        this.treeData = res.data
      })
    },
    searchData() {
      // 全局查询方法
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
.tools {
  margin-top: 20px;
}
.select {
  margin: 10px 0px;
  width: 49%;
  display: inline-block;
  .el-select {
    width: 200px;
  }
}
.toolsrt {
  width: 50%;
  display: inline-block;
  text-align: right;
  .el-input {
    display: inline-block;
    width: 200px;
  }
}
.content {
  .el-table th,
  .el-table td {
    padding: 5px;
  }
}
</style>
