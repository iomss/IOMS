<!-- 设备管理页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <h4>设备管理</h4>
            <div class="select">
              <el-button type="primary" @click="create()">新增设备</el-button>
              <el-button type="primary" @click="savelist()">保存设备清单</el-button>
              <el-button type="danger" @click="deletelist()">批量删除</el-button>
            </div>
            <div class="title">
              {{ title }}清单编号：{{ num }}
            </div>
          </div>
          <div class="content">
            <el-table :data="tableData" stripe border style="width: 100%" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="40" />
              <el-table-column label="系统名称" prop="version" width="150">
                <template slot-scope="scope">
                  <span v-for="(item,index) in scope.row.answer" :key="index" style="margin-right:8px;">{{ item===1?"A":item===2?"B":item===3?"C":"D" }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="year" label="设备种类" width="90" />
              <el-table-column prop="unit" label="责任期内数量" width="150" />
              <el-table-column prop="num" label="责任期外数量" width="150" />
              <el-table-column prop="time" label="设备小计" width="100" />
              <el-table-column prop="state" label="备注" width="100" />
              <el-table-column prop="state" label="来源" width="100" />
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
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
            <el-dialog title="编辑设备清单" :visible.sync="changeActiveVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="450px">
              <el-form ref="form" :model="formSearch" label-width="120px">
                <el-form-item label="系统名称">
                  <el-input v-model="formSearch.number" placeholder="系统名称" size="small" />
                </el-form-item>
                <el-form-item label="设备种类">
                  <el-input v-model="formSearch.number" placeholder="设备种类" size="small" />
                </el-form-item>
                <el-form-item label="责任期内数量">
                  <el-input v-model="formSearch.number" placeholder="责任期内数量" size="small" />
                </el-form-item>
                <el-form-item label="责任期外数量">
                  <el-input v-model="formSearch.number" placeholder="责任期外数量" size="small" />
                </el-form-item>
                <el-form-item label="设备小计">
                  <el-input v-model="formSearch.number" placeholder="设备小计" size="small" />
                </el-form-item>
                <el-form-item label="来源">
                  <el-input v-model="formSearch.number" placeholder="来源" size="small" />
                </el-form-item>
                <el-form-item label="备注">
                  <el-input v-model="formSearch.number" placeholder="备注" size="small" />
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updatedata()">确 定</el-button>
                <el-button type="primary" @click="changeActiveVisible=false">取消</el-button>
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
      changeActiveVisible: false,
      formSearch: {
        unit: '',
        year: ''
      },
      tableData: [],
      multipleSelection: '', // 表单选中行
      title: 'xx所2019年设备清单详细列表',
      num: '1111111111'
    }
  },
  computed: {},
  mounted() {
  },
  methods: {
    create() {
      // 新增设备
    },
    savelist() {
      // 保存设备清单
    },
    deletelist() {
      // 删除设备清单
      if (this.multipleSelection === '') {
        this.$message.error('请至少选择一条数据')
      } else {
        this.removeQuestionVisible = true
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    UpdateStage(val) { // 点击编辑按钮
      // 弹框？
      this.changeActiveVisible = true
    },
    updatedata() {
      // 编辑弹框关闭
      // 列表数据刷新
    },
    deleteManage(row) { // 点击删除按钮
      this.removeData = row
      this.removeQuestionVisible = true
    },
    // 删除试题
    removeQuestion() {
      // const _this = this
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
}

.title {
  margin: 10px 0px;
}
.content {
  .el-table th,
  .el-table td {
    padding: 5px;
  }
}
.el-dialog__footer {
  text-align: center;
}
</style>

