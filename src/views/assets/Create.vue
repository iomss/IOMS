<!-- 新建资产页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="content">
            <h4>新增资产</h4>
            <el-form ref="formData" :model="formData" :rules="formDatarules" label-width="110px">
              <el-form-item label="使用单位" prop="useUnitId">
                <el-select v-model="formData.useUnitId" filterable remote :remote-method="remoteMethodUnit" :loading="loading" placeholder="使用单位" size="small" @focus="remoteMethodUnit">
                  <el-option v-for="item in unitData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="安装位置" prop="positionId" style="margin-bottom:-20px;">
                <!-- <Position :source-position="formData.positionId" @position="positionChange" /> -->
                <treeselect v-model="formData.positionId" :disable-branch-nodes="true" :normalizer="normalizer" :options="positionTreeData" :load-options="loadOptions" placeholder="安装位置" no-results-text="未找到相关数据">
                  <div slot="value-label" slot-scope="{ node }">{{ node.raw.crumbsName }}</div>
                </treeselect>
              </el-form-item>
              <el-form-item label="所属系统" prop="systemId">
                <el-select v-model="formData.systemId" filterable remote :remote-method="remoteMethodsystemId" :loading="loading" placeholder="所属系统" size="small" @focus="remoteMethodsystemId">
                  <el-option v-for="item in systemData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="资产类别" prop="equipmentID">
                <el-select v-model="formData.equipmentID" filterable remote :remote-method="remoteMethodequipmentID" :loading="loading" placeholder="资产类别" size="small" @focus="remoteMethodequipmentID">
                  <el-option v-for="item in equipmentData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="集成商" prop="siId">
                <el-select v-model="formData.siId" filterable remote :remote-method="remoteMethodsiId" :loading="loading" placeholder="设备集成商" size="small" @focus="remoteMethodsiId">
                  <el-option v-for="item in siData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="资产名称" prop="alias">
                <el-input v-model="formData.alias" placeholder="资产名称" size="small" />
              </el-form-item>
              <el-form-item label="投用时间" prop="enableTime">
                <el-date-picker v-model="formData.enableTime" type="date" placeholder="投用时间" />
              </el-form-item>
              <el-form-item label="品牌" prop="brandId">
                <el-select v-model="formData.brandId" filterable remote :remote-method="remoteMethodbrandId" :loading="loading" placeholder="资产类别" size="small" @focus="remoteMethodbrandId" @change="changeBrand">
                  <el-option v-for="item in brandData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="型号" prop="modelId">
                <el-select v-model="formData.modelId" filterable remote :remote-method="remoteMethodmodelId" :loading="loading" placeholder="资产类别" size="small" @focus="remoteMethodmodelId">
                  <el-option v-for="item in modelData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="来源" prop="sourceId">
                <el-select v-model="formData.sourceId" filterable remote :remote-method="remoteMethodsourceId" :loading="loading" placeholder="来源" size="small" @focus="remoteMethodsourceId">
                  <el-option v-for="item in sourceData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="购置年份" prop="purchaseYear">
                <el-input v-model="formData.purchaseYear" placeholder="购置年份" size="small" />
              </el-form-item>
              <el-form-item label="交工时间" prop="handoverDate">
                <el-date-picker v-model="formData.handoverDate" type="month" placeholder="交工时间" />
              </el-form-item>
              <el-form-item label="工程名称" prop="engineering">
                <el-input v-model="formData.engineering" placeholder="工程名称" size="small" />
              </el-form-item>
              <el-form-item label="使用年限" prop="ratedLife">
                <el-input v-model="formData.ratedLife" placeholder="使用年限" size="small" />
              </el-form-item>
              <el-form-item label="缺陷责任期" prop="liabilityPeriod">
                <el-input v-model="formData.liabilityPeriod" placeholder="缺陷责任期" size="small" />
              </el-form-item>
              <el-form-item label="产权单位" prop="propertyUnitId">
                <el-select v-model="formData.propertyUnitId" filterable remote :remote-method="remoteMethodUnit" :loading="loading" placeholder="产权单位" size="small" @focus="remoteMethodUnit">
                  <el-option v-for="item in unitData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="资产原值" prop="original">
                <el-input v-model="formData.original" placeholder="资产原值" size="small" />
              </el-form-item>
              <el-form-item label="计量单位" prop="uint">
                <el-select v-model="formData.uint" clearable placeholder="计量单位" size="small">
                  <el-option key="1" label="台" value="台" />
                  <el-option key="2" label="套" value="套" />
                  <el-option key="3" label="个" value="个" />
                </el-select>
              </el-form-item>
              <el-form-item label="备注" class="form_mid" prop="comment">
                <el-input v-model="formData.comment" type="textarea" :rows="2" placeholder="请输入内容" />
              </el-form-item>
              <el-form-item label="照片" class="form_mid" prop="img">
                <Uploadimg v-model="formData.image" :reset="formData.image" @uploadimg="uploadimgdata">aaa</Uploadimg>
              </el-form-item>
              <div>
                <p>自定义属性：</p>
                <el-form-item v-for="item in selfData" :key="item.id" :label="item.displayName" class="form_mid" :prop="item.name">
                  <el-input v-model="formData[item.name]" size="small" />
                </el-form-item>
              </div>
              <el-form-item class="form_total">
                <el-button type="primary" size="small" icon="el-icon-search" @click="create()">保存</el-button>
                <el-button size="small" icon="el-icon-close" @click="cancel()">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { Treeselect, LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
// 节流
const simulateAsyncOperation = fn => {
  setTimeout(fn, 500)
}
import Uploadimg from '@/components/Uploadimg'
// import Position from '@/components/Position'
export default {
  components: {
    Treeselect,
    Uploadimg
    // Position
  },
  data() {
    return {
      // 树结构
      normalizer(node) {
        return {
          id: node.id,
          label: node.name,
          children: node.children
        }
      },
      loading: false, // 远程搜索
      formData: {
        useUnitId: '',
        positionId: null,
        systemId: '',
        equipmentID: '',
        enableTime: '',
        brandId: '',
        modelId: '',
        sourceId: '',
        siId: '',
        purchaseYear: '',
        ratedLife: '',
        handoverDate: '',
        engineering: '',
        liabilityPeriod: '',
        propertyUnitId: '',
        original: '',
        uint: '',
        comment: '',
        image: ''
      },
      unitData: [], // 使用单位同产权单位数据
      positionTreeData: [], // 安装位置数据
      systemData: [], // 所属系统数据
      equipmentData: [], // 资产类别数据
      brandData: [], // 品牌数据
      modelData: [], // 型号数据
      sourceData: [], // 设备来源
      siData: [], // 集成商来源
      selfData: [], // 自定义属性
      formDatarules: {
        useUnitId: [
          { required: true, message: '使用单位不可为空', trigger: 'change' }
        ],
        positionId: [
          { required: true, message: '安装位置不可为空', trigger: 'change' }
        ],
        systemId: [
          { required: true, message: '所属系统不可为空', trigger: 'change' }
        ],
        equipmentID: [
          { required: true, message: '资产类别不可为空', trigger: 'change' }
        ],
        siId: [
          { required: true, message: '资产名称不可为空', trigger: 'change' }
        ],
        brandId: [
          { required: true, message: '品牌不可为空', trigger: 'change' }
        ],
        modelId: [
          { required: true, message: '型号不可为空', trigger: 'change' }
        ],
        enableTime: [
          { type: 'date', required: true, message: '请选择投用时间', trigger: 'change' }
        ],
        sourceId: [
          { required: true, message: '来源不可为空', trigger: 'change' }
        ],
        purchaseYear: [
          { required: true, message: '购置年份不可为空', trigger: 'change' }
        ],
        ratedLife: [
          { required: true, message: '使用年限不可为空', trigger: 'change' }
        ],
        handoverDate: [
          { required: true, message: '交工不可为空', trigger: 'change' }
        ],
        liabilityPeriod: [
          { required: true, message: '缺陷责任期不可为空', trigger: 'change' }
        ],
        original: [
          { required: true, message: '资产原值不可为空', trigger: 'change' }
        ]
      },
      unitpage: {// 使用单位同产权单位分页
        pageNumber: 1,
        pageSize: 50,
        pageCount: ''
      },
      systempage: {// 所属系统分页
        pageNumber: 1,
        pageSize: 50,
        pageCount: ''
      },
      equipmentpage: {// 资产类别分页
        pageNumber: 1,
        pageSize: 50,
        pageCount: ''
      },
      brandpage: {// 品牌分页
        pageNumber: 1,
        pageSize: 50,
        pageCount: ''
      },
      modelpage: {// 型号分页
        pageNumber: 1,
        pageSize: 50,
        brandId: undefined,
        pageCount: ''
      },
      sourcepage: {// 来源分页
        pageNumber: 1,
        pageSize: 50,
        pageCount: ''
      },
      sipage: {// 集成商分页
        pageNumber: 1,
        pageSize: 50,
        pageCount: ''
      }
    }
  },
  computed: {},
  mounted() {
    this.getunitData()
    this.getpositionData()
    this.getsystemData()
    this.getequipmentData()
    this.getbrandData()
    this.getsourceData()
    this.getsiData()
    this.getData()
  },
  methods: {
    // 上传图片 子传父的值
    uploadimgdata(e) {
      this.formData.image = e
    },
    getData() { // 获取自定义属性
      this.$axios.get('/api/AssetField').then(res => {
        const newattribute = {}
        res.data.forEach(item => { newattribute[item.name] = '' })
        this.formData = { ... this.formData, ...newattribute }
        this.selfData = res.data
      })
    },
    getunitData() {
      // 获取使用单位信息
      this.$axios.get('/api/Meta/Unit?pageSize=' + this.unitpage.pageSize + '&pageNumber=' + this.unitpage.pageNumber).then(res => {
        this.unitData = this.unitData.concat(res.data)
        this.unitpage.pageCount = res.pageCount
      })
    },
    checkhasChildren(data) {
      // 位置数据遍历
      data.forEach((item, index) => {
        if (item.children === null) {
          item.children = undefined
        } else if (item.children !== undefined) {
          this.checkhasChildren(item.children)
        }
      })
      return data
    },
    getpositionData() {
      // 获取安装位置
      this.$axios.get('/api/Tree/Position').then(res => {
        this.positionTreeData = this.checkhasChildren(res)
      })
    },
    positionChange(val) {
      this.formData.positionId = val
    },
    getsystemData() {
      // 获取所属系统
      this.$axios.get('/api/Meta/System?pageSize=' + this.systempage.pageSize + '&pageNumber=' + this.systempage.pageNumber).then(res => {
        this.systemData = this.systemData.concat(res.data)
      })
    },
    getequipmentData() {
      // 获取资产类别
      this.$axios.get('/api/Meta/equipment?pageSize=' + this.equipmentpage.pageSize + '&pageNumber=' + this.equipmentpage.pageNumber).then(res => {
        this.equipmentData = this.equipmentData.concat(res.data)
      })
    },
    getbrandData() {
      // 获取品牌
      this.$axios.get('/api/Meta/Brand?pageSize=' + this.brandpage.pageSize + '&pageNumber=' + this.brandpage.pageNumber).then(res => {
        this.brandData = this.brandData.concat(res.data)
      })
    },
    changeBrand() {
      this.formData.modelId = ''
      this.modelpage.brandId = this.formData.brandId
      this.$axios.get('/api/Meta/Model?brandId=' + this.formData.brandId).then(res => {
        this.modelData = res.data
      })
    },
    getmodelData() {
      // 获取型号
      this.$axios.get('/api/Meta/Model', { params: this.modelpage }).then(res => {
        this.modelData = this.modelData.concat(res.data)
      })
    },
    getsourceData() {
      // 获取设备来源
      this.$axios.get('/api/Meta/Source?pageSize=' + this.sourcepage.pageSize + '&pageNumber=' + this.sourcepage.pageNumber).then(res => {
        this.sourceData = this.sourceData.concat(res.data)
      })
    },
    getsiData() {
      // 获取集成商
      this.$axios.get('/api/Meta/SI?pageSize=' + this.sipage.pageSize + '&pageNumber=' + this.sipage.pageNumber).then(res => {
        this.siData = this.siData.concat(res.data)
      })
    },
    // /远程搜索数据
    remoteMethodUnit(query) {
      this.loading = true
      let querytext = ''
      querytext = typeof (query) === 'string' ? query : ''
      this.$axios.get('/api/Meta/Unit?text=' + querytext).then(res => {
        this.loading = false
        this.unitData = res.data
      })
    },
    remoteMethodsystemId(query) {
      this.loading = true
      let querytext = ''
      querytext = typeof (query) === 'string' ? query : ''
      this.$axios.get('/api/Meta/System?text=' + querytext).then(res => {
        this.loading = false
        this.systemData = res.data
      })
    },
    remoteMethodequipmentID(query) {
      this.loading = true
      let querytext = ''
      querytext = typeof (query) === 'string' ? query : ''
      this.$axios.get('/api/Meta/Equipment?text=' + querytext).then(res => {
        this.loading = false
        this.equipmentData = res.data
      })
    },
    remoteMethodsiId(query) {
      this.loading = true
      let querytext = ''
      querytext = typeof (query) === 'string' ? query : ''
      this.$axios.get('/api/Meta/SI?text=' + querytext).then(res => {
        this.loading = false
        this.siData = res.data
      })
    },
    remoteMethodbrandId(query) {
      this.loading = true
      let querytext = ''
      querytext = typeof (query) === 'string' ? query : ''
      this.$axios.get('/api/Meta/Brand?text=' + querytext).then(res => {
        this.loading = false
        this.brandData = res.data
      })
    },
    remoteMethodmodelId(query) {
      this.loading = true
      let querytext = ''
      querytext = typeof (query) === 'string' ? query : ''
      this.$axios.get('/api/Meta/Model?brandId=' + this.formData.brandId + '&text=' + querytext).then(res => {
        this.loading = false
        this.modelData = res.data
      })
    },
    remoteMethodsourceId(query) {
      this.loading = true
      let querytext = ''
      querytext = typeof (query) === 'string' ? query : ''
      this.$axios.get('/api/Meta/source?text=' + querytext).then(res => {
        this.loading = false
        this.sourceData = res.data
      })
    },
    // treeSelect 加载
    loadOptions({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        switch (parentNode.id) {
          case 'success': {
            simulateAsyncOperation(() => {
              parentNode.children = [
                {
                  id: 'child',
                  label: 'Child option'
                }
              ]
              callback()
            })
            break
          }
          case 'no-children': {
            simulateAsyncOperation(() => {
              parentNode.children = []
              callback()
            })
            break
          }
          case 'failure': {
            simulateAsyncOperation(() => {
              callback(new Error('Failed to load options: network error.'))
            })
            break
          }
          default: /* empty */
        }
      }
    },
    create() { // 新增资产/api/Assets
      console.log(this)
      this.$refs.formData.validate(valid => {
        if (valid) {
          this.$axios.post('/api/Assets', this.formData).then(response => {
            this.$router.push('/assets/list')
          })
        }
      })
    },
    cancel() {
      // 跳转资产管理页面
      this.$router.push('/assets/list')
    }
  }
}
</script>
<style lang='scss' scoped>
.header {
  width: 100%;
  height: 64px;
}
.el-form-item {
  width: 30%;
  display: inline-block;
}
.form_mid {
  width: 49%;
}
.form_total {
  width: 100%;
  text-align: center;
}
.el-select {
  width: 100%;
}
.el-date-editor {
  width: 100%;
}
</style>
