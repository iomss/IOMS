<!-- 费率信息管理页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">

            <div class="tools">
              <el-button type="success" size="small" @click="updateData()">添加</el-button>
              <el-button type="danger" size="small" @click="deleteData()">删除</el-button>
              <el-button type="primary" size="small" @click="setvalid()">设为生效</el-button>
            </div>
            <div class="toolsrt">
              <el-form ref="form" :model="formSearch" label-width="70px">
                <el-form-item label="生效状态" prop="valid">
                  <el-select v-model="formSearch.valid" size="small">
                    <el-option label="全部" value="">全部</el-option>
                    <el-option key="已生效" label="已生效" value="true">已生效</el-option>
                    <el-option key="未生效" label="已生效" value="false">未生效</el-option>
                  </el-select>
                </el-form-item>
                <el-form-item class="form_total">
                  <el-button type="primary" plain size="small" @click="getData()">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="content">
            <el-table :data="tableData" stripe border style="width: 800px" @selection-change="handleSelectionChange">
              <el-table-column type="selection" />
              <el-table-column prop="code" label="版本号">
                <template slot-scope="scope">
                  <router-link :to="{ name: 'Rateinformation-Info', params: { id: scope.row.id }}" style="color:#409eff">{{ scope.row.code }}</router-link>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="创建时间" :formatter="formatterDate" />
              <el-table-column prop="source" label="生效状态">
                <template slot-scope="scope">
                  {{ scope.row.isValid?"已生效":"未生效" }}
                </template>
              </el-table-column>
              <el-table-column prop="comment" label="备注" />
            </el-table>
            <!--分页-->
            <pagination v-show="totalCount>0" :total="totalCount" :page.sync="formSearch.pageNumber" :limit.sync="formSearch.pageSize" @pagination="getPage" />
            <!--设为生效-->
            <el-dialog ref="setValid" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="setValidVisible" width="220px">
              <span>您确定要生效此条数据？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="setValidVisible = false">取 消</el-button>
                <el-button type="primary" @click="setvalidSubmit">确 定</el-button>
              </span>
            </el-dialog>
            <!--删除-->
            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="removeQuestionVisible" width="220px">
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
      loading: false, // 远程搜索
      formSearch: {
        valid: null,
        pageSize: 10, // 展示条数
        pageNumber: 1// 页码
      },
      totalCount: 0, // 数据总条数
      multipleSelection: '', // 表单选中行
      removeQuestionVisible: false, // 删除弹框
      tableData: [],
      removeData: [],
      setValidVisible: false// 生效弹框
    }
  },
  computed: {},
  mounted() {
    this.getData()
  },
  methods: {
    formatterDate(row, column, cellValue) {
      if (cellValue !== null) {
        return this.$moment(cellValue).format('YYYY-MM-DD HH:mm')
      } else {
        return cellValue
      }
    },
    getData() {
      this.$axios.get('/api/Tariff', { params: this.formSearch }).then(res => {
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
    updateData(row) {
      this.$axios.post('/api/Tariff').then(res => {
        this.$router.push('/Budgetmanage/RateinformationInfo/' + res.id)
      })
    },
    deleteData(row) {
      if (row === undefined) {
        if (this.multipleSelection.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.removeQuestionVisible = true
        }
      } else {
        this.removeQuestionVisible = true
      }
    },
    setvalid(row) { // 设为有效
      if (row === undefined) {
        if (this.multipleSelection.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.setValidVisible = true
        }
      } else {
        this.setValidVisible = true
      }
    },
    setvalidSubmit() {
      this.$axios.post('/api/Tariff/' + this.multipleSelection[0].id + '/SetValid').then(res => {
        this.$message.success('费率版本生效成功')
        this.setValidVisible = false
      })
    },
    // 删除
    removeQuestion() {
      const _this = this
      this.$axios.delete('/api/Tariff/' + this.multipleSelection[0].id).then(response => {
        _this.$message.success('删除成功')
        _this.removeQuestionVisible = false
        this.getData()
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
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
  width: 29%;
  display: inline-block;
}
.toolsrt {
  width: 50%;
  text-align: left;
  .el-form-item {
    width: 200px;
    display: inline-block;
  }
  .el-select {
    width: 200px;
  }
}

.content {
  .el-table th,
  .el-table td {
    padding: 5px;
  }
}
</style>
