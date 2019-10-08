<template>
  <el-form ref="form" :model="form" label-width="80px" size="small" :inline="true" class="demo-form-inline">

    <el-row>
      <el-col :span="12">
        <el-form-item label="报修单位">
          ssss
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="报修时间">
          222
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-form-item label="报修人">
          22
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="报修电话">
          222
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-form-item label="接报单位">
          22
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="接报时间">
          222
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-form-item label="接报人">
          22
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="紧急情况">
          <el-radio-group v-model="form.resource">
            <el-radio label="紧急" />
            <el-radio label="一般" />
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
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
      </el-col>
    </el-row>

    <el-form-item label="抢修依据" class="el-form-checkbox">
      <el-row :gutter="20">
        <el-col><a href="">《青海省高等级公路机电工程应急抢修管理办法（试行）》</a></el-col>
        <el-col class="el-form-small-input-box">
          第 2 章 2 条 第2款：xxxxxx
        </el-col>
      </el-row>
    </el-form-item>

    <el-form-item label="费用" style="display:block;">
      <el-radio-group v-model="form.resource">
        <el-radio label="是" />
        <el-radio label="否" />
      </el-radio-group>
      （是否预估5万以上）
    </el-form-item>

    <el-row>
      <el-col :span="24">
        <el-form-item label="报修内容">
          <el-row>1,工程名称: </el-row>
          <el-row>2,具体位置: </el-row>
          <el-row>3,事件经过: </el-row>
          <el-row>4,影响程度: </el-row>
          <el-row>5,抢修内容: </el-row>
          <el-row>6,费用估算: </el-row>
          <el-row>7,主要材料设备: </el-row>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-form-item label="附件" style="display:block;">
          <a href="" style="color:blue;display: block;">附件1</a>
          <a href="" style="color:blue;display: block;">附件2</a>
        </el-form-item>
      </el-col>
    </el-row>

  </el-form>
</template>
<style>
/*	.dialog-form-add{
		height: 400px;
		overflow: auto;
	}*/
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
  name: 'FormView',
  data: function() {
    return {

      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: '',
        type: '',
        resource: '',
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
  }
}
</script>
