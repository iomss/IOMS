<!-- 新建资产页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="content">
            <h4>新增资产</h4>
            <el-form ref="formData" :model="formData" :rules="formDatarules" label-width="90px">
              <el-form-item label="使用单位" prop="useUnit">
                <el-select v-model="formData.useUnit" filterable placeholder="使用单位" size="small">
                  <el-option v-for="item in unitData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="安装位置" prop="position">
                <el-select v-model="formData.position" filterable placeholder="安装位置" size="small">
                  <el-option v-for="item in positionData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="所属系统" prop="system">
                <el-select v-model="formData.system" filterable placeholder="所属系统" size="small">
                  <el-option v-for="item in systemData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="资产类别" prop="type">
                <el-select v-model="formData.type" clearable placeholder="资产类别" size="small">
                  <el-option v-for="item in typeData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="资产名称" prop="name">
                <el-input v-model="formData.name" placeholder="资产名称" size="small" />
              </el-form-item>
              <el-form-item label="投用时间" prop="enableTime">
                <el-date-picker v-model="formData.enableTime" type="date" placeholder="投用时间" />
              </el-form-item>
              <el-form-item label="品牌" prop="brand">
                <el-select v-model="formData.brand" clearable placeholder="资产类别" size="small">
                  <el-option v-for="item in brandData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="型号" prop="model">
                <el-select v-model="formData.model" clearable placeholder="资产类别" size="small">
                  <el-option v-for="item in modelData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="来源" prop="source">
                <el-select v-model="formData.source" clearable placeholder="来源" size="small">
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
              <el-form-item label="产权单位" prop="propertyUnit">
                <el-select v-model="formData.propertyUnit" clearable placeholder="产权单位" size="small">
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
              <el-form-item label="备注" class="form_mid" prop="Remarks">
                <el-input v-model="formData.Remarks" type="textarea" :rows="2" placeholder="请输入内容" />
              </el-form-item>
              <el-form-item label="照片" class="form_mid" prop="img" />
              <el-form-item label="自定义属性">
                <el-input v-model="formData.Model" placeholder="使用单位" size="small" />
              </el-form-item>
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
// import page from '@/components/page.vue'
export default {
  components: {
    // page
  },
  data() {
    return {
      formData: {
        useUnit: '',
        position: '',
        system: '',
        enableTime: '',
        brand: '',
        model: '',
        source: '',
        purchaseYear: '',
        ratedLife: '',
        handoverDate: '',
        engineering: '',
        liabilityPeriod: '',
        propertyUnit: '',
        original: '',
        uint: '',
        img: ''
      },
      unitData: [], // 使用单位同产权单位数据
      positionData: [], // 安装位置数据
      systemData: [], // 所属系统数据
      typeData: [], // 资产类别数据
      brandData: [], // 品牌数据
      modelData: [], // 型号数据
      sourceData: [], // 设备来源
      formDatarules: {
        useUnit: [
          { required: true, message: '使用单位不可为空', trigger: 'change' }
        ],
        position: [
          { required: true, message: '安装位置不可为空', trigger: 'change' }
        ],
        system: [
          { required: true, message: '所属系统不可为空', trigger: 'change' }
        ],
        type: [
          { required: true, message: '资产类别不可为空', trigger: 'change' }
        ],
        name: [
          { required: true, message: '资产名称不可为空', trigger: 'change' }
        ],
        brand: [
          { required: true, message: '品牌不可为空', trigger: 'change' }
        ],
        model: [
          { required: true, message: '型号不可为空', trigger: 'change' }
        ],
        enableTime: [
          { type: 'date', required: true, message: '请选择投用时间', trigger: 'change' }
        ]
      }
    }
  },
  computed: {},
  mounted() {
    this.getselectData()
  },
  methods: {
    getselectData() { // 获取下拉菜单数据
      // 获取使用单位信息
      this.$axios.get('/api/Meta/Unit').then(res => {
        this.unitData = res.data
      })
      // 获取安装位置
      this.$axios.get('/api/Meta/Position').then(res => {
        this.positionData = res.data
      })
      // 获取所属系统
      this.$axios.get('/api/Meta/System').then(res => {
        this.systemData = res.data
      })
      // 获取资产类别
      this.$axios.get('/api/Meta/Type').then(res => {
        this.typeData = res.data
      })
      // 获取品牌
      this.$axios.get('/api/Meta/Brand').then(res => {
        this.brandData = res.data
      })
      // 获取型号
      this.$axios.get('/api/Meta/Model').then(res => {
        this.modelData = res.data
      })
      // 获取设备来源
      this.$axios.get('/api/Meta/Source').then(res => {
        this.sourceData = res.data
      })
    },
    create() { // 新增资产/api/Assets
      console.log(this)
      this.$refs.formData.validate(valid => {
        if (valid) {
          this.$axios.post('/api/Assets', this.formData).then(response => {
            if (response.data.success) {
              this.$router.push('/Asset/List')
            } else {
              if (response.data.error.details !== '') {
                this.$message.error(response.data.error.details)
              } else {
                this.$message.error(response.data.error.message)
              }
            }
          })
        }
      })
    },
    cancel() {
      // 跳转资产管理页面
      this.$router.push('/Asset/List')
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
