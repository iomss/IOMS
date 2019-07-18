<!-- 设备页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <div class="search">
              <el-input v-model="equipmentFormSearch.text" placeholder="全局查询" size="small" />
              <el-button type="primary" size="small" @click="getData()">查询</el-button>
              <el-button type="success" size="small" @click="adddata()">添加</el-button>
              <el-button type="warning" size="small" @click="updateEquipment()">修改</el-button>
              <el-button type="danger" size="small" @click="deleteequipment()">删除</el-button>
            </div>
          </div>
          <div class="content">
            <el-table :data="equipmentData" stripe border style="width: 100%" @selection-change="handleSelectionChangeEquipment">
              <el-table-column type="selection" width="40" />
              <el-table-column prop="id" label="序号" />
              <el-table-column prop="" label="设备类型">
                <template slot-scope="scope">
                  {{ scope.row.equimentType.name }}
                </template>
              </el-table-column>
              <el-table-column prop="name" label="设备名称" />
            </el-table>
            <pagination v-show="equipmentTotalCount>0" :total="equipmentTotalCount" :page.sync="equipmentFormSearch.pageNumber" :limit.sync="equipmentFormSearch.pageSize" @pagination="getequipmentPage" />

            <el-dialog :title="equipmentFormTitle" :visible.sync="equipmentFormVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="450px" @close="equipmentFormClose">
              <el-form ref="equipmentForm" :model="equipmentForm" :rules="equipmentFormRules" label-width="120px">
                <el-form-item label="设备类型" prop="equimentTypeId">
                  <el-select v-model="equipmentForm.equimentTypeId" filterable placeholder="请选择">
                    <el-option v-for="item in equipmentTypeData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="设备" prop="name">
                  <el-input v-model="equipmentForm.name" placeholder="设备" size="small" />
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="equipmentFormVisible=false">关闭</el-button>
                <el-button type="primary" @click="submitEquipment()">提交</el-button>
              </span>
            </el-dialog>

            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="equipmentDeleteModelVisible" width="220px">
              <span>您确定要删除此条数据？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="equipmentDeleteModelVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitDeleteequipment">确 定</el-button>
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
      equipmentData: [], // 数据
      equipmentTypeData: [], // 设备类型
      equipmentFormSearch: {
        text: '',
        pageSize: 20,
        pageNumber: 1
      },
      equipmentTotalCount: 0,
      equipmentFormTitle: '',
      equipmentFormVisible: false,
      equipmentForm: {
        id: undefined,
        equimentTypeId: undefined,
        name: ''
      },
      equipmentFormRules: {
        equimentTypeId: {
          required: true,
          message: '设备类型不可为空',
          trigger: 'change'
        },
        name: {
          required: true,
          message: '设备名称不可为空',
          trigger: 'blur'
        }
      },
      equipmentDeleteModelVisible: false,
      equipmentDeleteDataId: null,
      multipleSelectionEquipment: []
    }
  },
  computed: {},
  mounted() {
    this.getData()
  },
  methods: {
    // 获取数据
    getData() {
      this.$axios.get('/api/Meta/equipment', { params: this.equipmentFormSearch }).then(res => {
        this.equipmentData = res.data
        this.equipmentTotalCount = res.totalCount
      })
      this.$axios.get('/api/Meta/Type', { params: { pageSize: 9999, pageNumber: 1 }}).then(res => {
        this.equipmentTypeData = res.data
      })
    },
    // 分页
    getequipmentPage(val) {
      // 展示条数
      this.equipmentFormSearch.pageSize = val.limit
      // 页码
      this.equipmentFormSearch.pageNumber = val.page
      // 调用获取数据
      this.getData()
    },
    // 添加
    adddata() {
      this.equipmentFormVisible = true// 显示弹框
      this.equipmentFormTitle = '添加设备'
      this.equipmentForm.id = undefined
      this.equipmentForm.name = ''
      this.equipmentForm.equimentTypeId = undefined
    },

    updateEquipment(row) {
      if (row === undefined) {
        this.equipmentFormTitle = '编辑设备'
        if (this.multipleSelectionEquipment.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.equipmentFormVisible = true
          this.equipmentForm.id = this.multipleSelectionEquipment[0].id
          this.equipmentForm.name = this.multipleSelectionEquipment[0].name
          this.equipmentForm.equimentTypeId = this.multipleSelectionEquipment[0].equimentType.id
        }
      } else {
        this.equipmentFormVisible = true
        this.equipmentForm.id = row.id
        this.equipmentForm.name = row.name
        this.equipmentForm.equimentTypeId = row.equimentType.id
      }
    },
    // 品牌表单提交
    submitEquipment() {
      this.$refs.equipmentForm.validate(valid => {
        if (valid) {
          if (this.equipmentForm.id === undefined) {
            this.$axios.post('/api/Meta/Equipment', this.equipmentForm).then(res => {
              this.getData()
              this.$message.success('设备添加成功')
              this.equipmentFormVisible = false
            })
          } else {
            this.$axios.put('/api/Meta/Equipment/' + this.equipmentForm.id, this.equipmentForm).then(res => {
              this.getData()
              this.$message.success('设备修改成功')
              this.equipmentFormVisible = false
            })
          }
        }
      })
    },
    // 品牌表单关闭重置
    equipmentFormClose() {
      this.$refs.equipmentForm.resetFields()
    },
    // 删除品牌
    deleteequipment(row) {
      if (row === undefined) {
        if (this.multipleSelectionEquipment.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.equipmentDeleteModelVisible = true
          this.equipmentDeleteDataId = this.multipleSelectionEquipment[0].id
        }
      } else {
        this.equipmentDeleteModelVisible = true
        this.equipmentDeleteDataId = row.id
      }
    },
    // 提交删除品牌
    submitDeleteequipment() {
      this.$axios.delete('/api/Meta/equipment/' + this.equipmentDeleteDataId).then(res => {
        this.getData()
        this.$message.success('设备删除成功')
        this.equipmentDeleteModelVisible = false
      })
    },
    // 品牌表单多选数据
    handleSelectionChangeEquipment(val) {
      this.multipleSelectionEquipment = val
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
