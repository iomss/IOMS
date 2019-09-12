<!-- 合同测算-预算（合同版）页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <div class="toolsrt">
              <el-form ref="form" :model="formSearch" label-width="60px">
                <el-form-item label="版本号" prop="name">
                  <el-input v-model="formSearch.name" placeholder="版本号" size="small" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" plain size="small" @click="getData()">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="content">
            <el-table :data="tableData" stripe border style="width: 100%">
              <el-table-column prop="" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="update(scope.row)">编辑</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="catalog" label="定额编目" />
              <el-table-column prop="normEquipment.name" label="软件类别" />
              <el-table-column prop="workName" label="工作名称" />
              <el-table-column prop="normEquipmentLevel.name" label="维护级别" />
              <el-table-column prop="levelCount" label="维护频次" />
              <el-table-column prop="levelPrice" label="维护单价" />
              <el-table-column prop="count" label="数量" />
              <el-table-column prop="remark" label="维护总价">
                <template slot-scope="scope">
                  {{ scope.row.levelCount*scope.row.levelPrice*scope.row.count }}
                </template>
              </el-table-column>
            </el-table>

            <!--分页-->
            <pagination v-show="totalCount>0" :total="totalCount" :page.sync="formSearch.pageNumber" :limit.sync="formSearch.pageSize" @pagination="getPage" />
            <!--编辑-->
            <el-dialog title="编辑" :close-on-press-escape=" false" :close-on-click-modal="false" :visible.sync="updateVisible" width="550px">
              <el-form ref="updateForm" :model="updateForm" :rules="updateFormRules" label-width="80px">
                <el-form-item label="定额编目">
                  {{ rowData.catalog }}
                </el-form-item>
                <el-form-item label="类别">
                  {{ rowData.normEquipment?rowData.normEquipment.name:'' }}
                </el-form-item>
                <el-form-item label="工作名称">
                  {{ rowData.workName }}
                </el-form-item>
                <el-form-item label="维护级别">
                  {{ rowData.normEquipmentLevel?rowData.normEquipmentLevel.name:'' }}
                </el-form-item>
                <el-form-item label="维修频次" prop="levels[0].levelCount">
                  <el-input v-model="updateForm.levels[0].levelCount" size="small" />
                </el-form-item>
                <el-form-item label="维护单价">
                  {{ rowData.levelPrice }}
                </el-form-item>
                <el-form-item label="数量" prop="count">
                  <el-input v-model="updateForm.count" size="small" />
                </el-form-item>
                <el-form-item label="维护总价">
                  {{ updateForm.levels[0].levelCount*rowData.levelPrice*updateForm.count }}
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="updateVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateSubmit">确 定</el-button>
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
      loading: false, // 远程搜索
      formSearch: {
        name: '',
        pageSize: 10, // 展示条数
        pageNumber: 1 // 页码
      },
      tableData: [],
      totalCount: 0, // 数据总条数
      updateVisible: false,
      updateForm: {
        normEquipmentId: null,
        levels: [{
          levelId: null,
          levelCount: null
        }],
        count: ''
      },
      updateFormRules: {
        count: {
          required: true,
          message: '数量不可为空',
          trigger: 'blur'
        },
        levels: {
          levelCount: {
            required: true,
            message: '维修频次不可为空',
            trigger: 'blur'
          }
        }

      },
      rowData: {},
      normEquipmentData: [],
      levelsData: []
    }
  },
  computed: {},
  mounted() {
    this.getData()
  },
  methods: {
    // 获取数据
    getData() {
      this.$axios.get('/api/Budget/' + this.$route.params.id, this.formSearch).then(res => {
        this.tableData = res.data
        this.totalCount = res.totalCount
      })
    },
    getPage(val) { // page事件
      // 展示条数
      this.formSearch.pageSize = val.limit
      // 页码
      this.formSearch.pageNumber = val.page
      // 调用获取数据
      this.getData()
    },
    update(row) {
      this.rowData = row
      this.updateVisible = true
      this.updateForm.normEquipmentId = row.normEquipmentId
      this.updateForm.count = row.count
      this.updateForm.levels[0].levelCount = row.levelCount
      this.updateForm.levels[0].levelId = row.normEquipmentLevel.id
    },
    updateSubmit() {
      this.$refs.updateForm.validate(valid => {
        if (valid) {
          this.$axios.put('/api/Budget/' + this.$route.params.id, this.updateForm).then(res => {
            this.$message.success('修改成功')
            this.getData()
            this.updateVisible = false
          })
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.header {
  width: 100%;
}

.tools {
  margin: 10px 0px;
  display: inline-block;
}
.toolsrt {
  width: 100%;
  .el-form-item {
    width: 10%;
    display: inline-block;
  }
  .form_total {
    width: 100%;
    text-align: center;
  }
  .el-select {
    width: 100%;
  }
  .el-input {
    width: 100%;
  }
}

.content {
  .el-select {
    width: 100%;
  }
}
</style>
