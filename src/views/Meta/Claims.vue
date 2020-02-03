<!-----权限信息-------->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <div class="content">
              <el-table :data="ClaimsData" stripe border style="width: 100%">
                <el-table-column prop="value" label="value" />
                <el-table-column prop="key" label="key" />
                <el-table-column prop="description" label="描述" />
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
  name: 'MetaClaims',
  data() {
    return {
      ClaimsData: [] // 数据
    }
  },
  computed: {},
  mounted() {
    this.getData()
  },
  methods: {
    // 获取数据
    getData() {
      this.$axios.get('/api/Meta/Claims').then(res => {
        this.ClaimsData = res
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.header {
  width: 100%;
  .search {
    margin: 10px 0px;
    .el-input {
      display: inline-block;
      width: 200px;
      margin-right: 20px;
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

