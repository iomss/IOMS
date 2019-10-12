<!-- 资产自定义属性页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <div class="search">
              <el-button type="success" size="small" @click="adddata()">添加</el-button>
              <el-button type="warning" size="small" @click="updateAssetField()">修改</el-button>
              <el-button type="danger" size="small" @click="deleteAssetField()">删除</el-button>
            </div>
          </div>
          <div class="content">
            <el-table :data="AssetFieldData" stripe border style="width: 100%" @selection-change="handleSelectionChangeAssetField">
              <el-table-column type="selection" width="40" />
              <el-table-column type="index" label="序号" width="60" />
              <el-table-column prop="name" label="名称" />
              <el-table-column prop="displayName" label="显示名称" />
            </el-table>
            <pagination v-show="AssetFieldTotalCount>0" :total="AssetFieldTotalCount" :page.sync="AssetFieldFormSearce.pageNumber" :limit.sync="AssetFieldFormSearce.pageSize" @pagination="getAssetFieldPage" />

            <el-dialog :title="AssetFieldFormTitle" :visible.sync="AssetFieldFormVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="450px" @close="AssetFieldFormClose">
              <el-form ref="AssetFieldForm" :model="AssetFieldForm" :rules="AssetFieldFormRules" label-width="120px">
                <el-form-item label="名称" prop="name">
                  <el-input v-model="AssetFieldForm.name" :disabled="AssetFieldFormTitle==='编辑资产自定义属性'" placeholder="名称" size="small" />
                </el-form-item>
                <el-form-item label="显示名称" prop="displayName">
                  <el-input v-model="AssetFieldForm.displayName" placeholder="显示名称" size="small" />
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="AssetFieldFormVisible=false">关闭</el-button>
                <el-button type="primary" @click="submitAssetField()">提交</el-button>
              </span>
            </el-dialog>

            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="AssetFieldDeleteModelVisible" width="220px">
              <span>您确定要删除此条数据？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="AssetFieldDeleteModelVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitDeleteAssetField">确 定</el-button>
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
      AssetFieldData: [], // 数据
      AssetFieldFormSearce: {
        text: '',
        pageSize: 20,
        pageNumber: 1
      },
      AssetFieldTotalCount: 0, // 总条数
      AssetFieldFormTitle: '添加资产自定义属性', // 表单表头
      AssetFieldFormVisible: false,
      AssetFieldForm: {
        id: undefined,
        name: '',
        displayName: ''
      },
      AssetFieldFormRules: {
        name: {
          required: true,
          message: '名称不可为空',
          trigger: 'blur'
        },
        displayName: {
          required: true,
          message: '显示名称不可为空',
          trigger: 'blur'
        }
      },
      AssetFieldDeleteModelVisible: false,
      AssetFieldDeleteDataId: null,
      multipleSelectionpAssetField: []

    }
  },
  computed: {},
  mounted() {
    this.getData()
  },
  methods: {
    // 获取数据
    getData() {
      this.$axios.get('/api/AssetField', { params: this.AssetFieldFormSearce }).then(res => {
        this.AssetFieldData = res.data
        this.AssetFieldTotalCount = res.totalCount
      })
    },
    // 分页
    getAssetFieldPage(val) {
      // 展示条数
      this.AssetFieldFormSearce.pageSize = val.limit
      // 页码
      this.AssetFieldFormSearce.pageNumber = val.page
      // 调用获取数据
      this.getData()
    },
    // 表单关闭重置
    AssetFieldFormClose() {
      this.$refs.AssetFieldForm.resetFields()
    },
    // 添加
    adddata() {
      this.AssetFieldFormVisible = true// 显示弹框
      this.AssetFieldFormTitle = '添加资产自定义属性'
      this.AssetFieldForm.id = undefined
      this.AssetFieldForm.name = ''
    },
    updateAssetField(row) {
      if (row === undefined) {
        this.AssetFieldFormTitle = '编辑资产自定义属性'
        if (this.multipleSelectionAssetField.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.AssetFieldFormVisible = true
          this.AssetFieldForm.id = this.multipleSelectionAssetField[0].id
          this.AssetFieldForm.name = this.multipleSelectionAssetField[0].name
          this.AssetFieldForm.displayName = this.multipleSelectionAssetField[0].displayName
        }
      } else {
        this.AssetFieldFormVisible = true
        this.AssetFieldForm.id = row.id
        this.AssetFieldForm.name = row.name
        this.AssetFieldForm.displayName = row.displayName
      }
    },
    // 表单提交
    submitAssetField() {
      this.$refs.AssetFieldForm.validate(valid => {
        if (valid) {
          if (this.AssetFieldForm.id === undefined) {
            this.$axios.post('/api/AssetField', this.AssetFieldForm).then(res => {
              this.getData()
              this.$message.success('添加成功')
              this.AssetFieldFormVisible = false
            })
          } else {
            this.$axios.put('/api/AssetField/' + this.AssetFieldForm.id, this.AssetFieldForm).then(res => {
              this.getData()
              this.$message.success('修改成功')
              this.AssetFieldFormVisible = false
            })
          }
        }
      })
    },
    // 删除
    deleteAssetField(row) {
      this.$message.warning('此删除功能尚未开放')
      // if (row === undefined) {
      //   if (this.multipleSelectionAssetField.length !== 1) {
      //     this.$message.error('请选择一项数据进行操作')
      //   } else {
      //     this.AssetFieldDeleteModelVisible = true
      //     this.AssetFieldDeleteDataId = this.multipleSelectionAssetField[0].id
      //   }
      // } else {
      //   this.AssetFieldDeleteModelVisible = true
      //   this.AssetFieldDeleteDataId = row.id
      // }
    },
    // 提交删除
    submitDeleteAssetField() {
      this.$axios.delete('/api/AssetField/' + this.AssetFieldDeleteDataId).then(res => {
        this.getData()
        this.$message.success('删除成功')
        this.AssetFieldDeleteModelVisible = false
      })
    },
    // 表单多选数据
    handleSelectionChangeAssetField(val) {
      this.multipleSelectionAssetField = val
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
