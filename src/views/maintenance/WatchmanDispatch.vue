<!-- 值班人员派单页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <h4>值班人员派单</h4>
            <div class="select">
              <el-form ref="formData" :model="formData" label-width="90px" :rules="formDatarules">
                <el-form-item label="报修位置" prop="positionId">
                  {{ formData.positionName }}
                </el-form-item>
                <el-form-item label="资产名称" prop="equipment">
                  {{ formData.equipment }}
                </el-form-item>
                <el-form-item label="故障时间" prop="failureTime">
                  <el-date-picker v-model="formData.failureTime" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="故障时间" />
                </el-form-item>
                <el-form-item label="报修时间" prop="reportTime">
                  <el-date-picker v-model="formData.reportTime" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="报修时间" />
                </el-form-item>
                <el-form-item label="故障类型" class="showtishi" prop="equipmentFaultId">
                  <el-select v-model="formData.equipmentFaultId" clearable placeholder="故障类型" size="small">
                    <el-option v-for="item in faultData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                  <i class="fa fa-plus" aria-hidden="true" @click="creatorder()" />
                </el-form-item>
                <el-form-item label="报修人" prop="reporterName">
                  {{ dangqianUser.userName }}
                </el-form-item>
                <el-form-item label="故障描述" class="total" prop="description">
                  <el-input v-model="formData.description" placeholder="故障描述" size="small" />
                </el-form-item>
                <el-form-item label="故障级别" class="showtishi" prop="repairLevelId">
                  <el-select v-model="formData.repairLevelId" clearable placeholder="故障级别" size="small">
                    <el-option v-for="item in levelData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                  <el-tooltip placement="right">
                    <div slot="content" style="width:300px;">一级故障（重大设备故障）：<br>
                      指机电系统出现系统瘫痪或局部瘫痪造成收费运营不能正常进行的故障。出现一级故障时要立即赶赴现场维修，要求在8小时内完成维修任务。其中现有外联维修协议包括的维修范围：①柴油发电机故障②UPS故障③光缆线路故障④通信设备故障⑤收费、监控系统故障⑥情报板故障⑦供配电系统故障。<br>
                      二级故障（较大设备故障）：<br>
                      指机电系统设备出现局部故障，对正常的收费监控管理造成较大影响的设备故障。出现二级故障时要求在72小时（3天）内完成维修任务。<br>
                      三级故障（一般设备故障）：<br>
                      指机电系统设备出现单一设备故障，对正常收费、监控管理影响较少或没有影响的故障。出现三级故障时要求在120小时（5天）内完成维修任务。
                    </div>
                    <el-button>说明</el-button>
                  </el-tooltip>
                </el-form-item>
                <el-form-item label="指定工程师" prop="repairUserId">
                  <el-select v-model="formData.repairUserId" clearable placeholder="指定工程师" size="small">
                    <el-option v-for="item in userData" :key="item.id" :label="item.userName" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item class="total">
                  <el-button type="primary" size="small" icon="el-icon-search" @click="createWorker()">派单</el-button>
                  <el-button type="primary" size="small" icon="el-icon-search" @click="cancelWorker()">取消</el-button>
                </el-form-item>
              </el-form>
            </div>
            <el-dialog title="添加故障类型" :visible.sync="changeActiveVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="600px">
              <el-form ref="formAdd" :model="formAdd" label-width="90px" :rules="formAddrules">
                <el-form-item label="设备种类" prop="equipmentId" class="total">
                  <el-select v-model="formAdd.equipmentId" clearable placeholder="设备种类" size="small">
                    <el-option v-for="item in typeData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="故障名称" prop="name" class="total">
                  <el-input v-model="formAdd.name" placeholder="故障名称" />
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="creatderrortype()">确 定</el-button>
                <el-button type="primary" @click="changeActiveVisible=false">关闭</el-button>
              </span>
            </el-dialog>
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
      dangqianUser: {// 当前登陆用户
        userName: this.$cookie.get('userName'),
        id: this.$cookie.get('id')
      },
      changeActiveVisible: false,
      formData: {
        assetId: '',
        positionId: '',
        positionName: '',
        equipment: '',
        equipmentId: '',
        failureTime: '',
        reportTime: '',
        equipmentFaultId: '',
        reporterName: '',
        description: '',
        repairLevelId: '',
        repairUserId: ''
      },
      formAdd: {
        equipmentId: '',
        name: ''
      },
      positionData: [], // 安装位置数据
      typeData: [], // 设备种类数据
      faultData: [], // 故障类型数据
      levelData: [], // 故障级别数据
      userData: [], // 可指派人员数据
      formDatarules: {
        failureTime: [
          { type: 'date', required: true, message: '请选择故障时间', trigger: 'change' }
        ],
        reportTime: [
          { type: 'date', required: true, message: '请选择报修时间', trigger: 'change' }
        ]
      },
      formAddrules: {
        equipmentId: [
          { required: true, message: '设备种类不可为空', trigger: 'change' }
        ],
        name: [
          { required: true, message: '故障名称不可为空', trigger: 'change' }
        ]
      }
    }
  },
  computed: {},
  mounted() {
    this.getselectData()
    this.getData()
  },
  methods: {
    getselectData() { // 获取下拉菜单数据
      // 获取安装位置
      this.$axios.get('/api/Meta/Position').then(res => {
        this.positionData = res.data
      })
      // 获取设备种类
      this.$axios.get('/api/Meta/Equipment').then(res => {
        this.typeData = res.data
      })
      // 获取故障类型
      this.$axios.get('/api/Meta/Fault').then(res => {
        this.faultData = res.data
      })
      // 获取维修级别
      this.$axios.get('/api/Meta/RepairLevel').then(res => {
        this.levelData = res.data
      })
      // 获取用户
      this.$axios.get('/api/User?dispatch=true').then(res => {
        this.userData = res.data
      })
    },
    getData() { // 获取当前数据
      const _this = this
      this.formData.assetId = window.location.href.split('/')[window.location.href.split('/').length - 1]
      this.$axios.get('/api/Assets/' + this.formData.assetId).then(res => {
        _this.formData.positionId = res.positionId
        _this.formData.equipment = res.equipment.name
        _this.formData.equipmentId = res.equipment.id
        _this.formData.positionId = res.position.id
        _this.formData.positionName = res.position.name
      })
    },
    createWorker() { // 提交派单按钮方法
      this.$refs.formData.validate(valid => {
        if (valid) {
          this.formData.reporterName = this.dangqianUser.id
          this.$axios.post('/api/RepairOrder', this.formData).then(res => {
            this.$message.success('录入成功')
            this.$router.push('/Workorder/Watchmanlist')
            // 页面跳转个人工作页
          })
        }
      })
    },
    handleSelectionChange(val) { // 表单选中行
      this.multipleSelection = val
    },
    creatorder() { // 创建故障类型
      this.changeActiveVisible = true// 打开弹框
    },
    creatderrortype() { // 添加故障类型弹框确定方法
      console.log(this)
      this.$refs.formAdd.validate(valid => {
        if (valid) {
          // 提交数据
          this.$axios.post('/api/Meta/Fault', this.formAdd).then(res => {
            this.faultData = res.data
          })
          // 刷新数据
          this.$axios.get('/api/Meta/Fault').then(res => {
            this.faultData = res.data
          })
          // 隐藏弹框
          this.changeActiveVisible = false
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.header {
  width: 100%;
}
.el-form-item {
  width: 49%;
  display: inline-block;
}
.el-select {
  margin-bottom: 5px;
  width: 100%;
}
.el-input {
  width: 100%;
}

.total {
  width: 98%;
  text-align: center;
}
.showtishi {
  .el-select {
    display: inline-block;
    width: 90%;
  }
  .el-button {
    padding: 8px 15px;
  }
}
</style>
