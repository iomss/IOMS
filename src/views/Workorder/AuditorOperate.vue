<!-- 审核人员审核页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <h4>维修单详情</h4>
            <div v-if="formData.assetCode!==''" class="Infodata">
              <ul>
                <li><span>维修单编号:</span><b>{{ formData.code }}</b></li>
                <li><span>设备位置:</span><b>{{ formData.position? formData.position.crumbName :'' }}</b></li>
                <li><span>资产名称:</span><b>{{ formData.equipment===null?'':formData.equipment.name }}</b></li>
                <li><span>设备编码:</span><b>{{ formData.assetCode }}</b></li>
                <!-- <li><span>故障类型:</span><b>{{ formData.equipment.name }}</b></li> -->
                <li><span>故障时间:</span><b>{{ formData.failureTime }}</b></li>
                <li><span>故障描述:</span><b>{{ formData.description }}</b></li>
                <li><span>录入人:</span><b>{{ formData.recordUser? formData.recordUser.name:'' }}</b></li>
                <li><span>故障类型:</span><b>{{ formData.equipmentFault? formData.equipmentFault.name:'' }}</b></li>
                <li><span>报修级别:</span><b>{{ formData.repairLevel? formData.repairLevel.name:'' }}</b></li>
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
          <div class="Infodata">
            <ul v-if="tableData.repairType!==''">
              <li><span>维修单类型:</span><b>{{ tableData.repairType=='Done'?'维修完成':tableData.repairType=='Repeat'?'重复报修':tableData.repairType=='Mistaken'?'误报':'暂缓' }}</b></li>
              <li v-show="tableData.repairType!=='Mistaken'"><span>资产名称:</span><b>{{ tableData.equipment? tableData.equipment.name:'' }}</b></li>
              <!-- <li><span>设备种类:</span><b>{{ tableData.equipment.equimentType.name }}</b></li> -->
              <li v-show="tableData.repairType!=='Mistaken'"><span>设备编号:</span><b>{{ tableData.assetCode }}</b></li>
              <li v-show="tableData.repairType!=='Mistaken'"><span>故障类型:</span><b>{{ tableData.equipmentFault? tableData.equipmentFault.name:'' }}</b></li>
              <li v-show="tableData.repairType!=='Mistaken'"><span>维修级别:</span><b>{{ tableData.repairLevel===null?'':tableData.repairLevel.name }}</b></li>
              <li v-show="tableData.repairType!=='Mistaken'"><span>维修开始时间:</span><b>{{ tableData.startTime===null?'':this.$moment(tableData.startTime).format('YYYY-MM-DD HH:MM:SS') }}</b></li>
              <li v-show="tableData.repairType!=='Mistaken'"><span>维修结束时间:</span><b>{{ tableData.endTime===null?'':this.$moment(tableData.endTime).format('YYYY-MM-DD HH:MM:SS') }}</b></li>
              <li v-show="tableData.repairType!=='Mistaken'"><span>维修过程:</span><b>{{ tableData.description }}</b></li>
              <!-- <li><span>建议:</span><b>null</b></li> -->
              <li v-show="tableData.repairType!=='Mistaken'"><span>配件名称及数量:</span><b>{{ tableData.spareDescription }}</b></li>
              <li><span>维修人:</span><b>{{ tableData.repairer? tableData.repairer.name:'' }}</b></li>
              <li v-show="tableData.repairType!=='Mistaken'">
                <span>维修结果图片:</span>
                <el-image style="width: 100px; height: 100px" :src="url+tableData.resultImg" :preview-src-list="[url+tableData.resultImg]">
                  <div slot="error" class="el-image__error">
                    暂无图片
                  </div>
                </el-image>
              </li>
              <li v-show="tableData.repairType!=='Mistaken'">
                <span>现场验收签字:</span>
                <b>
                  <el-image style="width: 100px; height: 100px" :src="url+tableData.signImg" :preview-src-list="[url+tableData.signImg]">
                    <div slot="error" class="el-image__error">
                      暂无图片
                    </div>
                  </el-image>
                </b>
              </li>
              <li v-show="tableData.repairType!=='Mistaken'"><span>协助人:</span><b>{{ tableData.assist }}</b></li>
              <li><span>备注:</span><b>{{ tableData.comment }}</b></li>
            </ul>
          </div>
        </div>
        <div class="mid">
          <h4>验收确认</h4>
          <div class="Infodata">
            <ul v-if="tableData.repairType!==''">
              <li><span>验收结果:</span><b>{{ tableData.checkStatus ==='Applied'?'通过':tableData.checkStatus ==='Rejected'?'不通过':'' }}</b></li>
              <li><span>验收意见:</span><b>{{ tableData.checkComment }}</b></li>
              <li><span>验收人:</span><b>{{ tableData.checkUser?tableData.checkUser.name:'' }}</b></li>
              <li><span>验收时间:</span><b>{{ tableData.checkTime }}</b></li>
            </ul>
          </div>
        </div>
        <div class="content">
          <h4>审核确认</h4>
          <el-form ref="checkData" :rules="checkDatarules" :model="checkData" style="width: 50%" label-width="150px">
            <el-form-item label="审核结果" prop="reviewStatus">
              <el-radio-group v-model="checkData.reviewStatus">
                <el-radio label="Applied">通过</el-radio>
                <el-radio label="Rejected">不通过</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="审核意见" prop="comment">
              <el-input v-model="checkData.comment" placeholder="审核意见" size="small" />
            </el-form-item>
            <el-form-item label="审核人">
              {{ dangqianUser.userName }}
            </el-form-item>
            <el-form-item class="form_total">
              <el-button type="primary" @click="sureright()">确定</el-button>
              <el-button type="primary" @click="close()">关闭</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'WorkorderAuditorOperate',
  components: {
  },
  data() {
    return {
      url: process.env.VUE_APP_API,
      dangqianUser: {// 当前登陆用户
        userName: this.$cookie.get('trueName'),
        id: this.$cookie.get('id')
      },
      repairRecordId: '', // 维修记录id
      formData: {// 维修单数据
        assetId: '',
        code: '',
        position: '',
        equipment: {
          id: '',
          name: '',
          equimentType: {
            id: '',
            name: ''
          }
        },
        assetCode: '',
        failureTime: '',
        description: '',
        repairUser: '',
        equipmentFault: '',
        reporterName: '',
        reportTime: '',
        dispatchCount: '',
        repairCount: ''
      },
      tableData: {// 维修记录数据
        assetId: '',
        repairType: ''
      },
      checkData: {// 审核表单数据
        reviewStatus: 'Applied',
        comment: ''
      },
      checkDatarules: {
        comment: [
          { required: true, message: '验收意见不可为空', trigger: 'change' }
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
        this.repairRecordId = res.repairRecordId
        this.formData.failureTime = this.$moment(res.failureTime).format('YYYY-MM-DD HH:mm')
        this.formData.reportTime = this.$moment(res.reportTime).format('YYYY-MM-DD HH:mm:ss')
        this.getrecord()
      })
    },
    getrecord() {
      this.$axios.get('/api/RepairRecord/' + this.repairRecordId).then(res => {
        this.tableData = res
        if (this.tableData.startTime === null) {
          this.tableData.startTime = ''
          this.tableData.endTime = ''
        } else {
          this.tableData.startTime = this.$moment(res.startTime).format('YYYY-MM-DD HH:mm')
          this.tableData.endTime = this.$moment(res.endTime).format('YYYY-MM-DD HH:mm')
        }
        // this.tableData.resultImg = process.env.VUE_APP_API + res.resultImg
        // this.tableData.signImg = process.env.VUE_APP_API + res.signImg
      })
    },
    sureright() { // 审核通过点确定
      this.$refs.checkData.validate(valid => {
        if (valid) {
          this.$axios.post('/api/RepairRecord/' + this.repairRecordId + '/Review', this.checkData).then(response => {
            // 跳转回个人工作页
            this.$router.push('/Workorder/Watchmanlist')
          })
        }
      })
    },
    reset() { },
    close() { // 点击关闭按钮，跳转回个人工作页
      this.$router.push('/Workorder/Watchmanlist')
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
        width: 150px;
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
  .form_total {
    width: 100%;
  }
}
</style>
