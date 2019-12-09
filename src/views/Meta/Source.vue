<!-- 来源页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <div class="search">
              <el-input v-model="sourceFormSearch.text" placeholder="来源名称" size="small" />
              <el-button type="primary" size="small" @click="getData()">查询</el-button>
              <el-button type="success" size="small" @click="adddata()">添加</el-button>
              <el-button type="warning" size="small" @click="updatesource()">修改</el-button>
              <el-button type="danger" size="small" @click="deleteSource()">删除</el-button>
            </div>
          </div>
          <div class="content">
            <el-table :data="sourceData" stripe border style="width: 100%" @selection-change="handleSelectionChangeSource">
              <el-table-column type="selection" width="40" />
              <el-table-column type="index" label="序号" />
              <el-table-column prop="name" label="来源名称" />
            </el-table>
            <pagination v-show="sourceTotalCount>0" :total="sourceTotalCount" :page.sync="sourceFormSearch.pageNumber" :limit.sync="sourceFormSearch.pageSize" @pagination="getSourcePage" />

            <el-dialog :title="sourceFormTitle" :visible.sync="sourceFormVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="450px" @close="sourceFormClose">
              <el-form ref="sourceForm" :model="sourceForm" :rules="sourceFormRules" label-width="120px">
                <el-form-item label="来源" prop="name">
                  <el-input v-model="sourceForm.name" placeholder="来源" size="small" />
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sourceFormVisible=false">关闭</el-button>
                <el-button type="primary" @click="submitSource()">提交</el-button>
              </span>
            </el-dialog>

            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="sourceDeleteModelVisible" width="220px">
              <span>您确定要删除此条数据？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="sourceDeleteModelVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitDeleteSource">确 定</el-button>
              </span>
            </el-dialog>

          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import pagination from '@/components/Pagination/index.vue'

export default {
  components: {
    pagination
  },
  data() {
    return {
      sourceData: [], // 数据
      sourceFormSearch: {
        text: '',
        pageSize: 20,
        pageNumber: 1
      },
      sourceTotalCount: 0,
      sourceFormTitle: '',
      sourceFormVisible: false,
      sourceForm: {
        id: undefined,
        name: ''
      },
      sourceFormRules: {
        name: {
          required: true,
          message: '来源名称不可为空',
          trigger: 'blur'
        }
      },
      sourceDeleteModelVisible: false,
      sourceDeleteDataId: null,
      multipleSelectionSource: []
    }
  },
  computed: {},
  mounted() {
    this.getData()
  },
  methods: {
    // 获取数据
    getData() {
      this.$axios.get('/api/Meta/Source', { params: this.sourceFormSearch }).then(res => {
        this.sourceData = res.data
        this.sourceTotalCount = res.totalCount
      })
    },
    // 分页
    getSourcePage(val) {
      // 展示条数
      this.sourceFormSearch.pageSize = val.limit
      // 页码
      this.sourceFormSearch.pageNumber = val.page
      // 调用获取数据
      this.getData()
    },
    // 添加
    adddata() {
      this.sourceFormVisible = true// 显示弹框
      this.sourceFormTitle = '添加来源'
      this.sourceForm.id = undefined
      this.sourceForm.name = ''
    },
    // 表单关闭重置
    sourceFormClose() {
      this.$refs.sourceForm.resetFields()
    },
    updatesource(row) {
      if (row === undefined) {
        this.sourceFormTitle = '编辑'
        if (this.multipleSelectionSource.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.sourceFormVisible = true
          this.sourceForm.id = this.multipleSelectionSource[0].id
          this.sourceForm.name = this.multipleSelectionSource[0].name
        }
      } else {
        this.sourceFormVisible = true
        this.sourceForm.id = row.id
        this.sourceForm.name = row.name
      }
    },
    // 表单提交
    submitSource() {
      this.$refs.sourceForm.validate(valid => {
        if (valid) {
          if (this.sourceForm.id === undefined) {
            this.$axios.post('/api/Meta/source', this.sourceForm).then(res => {
              this.getData()
              this.$message.success('添加成功')
              this.sourceFormVisible = false
            })
          } else {
            this.$axios.put('/api/Meta/source/' + this.sourceForm.id, this.sourceForm).then(res => {
              this.getData()
              this.$message.success('修改成功')
              this.sourceFormVisible = false
            })
          }
        }
      })
    },
    // 删除
    deleteSource(row) {
      if (row === undefined) {
        if (this.multipleSelectionSource.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.sourceDeleteModelVisible = true
          this.sourceDeleteDataId = this.multipleSelectionSource[0].id
        }
      } else {
        this.sourceDeleteModelVisible = true
        this.sourceDeleteDataId = row.id
      }
    },
    // 提交删除
    submitDeleteSource() {
      this.$axios.delete('/api/Meta/source/' + this.sourceDeleteDataId).then(res => {
        this.getData()
        this.$message.success('删除成功')
        this.sourceDeleteModelVisible = false
      })
    },
    // 表单多选数据
    handleSelectionChangeSource(val) {
      this.multipleSelectionSource = val
    }
  }
}
</script>
<style lang='scss' scoped>
.header {
  width: 100%;
  .search {
    margin: 10px 0px;
    .el-input {
      display: inline-block;
      width: 200px;
      margin-right: 20px;
    }
  }
}
.content {
  .el-table th,
  .el-table td {
    padding: 5px;
  }
}
</style>
