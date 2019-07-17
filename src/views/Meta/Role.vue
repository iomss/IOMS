<!-----角色信息-------->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <div class="search">
              <el-input v-model="RoleFormSearch.text" placeholder="全局查询" size="small" />
              <el-button type="primary" size="small" @click="getData()">查询</el-button>
              <el-button type="success" size="small" @click="adddata()">添加</el-button>
              <el-button type="warning" size="small" @click="updateRole()">修改</el-button>
              <el-button type="danger" size="small" @click="deleteRole()">删除</el-button>
              <el-select v-model="claim" multiple size="small" placeholder="选择权限">
                <el-option v-for="item in claimData" :key="item.value" :label="item.description" :value="item.value" />
              </el-select>
            </div>
          </div>
          <div class="content">
            <el-table :data="RoleData" stripe border style="width: 100%" @selection-change="handleSelectionChangeRole">
              <el-table-column type="selection" width="40" />
              <el-table-column prop="id" label="序号" />
              <el-table-column prop="name" label="角色名称" />
              <el-table-column label="拥有权限">
                <template slot-scope="scope">
                  <span v-for="item in scope.row.claims" :key="item.value">{{ item.description }}、</span>
                </template>
              </el-table-column>
            </el-table>
            <pagination v-show="RoleTotalCount>0" :total="RoleTotalCount" :page.sync="RoleFormSearch.pageNumber" :limit.sync="RoleFormSearch.pageSize" @pagination="getRolePage" />

            <el-dialog :title="RoleFormTitle" :visible.sync="RoleFormVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="450px" @close="RoleFormClose">
              <el-form ref="RoleForm" :model="RoleForm" :rules="RoleFormRules" label-width="120px">
                <el-form-item label="角色" prop="name">
                  <el-input v-model="RoleForm.name" placeholder="角色" size="small" />
                </el-form-item>
                <el-form-item label="权限" prop="claim">
                  <el-select v-model="RoleForm.claims" multiple size="small" placeholder="选择权限">
                    <el-option v-for="item in claimData" :key="item.value" :label="item.description" :value="item.key" />
                  </el-select>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="RoleFormVisible=false">关闭</el-button>
                <el-button type="primary" @click="submitRole()">提交</el-button>
              </span>
            </el-dialog>

            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="RoleDeleteModelVisible" width="220px">
              <span>您确定要删除此条数据？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="RoleDeleteModelVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitDeleteRole">确 定</el-button>
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
      RoleData: [], // 数据
      claimData: [], // 权限
      claim: [],
      RoleFormSearch: {
        text: '',
        pageSize: 20,
        pageNumber: 1
      },
      RoleTotalCount: 0,
      RoleFormTitle: '',
      RoleFormVisible: false,
      RoleForm: {
        id: undefined,
        claims: [],
        name: ''
      },
      RoleFormRules: {
        name: {
          required: true,
          message: '角色名称不可为空',
          trigger: 'blur'
        },
        claims: {
          required: true,
          message: '权限不可为空',
          trigger: 'blur'
        }
      },
      RoleDeleteModelVisible: false,
      RoleDeleteDataId: null,
      multipleSelectionRole: []
    }
  },
  computed: {},
  mounted() {
    this.getData()
  },
  methods: {
    // 获取数据
    getData() {
      this.$axios.get('/api/Meta/Role', { params: this.RoleFormSearch }).then(res => {
        this.RoleData = res.data
        this.RoleTotalCount = res.totalCount
      })
      this.$axios.get('/api/Meta/Claims').then(res => {
        this.claimData = res
      })
    },
    // 分页
    getRolePage(val) {
      // 展示条数
      this.RoleFormSearch.pageSize = val.limit
      // 页码
      this.RoleFormSearch.pageNumber = val.page
      // 调用获取数据
      this.getData()
    },
    // 添加
    adddata() {
      this.RoleFormVisible = true// 显示弹框
      this.RoleFormTitle = '添加角色'
      this.RoleForm.id = undefined
      this.RoleForm.claims = []
    },
    // 表单关闭重置
    RoleFormClose() {
      this.$refs.RoleForm.resetFields()
    },
    updateRole(row) {
      if (row === undefined) {
        this.RoleFormTitle = '编辑'
        if (this.multipleSelectionRole.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.RoleFormVisible = true
          this.RoleForm.id = this.multipleSelectionRole[0].id
          this.RoleForm.name = this.multipleSelectionRole[0].name
          this.multipleSelectionRole[0].claims.forEach(item => this.RoleForm.claims.push(item.key))
        }
      } else {
        this.RoleFormVisible = true
        this.RoleForm.id = row.id
        this.RoleForm.name = row.name
        row.claims.forEach(item => this.RoleForm.claims.push(item.key))
      }
    },
    // 表单提交
    submitRole() {
      this.$refs.RoleForm.validate(valid => {
        if (valid) {
          if (this.RoleForm.id === undefined) {
            this.$axios.post('/api/Meta/Role', this.RoleForm).then(res => {
              this.getData()
              this.$message.success('添加成功')
              this.RoleFormVisible = false
            })
          } else {
            this.$axios.put('/api/Meta/Role/' + this.RoleForm.id, this.RoleForm).then(res => {
              this.getData()
              this.$message.success('修改成功')
              this.RoleFormVisible = false
            })
          }
        }
      })
    },
    // 删除
    deleteRole(row) {
      if (row === undefined) {
        if (this.multipleSelectionRole.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.RoleDeleteModelVisible = true
          this.RoleDeleteDataId = this.multipleSelectionRole[0].id
        }
      } else {
        this.RoleDeleteModelVisible = true
        this.RoleDeleteDataId = row.id
      }
    },
    // 提交删除
    submitDeleteRole() {
      this.$axios.delete('/api/Meta/Role/' + this.RoleDeleteDataId).then(res => {
        this.getData()
        this.$message.success('删除成功')
        this.RoleDeleteModelVisible = false
      })
    },
    // 表单多选数据
    handleSelectionChangeRole(val) {
      this.multipleSelectionRole = val
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

