<!-- 验收人员验收页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <h4>维修单详情</h4>
            <div class="Infodata">
              <ul>
                <li><span>维修单编号:</span><b>{{ InfoData }}</b></li>
                <li><span>设备位置:</span><b>{{ InfoData }}</b></li>
                <li><span>设备种类:</span><b>{{ InfoData }}</b></li>
                <li><span>设备编码:</span><b>{{ InfoData }}</b></li>
                <li><span>故障类型:</span><b>{{ InfoData }}</b></li>
                <li><span>故障时间:</span><b>{{ InfoData }}</b></li>
                <li><span>故障描述:</span><b>{{ InfoData }}</b></li>
                <li><span>录入人:</span><b>{{ InfoData }}</b></li>
                <li><span>报修级别:</span><b>{{ InfoData }}</b></li>
                <li><span>代维状态:</span><b>{{ InfoData }}</b></li>
                <li><span>报修人:</span><b>{{ InfoData }}</b></li>
                <li><span>报修时间:</span><b>{{ InfoData }}</b></li>
                <li><span>派工次数:</span><b>{{ InfoData }}</b></li>
                <li><span>维修次数:</span><b>{{ InfoData }}</b></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="content">
          <h4>维修记录</h4>
          <el-form ref="form" :model="formSearch" label-width="120px">
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
            <el-form-item label="建议">
              <el-input v-model="formSearch.user" placeholder="建议" size="small" />
            </el-form-item>
            <el-form-item label="配件名称及数量">
              <el-input v-model="formSearch.user" placeholder="配件名称及数量" size="small" />
            </el-form-item>
            <el-form-item label="维修人">
              <el-input v-model="formSearch.user" placeholder="当前登录账号" size="small" />
            </el-form-item>
            <el-form-item label="协助人">
              <el-input v-model="formSearch.user" placeholder="协助人" size="small" />
            </el-form-item>
            <el-form-item label="维修结果图片">
              <el-button type="primary" plain size="small" @click="addpicturea()">添加图片</el-button>
            </el-form-item>
            <el-form-item label="现场验收签字">
              <el-button type="primary" plain size="small" @click="addpictureb()">添加图片</el-button>
            </el-form-item>
            <el-form-item class="form_total">
              <el-button type="primary" size="small" icon="el-icon-search" @click="initData()">录入验收意见</el-button>
              <!-- <el-button type="primary" size="small" icon="el-icon-search" @click="initData()">重置</el-button>
              <el-button type="primary" size="small" icon="el-icon-search" @click="initData()">关闭</el-button> -->
            </el-form-item>
          </el-form>
          <el-dialog title="验收确认" :visible.sync="changeActiveVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="600px">
            <el-form :data="tableData" style="width: 100%">
              <el-form-item label="验收结果">
                <el-radio-group v-model="radio2">
                  <el-radio :label="3">通过</el-radio>
                  <el-radio :label="6">不通过</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="验收意见">
                <el-input v-model="tableData.user" placeholder="验收意见" size="small" />
              </el-form-item>
              <el-form-item label="验收人">
                <el-input v-model="tableData.user" placeholder="验收人" size="small" />
              </el-form-item>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sureright()">确定</el-button>
                <el-button type="primary" @click="changeActiveVisible=false">重置</el-button>
                <el-button type="primary" @click="changeActiveVisible=false">关闭</el-button>
              </span>
            </el-form>
          </el-dialog>
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
      tableData: [], // 验收确认表单数据
      InfoData: [],
      multipleSelection: '', // 表单选中行
      changeActiveVisible: false, // 验收确认弹框隐藏
      radio2: 3 // 单选默认选中
    }
  },
  computed: {},
  mounted() {
    this.getDataInfo()
    // this.initData(1)
    // this.getOptionsYears()
  },
  methods: {
    getDataInfo() {
      this.$axios.get('/api/RepairRecord/' + this.$route.params.id).then(res => {
        console.log(res)
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    showInfo(val) { // 点击详情按钮
      this.$router.push('/Asset/Info' + val)
    },
    UpdateStage(val) { // 点击编辑按钮
      this.$router.push('/Asset/Info' + val)
    },
    addpicturea() { // 维修结果图片

    },
    addpictureb() { // 现场验收签字

    },
    initData() { // 录入验收意见
      this.changeActiveVisible = true // 打开弹框
    },
    sureright() { // 弹框中点确认
      this.changeActiveVisible = false // 关闭弹框
      // ajax
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
      border-top: 1px solid #999;
      li {
        width: 49%;
        display: inline-block;
        border-bottom: 1px solid #999;
        border-right: 1px solid #999;
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
  .form_total {
    width: 100%;
    text-align: center;
    margin-top: 30px;
  }
}
</style>
