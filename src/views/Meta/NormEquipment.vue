<!-----定额名称-------->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <div class="search">
              <el-input v-model="NormEquipmentFormSearch.text" placeholder="全局查询" size="small" />
              <el-button type="primary" size="small" @click="getData()">查询</el-button>
              <!-- <el-button type="success" size="small" @click="adddata()">添加</el-button>
              <el-button type="warning" size="small" @click="updateNormEquipment()">修改</el-button>
              <el-button type="danger" size="small" @click="deleteNormEquipment()">删除</el-button> -->
            </div>
          </div>
          <div class="content">
            <el-table :data="NormEquipmentData" stripe border style="width: 100%" @selection-change="handleSelectionChangeNormEquipment">
              <el-table-column type="selection" width="40" />
              <el-table-column type="index" label="序号" />
              <el-table-column prop="name" label="名称" />
            </el-table>
            <pagination v-show="NormEquipmentTotalCount>0" :total="NormEquipmentTotalCount" :page.sync="NormEquipmentFormSearch.pageNumber" :limit.sync="NormEquipmentFormSearch.pageSize" @pagination="getNormEquipmentPage" />

            <!-- <el-dialog :title="NormEquipmentFormTitle" :visible.sync="NormEquipmentFormVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="450px" @close="NormEquipmentFormClose">
              <el-form ref="NormEquipmentForm" :model="NormEquipmentForm" :rules="NormEquipmentFormRules" label-width="120px">
                <el-form-item label="角色" prop="name">
                  <el-input v-model="NormEquipmentForm.name" placeholder="角色" size="small" />
                </el-form-item>
                <el-form-item label="权限" prop="claim">
                  <el-select v-model="NormEquipmentForm.claims" multiple size="small" placeholder="选择权限">
                    <el-option v-for="item in claimData" :key="item.value" :label="item.description" :value="item.key" />
                  </el-select>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="NormEquipmentFormVisible=false">关闭</el-button>
                <el-button type="primary" @click="submitNormEquipment()">提交</el-button>
              </span>
            </el-dialog>

            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="NormEquipmentDeleteModelVisible" width="220px">
              <span>您确定要删除此条数据？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="NormEquipmentDeleteModelVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitDeleteNormEquipment">确 定</el-button>
              </span>
            </el-dialog> -->

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
      NormEquipmentData: [], // 数据
      // claimData: [], // 权限
      NormEquipmentFormSearch: {
        text: '',
        pageSize: 20,
        pageNumber: 1
      },
      NormEquipmentTotalCount: 0
      // NormEquipmentFormTitle: '',
      // NormEquipmentFormVisible: false,
      // NormEquipmentForm: {
      //   id: undefined,
      //   claims: [],
      //   name: ''
      // },
      // NormEquipmentFormRules: {
      //   name: {
      //     required: true,
      //     message: '角色名称不可为空',
      //     trigger: 'blur'
      //   },
      //   claims: {
      //     required: true,
      //     message: '权限不可为空',
      //     trigger: 'blur'
      //   }
      // },
      // NormEquipmentDeleteModelVisible: false,
      // NormEquipmentDeleteDataId: null,
      // multipleSelectionNormEquipment: []
    }
  },
  computed: {},
  mounted() {
    this.getData()
  },
  methods: {
    // 获取数据
    getData() {
      this.$axios.get('/api/Meta/NormEquipment', { params: this.NormEquipmentFormSearch }).then(res => {
        this.NormEquipmentData = res.data
        this.NormEquipmentTotalCount = res.totalCount
      })
      this.$axios.get('/api/Meta/Claims').then(res => {
        this.claimData = res
      })
    },
    // 分页
    getNormEquipmentPage(val) {
      // 展示条数
      this.NormEquipmentFormSearch.pageSize = val.limit
      // 页码
      this.NormEquipmentFormSearch.pageNumber = val.page
      // 调用获取数据
      this.getData()
    },
    // // 添加
    // adddata() {
    //   this.NormEquipmentFormVisible = true// 显示弹框
    //   this.NormEquipmentFormTitle = '添加角色'
    //   this.NormEquipmentForm.id = undefined
    //   this.NormEquipmentForm.name = ''
    //   this.NormEquipmentForm.claims = []
    // },
    // // 表单关闭重置
    // NormEquipmentFormClose() {
    //   this.$refs.NormEquipmentForm.resetFields()
    // },
    // updateNormEquipment(row) {
    //   if (row === undefined) {
    //     this.NormEquipmentFormTitle = '编辑'
    //     if (this.multipleSelectionNormEquipment.length !== 1) {
    //       this.$message.error('请选择一项数据进行操作')
    //     } else {
    //       this.NormEquipmentFormVisible = true
    //       this.NormEquipmentForm.id = this.multipleSelectionNormEquipment[0].id
    //       this.NormEquipmentForm.name = this.multipleSelectionNormEquipment[0].name
    //       this.NormEquipmentForm.claims = []
    //       this.multipleSelectionNormEquipment[0].claims.forEach(item => this.NormEquipmentForm.claims.push(item.key))
    //     }
    //   } else {
    //     this.NormEquipmentFormVisible = true
    //     this.NormEquipmentForm.id = row.id
    //     this.NormEquipmentForm.name = row.name
    //     this.NormEquipmentForm.claims = []
    //     row.claims.forEach(item => this.NormEquipmentForm.claims.push(item.key))
    //   }
    // },
    // // 表单提交
    // submitNormEquipment() {
    //   this.$refs.NormEquipmentForm.validate(valid => {
    //     if (valid) {
    //       if (this.NormEquipmentForm.id === undefined) {
    //         this.$axios.post('/api/Meta/NormEquipment', this.NormEquipmentForm).then(res => {
    //           this.getData()
    //           this.$message.success('添加成功')
    //           this.NormEquipmentFormVisible = false
    //         })
    //       } else {
    //         this.$axios.put('/api/Meta/NormEquipment/' + this.NormEquipmentForm.id, this.NormEquipmentForm).then(res => {
    //           this.getData()
    //           this.$message.success('修改成功')
    //           this.NormEquipmentFormVisible = false
    //         })
    //       }
    //     }
    //   })
    // },
    // // 删除
    // deleteNormEquipment(row) {
    //   if (row === undefined) {
    //     if (this.multipleSelectionNormEquipment.length !== 1) {
    //       this.$message.error('请选择一项数据进行操作')
    //     } else {
    //       this.NormEquipmentDeleteModelVisible = true
    //       this.NormEquipmentDeleteDataId = this.multipleSelectionNormEquipment[0].id
    //     }
    //   } else {
    //     this.NormEquipmentDeleteModelVisible = true
    //     this.NormEquipmentDeleteDataId = row.id
    //   }
    // },
    // // 提交删除
    // submitDeleteNormEquipment() {
    //   this.$axios.delete('/api/Meta/NormEquipment/' + this.NormEquipmentDeleteDataId).then(res => {
    //     this.getData()
    //     this.$message.success('删除成功')
    //     this.NormEquipmentDeleteModelVisible = false
    //   })
    // },
    // 表单多选数据
    handleSelectionChangeNormEquipment(val) {
      this.multipleSelectionNormEquipment = val
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

