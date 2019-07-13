<!-- 资产详情页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="content">
            <h4>资产明细</h4>
            <el-form ref="form" :model="formData" :rules="formDatarules" label-width="90px">
              <el-form-item label="使用单位" prop="useUnit">
                <el-select v-model="formData.useUnit" clearable placeholder="使用单位" size="small">
                  <el-option v-for="item in unitData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="安装位置" prop="position">
                <el-select v-model="formData.position" clearale placeholder="安装位置" size="small">
                  <el-option v-for="item in positionData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="所属系统" prop="system">
                <el-select v-model="formData.system" clearale placeholder="所属系统" size="small">
                  <el-option v-for="item in systemData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="资产类别" prop="equimentType">
                <el-select v-model="formData.sort" clearable placeholder="资产类别" size="small">
                  <el-option v-for="item in typeData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="资产名称" prop="alias">
                <el-input v-model="formData.alias" placeholder="资产名称" size="small" />
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
                <el-date-picker v-model="formData.purchaseYear" type="month" placeholder="购置年份" />
              </el-form-item>
              <el-form-item label="交工时间" prop="handoverDate">
                <el-date-picker v-model="formData.handoverDate" type="date" placeholder="交工时间" />
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
                  <el-option key="1" label="已发布" value="true" />
                  <el-option key="2" label="未发布" value="false" />
                </el-select>
              </el-form-item>
              <el-form-item label="资产原值" prop="original">
                <el-input v-model="formData.original" placeholder="资产原值" size="small" />
              </el-form-item>
              <el-form-item label="计量单位" prop="uint">
                <el-select v-model="formData.count" clearable placeholder="产权单位" size="small">
                  <el-option key="1" label="台" value="true" />
                  <el-option key="2" label="套" value="false" />
                  <el-option key="3" label="个" value="true" />
                  <el-option key="4" label="米" value="false" />
                </el-select>
              </el-form-item>
              <el-form-item label="备注" class="form_mid" prop="Remarks">
                <el-input v-model="formData.Remarks" type="textarea" :rows="2" placeholder="请输入内容" />
              </el-form-item>
              <el-form-item label="照片" class="form_mid" />
              <el-form-item label="自定义属性">
                <el-input v-model="formData.Model" placeholder="使用单位" size="small" />
              </el-form-item>
              <el-form-item class="form_mid">
                <el-button size="small" type="primary" @click="changeActiveVisible=true">查看处理日志</el-button>
              </el-form-item>
              <el-form-item class="form_total">
                <el-button type="primary" size="small" icon="el-icon-search" @click="initData()">确定</el-button>
              </el-form-item>
            </el-form>
            <el-dialog title="资产处理日志" :visible.sync="changeActiveVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="600px">
              <el-table :data="dealtableData" style="width: 100%">
                <el-table-column prop="dealdate" label="处理日期" width="100" />
                <el-table-column prop="dealperson" label="处理人" width="80" />
                <el-table-column prop="dealway" label="处理方式" />
                <el-table-column prop="message" label="处理内容" width="150" />
                <el-table-column prop="dealremark" label="备注" />
              </el-table>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="changeActiveVisible=false">确 定</el-button>
              </span>
            </el-dialog>
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
      id: '', // 资产id
      formData: {
        useUnit: '',
        position: '',
        system: '',
        enableTime: '',
        alias: '',
        brand: '',
        model: '',
        source: '',
        purchaseYear: '',
        handoverDate: '',
        engineering: '',
        liabilityPeriod: '',
        propertyUnit: '',
        original: '',
        uint: ''
      },
      changeActiveVisible: false,
      dealtableData: [
        {
          dealdate: '123',
          dealperson: '123',
          dealway: '123',
          message: '123',
          dealremark: '123'
        }
      ],
      unitData: [], // 使用单位数据
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
  computed: {

  },
  mounted() {
    this.getselectData()// 获取下拉菜单数据
    this.gedata()// 获取单条数据
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
      // 获取产权单位
    },
    gedata() { // 获取单条数据
      // 获取id
      this.id = window.location.href.split('/')[window.location.href.split('/').length - 1]
      this.$axios.get('/api/Assets/' + this.id).then(res => {
        this.formData = res.data
      })
    },
    initData() {
      // 跳转资产管理页面
      this.$router.push('/Asset/List')
    }
  }
}
</script>
<style lang='scss' scoped>
.header {
  width: 100%;
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
