<!--维修工程师工作页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <h4>维修工程师-我的工作</h4>
            <div class="tools">
              <el-button type="primary" size="small" @click="creatework()">新建报修单</el-button>
              <el-button type="primary" size="small" @click="changework()">转单</el-button>
              <el-button type="danger" size="small" @click="deletework()">删除</el-button>
            </div>
            <div class="select">
              <el-select v-model="tableDataSearch.state" clearable placeholder="工单状态" size="small">
                <el-option key="0" label="全部" value="0" />
                <el-option key="1" label="已指派" value="1" />
                <el-option key="2" label="未指派" value="2" />
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
              <el-table-column label="操作" width="200" prop="orderState">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" @click="Receiptwork(scope.row)">接单</el-button>
                  <el-button size="mini" type="primary" @click="changework(scope.row)">转单</el-button>
                  <el-button size="mini" type="success" @click="updatework(scope.row)">录入维修记录</el-button>
                  <el-button size="mini" type="danger" @click="deletework(scope.row)">删除</el-button>
                </template>
                <!-- <template slot-scope="scope">
                  <el-button v-show="scope.row.orderState==='Dispatched'||scope.row.orderState==='Dispatching'" size="mini" type="primary" @click="Receiptwork(scope.row)">接单</el-button>
                  <el-button v-show="scope.row.orderState==='Dispatching'||scope.row.orderState==='Dispatched'" size="mini" type="primary" @click="changework(scope.row)">转单</el-button>
                  <el-button v-show="scope.row.orderState==='Repair'" size="mini" type="success" @click="updatework(scope.row)">录入维修记录</el-button>
                  <el-button v-show="scope.row.orderState==='Record'||scope.row.orderState==='Dispatching'||scope.row.orderState==='Dispatched'" size="mini" type="danger" @click="deletework(scope.row)">删除</el-button>
                </template> -->
              </el-table-column>
              <el-table-column prop="code" label="维修单编号" width="120" />
              <el-table-column prop="position.name" label="设备位置" width="200" />
              <el-table-column prop="equipment.equimentType.name" label="设备种类" width="90" />
              <el-table-column prop="assetCode" label="设备编码" width="100" />
              <el-table-column prop="equipmentFault.name" label="故障类型" width="100" />
              <el-table-column prop="description" label="故障描述" width="200" />
              <el-table-column prop="failureTime" label="故障时间" width="120" />
              <el-table-column prop="reporterName" label="报修人" width="90" />
              <el-table-column prop="reportTime" label="报修时间" width="90" />
              <el-table-column prop="recordUser.name" label="录入人" width="90" />
              <el-table-column prop="recordTime" label="录入时间" width="90" />
              <el-table-column prop="repairUser" label="维修员" width="90" />
              <el-table-column prop="orderState" label="状态" width="180">
                <template slot-scope="scope">
                  {{ scope.row.orderState==="Record"?"记录，等待指派或抢单":scope.row.orderState==='Dispatching'?"已分配给组长，等待分派工程师":scope.row.orderState==='Dispatched'?'已分配给工程师，工程师待确认':scope.row.orderState==='Repair'?'已分配工程师，等待维修':scope.row.orderState==='Suspend'?'暂缓':scope.row.orderState==='Check'?'维修完成待验收':scope.row.orderState==='Review'?'验收完成，待审核':scope.row.orderState==='Done'?'审核完成':'报修单流程被终止' }}
                </template>
              </el-table-column>
              <el-table-column prop="repairLevel.name" label="报修等级" width="130" />
              <el-table-column prop="lastUpdateTime" label="更新时间" width="130" />
              <!-- 工单可派单可录入维修记录 -->
              <!-- <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button style="display:block;margin-left:0;margin-bottom:5px;" size="mini" type="success" @click="showInfo(scope.row)">详情</el-button>
                  <el-button style="display:block;margin-left:0;margin-bottom:5px;" size="mini" type="primary" @click="UpdateStage(scope.row)">编辑</el-button>
                </template>
              </el-table-column> -->
            </el-table>
            <!-- 删除弹框 -->
            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="removeQuestionVisible" width="220px">
              <span>您确定要删除此条数据？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="removeQuestionVisible = false">取 消</el-button>
                <el-button type="primary" @click="removeQuestion">确 定</el-button>
              </span>
            </el-dialog>
            <!--分页-->
            <pagination v-show="totalCount>0" :total="totalCount" :page.sync="tableDataSearch.pageSize" :limit.sync="tableDataSearch.pageNumber" @pagination="getPage" />
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
        pageNumber: 1, // 页码
        state: ''// 工单状态
      },
      totalCount: 0, // 数据总条数
      removeQuestionVisible: false, // 删除提示弹框隐藏
      removeData: ''// 要删除的行数据
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
        this.tableDataSearch.pageNumber = 1
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
      this.tableDataSearch.pageNumber = val.page
      // 调用获取数据
      this.getData()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    creatework() { // 新建报修单
      this.$router.push('/maintenance/WatchmanAssetslist')
    },
    changework(data) { // 转单
      console.log(data)
      if (this.multipleSelection === '') {
        this.$message.error('请选择一条数据')
      } else {
        this.$router.push('/Workorder/MaintainerChangeOrder/' + this.multipleSelection[0].id)
      }
    },
    Receiptwork(data) { // 接单
      console.log(data)
      this.$router.push('/Workorder/MaintainerReceipt/' + data.id)
    },
    updatework(data) { // 录入维修记录
      console.log(data)
      this.$router.push('/Workorder/MaintainerAddRecord/' + data.id)
    },
    deletework(data) { // 删除工单
      if (data) {
        this.removeData = data
        this.removeQuestionVisible = true
      } else {
        if (this.multipleSelection === '') {
          this.$message.error('请选择一条数据')
        } else {
          this.removeQuestionVisible = true
        }
      }
    },
    removeQuestion() {
      const _this = this
      this.$axios.delete('/api/RepairOrder/?Id=' + this.removeData.id).then(response => {
        _this.$message.success('删除成功')
        _this.removeQuestionVisible = false
        this.getData()
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.header {
  width: 100%;
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
}
.content {
  .el-table th,
  .el-table td {
    padding: 5px;
  }
}
</style>
