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
              <el-input v-model="tableDataSearch.text" placeholder="请输入查询内容" size="small" />
              <el-button type="primary" size="small" @click="getData()">查询</el-button>
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
              <el-table-column prop="position" label="资产位置" width="200" />
              <el-table-column prop="tips" label="资产种类" width="90" />
              <el-table-column prop="assetCode" label="资产编码" width="100" />
              <el-table-column prop="equipmentFault" label="故障类型" width="100" />
              <el-table-column prop="description" label="故障描述" width="200" />
              <el-table-column prop="failureTime" label="故障时间" width="120" />
              <el-table-column prop="reporterName" label="报修人" width="90" />
              <el-table-column prop="reportTime" label="报修时间" width="90" />
              <el-table-column prop="recordUser" label="录入人" width="90" />
              <el-table-column prop="recordTime" label="录入时间" width="90" />
              <el-table-column prop="repairUser" label="维修员" width="90" />
              <el-table-column prop="orderState" label="状态" width="90" />
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
            <!--分页-->
            <pagination v-show="totalCount>0" :total="totalCount" :page.sync="tableDataSearch.pageSize" :limit.sync="tableDataSearch.pageIndex" @pagination="getPage" />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import pagination from '@/components/Pagination'
export default {
  components: {
    pagination
  },
  data() {
    return {
      tableData: [],
      multipleSelection: '', // 表单选中行
      formSearch: {}, // 工单状态数据
      tableDataSearch: {
        text: '', // 搜索文本
        pageSize: 20, // 展示条数
        pageIndex: 1// 页码
      },
      totalCount: 0 // 数据总条数
    }
  },
  computed: {},
  mounted() {
    this.getData()
  },
  methods: {
    getData() { // 获取数据
      console.log(this.tableDataSearch.text)
      // 搜索框内容不为空 页码跳转至第一页
      if (this.tableDataSearch.text !== '') {
        this.tableDataSearch.pageIndex = 1
      }
      this.$axios.get('/api/RepairOrder', { params: this.tableDataSearch }).then(res => {
        this.tableData = res.data
        this.totalCount = res.totalCount
      })
    },
    getPage(val) { // page事件
      // 展示条数
      this.tableDataSearch.pageSize = val.limit
      // 页码
      this.tableDataSearch.pageIndex = val.page
      // 调用获取数据
      this.getData()
    },
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
