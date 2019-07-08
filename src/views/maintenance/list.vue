<!-- 工单列表页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <h4>工单管理</h4>
            <div class="select">
              <el-form ref="form" :model="formSearch" label-width="90px">
                <el-form-item label="设备位置">
                  <el-select v-model="formSearch.unit" clearable placeholder="设备位置" size="small">
                    <el-option key="1" label="单选" value="1" />
                    <el-option key="2" label="多选" value="2" />
                  </el-select>
                </el-form-item>
                <el-form-item label="设备种类">
                  <el-select v-model="formSearch.position" clearale placeholder="设备种类" size="small">
                    <el-option key="0" label="0" value="0" />
                    <el-option key="1" label="1" value="1" />
                  </el-select>
                </el-form-item>
                <el-form-item label="故障现象">
                  <el-select v-model="formSearch.sort" clearable placeholder="故障现象" size="small">
                    <el-option key="1" label="已发布" value="true" />
                    <el-option key="2" label="未发布" value="false" />
                  </el-select>
                </el-form-item>
                <el-form-item label="故障时间">
                  <el-date-picker v-model="formSearch.errortime" type="datetime" placeholder="故障时间" />
                </el-form-item>
                <el-form-item label="报修时间">
                  <el-date-picker v-model="formSearch.errortime" type="datetime" placeholder="报修时间" />
                </el-form-item>
                <el-form-item label="故障个数">
                  <el-input-number v-model="formSearch.num" controls-position="right" @change="handleChange" />
                </el-form-item>
                <el-form-item label="故障描述">
                  <el-select v-model="formSearch.source" clearable placeholder="故障描述" size="small">
                    <el-option key="1" label="已发布" value="true" />
                    <el-option key="2" label="未发布" value="false" />
                  </el-select>
                </el-form-item>
                <el-form-item label="派工">
                  <el-select v-model="formSearch.age" clearable placeholder="派工" size="small">
                    <el-option key="1" label="启用" value="true" />
                    <el-option key="2" label="禁用" value="false" />
                  </el-select>
                </el-form-item>
                <el-form-item label="录入人">
                  <el-input v-model="formSearch.brand" placeholder="录入人" size="small" />
                </el-form-item>
                <el-form-item label="报修人">
                  <el-input v-model="formSearch.Model" placeholder="报修人" size="small" />
                </el-form-item>
                <el-form-item style="margin-bottom:0">
                  <el-button type="primary" size="small" icon="el-icon-search" @click="createWorker()">提交更改</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="content">
              <el-table :data="tableData" stripe border style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="40" />
                <el-table-column prop="id" label="序号" width="60" />
                <el-table-column label="状态" width="80">
                  <template slot-scope="scope">
                    <span v-for="(item,index) in scope.row.answer" :key="index" style="margin-right:8px;">{{ item===1?"A":item===2?"B":item===3?"C":"D" }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="detail" label="资产编码" width="90" />
                <el-table-column prop="questionType" label="资产类别" width="90" />
                <el-table-column prop="year" label="资产名称" width="90" />
                <el-table-column prop="number" label="品牌" width="70" />
                <el-table-column prop="recommendedTime" label="型号" width="100" />
                <el-table-column prop="globalCorrectRate" label="所属系统" width="100" />
                <el-table-column prop="level" label="所属子系统" width="120" />
                <el-table-column prop="analysis" label="安装位置" width="90" />
                <el-table-column prop="tips" label="投用时间" width="90" />
                <el-table-column prop="tips" label="交工时间" width="90" />
                <el-table-column prop="tips" label="购置年份" width="90" />
                <el-table-column prop="tips" label="资产原值" width="90" />
                <el-table-column prop="tips" label="增加方式" width="90" />
                <el-table-column prop="tips" label="集成商" width="130" />
                <el-table-column prop="tips" label="录入人" width="80" />
                <el-table-column prop="tips" label="更新时间" width="90" />
                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button style="display:block;margin-left:0;margin-bottom:5px;" size="mini" type="success" @click="showInfo(scope.row)">详情</el-button>
                    <el-button style="display:block;margin-left:0;margin-bottom:5px;" size="mini" type="primary" @click="UpdateStage(scope.row)">编辑</el-button>
                    <el-button style="display:block;margin-left:0;margin-bottom:5px;" size="mini" type="danger" @click="deleteManage(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="removeQuestionVisible" width="220px">
                <span>您确定要删除此条数据？</span>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="removeQuestionVisible = false">取 消</el-button>
                  <el-button type="primary" @click="removeQuestion">确 定</el-button>
                </span>
              </el-dialog>
            </div>
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
      formSearchShow: false,
      removeQuestionVisible: false,
      formSearch: {
        unit: '',
        position: '',
        sort: '',
        owner: '',
        starttime: '',
        endtime: '',
        source: '',
        age: '',
        brand: '',
        Model: ''
      },
      tableData: [],
      multipleSelection: '', // 表单选中行id
      removeData: null
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
    createWorker() { // 提交更改按钮方法
      // ajax
    },
    handleSelectionChange(val) { // 表单选中行
      this.multipleSelection = val
    }
  }
}
</script>
<style lang='scss' scoped>
.header {
  width: 100%;
}
.select {
  width: 40%;
  display: inline-block;
}
.tools {
  width: 30%;
  display: inline-block;
}
.toolsrt {
  width: 20%;
  display: inline-block;
  text-align: right;
}
.search {
  width: 450px;
  position: absolute;
  right: 0;
  z-index: 4;
  .el-input {
    display: inline-block;
    width: 49%;
  }
  .el-select {
    margin-bottom: 5px;
    .el-input {
      width: 100%;
    }
  }
}
.content {
  margin-top: 30px;
  .el-table th,
  .el-table td {
    padding: 5px;
  }
}
</style>
