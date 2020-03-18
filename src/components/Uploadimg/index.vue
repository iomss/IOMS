<!--分页-->
<template>
  <div class="Uploadimg-container">
    <el-upload
      list-type="picture-card"
      action=""
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      :auto-upload="true"
      :on-change="onchange"
      :http-request="httprequest"
      :limit="limit"
      :on-exceed="uplimit"
      :on-success="handelsuccess"
      :file-list="fileList"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" size="tiny">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Uploadimg',
  props: ['reset'],
  data() {
    return {
      dialogImageUrl: '', // 上传图片
      dialogVisible: false,
      fileList: [],
      limit: 1
    }
  },
  computed: {

  },
  watch: {
    'reset': function(val) { // 这里监听父传过来的内容
      if (val) {
        if (this.limit === 1) {
          this.fileList = []
        }
        this.fileList.push({
          name: '',
          url: process.env.VUE_APP_API + val
        })
        this.dialogImageUrl = val
      }
      if (val === 'delete') {
        this.fileList = []
      }
    }
  },
  mounted() {
  },
  methods: {
    beforeUpload() {

    },
    onchange() { // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用

    },
    // 文件上传
    httprequest(a) { // 自定义上传
      var formdata = new FormData()
      formdata.append('file', a.file)
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      this.$axios.post('/api/File/Image/Upload', formdata, config).then(res => {
        if (res.success) {
          this.$emit('uploadimg', res.content[0])
        } else {
          // console.log(res.message)
        }
      })
    },
    // 当上传图片后，调用onchange方法，获取图片本地路径
    // onchange(file, fileList) {
    //   var _this = this
    //   var event = event || window.event
    //   var file = event.target.files[0]
    //   var reader = new FileReader()
    //   // 转base64
    //   reader.onload = function(e) {
    //     _this.imageUrl = e.target.result // 将图片路径赋值给src
    //   }
    //   reader.readAsDataURL(file)
    // },
    handelsuccess(response, file, fileList) {
      // 文件上传成功时钩子
      console.log('888888888')
      // console.log(file)
      // console.log(fileList)
    },
    handleRemove(file, fileList) {
      const index = this.fileList.indexOf(file)
      this.fileList.splice(index, 1)
      this.$emit('uploadimg', this.fileList.url)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    uplimit() {
      // 文件超出个数限制时的钩子
      this.$message.error('最多允许上传' + this.limit + '个文件!')
    }
  }
}
</script>

<style scoped>
</style>
