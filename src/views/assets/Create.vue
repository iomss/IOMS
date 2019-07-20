<!-- 新建资产页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="content">
            <h4>新增资产</h4>
            <el-form ref="formData" :model="formData" :rules="formDatarules" label-width="90px">
              <el-form-item label="使用单位" prop="useUnitId">
                <el-select v-model="formData.useUnitId" v-loadmore="loadMoreunit" filterable placeholder="使用单位" size="small">
                  <el-option v-for="item in unitData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="安装位置" prop="positionId">
                <treeselect v-model="formData.positionId" :disable-branch-nodes="true" :normalizer="normalizer" :options="positionTreeData" :load-options="loadOptions" placeholder="安装位置" no-results-text="未找到相关数据" />
              </el-form-item>
              <el-form-item label="所属系统" prop="systemId">
                <el-select v-model="formData.systemId" v-loadmore="loadMoresystem" filterable placeholder="所属系统" size="small">
                  <el-option v-for="item in systemData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="资产类别" prop="equipmentID">
                <el-select v-model="formData.equipmentID" v-loadmore="loadMoreequipment" filterable placeholder="资产类别" size="small">
                  <el-option v-for="item in equipmentData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="集成商" prop="siId">
                <el-select v-model="formData.siId" v-loadmore="loadMoresi" filterable placeholder="设备集成商" size="small">
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
                <el-select v-model="formData.brandId" v-loadmore="loadMorebrand" filterable placeholder="资产类别" size="small">
                  <el-option v-for="item in brandData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="型号" prop="modelId">
                <el-select v-model="formData.modelId" v-loadmore="loadMoremodel" filterable placeholder="资产类别" size="small">
                  <el-option v-for="item in modelData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="来源" prop="sourceId">
                <el-select v-model="formData.sourceId" v-loadmore="loadMoresource" filterable placeholder="来源" size="small">
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
                <el-select v-model="formData.propertyUnitId" v-loadmore="loadMoreunit" filterable placeholder="产权单位" size="small">
                  <el-option v-for="item in unitData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="资产原值" prop="original">
                <el-input v-model="formData.original" placeholder="资产原值" size="small" />
              </el-form-item>
              <el-form-item label="计量单位" prop="uint">
                <el-select v-model="formData.uint" clearable placeholder="计量单位" size="small">
                  <el-option key="1" label="台" value="true" />
                  <el-option key="2" label="套" value="false" />
                  <el-option key="3" label="个" value="true" />
                  <el-option key="4" label="米" value="false" />
                </el-select>
              </el-form-item>
              <el-form-item label="备注" class="form_mid" prop="comment">
                <el-input v-model="formData.comment" type="textarea" :rows="2" placeholder="请输入内容" />
              </el-form-item>
              <el-form-item label="照片" class="form_mid" prop="img" />
              <!-- <el-form-item label="自定义属性">
                <el-input v-model="formData.Model" placeholder="自定义属性" size="small" />
              </el-form-item> -->
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
export default {
  components: {
    Treeselect
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
        img: ''
      },
      unitData: [], // 使用单位同产权单位数据
      positionTreeData: [], // 安装位置数据
      systemData: [], // 所属系统数据
      equipmentData: [], // 资产类别数据
      brandData: [], // 品牌数据
      modelData: [], // 型号数据
      sourceData: [], // 设备来源
      siData: [], // 集成商来源
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
        pageSize: 10,
        pageCount: ''
      },
      systempage: {// 所属系统分页
        pageNumber: 1,
        pageSize: 10,
        pageCount: ''
      },
      equipmentpage: {// 资产类别分页
        pageNumber: 1,
        pageSize: 10,
        pageCount: ''
      },
      brandpage: {// 品牌分页
        pageNumber: 1,
        pageSize: 10,
        pageCount: ''
      },
      modelpage: {// 型号分页
        pageNumber: 1,
        pageSize: 10,
        pageCount: ''
      },
      sourcepage: {// 来源分页
        pageNumber: 1,
        pageSize: 10,
        pageCount: ''
      },
      sipage: {// 集成商分页
        pageNumber: 1,
        pageSize: 10,
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
    this.getmodelData()
    this.getsourceData()
    this.getsiData()
  },
  methods: {
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
        } else {
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
    getsystemData() {
      // 获取所属系统
      this.$axios.get('/api/Meta/System?pageSize=' + this.systempage.pageSize + '&pageNumber=' + this.systempage.pageNumber).then(res => {
        this.systemData = this.systemData.concat(res.data)
        this.systempage.pageCount = res.pageCount
      })
    },
    getequipmentData() {
      // 获取资产类别
      this.$axios.get('/api/Meta/equipment?pageSize=' + this.equipmentpage.pageSize + '&pageNumber=' + this.equipmentpage.pageNumber).then(res => {
        this.equipmentData = this.equipmentData.concat(res.data)
        this.equipmentpage.pageCount = res.pageCount
      })
    },
    getbrandData() {
      // 获取品牌
      this.$axios.get('/api/Meta/Brand?pageSize=' + this.brandpage.pageSize + '&pageNumber=' + this.brandpage.pageNumber).then(res => {
        this.brandData = this.brandData.concat(res.data)
        this.brandpage.pageCount = res.pageCount
      })
    },
    getmodelData() {
      // 获取型号
      this.$axios.get('/api/Meta/Model?pageSize=' + this.modelpage.pageSize + '&pageNumber=' + this.modelpage.pageNumber).then(res => {
        this.modelData = this.modelData.concat(res.data)
        this.modelpage.pageCount = res.pageCount
      })
    },
    getsourceData() {
      // 获取设备来源
      this.$axios.get('/api/Meta/Source?pageSize=' + this.sourcepage.pageSize + '&pageNumber=' + this.sourcepage.pageNumber).then(res => {
        this.sourceData = this.sourceData.concat(res.data)
        this.sourcepage.pageCount = res.pageCount
      })
    },
    getsiData() {
      // 获取集成商
      this.$axios.get('/api/Meta/SI?pageSize=' + this.sipage.pageSize + '&pageNumber=' + this.sipage.pageNumber).then(res => {
        this.siData = this.siData.concat(res.data)
        this.sipage.pageCount = res.pageCount
      })
    },
    loadMoreunit() { // 使用单位或产权单位加载下一页数据
      if (this.unitpage.pageCount > this.unitpage.pageNumber) {
        this.unitpage.pageNumber += 1
        this.getunitData()
      }
    },
    loadMoresystem() { // 所属系统加载下一页数据
      if (this.systempage.pageCount > this.systempage.pageNumber) {
        this.systempage.pageNumber += 1
        this.getsystemData()
      }
    },
    loadMoreequipment() { // 资产种类加载下一页数据
      if (this.equipmentpage.pageCount > this.equipmentpage.pageNumber) {
        this.equipmentpage.pageNumber += 1
        this.getequipmentData()
      }
    },
    loadMoresi() { // 集成商加载下一页数据
      if (this.sipage.pageCount > this.sipage.pageNumber) {
        this.sipage.pageNumber += 1
        this.getsiData()
      }
    },
    loadMorebrand() { // 品牌加载下一页数据
      if (this.brandpage.pageCount > this.brandpage.pageNumber) {
        this.brandpage.pageNumber += 1
        this.getbrandData()
      }
    },
    loadMoremodel() { // 型号加载下一页数据
      if (this.modelpage.pageCount > this.modelpage.pageNumber) {
        this.modelpage.pageNumber += 1
        this.getmodelData()
      }
    },
    loadMoresource() { // 来源加载下一页数据
      if (this.sourcepage.pageCount > this.sourcepage.pageNumber) {
        this.sourcepage.pageNumber += 1
        this.getsourceData()
      }
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
