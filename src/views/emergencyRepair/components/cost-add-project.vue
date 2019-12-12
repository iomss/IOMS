<template>

  <el-dialog title="添加工程单" :visible.sync="projectVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="500px" center>
    <el-form ref="form" :model="form" :rules="rules" label-width="110px" size="small" class="demo-form-inline">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="名称" style="width:200px" />
      </el-form-item>

      <el-form-item label="单位" prop="unit">
        <el-input v-model="form.unit" placeholder="单位" style="width:200px" />
      </el-form-item>

      <el-form-item label="数量" prop="quantity">
        <el-input-number v-model="form.quantity" :min="1" label="数量" style="width:200px" @change="handleChange" />
      </el-form-item>

      <el-form-item label="单价" prop="unitPrice">
        <el-input v-model="form.unitPrice" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="单价" style="width:200px" @input="unitPriceVal" /> (元)
      </el-form-item>

      <el-form-item label="总价" prop="totalPrice">
        <el-input v-model="form.totalPrice" placeholder="总价" style="width:200px" /> (元)
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="small" @click="onSubmit('form')">确定</el-button>
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
        name: '',
        unit: '',
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0
      },
      formData: {},
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '请输入单位', trigger: 'blur' }
        ],
        quantity: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ],
        unitPrice: [
          { required: true, message: '请输入单价', trigger: 'blur' }
        ],
        totalPrice: [
          { required: true, message: '请输入总价', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init() {
      this.projectVisible = true
    },
    // 监听 数量
    handleChange(value) {
      if (value !== 0 && this.form.unitPrice !== 0) {
        this.form.totalPrice = value * this.form.unitPrice
      }
    },
    // 监听 单价
    unitPriceVal(value) {
      if (value !== 0 && this.form.quantity !== 0) {
        this.form.totalPrice = value * this.form.quantity
      }
    },
    onSubmit(data) {
      const that = this

      this.formData = that.form

      this.$refs[data].validate((valid) => {
        if (valid) {
          // 给 父组件传值
          this.$emit('func', this.formData)

          this.$message({
            type: 'success',
            message: '提交成功!',
            duration: 2000,
            onClose: function() {
              that.projectVisible = false
            }

          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
