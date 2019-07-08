<!-- 资产管理页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <h4>资产管理</h4>
            <div class="select">
              <el-button type="primary" plain size="small" @click="selectstate(0)">资产列表</el-button>
              <el-button type="primary" plain size="small" @click="selectstate(1)">在用资产</el-button>
              <el-button type="primary" plain size="small" @click="selectstate(2)">闲置资产</el-button>
              <el-button type="primary" plain size="small" @click="selectstate(3)">报废资产</el-button>
            </div>
            <div class="tools">
              <el-button type="primary" @click="create()">新增资产</el-button>
              <el-dropdown>
                <el-button type="primary" @click="handleClick">
                  批量导入<i class="el-icon-arrow-down el-icon--right" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>导入</el-dropdown-item>
                  <el-dropdown-item>下载模板</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown>
                <el-button type="primary" @click="handleClick">
                  批量导出<i class="el-icon-arrow-down el-icon--right" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>导出全部</el-dropdown-item>
                  <el-dropdown-item>选择导出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="toolsrt">
              <el-button type="primary" plain size="small" @click="formSearchShow = !formSearchShow">高级搜索</el-button>
            </div>
            <el-card v-if="formSearchShow" class="search" :body-style="{ padding: '20px' }">
              <el-form ref="form" :model="formSearch" label-width="90px">
                <el-select v-model="formSearch.unit" clearable placeholder="使用单位" size="small">
                  <el-option key="1" label="单选" value="1" />
                  <el-option key="2" label="多选" value="2" />
                </el-select>
                <el-select v-model="formSearch.position" clearale placeholder="安装位置" size="small">
                  <el-option key="0" label="0" value="0" />
                  <el-option key="1" label="1" value="1" />
                </el-select>
                <el-select v-model="formSearch.sort" clearable placeholder="资产类别" size="small">
                  <el-option key="1" label="已发布" value="true" />
                  <el-option key="2" label="未发布" value="false" />
                </el-select>
                <el-select v-model="formSearch.owner" clearable placeholder="所属系统" size="small">
                  <el-option key="1" label="启用" value="true" />
                  <el-option key="2" label="禁用" value="false" />
                </el-select>
                <el-select v-model="formSearch.starttime" clearable placeholder="投用开始时间" size="small">
                  <el-option key="1" label="已发布" value="true" />
                  <el-option key="2" label="未发布" value="false" />
                </el-select>
                <el-select v-model="formSearch.endtime" clearable placeholder="投用截止时间" size="small">
                  <el-option key="1" label="启用" value="true" />
                  <el-option key="2" label="禁用" value="false" />
                </el-select>
                <el-select v-model="formSearch.source" clearable placeholder="资产来源" size="small">
                  <el-option key="1" label="已发布" value="true" />
                  <el-option key="2" label="未发布" value="false" />
                </el-select>
                <el-select v-model="formSearch.age" clearable placeholder="寿命状态" size="small">
                  <el-option key="1" label="启用" value="true" />
                  <el-option key="2" label="禁用" value="false" />
                </el-select>
                <el-input v-model="formSearch.brand" placeholder="品牌" size="small" />
                <el-input v-model="formSearch.Model" placeholder="型号" size="small" />
                <el-form-item style="margin-bottom:0">
                  <el-button type="primary" size="small" icon="el-icon-search" @click="initData(formSearch.PageIndex)">查询</el-button>
                  <el-button size="small" icon="el-icon-close" @click="formSearchShow=false">取消</el-button>
                </el-form-item>
              </el-form>
            </el-card>
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
      multipleSelection: '', // 表单选中行
      removeData: null
    }
  },
  computed: {},
  mounted() {
    // this.initData(1)
    // this.getOptionsYears()
  },
  methods: {
    create() { // 新增资产
      this.$router.push('/Asset/Create')
    },
    selectstate(data) { // 按状态筛选资产
      console.log(data)
    },
    handleClick(e) { // 导入导出选择事件
      console.log(e)
    },
    Import() { // 导入方法

    },
    export() { // 导出方法

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
    deleteManage(row) {
      this.removeData = row
      this.removeQuestionVisible = true
    },
    // 删除试题
    removeQuestion() {
      // let _this = this
      // this.$ajax.delete('/api/services/app/Question/DeleteClozeQuestion?Id=' + this.removeData.id).then(response => {
      //   if (response.data.success) {
      //     let index = _this.tableData.indexOf(_this.removeData)
      //     _this.tableData.splice(index, 1)
      //     _this.$message.success('删除成功')
      //     _this.removeQuestionVisible = false
      //   } else {
      //     _this.$message.error(response.data.error.message)
      //   }
      // })
    }
  }
}
</script>
<style lang='scss' scoped>
.header {
  width: 100%;
  height: 64px;
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
