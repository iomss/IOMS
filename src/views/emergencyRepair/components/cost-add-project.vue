<template>

  <el-dialog title="添加工程单" :visible.sync="projectVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="500px" center>
    <el-form ref="form" :model="form" label-width="110px" size="small" class="demo-form-inline">
      <el-form-item label="名称">
        <el-input v-model="form.name" placeholder="名称" style="width:200px" />
      </el-form-item>

      <el-form-item label="单位">
        <el-input v-model="form.name" placeholder="名称" style="width:200px" />
      </el-form-item>

      <el-form-item label="数量">
        <el-input v-model="form.name" placeholder="名称" style="width:200px" />
      </el-form-item>

      <el-form-item label="单价">
        <el-input v-model="form.name" placeholder="名称" style="width:200px" /> (元)
      </el-form-item>

      <el-form-item label="总价">
        <el-input v-model="form.name" placeholder="名称" style="width:200px" /> (元)
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="small" @click="projectVisible = false">确定</el-button>
      <el-button size="small" @click="projectVisible = false">取 消</el-button>
    </span>

  </el-dialog>
</template>

<script>
export default {
  name: 'CostAddProject',
  data() {
    return {
      projectVisible: false,
      form: {
        name: ''
      }
    }
  },
  methods: {
    init() {
      this.projectVisible = true
    }
  }
}
</script>
