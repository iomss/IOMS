<!-- 费率信息管理页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header" />
          <div class="content">
            <el-table :data="tableData" style="width: 100%" row-key="id" border :tree-props="{children: 'children', hasChildren: 'hasChildren'}" @row-contextmenu="rightClick">
              <el-table-column type="index" width="50" />
              <el-table-column prop="name" label="项目名称" />
              <el-table-column prop="rate" label="费率" />
              <el-table-column prop="comment" label="备注" />
            </el-table>
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
      removeData: []
    }
  },
  computed: {},
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$axios.get('/api/Tariff/' + this.$route.params.id).then(res => {
        this.tableData = res.tariffVerionItems
        this.totalCount = res.totalCount
      })
    },
    rightClick(row, column, event) {
      console.log(row)
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
  width: 50%;
  text-align: left;
  .el-form-item {
    width: 200px;
    display: inline-block;
  }
  .el-select {
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
