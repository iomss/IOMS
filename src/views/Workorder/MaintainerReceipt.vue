<!-- 维修工程师接单页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <h4>维修单详情</h4>
            <div v-if="formData.code!==''" class="Infodata">
              <ul>
                <li><span>维修单编号:</span><b>{{ formData.code }}</b></li>
                <li><span>设备位置:</span><b>{{ formData.position.crumbName }}</b></li>
                <li><span>资产名称:</span><b>{{ formData.equipment.name }}</b></li>
                <!-- <li><span>设备种类:</span><b>{{ formData.equipment.equimentType.name }}</b></li> -->
                <li><span>设备编码:</span><b>{{ formData.assetCode }}</b></li>
                <!-- <li><span>设备类型:</span><b>{{ formData.equipment.name }}</b></li> -->
                <li><span>故障时间:</span><b>{{ formData.failureTime }}</b></li>
                <li><span>故障描述:</span><b>{{ formData.description }}</b></li>
                <li><span>录入人:</span><b>{{ formData.recordUser.name }}</b></li>
                <li><span>故障类型:</span><b>{{ formData.equipmentFault.name }}</b></li>
                <li><span>报修级别:</span><b>{{ formData.repairLevel.name }}</b></li>
                <li><span>报修人:</span><b>{{ formData.reporterName }}</b></li>
                <li><span>报修时间:</span><b>{{ formData.reportTime }}</b></li>
                <li><span>派工次数:</span><b>{{ formData.dispatchCount }}</b></li>
                <li><span>维修次数:</span><b>{{ formData.repairCount }}</b></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="content">
          <el-button type="primary" size="small" @click="reciptwork()">接受</el-button>
          <el-button type="primary" size="small" @click="backworke()">退回</el-button>
          <el-button type="primary" size="small" @click="historywork()">历史详情</el-button>
          <el-button type="primary" size="small" @click="processrecord()">过程记录</el-button>
          <el-button type="danger" size="small" @click="closework()">关闭</el-button>
        </div>
      </el-col>
      <el-dialog title="历史详情" :visible.sync="showInfo" :close-on-press-escape="false" :close-on-click-modal="false" width="1500px" :show-close="false">
        <el-table :data="logsData" border style="width: 100%">
          <el-table-column prop="code" label="维修单编号" />
          <el-table-column prop="position.crumbName" label="设备位置" width="200" />
          <el-table-column prop="equipment.name" label="资产名称" />
          <el-table-column prop="assetCode" label="设备编码" />
          <el-table-column prop="equipmentFault.name" label="故障类型" />
          <el-table-column prop="description" label="故障描述" width="200" />
          <el-table-column prop="failureTime" label="故障时间" :formatter="formatterDate" />
          <el-table-column prop="reporterName" label="报修人" />
          <el-table-column prop="reportTime" label="报修时间" :formatter="formatterDate" />
          <el-table-column prop="recordUser.name" label="录入人" />
          <el-table-column prop="recordTime" label="录入时间" :formatter="formatterDate" />
          <el-table-column prop="repairUser.name" label="派工" />
          <el-table-column prop="orderState" label="状态">
            <template slot-scope="scope">
              {{ scope.row.orderState==="Record"?"记录，等待指派或抢单":scope.row.orderState==='Dispatching'?"已分配给组长，等待分派工程师":scope.row.orderState==='Dispatched'?'已分配给工程师，工程师待确认':scope.row.orderState==='Repair'?'已分配工程师，等待维修':scope.row.orderState==='Suspend'?'暂缓':scope.row.orderState==='Check'?'维修完成待验收':scope.row.orderState==='Review'?'验收完成，待审核':scope.row.orderState==='Done'?'审核完成':'报修单流程被终止' }}
            </template>
          </el-table-column>
        </el-table>
        <div class="dialog-footer">
          <el-button type="primary" @click="showInfo = false">关闭</el-button>
        </div>
      </el-dialog>
      <el-dialog title="过程记录" :visible.sync="showInfopast" :close-on-press-escape="false" :close-on-click-modal="false" width="1500px" :show-close="false">
        <div class="titletext">派单记录</div>
        <el-table :data="logsDatapd" border style="width: 100%">
          <el-table-column prop="inputUser" label="指派人">
            <template slot-scope="scope">
              {{ scope.row.inputUser.name }}
            </template>
          </el-table-column>
          <el-table-column prop="dispatchTime" label="指派时间" :formatter="formatterDate" />
          <el-table-column prop="repairer" label="接收人">
            <template slot-scope="scope">
              {{ scope.row.repairer.name }}
            </template>
          </el-table-column>
          <el-table-column prop="operate" label="备注" />
        </el-table>
        <div class="titletext">维修记录</div>
        <el-table :data="logsDatawx" border style="width: 100%">
          <el-table-column prop="repairType" label="维修单类型">
            <template slot-scope="scope">
              {{ scope.row.repairType=='Done'?'维修完成':scope.row.repairType=='Repeat'?'重复报修':scope.row.repairType=='Mistaken'?'误报':'暂缓' }}
            </template>
          </el-table-column>
          <el-table-column prop="equipment" label="资产名称" />
          <el-table-column prop="assetCode" label="设备编号" />
          <el-table-column prop="equipmentFault" label="故障类型" />
          <el-table-column prop="repairLevel" label="维修级别" />
          <el-table-column prop="startTime" label="维修开始时间" :formatter="formatterDate" />
          <el-table-column prop="endTime" label="维修结束时间" :formatter="formatterDate" />
          <el-table-column prop="description" label="维修过程" />
          <el-table-column prop="spareDescription" label="配件名称及数量" />
          <el-table-column prop="repairer" label="维修人" />
        </el-table>
        <div class="dialog-footer">
          <el-button type="primary" @click="showInfopast = false">关闭</el-button>
        </div>
      </el-dialog>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'WorkorderMaintainerReceipt',
  components: {

  },
  data() {
    return {
      showInfo: false,
      showInfopast: false,
      logsData: [], // 历史详情表格
      logsDatapd: [], // 派单记录表格
      logsDatawx: [], // 维修记录表格
      formData: {
        assetId: '',
        code: ''
      },
      updateData: {
        id: '',
        userId: '',
        dispatchType: ''
      }
    }
  },
  computed: {},
  mounted() {
    this.getdata()
  },
  methods: {
    // 日期时间格式化
    formatterDate(row, column, cellValue) {
      if (cellValue !== null) {
        return this.$moment(cellValue).format('YYYY-MM-DD HH:mm')
      } else {
        return cellValue
      }
    },
    getdata() {
      // 获取维修详情数据
      this.formData.assetId = window.location.href.split('/')[window.location.href.split('/').length - 1]
      this.$axios.get('/api/RepairOrder/' + this.formData.assetId).then(res => {
        this.formData = res
        this.updateData.id = res.id
        this.updateData.userId = res.recordUser.id
        this.formData.failureTime = this.$moment(res.failureTime).format('YYYY-MM-DD HH:mm')
        this.formData.reportTime = this.$moment(res.reportTime).format('YYYY-MM-DD HH:mm:ss')
      })
    },
    reciptwork(val) { // 点击接受按钮
      // this.$router.push('/Asset/Info' + val)
      this.updateData.dispatchType = 'Taken'// 接单
      this.$axios.post('/api/RepairOrder/' + this.formData.id + '/Dispatch', this.updateData).then(res => {
        this.$message.success('工单接单成功')
        // 跳转个人工作页
        this.$router.push('/Workorder/Watchmanlist')
      })
    },
    backworke(val) { // 点击退回按钮
      this.updateData.dispatchType = 'return'// 退回
      this.$axios.post('/api/RepairOrder/' + this.formData.id + '/Dispatch', this.updateData).then(res => {
        this.$message.success('工单退回成功')
        // 跳转个人工作页
        this.$router.push('/Workorder/Watchmanlist')
      })
    },
    historywork() { // 点击历史详情
      this.showInfo = true
      this.$axios.get('/api/RepairOrder/All?assetId=' + this.formData.assetId).then(res => {
        this.logsData = res.data
      })
    },
    processrecord() { // 点击过程记录
      this.showInfopast = true
      this.formData.assetId = window.location.href.split('/')[window.location.href.split('/').length - 1]
      this.$axios.get('/api/RepairOrder/' + this.formData.assetId + '/DispatchLogs').then(res => {
        this.logsDatapd = res
      })
      this.$axios.get('/api/RepairRecord?repairOrderId=' + this.formData.assetId).then(res => {
        this.logsDatawx = res.data
      })
    },
    closework() { // 点击关闭
      // 关闭接单页面
      console.log(this.$router.currentRoute.fullPath)
      this.$store.dispatch('tagsView/delAllViews', this.$router.currentRoute.fullPath)
      // 跳转个人工作页
      this.$router.push('/Workorder/Watchmanlist')
    }
  }
}
</script>
<style lang='scss' scoped>
.header {
  width: 100%;
  .Infodata {
    width: 100%;
    ul {
      list-style: none;
      width: 100%;
      padding-left: 10px;
      li {
        width: 49%;
        display: inline-block;
        span {
          display: inline-block;
          font-size: 16px;
          text-align: right;
          width: 120px;
          padding: 10px;
        }
        b {
          width: 77%;
          display: inline-block;
          font-weight: 400;
        }
      }
    }
  }
}
.content {
  margin-top: 30px;
  text-align: center;
}
.dialog-footer {
  margin: 20px 0px;
  width: 100%;
  text-align: center;
}
.titletext {
  font-size: 20px;
  padding: 10px;
  background: #ddd;
  color: #333;
}
</style>
