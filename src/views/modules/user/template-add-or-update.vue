<template>
  <el-dialog
    :title="!dataForm.id ? '新增病历模板' : '修改'"
    :close-on-click-modal="false"
    :fullscreen="true"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="标题" prop="title">
      <el-input v-model="dataForm.title" placeholder="标题"></el-input>
    </el-form-item>
    <el-form-item label="内容" prop="content">
      <vue-ueditor-wrap  :config="ueConfig"  v-model="dataForm.content"></vue-ueditor-wrap>
      <!--<el-input v-model="dataForm.content" placeholder="内容"></el-input>-->
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import VueUeditorWrap from 'vue-ueditor-wrap'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: 0,
        doctorId: '',
        title: '',
        content: ''
      },
      dataRule: {
        doctorId: [
          { required: true, message: '医生ID不能为空', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    VueUeditorWrap
  },
  computed: {
    record: {
      get () { return this.$store.state.templates.record }
    },
    doctorId: {
      get () { return this.$store.state.user.doctorId }
    },
    ueConfig: {
      get () { return this.$store.state.config.ueConfig }
    }
  },
  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/user/template/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.doctorId = data.template.doctorId
              this.dataForm.title = data.template.title
              this.dataForm.content = data.template.content
            }
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/user/template/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'doctorId': this.doctorId,
              'title': this.dataForm.title,
              'content': this.dataForm.content
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    }
  }
}
</script>
