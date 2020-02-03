<!-- 用户页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <div class="search">
              <el-input v-model="UserFormSearch.text" placeholder="全局查询" userze="small" />
              <el-button size="small" type="primary" userze="small" @click="getData()">查询</el-button>
              <el-button size="small" type="success" userze="small" @click="adddata()">添加</el-button>
              <el-button size="small" type="warning" userze="small" @click="updateUser()">修改</el-button>
              <el-button size="small" type="success" userze="small" @click="enableUser()">启用</el-button>
              <el-button size="small" type="danger" userze="small" @click="disableUser()">停用</el-button>
              <el-button size="small" type="danger" userze="small" @click="resetPassword()">重置密码</el-button>

              <!-- <el-button type="danger" userze="small" @click="deleteUser()">删除</el-button> -->
            </div>
          </div>
          <div class="content">
            <el-table :data="UserData" stripe border style="width: 100%" @selection-change="handleSelectionChangeUser">
              <el-table-column type="selection" width="40" />
              <el-table-column type="index" label="序号" width="60" />
              <el-table-column prop="disabled" label="状态" width="60">
                <template slot-scope="scope">
                  {{ scope.row.disabled?'停用':'启用' }}
                </template>
              </el-table-column>
              <el-table-column prop="trueName" label="用户名称" />
              <el-table-column prop="userName" label="登录账号" />
              <el-table-column prop="units" label="单位">
                <template slot-scope="scope">
                  <span v-for="item in scope.row.units" :key="item.id" style="margin-right:10px;">{{ item.name }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="roles" label="角色">
                <template slot-scope="scope">
                  <span v-for="item in scope.row.roles" :key="item.id" style="margin-right:10px;">{{ item.name }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="contactNumber" label="联系电话" />
              <el-table-column prop="commpany.name" label="公司" />
              <el-table-column prop="lastLoginTime" label="最后登录时间" :formatter="formatterDate" />
            </el-table>
            <pagination v-show="UserTotalCount>0" :total="UserTotalCount" :page.sync="UserFormSearch.pageNumber" :limit.sync="UserFormSearch.pageUserze" @pagination="getUserPage" />

            <el-dialog :title="UserFormTitle" :visible.sync="UserFormVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="450px" @close="UserFormClose">
              <el-form ref="UserForm" :model="UserForm" :rules="UserFormRules" label-width="120px">

                <el-form-item label="用户名称" prop="trueName">
                  <el-input v-model="UserForm.trueName" placeholder="用户名称" userze="small" />
                </el-form-item>
                <el-form-item label="登录账号" prop="userName">
                  <el-input v-model="UserForm.userName" placeholder="登录账号" userze="small" />
                </el-form-item>

                <el-form-item prop="units" label="单位">
                  <el-select v-model="UserForm.units" filterable remote multiple :remote-method="remoteMethodUnits" :loading="loading" placeholder="单位" size="small" @focus="remoteMethodUnits">
                    <el-option v-for="item in unitData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item prop="roles" label="角色">
                  <el-select v-model="UserForm.roles" filterable remote multiple :remote-method="remoteMethodRoles" :loading="loading" placeholder="角色" size="small" @focus="remoteMethodRoles">
                    <el-option v-for="item in roleData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item prop="contactNumber" label="联系电话">
                  <el-input v-model="UserForm.contactNumber" placeholder="联系电话" size="small" />
                </el-form-item>
                <el-form-item prop="commpanyId" label="公司">
                  <el-select v-model="UserForm.commpanyId" filterable remote :remote-method="remoteMethodCommpanyId" :loading="loading" placeholder="公司" size="small" @focus="remoteMethodCommpanyId">
                    <el-option v-for="item in SIData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="" @click="UserFormVisible=false">关闭</el-button>
                <el-button type="primary" @click="submitUser()">确定</el-button>
              </span>
            </el-dialog>

            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="DisableUserVisibale" width="220px">
              <span>您确定要停用此用户？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="DisableUserVisibale = false">取 消</el-button>
                <el-button type="primary" @click="submitDisableUser">确 定</el-button>
              </span>
            </el-dialog>
            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="EnableUserVisibale" width="220px">
              <span>您确定要启用此用户？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="EnableUserVisibale = false">取 消</el-button>
                <el-button type="primary" @click="submitEnableUser">确 定</el-button>
              </span>
            </el-dialog>
            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="UserDeleteModelVisible" width="220px">
              <span>您确定要删除此条数据？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="UserDeleteModelVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitDeleteUser">确 定</el-button>
              </span>
            </el-dialog>
            <el-dialog ref="resetPassword" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="resetPasswordVisible" width="220px">
              <span>您确定要重置此用户密码？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="resetPasswordVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitResetPassword">确 定</el-button>
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
  name: 'Userlist',
  components: {
    pagination
  },
  data() {
    return {
      UserData: [], // 数据
      unitData: [], // 单位数据
      roleData: [], // 角色数据
      SIData: [], // 公司数据
      UserFormSearch: {
        text: '',
        pageSize: 20,
        pageNumber: 1
      },
      UserTotalCount: 0, // 总条数
      UserFormTitle: '添加用户', // 表单表头
      UserFormVisible: false,
      UserForm: {
        id: undefined,
        trueName: '',
        userName: '',
        units: [],
        roles: [],
        contactNumber: '',
        commpanyId: null
      },
      UserFormRules: {
        trueName: {
          required: true,
          message: '用户名称不可为空',
          trigger: 'blur'
        },
        userName: {
          required: true,
          message: '登录账号不可为空',
          trigger: 'blur'
        },
        units: [
          { required: true, message: '用户单位不可为空', trigger: 'change' }
        ],
        roles: {
          required: true,
          message: '用户角色不可为空',
          trigger: 'change'
        },
        contactNumber: {
          required: true,
          message: '联系方式不可为空',
          trigger: 'blur'
        }
      },
      UserDeleteModelVisible: false,
      UserDeleteDataId: null,
      multipleSelectionUser: [],
      loading: false,
      EnableUserVisibale: false,
      DisableUserVisibale: false,
      userSelectId: null,
      resetPasswordVisible: false
    }
  },
  computed: {},
  mounted() {
    this.getData()
  },
  methods: {
    // 日期时间格式化
    formatterDate(row, column, cellValue) {
      if (cellValue !== null) {
        return this.$moment(cellValue).format('YYYY-MM-DD HH:mm')
      } else {
        return cellValue
      }
    },
    // 获取数据
    getData() {
      this.$axios.get('/api/User', { params: this.UserFormSearch }).then(res => {
        this.UserData = res.data
        this.UserTotalCount = res.totalCount
      })
      // 获取单位信息
      this.$axios.get('/api/Meta/Unit').then(res => {
        this.unitData = res.data
      })
      // 获取角色信息
      this.$axios.get('/api/Meta/Role').then(res => {
        this.roleData = res.data
      })
      // 获取公司数据
      this.$axios.get('/api/Meta/SI').then(res => {
        this.SIData = res.data
      })
    },
    // 分页
    getUserPage(val) {
      // 展示条数
      this.UserFormSearch.pageUserze = val.limit
      // 页码
      this.UserFormSearch.pageNumber = val.page
      // 调用获取数据
      this.getData()
    },
    // 表单关闭重置
    UserFormClose() {
      this.$refs.UserForm.resetFields()
    },
    // 添加
    adddata() {
      this.UserFormVisible = true// 显示弹框
      this.UserFormTitle = '添加用户'
      this.UserForm.id = undefined
      this.UserForm.userName = ''
      this.UserForm.password = ''
      this.UserForm.units = []
      this.UserForm.roles = []
      this.UserForm.contactNumber = ''
    },
    updateUser(row) {
      const unitVal = []
      const rolesVal = []
      if (row === undefined) {
        this.UserFormTitle = '编辑'
        if (this.multipleSelectionUser.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.UserFormVisible = true
          this.UserForm.id = this.multipleSelectionUser[0].id
          this.UserForm.userName = this.multipleSelectionUser[0].userName
          this.UserForm.trueName = this.multipleSelectionUser[0].trueName
          this.UserForm.password = ''
          this.multipleSelectionUser[0].units.forEach(item => unitVal.push(item.id))
          this.UserForm.units = unitVal
          this.multipleSelectionUser[0].roles.forEach(item => rolesVal.push(item.id))
          this.UserForm.roles = rolesVal
          this.UserForm.contactNumber = this.multipleSelectionUser[0].contactNumber
          this.UserForm.commpanyId = this.multipleSelectionUser[0].commpanyId
        }
      } else {
        this.UserFormVisible = true
        this.UserForm.id = row.id
        this.UserForm.name = row.userName
        this.UserForm.trueName = row.trueName
        this.UserForm.password = row.password
        row.units.forEach(item => unitVal.push(item.id))
        this.UserForm.units = row.units
        row.roles.forEach(item => rolesVal.push(item.id))
        this.UserForm.roles = rolesVal
        this.UserForm.contactNumber = row.contactNumber
        this.UserForm.commpanyId = row.commpanyId
      }
    },
    // 表单提交
    submitUser() {
      this.$refs.UserForm.validate(valid => {
        if (valid) {
          if (this.UserForm.id === undefined) {
            this.$axios.post('/api/User', this.UserForm).then(res => {
              this.getData()
              this.$message.success('添加成功')
              this.UserFormVisible = false
            })
          } else {
            this.$axios.put('/api/User/' + this.UserForm.id, this.UserForm).then(res => {
              this.getData()
              this.$message.success('修改成功')
              this.UserFormVisible = false
            })
          }
        }
      })
    },
    // 删除
    deleteUser(row) {
      if (row === undefined) {
        if (this.multipleSelectionUser.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.UserDeleteModelVisible = true
          this.UserDeleteDataId = this.multipleSelectionUser[0].id
        }
      } else {
        this.UserDeleteModelVisible = true
        this.UserDeleteDataId = row.id
      }
    },
    // 提交删除
    submitDeleteUser() {
      this.$axios.delete('/api/User/' + this.UserDeleteDataId).then(res => {
        this.getData()
        this.$message.success('删除成功')
        this.UserDeleteModelVisible = false
      })
    },
    // 表单多选数据
    handleSelectionChangeUser(val) {
      this.multipleSelectionUser = val
    },
    remoteMethodUnits(query) {
      this.loading = true
      let querytext = ''
      querytext = typeof (query) === 'string' ? query : ''
      this.$axios.get('/api/Meta/Unit?text=' + querytext).then(res => {
        this.loading = false
        this.unitData = res.data
      })
    },
    remoteMethodRoles(query) {
      this.loading = true
      let querytext = ''
      querytext = typeof (query) === 'string' ? query : ''
      this.$axios.get('/api/Meta/Role?text=' + querytext).then(res => {
        this.loading = false
        this.roleData = res.data
      })
    },
    remoteMethodCommpanyId(query) {
      this.loading = true
      let querytext = ''
      querytext = typeof (query) === 'string' ? query : ''
      this.$axios.get('/api/Meta/SI?text=' + querytext).then(res => {
        this.loading = false
        this.SIData = res.data
      })
    },
    // 启用
    enableUser(row) {
      if (row === undefined) {
        if (this.multipleSelectionUser.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.EnableUserVisibale = true
          this.userSelectId = this.multipleSelectionUser[0].id
        }
      } else {
        this.EnableUserVisibale = true
        this.userSelectId = row.id
      }
    },
    // 启用用户
    submitEnableUser() {
      this.$axios.post('/api/User/' + this.userSelectId + '/Enable').then(res => {
        this.getData()
        this.$message.success('用户启用成功')
        this.EnableUserVisibale = false
      })
    },
    // 停用
    disableUser(row) {
      if (row === undefined) {
        if (this.multipleSelectionUser.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.DisableUserVisibale = true
          this.userSelectId = this.multipleSelectionUser[0].id
        }
      } else {
        this.DisableUserVisibale = true
        this.userSelectId = row.id
      }
    },
    // 停用用户
    submitDisableUser() {
      this.$axios.post('/api/User/' + this.userSelectId + '/Disable').then(res => {
        this.getData()
        this.$message.success('用户停用成功')
        this.DisableUserVisibale = false
      })
    },
    // 重置密码
    resetPassword(row) {
      if (row === undefined) {
        if (this.multipleSelectionUser.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.resetPasswordVisible = true
          this.userSelectId = this.multipleSelectionUser[0].id
        }
      } else {
        this.resetPasswordVisible = true
        this.userSelectId = row.id
      }
    },
    // 提交重置密码
    submitResetPassword() {
      this.$axios.post('/api/User/' + this.userSelectId + '/reset').then(res => {
        this.$message.success('用户密码重置成功')
        this.resetPasswordVisible = false
      })
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
