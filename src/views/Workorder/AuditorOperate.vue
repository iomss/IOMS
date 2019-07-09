<!-- 审核人员审核页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <h4>维修单详情</h4>
            <div class="Infodata">
              <ul>
                <li><span>维修单类型:</span><b>{{ InfoData }}</b></li>
                <li><span>设备种类:</span><b>{{ InfoData }}</b></li>
                <li><span>设备编号:</span><b>{{ InfoData }}</b></li>
                <li><span>故障类型:</span><b>{{ InfoData }}</b></li>
                <li><span>维修级别:</span><b>{{ InfoData }}</b></li>
                <li><span>维修开始时间:</span><b>{{ InfoData }}</b></li>
                <li><span>维修结束时间:</span><b>{{ InfoData }}</b></li>
                <li><span>维修过程:</span><b>{{ InfoData }}</b></li>
                <li><span>建议:</span><b>{{ InfoData }}</b></li>
                <li><span>配件名称及数量:</span><b>{{ InfoData }}</b></li>
                <li><span>维修人:</span><b>{{ InfoData }}</b></li>
                <li><span>协助人:</span><b>{{ InfoData }}</b></li>
                <li><span>维修结果图片:</span><b>{{ InfoData }}</b></li>
                <li><span>现场验收签字:</span><b>{{ InfoData }}</b></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="mid">
          <h4>验收确认</h4>
          <div class="checkdata">
            <ul>
              <li><span>验收结果:</span><b>{{ checkdata }}</b></li>
              <li><span>验收意见:</span><b>{{ checkdata }}</b></li>
              <li><span>验收人:</span><b>{{ checkdata }}</b></li>
            </ul>
          </div>
        </div>
        <div class="content">
          <h4>审核确认</h4>
          <el-form ref="form" :data="tableData" label-width="90">
            <el-form-item label="审核结果">
              <el-radio-group v-model="radio2">
                <el-radio :label="3">通过</el-radio>
                <el-radio :label="6">不通过</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="审核意见">
              <el-input v-model="tableData.user" placeholder="审核意见" size="small" />
            </el-form-item>
            <el-form-item label="审核人">
              <el-input v-model="tableData.user" placeholder="审核人" size="small" />
            </el-form-item>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="sureright()">确定</el-button>
            </span>
          </el-form>
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
      InfoData: [],
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
    },
    sureright() { // 审核通过点确定

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
