<!-- 信息安全单价管理页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <div class="tools">
              <el-button type="success" size="small" @click="create()">生成维护费用</el-button>
              <el-button type="primary" size="small" @click="setvalid()">设置有效</el-button>
            </div>
            <div class="toolsrt">
              <el-form ref="form" :model="formSearch" label-width="60px">
                <el-form-item label="版本号" prop="code">
                  <el-input v-model="formSearch.code" placeholder="版本号" size="small" />
                </el-form-item>
                <el-form-item label="年度" prop="year">
                  <el-input v-model="formSearch.year" placeholder="年度" size="small" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" plain size="small" @click="getData()">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="content">
            <el-table :data="tableData" stripe border style="width: 1200px" @selection-change="handleSelectionChange">
              <el-table-column type="selection" />
              <el-table-column prop="code" label="版本号" />
              <el-table-column prop="createTime" label="创建时间" :formatter="formatterDate" />
              <el-table-column prop="createUser.name" label="创建人" />
              <el-table-column prop="referVesion" label="参考定额">
                <template slot-scope="scope">
                  <el-button type="text" @click="clickReferVesionInfo(scope.row)">{{ scope.row.referVesion.code }}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="source" label="是否有效">
                <template slot-scope="scope">
                  {{ scope.row.isValid ?"已生效":"未生效" }}
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
            <!--参考定额-->
            <el-dialog ref="referVesion" title="定额版本详情" :visible.sync="referVesionVisible" width="450px">
              <el-form v-model="rowDataReferVesion" label-width="80px">
                <el-form-item label="版本号:">{{ rowDataReferVesion.code }}</el-form-item>
                <el-form-item label="类型:">{{ rowDataReferVesion.type }}</el-form-item>
                <el-form-item label="版次:">{{ rowDataReferVesion.edition }}</el-form-item>
                <el-form-item label="印次:">{{ rowDataReferVesion.print }}</el-form-item>
                <el-form-item label="书号:">{{ rowDataReferVesion.isbn }}</el-form-item>
                <el-form-item label="出版社:">{{ rowDataReferVesion.publishingHouse }}</el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="referVesionVisible = false">取 消</el-button>
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
      tableData: [],
      totalCount: 0, // 数据总条数
      formSearch: {
        code: '', // 版本编号
        year: '', // 年度
        type: 'InformationSecurity', // 类型
        pageSize: 10, // 展示条数
        pageNumber: 1// 页码
      },
      multipleSelection: {}, // 表单选中行
      setValidVisible: false, // 设为有效弹框
      referVesionVisible: false, // 定额详情弹框
      rowDataReferVesion: {}
    }
  },
  computed: {},
  mounted() {
    this.getData()
  },
  methods: {
    formatterDate(row, column, cellValue) {
      if (cellValue !== null) {
        return this.$moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
      } else {
        return cellValue
      }
    },
    getData() {
      this.$axios.get('/api/UnitPrice', { params: this.formSearch }).then(res => {
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
    create(row) { // 生成维护费用
      this.$axios.post('/api/UnitPrice', { type: 'InformationSecurity' }).then(res => {
        this.$message.success('信息安全费用生成成功')
        this.getData()
      })
    },
    setvalid(row) { // 设置有效
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
    // 设为有效
    setvalidSubmit() {
      this.$axios.post('/api/UnitPrice/' + this.multipleSelection[0].id + '/SetValid').then(res => {
        this.$message.success('信息安全费用生效成功')
        this.getData()
        this.setValidVisible = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    clickReferVesionInfo(row) {
      this.referVesionVisible = true
      this.rowDataReferVesion = row.referVesion
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
  width: 100%;
  .el-form-item {
    display: inline-block;
  }
}

.content {
  .el-table th,
  .el-table td {
    padding: 5px;
  }
}
</style>
