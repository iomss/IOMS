<!-- 维修工程师转单页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <h4>维修转单详情</h4>
            <div class="Infodata">
              <ul>
                <li><span>维修单编号:</span><b>{{ InfoData }}</b></li>
                <li><span>设备位置:</span><b>{{ InfoData }}</b></li>
                <li><span>设备种类:</span><b>{{ InfoData }}</b></li>
                <li><span>设备编码:</span><b>{{ InfoData }}</b></li>
                <li><span>设备类型:</span><b>{{ InfoData }}</b></li>
                <li><span>故障时间:</span><b>{{ InfoData }}</b></li>
                <li><span>设备描述:</span><b>{{ InfoData }}</b></li>
                <li><span>录入人:</span><b>{{ InfoData }}</b></li>
                <li><span>报修级别:</span><b>{{ InfoData }}</b></li>
                <!-- <li><span>代维状态:</span><b>{{ InfoData }}</b></li> -->
                <li><span>报修人:</span><b>{{ InfoData }}</b></li>
                <li><span>报修时间:</span><b>{{ InfoData }}</b></li>
                <li><span>派工次数:</span><b>{{ InfoData }}</b></li>
                <li><span>维修次数:</span><b>{{ InfoData }}</b></li>
                <li>
                  <el-form ref="form" :model="formSearch" label-width="120px">
                    <el-form-item label="派工:">
                      <el-select v-model="formSearch.owner" clearable placeholder="派工" size="small">
                        <el-option key="1" label="启用" value="true" />
                        <el-option key="2" label="禁用" value="false" />
                      </el-select>
                    </el-form-item>
                  </el-form>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="content">
          <el-button type="primary" size="small" @click="partwork()">分配工单</el-button>
          <el-button type="primary" size="small" @click="processrecord()">过程记录</el-button>
          <el-button type="danger" size="small" @click="closework()">关闭</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  components: {

  },
  data() {
    return {
      InfoData: [],
      formSearch: {}
    }
  },
  computed: {},
  mounted() {
    // this.initData(1)
    this.getdata()
  },
  methods: {
    getdata() {
      // 获取维修详情数据
    },
    partwork() { // 分配工单

    },
    processrecord() { // 点击过程记录

    },
    closework() { // 点击关闭

    }
  }
}
</script>
<style lang='scss' scoped>
.header {
  width: 100%;
  .Infodata {
    width: 100%;
    ul {
      list-style: none;
      width: 100%;
      padding-left: 10px;
      li {
        width: 49%;
        display: inline-block;
        span {
          display: inline-block;
          font-size: 16px;
          text-align: right;
          width: 120px;
          padding: 10px;
        }
        b {
          display: inline-block;
          font-weight: 400;
        }
      }
    }
  }
}
.content {
  width: 100%;
  text-align: center;
}
</style>
