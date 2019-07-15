<!-- 用户管理页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <h4>用户管理</h4>
            <div class="select">
              <el-button type="primary" size="small" @click="addUser()">添加</el-button>
              <el-button type="primary" size="small" @click="updataUser()">编辑</el-button>
              <el-button type="primary" size="small" @click="deleteUser()">删除</el-button>
            </div>
            <div class="toolsrt">
              <!-- <el-form ref="form" :model="formSearch" label-width="90px">
                <el-form-item prop="所属单位">
                  <el-select v-model="formSearch.unit" clearable placeholder="所属单位" size="small">
                    <el-option key="1" label="单选" value="1" />
                    <el-option key="2" label="多选" value="2" />
                  </el-select>
                </el-form-item>
                <el-form-item prop="角色">
                  <el-select v-model="formSearch.unit" clearable placeholder="角色" size="small">
                    <el-option key="1" label="单选" value="1" />
                    <el-option key="2" label="多选" value="2" />
                  </el-select>
                </el-form-item>
                <el-form-item prop="检索姓名或用户">
                  <el-input v-model="formSearch.name" placeholder="检索姓名或用户" size="small" />
                </el-form-item>
              </el-form> -->
              <el-input v-model="tableDataSearch.text" placeholder="全局查询" size="small" />
              <el-button type="primary" size="small" @click="getData()">查询</el-button>
            </div>
          </div>
          <!--表格-->
          <div class="content">
            <el-table :data="tableData" stripe border style="width: 100%" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="40" />
              <el-table-column prop="id" label="序号" width="60" />
              <el-table-column prop="userName" label="用户名" width="100" />
              <el-table-column prop="units[0].name" label="单位" width="100" />
              <el-table-column prop="roles[0].name" label="角色" width="120" />
              <el-table-column prop="contactNumber" label="联系电话" width="150" />
              <el-table-column prop="lastLoginTime" label="最后登录时间" width="150" />
              <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                  <el-button style="display:block;margin-left:0;margin-bottom:5px;" size="mini" type="primary" @click="UpdateStage(scope.row)">重置密码</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!--分页-->
            <pagination v-show="totalCount>0" :total="totalCount" :page.sync="tableDataSearch.pageSize" :limit.sync="tableDataSearch.pageNumber" @pagination="getPage" />
            <!-- 添加或编辑 -->
            <el-dialog ref="form" :title="title" :visible.sync="showInfo" :close-on-click-modal="true" :close-on-press-escape="false" width="400px" @close="FormClose">
              <el-form ref="formSearch" :model="formSearch" label-width="90px" :rules="formSearchrules">
                <el-form-item prop="userName" label="用户名">
                  <el-input v-model="formSearch.userName" placeholder="用户名" size="small" />
                </el-form-item>
                <el-form-item prop="units" label="单位">
                  <el-select v-model="formSearch.units" multiple placeholder="单位" size="small">
                    <el-option v-for="item in unitData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item prop="roles" label="角色">
                  <el-select v-model="formSearch.roles" multiple placeholder="角色" size="small">
                    <el-option v-for="item in roleData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item prop="contactNumber" label="联系电话">
                  <el-input v-model="formSearch.contactNumber" placeholder="联系电话" size="small" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="saveData()">确 定</el-button>
                </el-form-item>
              </el-form>
            </el-dialog>
            <!--删除-->
            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="true" :visible.sync="removeQuestionVisible" width="220px">
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
import pagination from '@/components/Pagination'
export default {
  components: {
    pagination
  },
  data() {
    return {
      title: '添加',
      showInfo: false, // 添加弹框隐藏
      removeQuestionVisible: false, // 删除弹框隐藏
      tableData: [], // 表格数据
      multipleSelection: '', // 表单选中行
      removeData: null, // 当前表单所选删除行
      tableDataSearch: {
        text: '', // 搜索文本
        pageSize: 20, // 展示条数
        pageNumber: 1// 页码
      },
      totalCount: 0, // 数据总条数
      formSearch: {
        userName: '',
        units: [],
        roles: [],
        contactNumber: ''
      },
      unitData: [], // 单位数据
      roleData: [], // 角色数据
      formSearchrules: {// 表单验证规则
        userName: [
          { required: true, message: '用户名不可为空', trigger: 'bulr' }
        ],
        units: [
          { required: true, message: '单位不可为空', trigger: 'change' }
        ],
        roles: [
          { required: true, message: '角色不可为空', trigger: 'change' }
        ],
        contactNumber: [
          { required: true, message: '联系电话不可为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  mounted() {
    this.getData()
    this.getselectData()
  },
  methods: {
    getData() { // 获取数据
      console.log(this.tableDataSearch.text)
      // 搜索框内容不为空 页码跳转至第一页
      if (this.tableDataSearch.text !== '') {
        this.tableDataSearch.pageNumber = 1
      }
      this.$axios.get('/api/User', { params: this.tableDataSearch }).then(res => {
        this.tableData = res.data
        this.totalCount = res.totalCount
      })
    },
    getselectData() { // 获取添加编辑下拉菜单数据
      // 获取单位信息
      this.$axios.get('/api/Meta/Unit').then(res => {
        this.unitData = res.data
      })
      // 获取角色信息
      this.$axios.get('/api/Meta/Role').then(res => {
        this.roleData = res.data
      })
    },
    addUser() { // 新增资产
      // 打开添加弹框
      this.showInfo = true
      this.title = '添加'
    },
    FormClose() {
      this.$refs.formSearch.resetFields()
    },
    handleSelectionChange(val) { // 表格选中行
      this.multipleSelection = val
    },
    updataUser(row) { // 点击编辑按钮
      if (this.multipleSelection.length !== 1) {
        this.$message.error('请选择一项数据进行操作')
      } else {
        this.title = '编辑'
        this.showInfo = true
        this.$axios.get('/api/User/' + this.multipleSelection[0].id).then(res => {
          this.formSearch = res
          console.log(res)
          const unit = []
          const role = []
          res.units.forEach(item => { unit.push(item.id) })
          res.roles.forEach(item => { role.push(item.id) })
          this.formSearch.units = unit
          this.formSearch.roles = role
        })
      }
    },
    saveData() { // 添加或编辑弹框中点确定
      this.$refs.formSearch.validate(valid => {
        if (valid) {
          if (this.title === '添加') {
            this.$axios.post('/api/User', this.formSearch).then(res => {
              this.$message.success('添加成功')
              this.showInfo = false
              this.getData()
            })
          }
          if (this.title === '编辑') {
            this.$axios.put('/api/User/' + this.multipleSelection[0].id, this.formSearch).then(res => {
              this.$message.success('编辑成功')
              this.showInfo = false
              this.getData()
            })
          }
        }
      })
    },
    deleteUser(row) { // 点击删除按钮
      if (this.multipleSelection === '') {
        this.$message.error('请选择一条数据')
      } else {
        this.removeData = row
        this.removeQuestionVisible = true
      }
    },
    // 删除
    removeQuestion() {
      const _this = this
      this.$axios.delete('/api/User/' + this.multipleSelection[0].id).then(response => {
        _this.$message.success('删除成功')
        _this.removeQuestionVisible = false
        this.getData()
      })
    },
    getPage(val) { // page事件
      // 展示条数
      this.tableDataSearch.pageSize = val.limit
      // 页码
      this.tableDataSearch.pageNumber = val.page
      // 调用获取数据
      this.getData()
    }
  }
}
</script>
<style lang='scss' scoped>
.header {
  width: 100%;
}
.toolsrt {
  width: 100%;
  display: inline-block;
  margin: 10px 0px;
}
.el-form-item__content {
  width: 300px;
}
.el-input {
  display: inline-block;
  width: 200px;
}
</style>
