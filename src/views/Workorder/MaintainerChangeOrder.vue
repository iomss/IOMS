<!-- 维修工程师转单页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <h4>维修转单详情</h4>
            <div v-if="formData.code!==''" class="formData">
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
                <li>
                  <el-form ref="form" :model="updateData" label-width="120px">
                    <el-form-item label="派工:">
                      <el-select v-model="updateData.userId" v-loadmore="loadMoreuser" filterable placeholder="派工" size="small">
                        <el-option v-for="item in userData" :key="item.id" :label="item.userName" :value="item.id" />
                      </el-select>
                    </el-form-item>
                  </el-form>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="content">
          <el-button type="primary" size="small" @click="partwork()">分配工单</el-button>
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
      userData: [], // 用户数据
      updateData: {
        id: '',
        userId: '',
        dispatchType: 'Transfer'// 转单
      },
      userpage: {// 指定工程师分页
        pageNumber: 1,
        pageSize: 10,
        pageCount: ''
      }
    }
  },
  computed: {},
  mounted() {
    this.getdata()
    this.getuserData()
  },
  methods: {
    getdata() {
      // 获取维修详情数据
      this.formData.assetId = window.location.href.split('/')[window.location.href.split('/').length - 1]
      this.$axios.get('/api/RepairOrder/' + this.formData.assetId).then(res => {
        this.formData = res
        this.formData.failureTime = this.$moment(res.failureTime).format('YYYY-MM-DD HH:mm')
        this.formData.reportTime = this.$moment(res.reportTime).format('YYYY-MM-DD HH:mm:ss')
        this.updateData.id = res.id
      })
    },
    getuserData() {
      // 获取用户
      this.$axios.get('/api/User?Dispatch=true&pageSize=' + this.userpage.pageSize + '&pageNumber=' + this.userpage.pageNumber).then(res => {
        this.userData = this.userData.concat(res.data)
        this.userpage.pageCount = res.pageCount
      })
    },
    loadMoreuser() {
      if (this.userpage.pageCount > this.userpage.pageNumber) {
        this.userpage.pageNumber += 1
        this.getuserData()
      }
    },
    partwork() { // 分配工单
      this.$axios.post('/api/RepairOrder/' + this.formData.id + '/Dispatch', this.updateData).then(res => {
        this.$message.success('工单分配成功')
        // 跳转个人工作页
        this.$router.push('/Workorder/Watchmanlist')
      })
    },
    processrecord() { // 点击过程记录

    },
    closework() { // 点击关闭
      // 跳转个人工作页
      this.$router.push('/Workorder/Watchmanlist')
    }
  }
}
</script>
<style lang='scss' scoped>
.header {
  width: 100%;
  .formData {
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
  width: 100%;
  text-align: center;
}
</style>
