<!-- 资产管理页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <h4>清单管理</h4>
            <div class="tools">
              <el-button
                type="primary"
                plain
                size="small"
                @click="exportdata()"
              >导出数据</el-button>
            </div>
            <div class="toolsrt">
              <el-form ref="form" :model="formSearch">
                <el-select
                  v-model="formSearch.systemId"
                  filterable
                  remote
                  :remote-method="remoteMethodsystemId"
                  :loading="loading"
                  clearable
                  placeholder="系统名称"
                  size="small"
                  @focus="remoteMethodsystemId"
                >
                  <el-option
                    v-for="item in systemData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
                <!-- <el-select v-model="formSearch.source" filterable remote :remote-method="remoteMethodsystemId" :loading="loading" placeholder="来源" size="small" @focus="remoteMethodsourceId">
                  <el-option v-for="item in sourceData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select> -->
                <el-select
                  v-model="formSearch.source"
                  filterable
                  placeholder="来源"
                  size="small"
                >
                  <el-option key="Manual" label="人工修订" value="Manual" />
                  <el-option
                    key="Automatic"
                    label="自动汇总"
                    value="Automatic"
                  />
                </el-select>
                <el-input
                  v-model="formSearch.text"
                  placeholder="设备名称"
                  size="small"
                />
                <el-button
                  type="primary"
                  plain
                  size="small"
                  @click="getData()"
                >查询</el-button>
                <el-button
                  type="primary"
                  plain
                  size="small"
                  @click="resetForm()"
                >重置</el-button>
              </el-form>
            </div>
          </div>
          <div class="content">
            <el-table
              :data="tableData"
              stripe
              border
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" />
              <el-table-column label="系统名称" prop="system">
                <template slot-scope="scope">
                  {{ scope.row.system.name }}
                </template>
              </el-table-column>
              <el-table-column prop="equipment" label="设备种类">
                <template slot-scope="scope">
                  {{ scope.row.equipment.name }}
                </template>
              </el-table-column>
              <el-table-column prop="inLiability" label="责任期内数量" />
              <el-table-column prop="outLiability" label="责任期外数量" />
              <el-table-column prop="count" label="设备小计" />
              <el-table-column prop="remark" label="备注" />
              <el-table-column prop="source" label="来源">
                <template slot-scope="scope">
                  {{
                    scope.row.source === "Automatic" ? "自动汇总" : "人工修订"
                  }}
                </template>
              </el-table-column>
            </el-table>
            <!--分页-->
            <pagination
              v-show="totalCount > 0"
              :total="totalCount"
              :page.sync="formSearch.pageNumber"
              :limit.sync="formSearch.pageSize"
              @pagination="getPage"
            />
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
      id: '',
      formSearchShow: false,
      formSearch: {
        source: '',
        system: '',
        text: '', // 搜索文本
        pageSize: 10, // 展示条数
        pageNumber: 1 // 页码
      },
      totalCount: 0, // 数据总条数
      multipleSelection: false, // 表单选中行
      tableData: [],
      removeData: [],
      systemData: [],
      sourceData: [],
      sourcepage: {
        // 来源分页
        pageNumber: 1,
        pageSize: 999999,
        pageCount: ''
      },
      systempage: {
        // 所属系统分页
        pageNumber: 1,
        pageSize: 999999,
        pageCount: ''
      }
    }
  },
  computed: {},
  mounted() {
    this.getData()
    this.getsystemData()
    this.getsourceData()
  },
  methods: {
    resetForm() {
      // 重置搜索条件
      this.formSearch = {
        source: '',
        system: '',
        text: '', // 搜索文本
        pageSize: 10, // 展示条数
        pageNumber: 1 // 页码
      }
      this.getData()
    },
    getData() {
      this.id = window.location.href.split('/')[
        window.location.href.split('/').length - 1
      ]
      this.$axios
        .get('/api/EquipmentList/' + this.id + '/Items', {
          params: this.formSearch
        })
        .then(res => {
          this.tableData = res.data
          this.totalCount = res.totalCount
        })
    },
    getPage(val) {
      // page事件
      // 展示条数
      this.formSearch.pageSize = val.limit
      // 页码
      this.formSearch.pageNumber = val.page
      // 调用获取数据
      this.$axios
        .get('/api/EquipmentList/' + this.id + '/Items', {
          params: this.formSearch
        })
        .then(res => {
          this.tableData = res.data
        })
    },
    getsystemData() {
      // 获取所属系统
      this.$axios
        .get(
          '/api/Meta/System?pageSize=' +
            this.systempage.pageSize +
            '&pageNumber=' +
            this.systempage.pageNumber
        )
        .then(res => {
          this.systemData = this.systemData.concat(res.data)
          // this.systempage.pageCount = res.pageCount
        })
    },
    getsourceData() {
      // 获取设备来源
      this.$axios
        .get(
          '/api/Meta/Source?pageSize=' +
            this.sourcepage.pageSize +
            '&pageNumber=' +
            this.sourcepage.pageNumber
        )
        .then(res => {
          this.sourceData = this.sourceData.concat(res.data)
          // this.sourcepage.pageCount = res.pageCount
        })
    },
    // loadMoresystem() { // 所属系统加载下一页数据
    //   if (this.systempage.pageCount > this.systempage.pageNumber) {
    //     this.systempage.pageNumber += 1
    //     this.getsystemData()
    //   }
    // },
    // loadMoresource() { // 来源加载下一页数据
    //   if (this.sourcepage.pageCount > this.sourcepage.pageNumber) {
    //     this.sourcepage.pageNumber += 1
    //     this.getsourceData()
    //   }
    // },
    remoteMethodsystemId(query) {
      this.loading = true
      let querytext = ''
      querytext = typeof query === 'string' ? query : ''
      this.$axios.get('/api/Meta/System?text=' + querytext).then(res => {
        this.loading = false
        this.systemData = res.data
      })
    },
    remoteMethodsourceId(query) {
      this.loading = true
      let querytext = ''
      querytext = typeof query === 'string' ? query : ''
      this.$axios.get('/api/Meta/source?text=' + querytext).then(res => {
        this.loading = false
        this.sourceData = res.data
      })
    },
    search() {
      // 点击右上角查询方法
    },
    exportdata() {
      // 导出方法
      // this.$axios
      //   .get("/api/EquipmentList/" + this.id + "/Items", {
      //     params: { ...this.formSearch, export: true }
      //   })
      //   .then(res => {
      //     this.$message.success("导出任务已生成,请前往任务列表查看");
      //   });
      this.$axios
        .get('/api/EquipmentList/' + this.id + '/ExportItems', {
          params: this.tableDataSearch,
          Accept: {
            'Content-Type': 'application/json;application/octet-stream'
          },
          responseType: 'blob'
        })
        .then(res => {
          const fileName = res.headers['content-disposition'].match(
            /filename=(.*)/
          )[1]
          const url = window.URL.createObjectURL(new Blob([res.data]))
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', decodeURI(fileName))
          document.body.appendChild(link)
          link.click()
        })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>
<style lang="scss" scoped>
.header {
  width: 100%;
}

.tools {
  margin: 10px 0px;
  width: 29%;
  display: inline-block;
}
.toolsrt {
  width: 70%;
  display: inline-block;
  text-align: right;
}
.search {
  width: 450px;
  position: absolute;
  right: 0;
  z-index: 4;
}
.content {
  .el-table th,
  .el-table td {
    padding: 5px;
  }
}
.el-input {
  display: inline-block;
  width: 200px;
}
</style>
