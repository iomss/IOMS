<!-- 所属系统页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <div class="search">
              <el-input v-model="systemFormSearch.text" placeholder="全局查询" size="small" />
              <el-select v-model="systemFormSearch.parentId" clearable size="small" filterable placeholder="上级系统">
                <el-option v-for="item in parentSystemData" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
              <el-button type="primary" size="small" @click="getData()">查询</el-button>
              <el-button type="success" size="small" @click="adddata()">添加</el-button>
              <el-button type="warning" size="small" @click="updateSystem()">修改</el-button>
              <el-button type="danger" size="small" @click="deleteSystem()">删除</el-button>
            </div>
          </div>
          <div class="content">
            <el-table :data="systemData" stripe border style="width: 100%" @selection-change="handleSelectionChangeSystem">
              <el-table-column type="selection" width="40" />
              <el-table-column prop="id" label="序号" />
              <el-table-column prop="name" label="所属系统" />
              <el-table-column prop="parentName" label="上级系统" />
            </el-table>

            <pagination v-show="systemTotalCount>0" :total="systemTotalCount" :page.sync="systemFormSearch.pageNumber" :limit.sync="systemFormSearch.pageSize" @pagination="getSystemPage" />

            <el-dialog :title="systemFormTitle" :visible.sync="systemFormVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="450px" @close="systemFormClose">
              <el-form ref="systemForm" :model="systemForm" :rules="systemFormRules" label-width="120px">
                <el-form-item label="所属系统" prop="name">
                  <el-input v-model="systemForm.name" placeholder="所属系统" size="small" />
                </el-form-item>
                <el-form-item label="上级系统" prop="parentId">
                  <el-select v-model="systemForm.parentId" size="small" filterable placeholder="上级系统">
                    <el-option v-for="item in parentSystemData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="systemFormVisible=false">关闭</el-button>
                <el-button type="primary" @click="submitSystem()">提交</el-button>
              </span>
            </el-dialog>

            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="systemDeleteModelVisible" width="220px">
              <span>您确定要删除此条数据？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="systemDeleteModelVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitDeletesystem">确 定</el-button>
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
      systemData: [], // 全部数据
      parentSystemData: [],
      systemFormSearch: {
        text: '',
        parentId: undefined,
        pageSize: 20,
        pageNumber: 1
      },
      systemTotalCount: 0,
      systemFormTitle: '',
      systemFormVisible: false,
      systemForm: {
        id: undefined,
        parentId: null,
        name: ''
      },
      systemFormRules: {
        name: {
          required: true,
          message: '所属系统不可为空',
          trigger: 'blur'
        }
      },
      systemDeleteModelVisible: false,
      systemDeleteDataId: null,
      multipleSelectionSystem: []

    }
  },
  computed: {},
  mounted() {
    this.getData()
    this.getParentData()
  },
  methods: {
    getData() {
      this.$axios.get('/api/Meta/System', { params: this.systemFormSearch }).then(res => {
        this.systemData = res.data
        this.systemTotalCount = res.totalCount
      })
    },
    getParentData() {
      this.$axios.get('/api/Meta/System', { params: { ...this.systemFormSearch, topLevel: true, pageSize: 9999 }}).then(res => {
        this.parentSystemData = res.data
      })
    },
    // 分页
    getSystemPage(val) {
      // 展示条数
      this.systemFormSearch.pageSize = val.limit
      // 页码
      this.systemFormSearch.pageNumber = val.page
      // 调用获取数据
      this.getData()
    },
    adddata() {
      // 添加方法
      this.systemFormVisible = true// 显示弹框
      this.systemFormTitle = '添加所属系统'
      this.systemForm.id = undefined
    },
    // 型号表单关闭重置
    systemFormClose() {
      this.$refs.systemForm.resetFields()
    },
    updateSystem(row) {
      if (row === undefined) {
        this.systemFormTitle = '编辑'
        if (this.multipleSelectionSystem.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.systemFormVisible = true
          this.systemForm.id = this.multipleSelectionSystem[0].id
          this.systemForm.parentId = this.multipleSelectionSystem[0].parentId
          this.systemForm.name = this.multipleSelectionSystem[0].name
        }
      } else {
        this.systemFormVisible = true
        this.systemForm.id = row.id
        this.systemForm.parentId = row.parentId
        this.systemForm.name = row.name
      }
    },
    // 表单提交
    submitSystem() {
      this.$refs.systemForm.validate(valid => {
        if (valid) {
          if (this.systemForm.id === undefined) {
            this.$axios.post('/api/Meta/System', this.systemForm).then(res => {
              this.getData()
              this.$message.success('添加成功')
              this.systemFormVisible = false
            })
          } else {
            this.$axios.put('/api/Meta/System/' + this.systemForm.id, this.systemForm).then(res => {
              this.getData()
              this.$message.success('修改成功')
              this.systemFormVisible = false
            })
          }
        }
      })
    },
    // 删除
    deleteSystem(row) {
      if (row === undefined) {
        if (this.multipleSelectionSystem.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.systemDeleteModelVisible = true
          this.systemDeleteDataId = this.multipleSelectionSystem[0].id
        }
      } else {
        this.systemDeleteModelVisible = true
        this.systemDeleteDataId = row.id
      }
    },
    // 提交删除
    submitDeletesystem() {
      this.$axios.delete('/api/Meta/System/' + this.systemDeleteDataId).then(res => {
        this.getData()
        this.$message.success('删除成功')
        this.systemDeleteModelVisible = false
      })
    },
    // 表单多选数据
    handleSelectionChangeSystem(val) {
      this.multipleSelectionSystem = val
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
