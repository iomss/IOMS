<!-- 值班人员-工单报修-资产列表页面 -->
<template>
  <div>
    <el-row>
      <el-col :span="6">
        <h4>设备位置</h4>
        <el-tree ref="TreeData" :data="treeData" :check-strictly="true" show-checkbox node-key="id" :props="defaultProps" @check-change="handleCheckChange" />
      </el-col>
      <el-col :span="18">
        <div class="panel">
          <div class="header">
            <div class="tools">
              <el-button type="primary" size="small" @click="showerror()">报修</el-button>
            </div>
            <div class="select">
              <el-select v-model="tableDataSearch.systemId" clearable placeholder="所属系统" size="small">
                <el-option v-for="item in systemData" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </div>
            <div class="toolsrt">
              <el-input v-model="tableDataSearch.text" placeholder="请输入查询内容" size="small" />
              <el-button type="primary" size="small" @click="getData()">查询</el-button>
            </div>
            <div class="content">
              <el-table :data="tableData" stripe border style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="40" />
                <el-table-column prop="id" label="序号" width="60" />
                <el-table-column prop="state" label="状态" width="80">
                  <template slot-scope="scope">
                    {{ scope.row.state==='Normal'?"正常":scope.row.state==='Using'?"使用中":"故障" }}
                  </template>
                </el-table-column>
                <el-table-column prop="code" label="资产编码" width="150" />
                <el-table-column prop="alias" label="资产名称" width="100" />
                <el-table-column prop="brand.name" label="品牌" width="100" />
                <el-table-column prop="model.name" label="型号" width="100" />
                <el-table-column prop="system.name" label="所属系统" width="100" />
                <el-table-column prop="position.name" label="安装位置" width="150" />
                <el-table-column prop="recommendedTime" label="报修次数" width="100" />
                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button style="display:block;margin-left:0;margin-bottom:5px;" size="mini" type="primary" @click="showerror(scope.row)">报修</el-button>
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
export default {
  components: {
  },
  data() {
    return {
      tableData: [],
      treeData: [],
      treeselect: null,
      multipleSelection: '', // 表单选中行id
      removeData: null,
      formSearch: {}, // 筛选所属系统数据
      searchMessage: '', // 查询内容
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      tableDataSearch: {
        text: '', // 搜索文本
        pageSize: 20, // 展示条数
        pageNumber: 1, // 页码
        positionIds: [], // 树选中值
        systemId: ''// 所属系统选中值
      },
      totalCount: 0, // 数据总条数
      systemData: []// 所属系统数据
    }
  },
  computed: {},
  mounted() {
    this.getTree()
    this.getselect()
  },
  methods: {
    getselect() {
      this.$axios.get('/api/Meta/System').then(res => {
        this.systemData = res.data
      })
    },
    // 获取数据
    getTree() {
      this.$axios.get('/api/tree/position').then(res => {
        this.treeData = res
        console.log(this.treeData)
      })
      this.getData()
    },
    getData() { // 获取右侧列表数据
      // 搜索框内容不为空 页码跳转至第一页
      if (this.tableDataSearch.text !== '') {
        this.tableDataSearch.pageNumber = 1
      }
      this.$axios.get('/api/Assets', { params: this.tableDataSearch }).then(res => {
        this.tableData = res.data
        this.totalCount = res.totalCount
      })
    },
    searchData() {
      // 全局查询方法
    },
    handleSelectionChange(val) { // 表单选中行
      this.multipleSelection = val
    },
    showerror(data) { // 列表单行报修方法
      this.$router.push('/maintenance/WatchmanDispatch/' + data.id)
    },

    handleCheckChange(data, checked, indeterminate) {
      /* 主要通过checked进行判断 */
      if (checked) {
        // const arr = [data.id]
        // this.$refs.TreeData.setCheckedKeys(arr)// 饿了么树变单选
        this.tableDataSearch.positionIds.push(data.id)
        // 请求筛选右侧
        this.getData()
      } else {
        this.tableDataSearch.positionIds.splice(this.tableDataSearch.positionIds.indexOf(data.id), 1)
        this.getData()
      }
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
