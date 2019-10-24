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
                <li><span>设备位置:</span><b>{{ formData.position.crumbName }}</b></li>
                <li><span>资产名称:</span><b>{{ formData.equipment.name }}</b></li>
                <!-- <li><span>设备种类:</span><b>{{ formData.equipment.equimentType.name }}</b></li> -->
                <li><span>设备编码:</span><b>{{ formData.assetCode }}</b></li>
                <!-- <li><span>故障类型:</span><b>{{ formData.equipment.name }}</b></li> -->
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
          <el-form v-show="repairType=='Done'" ref="formRcorda" :model="formRcorda" label-width="120px" :rules="formRcordarules">
            <el-form-item label="设备种类" prop="equipmentId">
              <el-select v-model="formRcorda.equipmentId" filterable remote :remote-method="remoteMethodequipmentID" :loading="loading" placeholder="设备种类" size="small" @focus="remoteMethodequipmentID" @change="changeEquipment">
                <el-option v-for="item in equipmentData" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="设备编码" prop="assetCode">
              <el-select v-model="formRcorda.assetCode" filterable remote :remote-method="remoteMethodecodeID" :loading="loading" placeholder="设备编码" size="small" @focus="remoteMethodecodeID">
                <el-option v-for="item in assetsData" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="故障类型" prop="equipmentFaultId">
              <el-select v-model="formRcorda.equipmentFaultId" filterable remote :remote-method="remoteMethodefaultID" :loading="loading" placeholder="故障类型" size="small" @focus="remoteMethodefaultID">
                <el-option v-for="item in faultData" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="维修级别" prop="repairLevelId">
              <el-select v-model="formRcorda.repairLevelId" filterable placeholder="维修级别" size="small">
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
            <el-form-item label="配件名称及数量" prop="spareDescription">
              <el-input v-model="formRcorda.spareDescription" placeholder="配件名称及数量" size="small" />
            </el-form-item>
            <el-form-item label="维修人" prop="repairerId">
              {{ dangqianUser.trueName }}
            </el-form-item>
            <el-form-item label="协助人" prop="assist">
              <el-input v-model="formRcorda.assist" placeholder="协助人" size="small" />
            </el-form-item>
            <el-form-item label="维修结果图片" class="form_mid">
              <Uploadimg v-model="formRcorda.resultImg" :reset="formRcorda.resultImg" @uploadimg="uploadresultImg">aaa</Uploadimg>
            </el-form-item>
            <el-form-item label="现场验收签字" class="form_mid">
              <Uploadimg v-model="formRcorda.signImg" :reset="formRcorda.signImg" @uploadimg="uploadsignImg">aaa</Uploadimg>
            </el-form-item>
            <el-form-item label="备注" prop="comment">
              <el-input v-model="formRcorda.comment" placeholder="备注" size="small" />
            </el-form-item>
            <el-form-item class="form_total">
              <el-button type="primary" size="small" @click="updata('a')">提交</el-button>
              <el-button type="primary" size="small" @click="initData('a')">重置</el-button>
              <el-button type="primary" size="small" @click="close('a')">关闭</el-button>
            </el-form-item>
          </el-form>
          <el-form v-show="repairType=='Mistaken'" ref="formRcordc" :model="formRcordc" label-width="120px" :rules="formRcordcrules">
            <!-- <el-form-item label="是否重新派工" prop="repairType">
              <el-radio-group v-model="formRcordc.repairType" placeholder="是否重新派工">
                <el-radio label="true">是</el-radio>
                <el-radio label="false">否</el-radio>
              </el-radio-group>
            </el-form-item> -->
            <el-form-item label="维修人" prop="repairerId">
              {{ dangqianUser.trueName }}
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
          <el-form v-show="repairType=='Suspend'" ref="formRcordd" :model="formRcordd" label-width="120px" :rules="formRcorddrules">
            <el-form-item label="设备种类" prop="equipmentId">
              <el-select v-model="formRcordd.equipmentId" filterable remote :remote-method="remoteMethodequipmentID" :loading="loading" placeholder="设备种类" size="small" @focus="remoteMethodequipmentID" @change="changeEquipment">
                <el-option v-for="item in equipmentData" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="设备编码" prop="assetCode">
              <el-select v-model="formRcordd.assetCode" filterable remote :remote-method="remoteMethodecodeID" :loading="loading" placeholder="设备编码" size="small" @focus="remoteMethodecodeID">
                <el-option v-for="item in assetsData" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="故障类型" prop="equipmentFaultId">
              <el-select v-model="formRcordd.equipmentFaultId" filterable remote :remote-method="remoteMethodefaultID" :loading="loading" placeholder="故障类型" size="small" @focus="remoteMethodefaultID">
                <el-option v-for="item in faultData" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="维修级别" prop="repairLevelId">
              <el-select v-model="formRcordd.repairLevelId" filterable placeholder="维修级别" size="small">
                <el-option v-for="item in levelData" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="预计开始时间" prop="startTime">
              <el-date-picker v-model="formRcordd.startTime" type="datetime" placeholder="预计开始时间" />
            </el-form-item>
            <el-form-item label="预计结束时间" prop="endTime">
              <el-date-picker v-model="formRcordd.endTime" type="datetime" placeholder="预计结束时间" />
            </el-form-item>
            <el-form-item label="维修过程" prop="description">
              <el-input v-model="formRcordd.description" placeholder="维修过程" size="small" />
            </el-form-item>
            <el-form-item label="备注" prop="comment">
              <el-input v-model="formRcordd.comment" placeholder="备注" size="small" />
            </el-form-item>
            <el-form-item label="维修人" prop="repairerId">
              {{ dangqianUser.trueName }}
            </el-form-item>
            <el-form-item label="协助人" prop="assist">
              <el-input v-model="formRcordd.assist" placeholder="协助人" size="small" />
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

