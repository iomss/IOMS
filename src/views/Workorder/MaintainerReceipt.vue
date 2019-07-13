<!-- 维修工程师接单页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <h4>维修单详情</h4>
            <div class="Infodata">
              <ul>
                <li><span>维修单编号:</span><b>{{ InfoData }}</b></li>
                <li><span>设备位置:</span><b>{{ InfoData }}</b></li>
                <li><span>设备种类:</span><b>{{ InfoData }}</b></li>
                <li><span>设备编码:</span><b>{{ InfoData }}</b></li>
                <li><span>故障类型:</span><b>{{ InfoData }}</b></li>
                <li><span>故障时间:</span><b>{{ InfoData }}</b></li>
                <li><span>故障描述:</span><b>{{ InfoData }}</b></li>
                <li><span>录入人:</span><b>{{ InfoData }}</b></li>
                <li><span>报修级别:</span><b>{{ InfoData.repairLevel }}</b></li>
                <!-- <li><span>代维状态:</span><b>{{ InfoData }}</b></li> -->
                <li><span>报修人:</span><b>{{ InfoData }}</b></li>
                <li><span>报修时间:</span><b>{{ InfoData }}</b></li>
                <li><span>派工次数:</span><b>{{ InfoData }}</b></li>
                <li><span>维修次数:</span><b>{{ InfoData }}</b></li>
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
    </el-row>
  </div>
</template>
<script>
export default {
  components: {

  },
  data() {
    return {
      InfoData: []
    }
  },
  computed: {},
  mounted() {
    // this.initData(1)
    this.getdata()
  },
  methods: {
    getdata() {
      // 获取维修详情数据
      this.$axios.get('/api/RepairOrder/1').then(res => {
        this.InfoData = res.data
      })
    },
    reciptwork(val) { // 点击接受按钮
      // this.$router.push('/Asset/Info' + val)
    },
    backworke(val) { // 点击退回按钮
      // this.$router.push('/Asset/Info' + val)
    },
    historywork() { // 点击历史详情

    },
    processrecord() { // 点击过程记录

    },
    closework() { // 点击关闭

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
      border-top: 1px solid #999;
      li {
        width: 49%;
        display: inline-block;
        border-bottom: 1px solid #999;
        border-right: 1px solid #999;
        span {
          display: inline-block;
          font-size: 16px;
          text-align: right;
          width: 120px;
          padding: 10px;
        }
        b {
          display: inline-block;
          font-weight: 400;
        }
      }
    }
  }
}
.content {
  margin-top: 30px;
  .el-table th,
  .el-table td {
    padding: 5px;
  }
  .el-form-item {
    width: 49%;
    display: inline-block;
    .el-select {
      width: 100%;
    }
    .el-date-editor {
      width: 100%;
    }
  }
  .form_total {
    width: 100%;
    text-align: center;
    margin-top: 30px;
  }
}
</style>
