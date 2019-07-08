<!-- 工单处理 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <h4>维修单详情</h4>
            <!-- <el-form ref="form" :model="formSearch" label-width="90px">
              <el-form-item label="使用年限">
                <el-input v-model="formSearch.useyear" placeholder="使用年限" size="small" />
              </el-form-item>
              <el-form-item label="缺陷责任期">
                <el-input v-model="formSearch.defect" placeholder="缺陷责任期" size="small" />
              </el-form-item>
              <el-form-item label="产权单位">
                <el-select v-model="formSearch.Owner" clearable placeholder="产权单位" size="small">
                  <el-option key="1" label="已发布" value="true" />
                  <el-option key="2" label="未发布" value="false" />
                </el-select>
              </el-form-item>
              <el-form-item label="使用单位">
                <el-input v-model="formSearch.user" placeholder="使用单位" size="small" />
              </el-form-item>
              <el-form-item class="form_total">
                <el-button type="primary" size="small" icon="el-icon-search" @click="initData()">确定</el-button>
              </el-form-item>
            </el-form> -->
          </div>
          <div class="content">
            <h4>维修记录</h4>
            <el-form ref="form" :model="formSearch" label-width="90px">
              <el-form-item label="维修单类型">
                <el-radio-group v-model="formSearch.radio">
                  <el-radio :label="1">维修完毕</el-radio>
                  <el-radio :label="2">重复报修</el-radio>
                  <el-radio :label="3">误报</el-radio>
                  <el-radio :label="4">暂缓</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="设备种类">
                <el-select v-model="formSearch.Owner" clearable placeholder="设备种类" size="small">
                  <el-option key="1" label="已发布" value="true" />
                  <el-option key="2" label="未发布" value="false" />
                </el-select>
              </el-form-item>
              <el-form-item label="设备编码">
                <el-input v-model="formSearch.user" placeholder="设备编码" size="small" />
              </el-form-item>
              <el-form-item label="故障类型">
                <el-input v-model="formSearch.user" placeholder="故障类型" size="small" />
              </el-form-item>
              <el-form-item label="维修级别">
                <el-select v-model="formSearch.Owner" clearable placeholder="产权单位" size="small">
                  <el-option key="1" label="已发布" value="true" />
                  <el-option key="2" label="未发布" value="false" />
                </el-select>
              </el-form-item>
              <el-form-item label="维修开始时间">
                <el-date-picker v-model="formSearch.value1" type="datetime" placeholder="维修开始时间" />
              </el-form-item>
              <el-form-item label="维修结束时间">
                <el-date-picker v-model="formSearch.value2" type="datetime" placeholder="维修结束时间" />
              </el-form-item>
              <el-form-item label="维修过程">
                <el-input v-model="formSearch.user" placeholder="维修过程" size="small" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formSearch.user" placeholder="备注" size="small" />
              </el-form-item>
              <el-form-item label="配件名称及数量">
                <el-input v-model="formSearch.user" placeholder="配件名称及数量" size="small" />
              </el-form-item>
              <el-form-item label="维修人">
                <el-input v-model="formSearch.user" placeholder="当前登录账号" size="small" />
              </el-form-item>
              <el-form-item label="维修人员">
                <el-input v-model="formSearch.user" placeholder="维修人员" size="small" />
              </el-form-item>
              <el-form-item class="form_total">
                <el-button type="primary" size="small" icon="el-icon-search" @click="initData()">提交</el-button>
                <el-button type="primary" size="small" icon="el-icon-search" @click="initData()">重置</el-button>
                <el-button type="primary" size="small" icon="el-icon-search" @click="initData()">关闭</el-button>
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
      formSearch: {
        unit: '',
        position: '',
        sort: '',
        owner: '',
        starttime: ''
      },
      tableData: [],
      multipleSelection: '' // 表单选中行
    }
  },
  computed: {},
  mounted() {
    // this.initData(1)
    // this.getOptionsYears()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    showInfo(val) { // 点击详情按钮
      this.$router.push('/Asset/Info' + val)
    },
    UpdateStage(val) { // 点击编辑按钮
      this.$router.push('/Asset/Info' + val)
    }
  }
}
</script>
<style lang='scss' scoped>
.header {
  width: 100%;
}
.content {
  margin-top: 30px;
  .el-table th,
  .el-table td {
    padding: 5px;
  }
}
</style>
