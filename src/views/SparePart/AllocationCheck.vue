<!-- 备品备件管理-备件调拨审批页面 -->
<template>
  <el-col>
    <el-row>
      <el-col>
        <el-row class="panel">
          <div class="header">
            <div class="tools">
              <el-button type="primary" size="small" @click="check()">审批</el-button>
            </div>
            <div class="toolsrt">
              <el-form ref="form" :model="formSearch">
                起止时间：
                <el-date-picker v-model="formSearch.beginTime" size="small" type="date" placeholder="开始时间" />
                ——
                <el-date-picker v-model="formSearch.endTime" size="small" type="date" placeholder="结束时间" />
                <el-input v-model="formSearch.text" placeholder="模糊搜索" size="small" />
                <el-button type="primary" plain size="small" @click="getData()">查询</el-button>
              </el-form>
            </div>
          </div>
          <el-col class="content">
            <el-table :data="tableData" stripe border @selection-change="handleSelectionChange">
              <el-table-column type="selection" />
              <el-table-column prop="reviewStatus" label="单据状态">
                <template slot-scope="scope">
                  {{ scope.row.reviewStatus ==='Pending'?'等待审批':scope.row.reviewStatus ==='Applied'?'已批准':'已拒绝' }}
                </template>
              </el-table-column>
              <el-table-column label="调拨单号" prop="code">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="getInfo(scope.row.id)">{{ scope.row.code }}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="创建时间" :formatter="formatterstartDate" />
              <el-table-column prop="unit.name" label="申请单位" />
              <el-table-column prop="createUser.name" label="操作人" />
              <el-table-column prop="remark" label="备注" />
              <el-table-column prop="reviewComment" label="审批备注" />
            </el-table>
            <!-- 调拨审批 -->
            <el-dialog title="调拨审批" :visible.sync="checkVisibale" :close-on-press-escape="false" :show-close="false" :close-on-click-modal="false" width="600px">
              <el-form ref="checkForm" :model="checkForm" :rules="checkFormRules" label-width="100px">
                <el-form-item label="审批意见" prop="reviewStatus">
                  <el-radio-group v-model="checkForm.reviewStatus">
                    <el-radio label="Applied">通过</el-radio>
                    <el-radio label="Rejected">不通过</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="备注" prop="reviewComment">
                  <el-input v-model="checkForm.reviewComment" type="textarea" />
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="submitCheck()">确定</el-button>
                <el-button type="primary" plain size="small" @click="closeCheck()">取消</el-button>
              </span>
            </el-dialog>
            <!--分页-->
            <pagination v-show="totalCount>0" :total="totalCount" :page.sync="formSearch.pageNumber" :limit.sync="formSearch.pageSize" @pagination="getPage" />
            <el-dialog title="调拨申请单详情" :visible.sync="infoVisible" width="1000">
              <el-row>

                <el-form v-if="Info!==''" label-width="120px">
                  <el-col :span="8">
                    <el-form-item label="调拨单号">
                      {{ Info.code }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="调拨前单位">
                      {{ Info.fromUnit!==null?Info.fromUnit.name:'' }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="调拨前库房">
                      {{ Info.fromRepository!==null?Info.fromRepository.name:'' }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="调拨后单位">
                      {{ Info.unit!==null?Info.unit.name:'' }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="调拨后库房">
                      {{ Info.spareRepository!==null ? Info.spareRepository.name:'' }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="经办人">
                      {{ Info.opeartor }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="备注">
                      {{ Info.remark }}
                    </el-form-item>
                  </el-col>
                  <el-divider />
                  <el-table :data="Info.spareStockRecordItems" stripe border style="width: 100%">
                    <el-table-column type="index" label="序号" width="50" />
                    <el-table-column prop="spare.number" label="编码" />
                    <el-table-column prop="spare.name" label="备件名称" />
                    <el-table-column prop="spare.consumable" label="备件分类">
                      <template slot-scope="scope">
                        {{ scope.row.spare.consumable?'易损易耗':'非易损易耗' }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="spare.brand.name" label="品牌" />
                    <el-table-column prop="spare.model.name" label="型号" />
                    <el-table-column prop="spare.unit" label="单位" />
                    <el-table-column prop="spare.supplier" label="供应商" />
                    <el-table-column prop="unitPrice" label="单价" />
                    <el-table-column prop="quantity" label="数量" />
                    <el-table-column prop="totalPrice" label="总价" />
                    <el-table-column prop="remark" label="备注" />
                  </el-table>
                </el-form>
                <el-col :span="24" style="text-align:center;margin-top:20px;">
                  <el-button size="small" type="primary" @click="infoVisible=false">确 定</el-button>
                  <el-button size="small" @click="infoVisible=false">取 消</el-button>
                </el-col>
              </el-row>

            </el-dialog>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-col>
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
        beginTime: '',
        endTime: '',
        text: '', // 搜索文本
        spareBoundType: 'TransferApplication',
        spareBoundSubType: 'TransferApplication',
        pageSize: 10, // 展示条数
        pageNumber: 1// 页码
      },
      tableData: [],
      totalCount: 0, // 数据总条数
      multipleSelection: '',
      checkVisibale: false,
      checkForm: {
        reviewStatus: '',
        reviewComment: ''
      },
      checkFormRules: {
        reviewStatus: {
          required: true,
          message: '请选择审批意见',
          trigger: 'change'
        }
      },
      infoVisible: false,
      Info: ''
    }
  },
  computed: {},
  mounted() {
    this.getData()
  },
  methods: {
    // 日期时间格式化
    formatterstartDate(row, column, cellValue) {
      if (cellValue !== null) {
        return this.$moment(cellValue).format('YYYY-MM-DD')
      } else {
        return cellValue
      }
    },
    getData() { // 获取列表
      this.$axios.get('/api/SpareStockRecord', { params: this.formSearch }).then(res => {
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    check() {
      if (this.multipleSelection.length === 1) {
        if (this.multipleSelection[0].reviewStatus !== 'Pending') {
          this.$message.warning('此调拨申请状态不正确不可进行审批')
        } else {
          this.checkVisibale = true
        }
      } else {
        this.$message.warning('请选择一条数据进行审批操作')
      }
    },
    submitCheck() {
      this.$refs.checkForm.validate(valid => {
        if (valid) {
          this.$axios.post('/api/SpareStockRecord/' + this.multipleSelection[0].id, this.checkForm).then(res => {
            this.$message.success('审批操作成功')
            this.closeCheck()
          })
        }
      })
    },
    closeCheck() {
      this.checkVisibale = false
      this.$refs.checkForm.resetFields()
    },
    getInfo(id) {
      this.$axios.get('/api/SpareStockRecord/' + id).then(res => {
        this.Info = res
        this.infoVisible = true
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
  width: 400px;
  display: inline-block;
}
.toolsrt {
  width: 100%;
  display: inline-block;
  margin: 10px 0px;
  .el-input {
    width: 200px;
  }
}
// .el-form-item {
//   width: 33%;
//   display: inline-block;
//   .el-select {
//     width: 100%;
//   }
//   .el-date-editor {
//     width: 100%;
//   }
// }
</style>
