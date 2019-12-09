<!-- 设备种类页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <div class="search">
              <el-input v-model="TypeFormSearch.text" placeholder="设备种类名称" size="small" />
              <el-button type="primary" size="small" @click="getData()">查询</el-button>
              <el-button type="success" size="small" @click="adddata()">添加</el-button>
              <el-button type="warning" size="small" @click="updateType()">修改</el-button>
              <el-button type="danger" size="small" @click="deleteType()">删除</el-button>
            </div>
          </div>
          <!--表格-->
          <div class="content">
            <el-table :data="TypeData" stripe border style="width: 100%" @selection-change="handleSelectionChangeType">
              <el-table-column type="selection" width="40" />
              <el-table-column type="index" label="序号" />
              <el-table-column prop="name" label="设备种类" />
            </el-table>
            <!--分页-->
            <pagination v-show="TypeTotalCount>0" :total="TypeTotalCount" :page.sync="TypeFormSearch.pageNumber" :limit.sync="TypeFormSearch.pageSize" @pagination="getTypePage" />
            <!--添加、修改-->
            <el-dialog :title="TypeFormTitle" :visible.sync="TypeFormVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="450px" @close="TypeFormClose">
              <el-form ref="TypeForm" :model="TypeForm" :rules="TypeFormRules" label-width="120px">
                <el-form-item label="设备种类" prop="name">
                  <el-input v-model="TypeForm.name" placeholder="设备种类" size="small" />
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="TypeFormVisible=false">关闭</el-button>
                <el-button type="primary" @click="submitType()">提交</el-button>
              </span>
            </el-dialog>

            <!--删除-->
            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="TypeDeleteModelVisible" width="220px">
              <span>您确定要删除此条数据？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="TypeDeleteModelVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitDeleteType">确 定</el-button>
              </span>
            </el-dialog>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      TypeData: [], // 数据
      TypeFormSearch: {
        text: '',
        pageSize: 20,
        pageNumber: 1
      },
      TypeTotalCount: 0, // 总条数
      TypeFormTitle: '添加设备集成商', // 表单表头
      TypeFormVisible: false,
      TypeForm: {
        id: undefined,
        name: ''
      },
      TypeFormRules: {
        name: {
          required: true,
          message: '设备类型不可为空',
          trigger: 'blur'
        }
      },
      TypeDeleteModelVisible: false,
      TypeDeleteDataId: null,
      multipleSelectionpType: []
    }
  },
  computed: {},
  mounted() {
    this.getData()
  },
  methods: {
    // 获取数据
    getData() {
      this.$axios.get('/api/Meta/Type', { params: this.TypeFormSearch }).then(res => {
        this.TypeData = res.data
        this.TypeTotalCount = res.totalCount
      })
    },
    // 分页
    getTypePage(val) {
      // 展示条数
      this.TypeFormSearch.pageSize = val.limit
      // 页码
      this.TypeFormSearch.pageNumber = val.page
      // 调用获取数据
      this.getData()
    },
    // 表单关闭重置
    TypeFormClose() {
      this.$refs.TypeForm.resetFields()
    },
    // 添加
    adddata() {
      this.TypeFormVisible = true// 显示弹框
      this.TypeFormTitle = '添加设备类型'
      this.TypeForm.id = undefined
      this.TypeForm.name = ''
    },
    updateType(row) {
      if (row === undefined) {
        this.TypeFormTitle = '编辑'
        if (this.multipleSelectionType.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.TypeFormVisible = true
          this.TypeForm.id = this.multipleSelectionType[0].id
          this.TypeForm.name = this.multipleSelectionType[0].name
        }
      } else {
        this.TypeFormVisible = true
        this.TypeForm.id = row.id
        this.TypeForm.name = row.name
      }
    },
    // 表单提交
    submitType() {
      this.$refs.TypeForm.validate(valid => {
        if (valid) {
          if (this.TypeForm.id === undefined) {
            this.$axios.post('/api/Meta/Type', this.TypeForm).then(res => {
              this.getData()
              this.$message.success('添加成功')
              this.TypeFormVisible = false
            })
          } else {
            this.$axios.put('/api/Meta/Type/' + this.TypeForm.id, this.TypeForm).then(res => {
              this.getData()
              this.$message.success('修改成功')
              this.TypeFormVisible = false
            })
          }
        }
      })
    },
    // 删除
    deleteType(row) {
      if (row === undefined) {
        if (this.multipleSelectionType.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.TypeDeleteModelVisible = true
          this.TypeDeleteDataId = this.multipleSelectionType[0].id
        }
      } else {
        this.TypeDeleteModelVisible = true
        this.TypeDeleteDataId = row.id
      }
    },
    // 提交删除
    submitDeleteType() {
      this.$axios.delete('/api/Meta/Type/' + this.TypeDeleteDataId).then(res => {
        this.getData()
        this.$message.success('删除成功')
        this.TypeDeleteModelVisible = false
      })
    },
    // 表单多选数据
    handleSelectionChangeType(val) {
      this.multipleSelectionType = val
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
