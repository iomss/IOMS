<template>
  <div>
    <el-upload
      class="upload-demo"
      action="/"
      :file-list="message.fileList"
      :list-type="message.listType"
      :multiple="message.multiple"
      :limit="message.limit"
      :accept="message.accept"
      :http-request="upload"
      :on-exceed="allowableQuantity"
      :before-upload="beforeUpload"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :on-remove="removeFile"
    >
      <el-button v-if="message.listType==='fileList'" size="small" type="primary"><i class="el-icon-plus" />点击上传</el-button>
      <i v-else class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showUploadProgress" :percentage="UploadProgress" />
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: Object,
      default: function() {
        return {
          fileList: [], // 已上传文件列表
          listType: 'fileList', // 文件列表展示类型 text/picture/picture-card
          multiple: false, // 是否允许多选
          limit: 1, // 文件允许上传个数
          drag: false, // 是否允许拖拽
          accept: '', // 允许上传类型
          messageErrorFormat: '该文件格式不允许上传', // 文件格式错误提示
          messageErrorNumber: '上传文件超出允许上传数量', // 文件个数超出
          messageSuccess: '文件上传成功'
        }
      }
    }
  },
  data() {
    return {
      // 上传控件参数
      option: {
        fileList: [], // 已上传文件列表  格式 {name:sdf,url:src}
        listType: '', // 列表展示类型
        limit: null, // 允许上传数量
        messageErrorFormat: '', // 文件格式错误提示
        messageErrorNumber: '', // 文件个数超出
        drag: false, // 是否启用拖拽
        multiple: false, // 允许多选
        accept: 'image/jpeg,image/gif,image/png,image/bmp,' // 文件允许类型格式
        // 图片文件格式: 'image/jpeg,image/gif,image/png,image/bmp,image/tiff,application/x-shockwave-flash,image/svg+xml'
        // 视频文件格式: 'video/mp4,video/x-flv,video/quicktime,video/x-ms-wmv,video/x-ms-asf,video/3gpp,video/avi,video/x-matroska'
        // 音频文件格式: 'audio/mp3,audio/wav,audio/aiff,audio/basic,audio/mpeg,audio/mid,'
        // 安卓安装包: 'application/vnd.android.package-archive'
      },
      // 上传进度条进度值
      UploadProgress: 0,
      // 是否显示上传进度条
      showUploadProgress: false,
      accessid: '',
      accesskey: '',
      host: '',
      policyBase64: '',
      signature: '',
      filename: '',
      key: '',
      expire: 0,
      successfileList: '',
      successfileListArr: []
    }
  },
  watch: {
    message: {
      handler(newValue, oldValue) {
        this.initData()
      },
      deep: true
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      const _this = this
      _this.successfileListArr = []
      this.message.fileList.forEach((item, index) => {
        if (_this.message.limit > 1) {
          _this.successfileListArr.push(item.url)
        } else {
          _this.successfileList = item.url
        }
      })
    },
    // 自定义上传方法
    upload(file) {
      const formdata = new FormData()
      formdata.append('file', file.file)

      this.$axios.post('/api/File/Image/Upload', formdata, { headers: { 'Content-Type': 'multipart/form-data' }}).then(res => {
        if (res.success) {
          this.$emit('listenToChildEvent', res.content[0])
        } else {
          // console.log(res.message)
        }
      })
    },
    // 允许上传文件个数过滤
    allowableQuantity(files) {
      if (files.length >= this.message.limit) {
        this.$notify.error(this.message.messageErrorNumber)
      }
    },
    // 文件格式过滤
    beforeUpload(file) {
      // 上传之前
      let isImg = true
      const isLength = this.message.fileList.length >= this.message.limit
      if (this.message.accept !== '') {
        const type = this.message.accept.split(',')
        isImg = type.indexOf(file.type) !== -1
      }
      if (!isImg) {
        this.$notify.error(this.message.messageErrorFormat)
      }
      if (isLength) {
        this.$notify.error(this.message.messageErrorNumber)
      }
      return isImg && !isLength
    },
    // 文件上传进行中
    uploadProgress(event, file, fileList) {
      this.UploadProgress = 0
    },
    // 文件上传成功
    uploadSuccess(response, file, fileList) {
      this.$notify.success('文件上传成功')
      // this.message.fileList.push({url: response.result})
      // this.$emit('listenToChildEvent', response.result.url)
    },
    // 文件上传失败
    uploadError(err, file, fileList) {
      const error = JSON.parse(err.message)
      if (error.error) {
        this.$notify.error(error.error.message)
      } else {
        this.$notify.error(error.result.message)
      }
    },
    // 删除已上传文件
    removeFile(file, fileList) {
      const index = this.message.fileList.indexOf(file)
      this.message.fileList.splice(index, 1)
      if (this.message.limit > 1) {
        const index = this.successfileListArr.indexOf(file.url)
        this.successfileListArr.splice(index, 1)
        this.$emit('listenToChildEvent', this.successfileListArr)
      } else {
        this.successfileList = null
        this.$emit('listenToChildEvent', this.successfileList)
      }
    }
  }
}
</script>
