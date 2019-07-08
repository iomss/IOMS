<!-- 工单资产列表报修页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <h4>工单资产列表报修管理</h4>
            <div class="select">
              <el-form ref="form" :model="formSearch" label-width="90px">
                <el-form-item label="报修位置">
                  <el-select v-model="formSearch.unit" clearable placeholder="报修位置" size="small">
                    <el-option key="1" label="单选" value="1" />
                    <el-option key="2" label="多选" value="2" />
                  </el-select>
                </el-form-item>
                <el-form-item label="资产名称">
                  <el-select v-model="formSearch.position" clearale placeholder="资产名称" size="small">
                    <el-option key="0" label="0" value="0" />
                    <el-option key="1" label="1" value="1" />
                  </el-select>
                </el-form-item>
                <el-form-item label="故障时间">
                  <el-date-picker v-model="formSearch.errortime" type="datetime" placeholder="故障时间" />
                </el-form-item>
                <el-form-item label="报修时间">
                  <el-date-picker v-model="formSearch.errortime" type="datetime" placeholder="报修时间" />
                </el-form-item>
                <el-form-item label="故障类型">
                  <el-select v-model="formSearch.source" clearable placeholder="故障类型" size="small">
                    <el-option key="1" label="已发布" value="true" />
                    <el-option key="2" label="未发布" value="false" />
                  </el-select>
                  <i class="iconfont icon-add" @click="createerror()" />
                </el-form-item>
                <el-form-item label="报修人">
                  <el-input v-model="formSearch.Model" placeholder="报修人" size="small" />
                </el-form-item>
                <el-form-item label="故障描述">
                  <el-select v-model="formSearch.source" clearable placeholder="故障描述" size="small">
                    <el-option key="1" label="已发布" value="true" />
                    <el-option key="2" label="未发布" value="false" />
                  </el-select>
                </el-form-item>
                <el-form-item label="故障级别">
                  <el-select v-model="formSearch.source" clearable placeholder="故障级别" size="small">
                    <el-option key="1" label="已发布" value="true" />
                    <el-option key="2" label="未发布" value="false" />
                  </el-select>
                  <span>说明</span>
                </el-form-item>
                <el-form-item label="指定工程师">
                  <el-select v-model="formSearch.source" clearable placeholder="指定工程师" size="small">
                    <el-option key="1" label="已发布" value="true" />
                    <el-option key="2" label="未发布" value="false" />
                  </el-select>
                </el-form-item>
                <el-form-item class="total">
                  <el-button type="primary" size="small" icon="el-icon-search" @click="createWorker()">派单</el-button>
                  <el-button type="primary" size="small" icon="el-icon-search" @click="cancelWorker()">取消</el-button>
                </el-form-item>
              </el-form>
            </div>
            <el-dialog title="添加故障类型" :visible.sync="changeActiveVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="600px">
              <el-form ref="form" :model="formadd" label-width="90px">
                <el-form-item label="所属系统">
                  <el-select v-model="formadd.source" clearable placeholder="所属系统" size="small">
                    <el-option key="1" label="已发布" value="true" />
                    <el-option key="2" label="未发布" value="false" />
                  </el-select>
                </el-form-item>
                <el-form-item label="设备种类">
                  <el-select v-model="formadd.source" clearable placeholder="设备种类" size="small">
                    <el-option key="1" label="已发布" value="true" />
                    <el-option key="2" label="未发布" value="false" />
                  </el-select>
                </el-form-item>
                <el-form-item label="故障名称">
                  <el-input v-model="formadd.Remarks" type="textarea" placeholder="故障名称" />
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
// import page from '@/components/page.vue'
export default {
  components: {
    // page
  },
  data() {
    return {
      changeActiveVisible: true,
      formSearch: {},
      formadd: {}
    }
  },
  computed: {},
  mounted() {
    // this.initData(1)
    // this.getOptionsYears()
  },
  methods: {
    handleChange(val) { // 故障个数点击方法
      console.log(val)
    },
    createWorker() { // 提交派单按钮方法
      // ajax
      // 页面跳转？派单页
    },
    handleSelectionChange(val) { // 表单选中行
      this.multipleSelection = val
    },
    createerror() { // 创建故障类型

    },
    creatderrortype() { // 添加故障类型弹框确定方法
      // 刷新数据
      // 隐藏弹框
      this.changeActiveVisible = false
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
  width: 100%;
  text-align: center;
}
</style>