import Uploadimg from '@/components/Uploadimg'
export default {
  components: {
    Uploadimg
  },
  data() {
    var compareEndTime = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择维修结束时间'))
      } else if (this.formRcorda.startTime !== '') {
        if (this.formRcorda.startTime >= this.formRcorda.endTime) {
          callback(new Error('结束时间需大于开始时间'))
        } else {
          callback()
        }
      }
    }
    var compareEndTimed = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择预计结束时间'))
      } else if (this.formRcordd.startTime !== '') {
        if (this.formRcordd.startTime >= this.formRcordd.endTime) {
          callback(new Error('结束时间需大于开始时间'))
        } else {
          callback()
        }
      }
    }
    return {
      loading: false, // 远程搜索
      dangqianUser: {
        userName: this.$cookie.get('trueName'),
        id: this.$cookie.get('id'),
        trueName: this.$cookie.get('trueName')
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
        equipmentFaultId: '',
        resultImg: '',
        signImg: ''
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
          { required: true, message: '维修开始时间不可为空', trigger: 'change' }
        ],
        endTime: [
          { validator: compareEndTime, trigger: 'blur' }
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
          { validator: compareEndTimed, trigger: 'blur' }
        ]
      },
      equipmentpage: {// 设备种类分页
        pageNumber: 1,
        pageSize: 50,
        pageCount: '',
        positionId: ''
      },
      faultpage: {// 故障类型分页
        pageNumber: 1,
        pageSize: 50,
        pageCount: '',
        equipmentId: undefined
      },
      assetspage: {// 设备编码分页
        pageNumber: 1,
        pageSize: 50,
        pageCount: '',
        equipmentId: undefined,
        positionId: ''
      }
    }
  },
  computed: {},
  mounted() {
    this.getdata()
    this.getselectData()
    this.getfaultData()
  },
  methods: {
    uploadresultImg(e) {
      console.log(e)
      this.formRcorda.resultImg = e
    },
    uploadsignImg(e) {
      console.log(e)
      this.formRcorda.signImg = e
    },
    getselectData() { // 获取下拉菜单数据
      // 获取维修级别数据
      this.$axios.get('/api/Meta/RepairLevel').then(res => {
        this.levelData = res.data
        this.formRcorda.repairLevelId = this.levelData[1].id
        this.formRcordd.repairLevelId = this.levelData[1].id
      })
    },
    getAssetsData() {
      // 获取设备编码
      this.$axios.get('/api/Meta/Assets', { params: this.assetspage }).then(res => {
        this.assetsData = this.assetsData.concat(res.data)

        const multiple = [...this.assetsData, ...res.data]
        this.assetsData = multiple.reduce((all, next) => all.some((item) => item['id'] === next['id']) ? all : [...all, next], [])
      })
    },
    getequipmentData() {
      // 获取设备种类
      this.$axios.get('/api/Meta/equipment', { params: this.equipmentpage }).then(res => {
        this.equipmentData = this.equipmentData.concat(res.data)
      })
    },
    getfaultData() {
      // 获取故障类型
      this.$axios.get('/api/Meta/Fault', { params: this.faultpage }).then(res => {
        this.faultData = this.faultData.concat(res.data)
      })
    },
    remoteMethodecodeID(query) {
      this.loading = true
      let querytext = ''
      querytext = typeof (query) === 'string' ? query : ''
      this.$axios.get('/api/Meta/Assets?text=' + querytext, { params: this.assetspage }).then(res => {
        this.loading = false
        this.assetsData = res.data
      })
    },
    remoteMethodefaultID(query) {
      this.loading = true
      let querytext = ''
      querytext = typeof (query) === 'string' ? query : ''
      this.$axios.get('/api/Meta/Fault?text=' + querytext, { params: this.faultpage }).then(res => {
        this.loading = false
        this.faultData = res.data
      })
    },
    remoteMethodequipmentID(query) {
      this.loading = true
      let querytext = ''
      querytext = typeof (query) === 'string' ? query : ''
      this.$axios.get('/api/Meta/Equipment?text=' + querytext, { params: this.equipmentpage }).then(res => {
        this.loading = false
        this.equipmentData = res.data
      })
    },
    getdata() {
      // 获取维修详情数据
      this.formData.assetId = window.location.href.split('/')[window.location.href.split('/').length - 1]
      this.$axios.get('/api/RepairOrder/' + this.formData.assetId).then(res => {
        this.formData = res
        this.formData.failureTime = this.$moment(res.failureTime).format('YYYY-MM-DD HH:mm')
        this.formData.reportTime = this.$moment(res.reportTime).format('YYYY-MM-DD HH:mm')
        this.updateData.id = res.id
        this.equipmentpage.positionId = res.position.id
        this.getequipmentData()// 根据位置筛选设备种类
        this.faultpage.positionId = res.position.id
        this.assetspage.positionId = res.position.id
        this.getAssetsData()// 根据位置筛选设备编码

        // 为维修记录表单添加默认值
        // 先判断下拉菜单是否有这条数据
        let hasbrandDataa = false
        this.equipmentData.forEach(item => { item.id === res.equipment.id ? hasbrandDataa = true : '' })
        hasbrandDataa ? '' : this.equipmentData.push({ id: res.equipment.id, name: res.equipment.name })
        let hasbrandDatab = false
        this.faultData.forEach(item => { item.id === res.equipmentFault.id ? hasbrandDatab = true : '' })
        hasbrandDatab ? '' : this.faultData.push({ id: res.equipmentFault.id, name: res.equipmentFault.name })
        let hasbrandDatac = false
        this.assetsData.forEach(item => { item.id === res.assetId ? hasbrandDatac = true : '' })
        hasbrandDatac ? '' : this.assetsData.push({ id: res.assetId, name: res.assetCode })
        // 在设置选中
        this.formRcorda.equipmentId = res.equipment.id
        this.formRcordd.equipmentId = res.equipment.id
        this.formRcorda.equipmentFaultId = res.equipmentFault.id
        this.formRcordd.equipmentFaultId = res.equipmentFault.id
        this.formRcorda.assetCode = res.assetId
        this.formRcordd.assetCode = res.assetId
      })
    },
    changeEquipment() { // 设备种类筛选设备编码
      if (this.repairType === 'Done') {
        this.faultpage.equipmentId = this.formRcorda.equipmentId
        this.assetspage.equipmentId = this.formRcorda.equipmentId
      } else if (this.repairType === 'Suspend') {
        this.faultpage.equipmentId = this.formRcordd.equipmentId
        this.assetspage.equipmentId = this.formRcordd.equipmentId
      }
      // 设备种类筛选故障类型
      this.$axios.get('/api/Meta/Fault', { params: this.faultpage }).then(res => {
        this.faultData = res.data
        this.formRcorda.equipmentFaultId = ''
      })
      // 设备种类筛选设备编码
      this.$axios.get('/api/Meta/Assets', { params: this.assetspage }).then(res => {
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
            debugger
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
    initData(val) { // 重置
      if (val === 'a') {
        this.$refs.formRcorda.resetFields()
        // 重置两张图片
        this.formRcorda.resultImg = 'delete'
        this.formRcorda.signImg = 'delete'
      }
      if (val === 'b') {
        this.$refs.formRcordb.resetFields()
      }
      if (val === 'c') {
        this.formRcordc.comment = ''
      }
      if (val === 'd') {
        this.$refs.formRcordd.resetFields()
      }
    },
    close(val) { // 关闭
      console.log(this.$router.currentRoute.fullPath)
      this.$store.dispatch('tagsView/delAllViews', this.$router.currentRoute.fullPath)
      // 跳转回个人工作页
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
        overflow: hidden;
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
