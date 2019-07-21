<!-- 维修工程师添加维修记录页面 -->
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
                <li><span>资产名称:</span><b>{{ formData.equipment.name }}</b></li>
                <!-- <li><span>设备种类:</span><b>{{ formData.equipment.equimentType.name }}</b></li> -->
                <li><span>设备编码:</span><b>{{ formData.assetCode }}</b></li>
                <!-- <li><span>故障类型:</span><b>{{ formData.equipment.name }}</b></li> -->
                <li><span>故障时间:</span><b>{{ formData.failureTime }}</b></li>
                <li><span>故障描述:</span><b>{{ formData.description }}</b></li>
                <li><span>录入人:</span><b>{{ formData.repairUser.name }}</b></li>
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
          <h4>维修记录</h4>
          <el-form label-width="120px">
            <el-form-item label="维修单类型" prop="repairType">
              <el-radio-group v-model="repairType">
                <el-radio label="Done">维修完毕</el-radio>
                <el-radio label="Mistaken">误报</el-radio>
                <el-radio label="Suspend">暂缓</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <el-form v-if="repairType=='Done'" ref="formRcorda" :model="formRcorda" label-width="120px" :rules="formRcordarules">
            <el-form-item label="设备种类" prop="equipmentId">
              <el-select v-model="formRcorda.equipmentId" v-loadmore="loadMoreequipment" filterable placeholder="设备种类" size="small" @change="changeEquipment">
                <el-option v-for="item in equipmentData" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="设备编码" prop="assetCode">
              <el-select v-model="formRcorda.assetCode" filterable placeholder="设备编码" size="small">
                <el-option v-for="item in assetsData" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="故障类型" prop="equipmentFaultId">
              <el-select v-model="formRcorda.equipmentFaultId" v-loadmore="loadMorefault" filterable placeholder="故障类型" size="small">
                <el-option v-for="item in faultData" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="维修级别" prop="repairLevelId">
              <el-select v-model="formRcorda.repairLevelId" filterable placeholder="产权单位" size="small">
                <el-option v-for="item in levelData" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="维修开始时间" prop="startTime">
              <el-date-picker v-model="formRcorda.startTime" type="datetime" placeholder="维修开始时间" />
            </el-form-item>
            <el-form-item label="维修结束时间" prop="endTime">
              <el-date-picker v-model="formRcorda.endTime" type="datetime" placeholder="维修结束时间" />
            </el-form-item>
            <el-form-item label="维修过程" prop="description">
              <el-input v-model="formRcorda.description" placeholder="维修过程" size="small" />
            </el-form-item>
            <el-form-item label="备注" prop="comment">
              <el-input v-model="formRcorda.comment" placeholder="备注" size="small" />
            </el-form-item>
            <el-form-item label="配件名称及数量" prop="spareDescription">
              <el-input v-model="formRcorda.spareDescription" placeholder="配件名称及数量" size="small" />
            </el-form-item>
            <el-form-item label="维修人" prop="repairerId">
              {{ dangqianUser.userName }}
            </el-form-item>
            <el-form-item label="维修人员" prop="assist">
              <el-input v-model="formRcorda.assist" placeholder="维修人员" size="small" />
            </el-form-item>
            <el-form-item class="form_total">
              <el-button type="primary" size="small" @click="updata('a')">提交</el-button>
              <el-button type="primary" size="small" @click="initData('a')">重置</el-button>
              <el-button type="primary" size="small" @click="close('a')">关闭</el-button>
            </el-form-item>
          </el-form>
          <el-form v-if="repairType=='Mistaken'" ref="formRcordc" :model="formRcordc" label-width="120px" :rules="formRcordcrules">
            <!-- <el-form-item label="是否重新派工" prop="repairType">
              <el-radio-group v-model="formRcordc.repairType" placeholder="是否重新派工">
                <el-radio label="true">是</el-radio>
                <el-radio label="false">否</el-radio>
              </el-radio-group>
            </el-form-item> -->
            <el-form-item label="维修人" prop="repairerId">
              {{ dangqianUser.userName }}
            </el-form-item>
            <el-form-item label="备注" prop="comment">
              <el-input v-model="formRcordc.comment" placeholder="备注" size="small" />
            </el-form-item>
            <el-form-item class="form_total">
              <el-button type="primary" size="small" @click="updata('c')">提交</el-button>
              <el-button type="primary" size="small" @click="initData('c')">重置</el-button>
              <el-button type="primary" size="small" @click="close('c')">关闭</el-button>
            </el-form-item>
          </el-form>
          <el-form v-if="repairType=='Suspend'" ref="formRcordd" :model="formRcordd" label-width="120px" :rules="formRcorddrules">
            <el-form-item label="设备种类" prop="equipmentId">
              <el-select v-model="formRcordd.equipmentId" v-loadmore="loadMoreequipment" filterable placeholder="设备种类" size="small" @change="changeEquipment">
                <el-option v-for="item in equipmentData" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="设备编码" prop="assetCode">
              <el-select v-model="formRcordd.assetCode" filterable placeholder="设备编码" size="small">
                <el-option v-for="item in assetsData" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="故障类型" prop="equipmentFaultId">
              <el-select v-model="formRcordd.equipmentFaultId" v-loadmore="loadMorefault" filterable placeholder="故障类型" size="small">
                <el-option v-for="item in faultData" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="维修级别" prop="repairLevelId">
              <el-select v-model="formRcordd.repairLevelId" filterable placeholder="产权单位" size="small">
                <el-option v-for="item in levelData" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="预计开始时间" prop="startTime">
              <el-date-picker v-model="formRcordd.startTime" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="维修开始时间" />
            </el-form-item>
            <el-form-item label="预计结束时间" prop="endTime">
              <el-date-picker v-model="formRcordd.endTime" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="维修结束时间" />
            </el-form-item>
            <el-form-item label="维修过程" prop="description">
              <el-input v-model="formRcordd.description" placeholder="维修过程" size="small" />
            </el-form-item>
            <el-form-item label="备注" prop="comment">
              <el-input v-model="formRcordd.comment" placeholder="备注" size="small" />
            </el-form-item>
            <el-form-item label="维修人" prop="repairerId">
              {{ dangqianUser.userName }}
            </el-form-item>
            <el-form-item label="维修人员" prop="assist">
              <el-input v-model="formRcordd.assist" placeholder="维修人员" size="small" />
            </el-form-item>
            <el-form-item class="form_total">
              <el-button type="primary" size="small" @click="updata('d')">提交</el-button>
              <el-button type="primary" size="small" @click="initData('d')">重置</el-button>
              <el-button type="primary" size="small" @click="close('d')">关闭</el-button>
            </el-form-item>
          </el-form>
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
      dangqianUser: {
        userName: this.$cookie.get('userName'),
        id: this.$cookie.get('id')
      },
      repairType: 'Done', // 维修单类型
      formData: {
        assetId: '',
        code: ''
      },
      updateData: {
        id: '',
        userId: '',
        dispatchType: ''
      },
      formRcorda: {
        assetCode: '',
        repairLevelId: '',
        startTime: '',
        endTime: '',
        description: '',
        comment: '',
        spareDescription: '',
        repairerId: '',
        assist: '',
        equipmentId: '',
        equipmentFaultId: ''
      },
      formRcordc: {
        repairerId: '',
        comment: ''
      },
      formRcordd: {
        repairType: '',
        assetCode: '',
        repairLevelId: '',
        startTime: '',
        endTime: '',
        description: '',
        comment: '',
        spareDescription: '',
        repairerId: '',
        assist: '',
        equipmentId: '',
        equipmentFaultId: ''
      },
      multipleSelection: '', // 表单选中行
      faultData: [], // 故障类型数据
      equipmentData: [], // 设备类别数据
      levelData: [], // 维修等级数据
      assetsData: [], // 设备编码数据
      formRcordarules: {// 维修完成验证规则
        equipmentId: [
          { required: true, message: '设备种类不可为空', trigger: 'change' }
        ],
        assetCode: [
          { required: true, message: '设备编码不可为空', trigger: 'change' }
        ],
        repairLevelId: [
          { required: true, message: '维修级别不可为空', trigger: 'change' }
        ],
        description: [
          { required: true, message: '维修过程不可为空', trigger: 'change' }
        ],
        startTime: [
          { type: 'date', required: true, message: '请选择维修开始时间', trigger: 'change' }
        ],
        endTime: [
          { type: 'date', required: true, message: '请选择维修结束时间', trigger: 'change' }
        ]
      },
      formRcordcrules: {// 误报验证规则
        comment: [
          { required: true, message: '备注不可为空', trigger: 'change' }
        ]
      },
      formRcorddrules: {// 暂缓验证规则
        equipmentId: [
          { required: true, message: '设备种类不可为空', trigger: 'change' }
        ],
        assetCode: [
          { required: true, message: '设备编码不可为空', trigger: 'change' }
        ],
        repairLevelId: [
          { required: true, message: '维修级别不可为空', trigger: 'change' }
        ],
        description: [
          { required: true, message: '维修过程不可为空', trigger: 'change' }
        ],
        startTime: [
          { type: 'date', required: true, message: '请选择预计开始时间', trigger: 'change' }
        ],
        endTime: [
          { type: 'date', required: true, message: '请选择预计结束时间', trigger: 'change' }
        ]
      },
      equipmentpage: {// 资产类别分页
        pageNumber: 1,
        pageSize: 10,
        pageCount: ''
      },
      faultpage: {// 故障类型分页
        pageNumber: 1,
        pageSize: 10,
        pageCount: '',
        equipmentId: undefined
      }
    }
  },
  computed: {},
  mounted() {
    this.getdata()
    this.getselectData()
    this.getequipmentData()
    this.getfaultData()
  },
  methods: {
    getselectData() { // 获取下拉菜单数据
      // 获取维修级别数据
      this.$axios.get('/api/Meta/RepairLevel').then(res => {
        this.levelData = res.data
      })
      // 获取设备编码
      this.$axios.get('/api/Meta/Assets').then(res => {
        this.assetsData = res.data
      })
    },
    getequipmentData() {
      // 获取资产类别
      this.$axios.get('/api/Meta/equipment?pageSize=' + this.equipmentpage.pageSize + '&pageNumber=' + this.equipmentpage.pageNumber).then(res => {
        this.equipmentData = this.equipmentData.concat(res.data)
        this.equipmentpage.pageCount = res.pageCount
      })
    },
    getfaultData() {
      // 获取故障类型
      this.$axios.get('/api/Meta/Fault', { params: this.faultpage }).then(res => {
        this.faultData = this.faultData.concat(res.data)
        this.faultpage.pageCount = res.pageCount
      })
    },
    loadMoreequipment() { // 资产种类加载下一页数据
      if (this.equipmentpage.pageCount > this.equipmentpage.pageNumber) {
        this.equipmentpage.pageNumber += 1
        this.getequipmentData()
      }
    },
    loadMorefault() { // 故障类型获取下一页
      if (this.faultpage.pageCount > this.faultpage.pageNumber) {
        this.faultpage.pageNumber += 1
        this.getfaultData()
      }
    },
    getdata() {
      // 获取维修详情数据
      this.formData.assetId = window.location.href.split('/')[window.location.href.split('/').length - 1]
      this.$axios.get('/api/RepairOrder/' + this.formData.assetId).then(res => {
        this.formData = res
        this.updateData.id = res.id
      })
    },
    changeEquipment() { // 设备种类筛选设备编码
      // 获取设备编码
      this.faultpage.equipmentId = this.formRcorda.equipmentId
      this.$axios.get('/api/Meta/Fault', { params: this.faultpage }).then(res => {
        this.faultData = res.data
      })
      this.$axios.get('/api/Meta/Assets?equipmentId=' + this.formRcorda.equipmentId).then(res => {
        this.assetsData = res.data
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    updata(val) { // 表单提交按钮
      console.log(val)
      if (val === 'a') {
        this.$refs.formRcorda.validate(valid => {
          if (valid) {
            this.formRcorda.repairType = this.repairType
            this.formRcorda.repairerId = this.dangqianUser.id
            this.formRcorda.repairOrderId = window.location.href.split('/')[window.location.href.split('/').length - 1]
            this.$axios.post('/api/RepairRecord', this.formRcorda).then(response => {
              // 跳转回个人工作页
              this.$router.push('/Workorder/Watchmanlist')
            })
          }
        })
      }
      if (val === 'c') {
        this.$refs.formRcordc.validate(valid => {
          if (valid) {
            this.formRcordc.repairType = this.repairType
            this.formRcordc.repairerId = this.dangqianUser.id
            this.formRcordc.repairOrderId = window.location.href.split('/')[window.location.href.split('/').length - 1]
            this.$axios.post('/api/RepairRecord', this.formRcordc).then(response => {
              // 跳转回个人工作页
              this.$router.push('/Workorder/Watchmanlist')
            })
          }
        })
      }
      if (val === 'd') {
        this.$refs.formRcordd.validate(valid => {
          if (valid) {
            this.formRcordd.repairType = this.repairType
            this.formRcordd.repairerId = this.dangqianUser.id
            this.formRcordd.repairOrderId = window.location.href.split('/')[window.location.href.split('/').length - 1]
            this.$axios.post('/api/RepairRecord/', this.formRcordd).then(response => {
              // 跳转回个人工作页
              this.$router.push('/Workorder/Watchmanlist')
            })
          }
        })
      }
    },
    initData() { // 重置

    },
    close() { // 关闭

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
  .total {
    width: 100%;
  }
  .form_total {
    width: 100%;
    text-align: center;
    margin-top: 30px;
  }
}
</style>
