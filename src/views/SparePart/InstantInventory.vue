<!-- 备品备件管理-即时库存页面 -->
<template>
  <el-col>
    <el-row>
      <el-col>
        <el-row class="panel">
          <div class="header">
            <div class="tooltotal">
              <el-button size="small" type="primary" @click="form('InBound')">备件入库</el-button>
              <el-button size="small" type="primary" @click="form('OutBound')">备件出库</el-button>
              <el-button size="small" type="primary" plain @click="outputData()">导出</el-button>
            </div>
            <div class="tools">
              <el-button type="primary" plain size="small" @click="formSearch.type='spare';getData()">备件库</el-button>
              <el-button type="primary" plain size="small" @click="formSearch.type='repair';getData()">维修库</el-button>
              <el-button type="primary" plain size="small" @click="formSearch.type='scrap';getData()">报废库</el-button>
            </div>
            <div class="toolsrt">
              <el-form ref="form" :model="formSearch">
                <el-select v-model="formSearch.spareRepositoryId" filterable remote :remote-method="remoteMethodSpareRepository" :loading="loading" clearable placeholder="全部库房" size="small" @focus="remoteMethodSpareRepository">
                  <el-option v-for="item in spareRepositoryData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
                <el-select v-model="formSearch.consumable" clearable placeholder="备件性质" size="small">
                  <el-option key="1" label="非易损易耗" value="false" />
                  <el-option key="2" label="易损易耗" value="true" />
                </el-select>
                <el-input v-model="formSearch.text" placeholder="模糊搜索" size="small" />
                <el-button type="primary" plain size="small" @click="getData()">查询</el-button>
              </el-form>
            </div>
          </div>
          <el-col class="content">
            <el-table :data="tableData" stripe border style="width: 1500px" @selection-change="handleSelectionTableDataChange">
              <el-table-column type="selection" />
              <el-table-column prop="unit.name" label="管理单位" />
              <el-table-column label="库房名称" prop="spareRepository.name" />
              <el-table-column prop="spare.name" label="设备名称" />
              <el-table-column prop="spare.brand.name" label="品牌" />
              <el-table-column prop="spare.model.name" label="型号" />
              <el-table-column prop="source" label="备件类型">
                <template slot-scope="scope">
                  {{ scope.row.consumable ?"易损易耗":"非易损易耗" }}
                </template>
              </el-table-column>
              <el-table-column prop="quantity" label="数量" />
              <el-table-column prop="unitPrice" label="单价" />
              <el-table-column prop="totalPrice" label="总价" />
              <el-table-column prop="year" label="入库年份" />
              <el-table-column prop="remark" label="备注" />
              <el-table-column prop="remark" label="摘要">
                <template slot-scope="scope">
                  <el-button v-show="scope.row.consumable" type="text" @click="zhaiyaoVisible=true;getZhaiyaoData(scope.row.spareId)">出入库摘要</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!--出入库摘要-->
            <el-dialog width="40%" title="选择备件" :visible.sync="zhaiyaoVisible" append-to-body>
              <el-table :data="zhaiyaoData" border>
                <el-table-column type="index" label="序号" width="50" />
                <el-table-column type="spareStockRecordCode" label="单据号" />
                <el-table-column type="spareStockRecordCode" label="出入库类型" />
                <el-table-column type="spareStockRecordItem.name" label="设备名称" />
                <el-table-column type="spareStockRecordBoundTime" label="出入库时间" />
                <el-table-column type="quantity" label="出入库数量" />
                <el-table-column type="remark" label="备注" />
              </el-table>
              <pagination v-show="zhaiyaoTotalCount>0" :total="zhaiyaoTotalCount" :page.sync="zhaiyaoForm.pageNumber" :limit.sync="zhaiyaoForm.pageSize" @pagination="getPageZhaiyao" />
            </el-dialog>
            <!--分页-->
            <pagination v-show="totalCount>0" :total="totalCount" :page.sync="formSearch.pageNumber" :limit.sync="formSearch.pageSize" @pagination="getPage" />
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
      // 主 table 库存相关 start//
      formSearch: {
        text: '', // 搜索文本
        type: '', // 库存类型
        spareRepositoryId: null, // 库房
        consumable: null, // 易损易耗
        pageSize: 10, // 展示条数
        pageNumber: 1// 页码
      },
      totalCount: 0, // 数据总条数
      tableData: [], // 列表数据
      multipleSelectionTableData: '', // 表单选中行（主table）
      // 出入库摘要
      zhaiyaoVisible: false, // 摘要
      zhaiyaoData: [], // 摘要数据
      zhaiyaoForm: {
        pageNumber: 1, // 当前页码
        pageSize: 10// 每页条数
      },
      zhaiyaoTotalCount: 0, // 摘要总数
      spareRepositoryData: [] // 库房数据
    }
  },
  computed: {},
  mounted() {
    this.getData()// 获取即时库存数据
  },
  methods: {
    // 获取即时库存数据
    getData() {
      this.$axios.get('/api/SpareStock/', { params: this.formSearch }).then(res => {
        this.tableData = res.data
        this.totalCount = res.totalCount
      })
    },
    // 入库单分页
    getPage(val) { // page事件
      // 展示条数
      this.formSearch.pageSize = val.limit
      // 页码
      this.formSearch.pageNumber = val.page
      // 调用获取数据
      this.getData()
    },
    // 获取摘要数据
    getZhaiyaoData(id) {
      this.$axios.get('/api/SpareStock/' + id + '/Logs', { params: this.zhaiyaoForm }).then(res => {
        this.zhaiyaoData = res.data
      })
    },
    // 摘要数据分页
    getPageZhaiyao(val) {
      // 展示条数
      this.formSearch.pageSize = val.limit
      // 页码
      this.formSearch.pageNumber = val.page
      // 调用获取摘要数据
      this.getZhaiyaoData()
    },

    // 主table选择事件
    handleSelectionTableDataChange(val) {
      this.multipleSelectionTableData = val
    },
    // 库房数据
    remoteMethodSpareRepository(query) {
      this.loading = true
      let querytext = ''
      querytext = typeof (query) === 'string' ? query : ''
      this.$axios.get('/api/SpareRepository?text=' + querytext).then(res => {
        this.loading = false
        this.spareRepositoryData = res.data
      })
    }

    /** **********主table form 相关方法 end***************/
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
  width: 60%;
  display: inline-block;
  .el-input {
    width: 200px;
  }
}
.el-form-item {
  width: 33%;
  display: inline-block;
  .el-select {
    width: 100%;
  }
  .el-date-editor {
    width: 100%;
  }
}
.form_total {
  width: 100%;
  text-align: center;
}
.dialog-footer {
  display: block;
  width: 100%;
  text-align: center;
}
.content {
  .el-table th,
  .el-table td {
    padding: 5px;
  }
}
</style>
