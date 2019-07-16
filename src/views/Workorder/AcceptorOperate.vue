<!-- 验收人员验收页面 -->
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
                <li><span>设备位置:</span><b>{{ formData.position.name }}</b></li>
                <li><span>设备种类:</span><b>{{ formData.equipment.equimentType.name }}</b></li>
                <li><span>设备编码:</span><b>{{ formData.assetCode }}</b></li>
                <li><span>故障类型:</span><b>{{ formData.equipment.name }}</b></li>
                <li><span>故障时间:</span><b>{{ formData.failureTime }}</b></li>
                <li><span>故障描述:</span><b>{{ formData.description }}</b></li>
                <li><span>录入人:</span><b>{{ formData.repairUser }}</b></li>
                <li><span>报修级别:</span><b>{{ formData.equipmentFault.name }}</b></li>
                <li><span>代维状态:</span><b>{{ formData.reporterName }}</b></li>
                <li><span>报修人:</span><b>{{ formData.reporterName }}</b></li>
                <li><span>报修时间:</span><b>{{ formData.reportTime }}</b></li>
                <li><span>派工次数:</span><b>{{ formData.dispatchCount }}</b></li>
                <li><span>维修次数:</span><b>{{ formData.repairCount }}</b></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="content">
          <h4>维修记录</h4>
          <div v-if="tableData.assetCode!==''" class="Infodata">
            <ul>
              <li><span>维修单类型:</span><b>{{ tableData.repairType }}</b></li>
              <li><span>设备种类:</span><b>{{ tableData.equipment.equimentType.name }}</b></li>
              <li><span>设备编号:</span><b>{{ tableData.assetCode }}</b></li>
              <li><span>故障类型:</span><b>{{ tableData.equipment.name }}</b></li>
              <li><span>维修级别:</span><b>{{ tableData.repairLevel }}</b></li>
              <li><span>维修开始时间:</span><b>{{ tableData.startTime }}</b></li>
              <li><span>维修结束时间:</span><b>{{ tableData.endTime }}</b></li>
              <li><span>维修过程:</span><b>{{ tableData.description }}</b></li>
              <li><span>建议:</span><b>null</b></li>
              <li><span>配件名称及数量:</span><b>{{ tableData.spareDescription }}</b></li>
              <li><span>维修人:</span><b>{{ tableData.repairer }}</b></li>
              <li><span>协助人:</span><b>{{ tableData.assist }}</b></li>
              <li><span>维修结果图片:</span><b>{{ tableData.assist }}</b></li>
              <li><span>现场验收签字:</span><b>{{ tableData.assist }}</b></li>
            </ul>
          </div>
        </div>
        <div class="content">
          <h4>验收确认</h4>
          <div v-if="checkData.assetCode!==''" class="Infodata">
            <el-form ref="checkData" :rules="checkDatarules" :model="checkData" style="width: 50%" label-width="100px">
              <el-form-item label="验收结果" prop="user">
                <el-radio-group v-model="checkData.user">
                  <el-radio :label="3">通过</el-radio>
                  <el-radio :label="6">不通过</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="验收意见" prop="user">
                <el-input v-model="checkData.user" placeholder="验收意见" size="small" />
              </el-form-item>
              <el-form-item label="验收人" prop="user">
                <el-input v-model="checkData.user" placeholder="验收人" size="small" />
              </el-form-item>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sureright()">确定</el-button>
                <el-button type="primary" @click="reset()">重置</el-button>
                <el-button type="primary" @click="close()">关闭</el-button>
              </span>
            </el-form>
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
      formSearch: {
        unit: '',
        position: '',
        sort: '',
        owner: '',
        starttime: ''
      },
      formData: {// 维修单数据
        assetId: '',
        code: ''
      },
      tableData: {// 维修记录数据
        assetId: '',
        assetCode: ''
      },
      checkData: {}, // 验收表单数据
      checkDatarules: {
        user: [
          { required: true, message: '验收意见不可为空', trigger: 'change' }
        ],
        positionId: [
          { required: true, message: '验收人不可为空', trigger: 'change' }
        ]
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
      })
      // 获取维修记录
      this.tableData.assetId = window.location.href.split('/')[window.location.href.split('/').length - 1]
      this.$axios.get('/api/RepairRecord/' + this.tableData.assetId).then(res => {
        this.tableData = res
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    sureright() { // 弹框中点确认
      this.changeActiveVisible = false // 关闭弹框
      this.$refs.checkData.validate(valid => {
        if (valid) {
          console.log('hhhhh')
          this.$axios.post('/api/', this.checkData).then(response => {
            // 跳转回个人工作页
            this.$router.push('/Workorder/Acceptorlist')
          })
        }
      })
    },
    reset() { },
    close() { // 点击关闭按钮，跳转回个人工作页
      this.$router.push('/Workorder/Acceptorlist')
    }
  }
}
</script>
<style lang='scss' scoped>
.header {
  width: 100%;
}
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
        display: inline-block;
        font-weight: 400;
      }
    }
  }
}
.content {
  margin-top: 30px;
  div {
    text-align: center;
  }
}
</style>
