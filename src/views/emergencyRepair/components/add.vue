<template>

  <el-dialog
    title="青海省高等级公路机电工程应急抢修申请表"
    :visible.sync="changeActiveVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    top="10px"
  >
    <el-form ref="form" :model="form" label-width="80px" size="small" :inline="true" class="demo-form-inline dialog-form-add">

      <el-form-item label="报修单位">
        <el-select v-model="form.region" placeholder="请选择报修单位">
          <el-option label="区域一" value="shanghai" />
          <el-option label="区域二" value="beijing" />
        </el-select>
      </el-form-item>

      <el-form-item label="报修时间">
        <el-col>
          <el-date-picker v-model="form.date1" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-col>
      </el-form-item>

      <el-form-item label="报修人">
        <el-input v-model="form.name" placeholder="报修人" style="min-width:194px;" />
      </el-form-item>

      <el-form-item label="报修电话">
        <el-input v-model="form.name" placeholder="报修电话" style="min-width:209px;" />
      </el-form-item>

      <el-form-item label="接报单位">
        <el-select v-model="form.region" placeholder="请选择接报单位">
          <el-option label="区域一" value="shanghai" />
          <el-option label="区域二" value="beijing" />
        </el-select>
      </el-form-item>

      <el-form-item label="接报时间">
        <el-col>
          <el-date-picker v-model="form.date1" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-col>
      </el-form-item>

      <el-form-item label="接报人">
        <el-input v-model="form.name" placeholder="接报人" />
      </el-form-item>

      <el-form-item label="紧急情况">
        <el-radio-group v-model="form.resource">
          <el-radio label="紧急" />
          <el-radio label="一般" />
        </el-radio-group>
      </el-form-item>

      <el-form-item label="抢修范围" class="el-form-checkbox">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="供配电系统" name="type" />
          <el-checkbox label="监控系统" name="type" />
          <el-checkbox label="收费系统" name="type" />
          <el-checkbox label="通信系统" name="type" />
          <el-checkbox label="隧道设备" name="type" />
          <el-checkbox label="其他" name="type" />
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="抢修依据" class="el-form-checkbox">
        <el-row :gutter="20">
          <el-col><a href="">《青海省高等级公路机电工程应急抢修管理办法（试行）》</a></el-col>
          <el-col class="el-form-small-input-box">
            第<el-input v-model="form.name" />章<el-input v-model="form.name" />条 第<el-input v-model="form.name" />款：
            <el-input v-model="form.name" style="width:190px;" />
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="费用" style="display:block;">
        <el-radio-group v-model="form.money">
          <el-radio label="是" />
          <el-radio label="否" />
        </el-radio-group>
        （是否预估5万以上）
      </el-form-item>

      <el-form-item label="工程名称">
        <el-input v-model="form.name" placeholder="请输入工程名称" />
      </el-form-item>

      <el-form-item label="具体位置">
        <el-input v-model="form.name" placeholder="请输入具体位置" />
      </el-form-item>

      <el-form-item label="事件经过" style="display:block;" size="medium">
        <el-input v-model="form.desc" type="textarea" style="width:482px;" />
      </el-form-item>

      <el-form-item label="影响程度" style="display:block;">
        <el-input v-model="form.name" style="width:482px;" />
      </el-form-item>

      <el-form-item label="抢修内容" style="display:block;">
        <el-input v-model="form.desc" type="textarea" style="width:482px;" />
      </el-form-item>

      <el-form-item label="费用估算">
        <el-input v-model="form.name" placeholder="费用估算" style="width:80px;" /> （万元）
      </el-form-item>

      <el-form-item label="材料设备">
        <el-input v-model="form.name" placeholder="接报人" style="width:100px;" />（品牌，型号）
      </el-form-item>

      <el-form-item label="附件" style="display:block;">
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-change="handleChange"
          :file-list="form.fileList"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">大小不能超过500kb</div>
        </el-upload>
      </el-form-item>

    </el-form>

    <div slot="footer" class="dialog-footer" style="text-align: center;display: block;">
      <el-button size="small" @click="changeActiveVisible = false">取 消</el-button>
      <el-button size="small" type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<style>
	.dialog-form-add{
		height: 500px;
		overflow: auto;
	}
	.el-input{
		width: 194px;
	}
	.el-item-label label.el-form-item__label{
		width : 100px;
	}
	.el-form-checkbox .el-form-item__label{
		width: 80px;
    display: block;
    float: left;
	}
	.el-form-checkbox .el-form-item__content{
		display: block;
    float: left;
    width: 500px;
	}
	.el-form-small-input-box .el-input{
		width : 30px;
		margin:0px 5px;
	}
</style>
<script>
export default {
  name: 'Add',
  data: function() {
    return {
      changeActiveVisible: false,

      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: '',
        type: '',
        resource: '一般',
        money: '否',
        desc: '',

        fileList: [{
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }, {
          name: 'food2.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }]

      }
    }
  },
  methods: {
    init() {
      this.changeActiveVisible = true
    },

    onSubmit() {

    },
    handleChange() {

    }
  }
}
</script>
