<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :fullscreen="true"
    append-to-body
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="标题" prop="title">
      <el-input v-model="dataForm.title" placeholder="标题"></el-input>
    </el-form-item>
    <el-form-item label="病历模版" >
        <el-select v-model="dataForm.template"  filterable clearable  placeholder="类型">
          <el-option
            v-for="item in templateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      <el-button @click="loadTemplate()">加载模版</el-button>
     </el-form-item>
    <el-form-item label="诊断记录" prop="content">
        <vue-ueditor-wrap  :config="ueConfig"  v-model="dataForm.content"></vue-ueditor-wrap>
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
      ueConfig: {
        zIndex: 2999,
        toolbars: [
          ['undo', 'redo', 'indent', 'bold', 'italic', '|', 'fontfamily', 'fontsize', '|', 'template'],
          ['justifyleft', 'justifyright', 'justifycenter', 'justifyjustify', 'print', 'preview']
        ],
        // theme: 'gray',
        elementPathEnabled: false,
        wordCount: false,
        serverUrl: ''
      },
      visible: false,
      dataForm: {
        id: 0,
        patientRecordId: '',
        doctorId: '',
        title: '',
        content: '',
        delFlag: '',
        createBy: '',
        createTime: '',
        modifyBy: '',
        modifyTime: '',
        template: ''
      },
      templateOptions: [],
      dataRule: {
        patientRecordId: [
          { required: true, message: '病人记录ID不能为空', trigger: 'blur' }
        ],
        doctorId: [
          { required: true, message: '医生ID不能为空', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '诊断记录不能为空', trigger: 'blur' }
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
    userName: {
      get () { return this.$store.state.user.name }
    }
  },
  created () {
    this.getTemplateOption()
  },
  methods: {
    initAddDiagnose (recordId) {
      this.dataForm.patientRecordId = recordId
      this.init(0)
    },
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/user/patientdiagnose/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.patientRecordId = data.patientDiagnose.patientRecordId
              this.dataForm.doctorId = data.patientDiagnose.doctorId
              this.dataForm.title = data.patientDiagnose.title
              this.dataForm.content = data.patientDiagnose.content
              this.dataForm.delFlag = data.patientDiagnose.delFlag
              this.dataForm.createBy = data.patientDiagnose.createBy
            }
          })
        }
      })
    },
    loadTemplate () {
      if (this.dataForm.template === '') {
        this.$message.error('请先选择模版！')
      } else {
        this.dataForm.content = this.dataForm.template
      }
    },
    getTemplateOption () {
      this.templateOptions = []
      this.$http({
        url: this.$http.adornUrl('/user/template/getTemplateByDoctorId'),
        method: 'get',
        params: this.$http.adornParams({
          // 'doctorId': this.doctorId
          'doctorId': ''
        })
      }).then(({data}) => {
        data.templateList.map(item => {
          let option = {}
          option.value = item.content
          option.label = item.title
          this.templateOptions.push(option)
        })
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/user/patientdiagnose/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'patientRecordId': this.dataForm.patientRecordId,
              'doctorId': this.doctorId,
              'title': this.dataForm.title,
              'content': this.dataForm.content,
              'createBy': this.userName
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
