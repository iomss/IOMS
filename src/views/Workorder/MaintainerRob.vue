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
                <li><span>录入人:</span><b>{{ formData.repairUser==null?'': formData.repairUser.name }}</b></li>
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
          <el-button type="primary" size="small" @click="robwork()">抢单</el-button>
          <el-button type="primary" size="small" @click="backworke()">退回</el-button>
          <el-button type="primary" size="small" @click="historywork()">历史详情</el-button>
          <el-button type="primary" size="small" @click="processrecord()">过程记录</el-button>
          <el-button type="danger" size="small" @click="closework()">关闭</el-button>
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
    getdata() {
      // 获取维修详情数据
      this.formData.assetId = window.location.href.split('/')[window.location.href.split('/').length - 1]
      this.$axios.get('/api/RepairOrder/' + this.formData.assetId).then(res => {
        this.formData = res
        this.updateData.id = res.id
        this.updateData.userId = res.recordUser.id
      })
    },
    robwork() { // 点击接受按钮
      // this.$router.push('/Asset/Info' + val)
      this.updateData.dispatchType = 'Grab'// 抢单
      this.$axios.post('/api/RepairOrder/' + this.formData.id + '/Dispatch', this.updateData).then(res => {
        this.$message.success('工单抢单成功')
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

    },
    processrecord() { // 点击过程记录

    },
    closework() { // 点击关闭
      // 跳转个人工作页
      this.$router.push('/Workorder/Maintainerlist')
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
</style>
