<!-- 费率信息管理页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header" />
          <div class="content">
            <el-table id="treeTable" :data="tableData" style="width: 100%" row-key="id" border :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
              <el-table-column type="index" width="50" />
              <el-table-column prop="name" label="项目名称" />
              <el-table-column prop="rate" label="费率" />
              <el-table-column prop="comment" label="备注" />
              <el-table-column prop="" label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" type="success" @click="changeForm(scope.row,'add')"><i class="fa fa-plus" style="margin-right:5px;" />添加</el-button>
                  <el-button size="mini" type="primary" @click="changeForm(scope.row,'edit')"><i class="fa fa-edit" style="margin-right:5px;" />编辑</el-button>
                  <!-- <el-button size="mini" type="danger" @click="remove(scope.row)"><i class="fa fa-times" style="margin-right:5px;" />删除</el-button> -->
                </template>
              </el-table-column>
            </el-table>

            <el-dialog ref="setValid" :title="formTitle" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="changeFormVisible" width="450px">
              <el-form ref="rateForm" :model="rateForm" :rules="formRules" label-width="80px">
                <el-form-item label="名称" prop="name">
                  <el-input v-model="rateForm.name" />
                </el-form-item>
                <el-form-item label="费率" prop="rate">
                  <el-input v-model="rateForm.rate" />
                </el-form-item>
                <el-form-item label="备注" prop="comment">
                  <el-input v-model="rateForm.comment" />
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="changeFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitChangeForm">确 定</el-button>
              </span>
            </el-dialog>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  components: {
  },
  data() {
    return {
      tableData: [],
      removeData: [],
      changeFormVisible: false,
      formTitle: '',
      formType: '',
      rateForm: {
        name: '', // 名称
        rate: '', // 费率
        comment: '', // 备注
        parentId: undefined// 父级id
      },
      formRules: {
        name: {
          required: true,
          message: '项目名称不可为空',
          trigger: 'blur'
        },
        rate: {
          required: true,
          message: '费率不可为空',
          trigger: 'blur'
        }
      },
      rowData: {}
    }
  },
  computed: {},
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$axios.get('/api/Tariff/' + this.$route.params.id).then(res => {
        this.tableData = res.tariffVerionItems
        this.totalCount = res.totalCount
      })
    },
    changeForm(row, type) {
      this.changeFormVisible = true
      this.rowData = row
      this.formType = type
      type === 'add' ? this.formTitle = '添加' : this.formTitle = '编辑'
      if (type === 'add') {
        this.rateForm.name = ''
        this.rateForm.rate = ''
        this.rateForm.comment = ''
        this.rateForm.parentId = row.id
        debugger
      } else {
        this.rateForm.name = row.name
        this.rateForm.rate = row.rate
        this.rateForm.comment = row.comment
        this.rateForm.parentId = row.parentId
      }
    },
    submitChangeForm() {
      this.$refs.rateForm.validate(valid => {
        if (valid) {
          debugger
          if (this.formType === 'add') {
            this.$axios.post('/api/Tariff/' + this.$route.params.id, this.rateForm).then(res => {
              this.$message.success('项目添加成功')
              this.getData()
              this.changeFormVisible = false
            })
          } else {
            this.$axios.put('/api/Tariff/' + this.rowData.id, this.rateForm).then(res => {
              this.$message.success('项目修改成功')
              this.getData()
              this.changeFormVisible = false
            })
          }
        }
      })
    },
    remove() { }

  }
}
</script>
<style lang='scss' scoped>
.header {
  width: 100%;
}

.tools {
  margin: 10px 0px;
  width: 29%;
  display: inline-block;
}
.toolsrt {
  width: 50%;
  text-align: left;
  .el-form-item {
    width: 200px;
    display: inline-block;
  }
  .el-select {
    width: 200px;
  }
}

.content {
  .el-table th,
  .el-table td {
    padding: 5px;
  }
}
</style>
