<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="病人记录ID" prop="patientRecordId">
      <el-input v-model="dataForm.patientRecordId" placeholder="病人记录ID"></el-input>
    </el-form-item>
    <el-form-item label="医生ID" prop="doctorId">
      <el-input v-model="dataForm.doctorId" placeholder="医生ID"></el-input>
    </el-form-item>
    <el-form-item label="标题" prop="title">
      <el-input v-model="dataForm.title" placeholder="标题"></el-input>
    </el-form-item>
    <el-form-item label="诊断记录" prop="content">
      <el-input v-model="dataForm.content" placeholder="诊断记录"></el-input>
    </el-form-item>
    <el-form-item label="删除标志" prop="delFlag">
      <el-input v-model="dataForm.delFlag" placeholder="删除标志"></el-input>
    </el-form-item>
    <el-form-item label="创建人" prop="createBy">
      <el-input v-model="dataForm.createBy" placeholder="创建人"></el-input>
    </el-form-item>
    <el-form-item label="创建时间" prop="createTime">
      <el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
    </el-form-item>
    <el-form-item label="修改人" prop="modifyBy">
      <el-input v-model="dataForm.modifyBy" placeholder="修改人"></el-input>
    </el-form-item>
    <el-form-item label="修改时间" prop="modifyTime">
      <el-input v-model="dataForm.modifyTime" placeholder="修改时间"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
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
        modifyTime: ''
      },
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
        ],
        delFlag: [
          { required: true, message: '删除标志不能为空', trigger: 'blur' }
        ],
        createBy: [
          { required: true, message: '创建人不能为空', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '创建时间不能为空', trigger: 'blur' }
        ],
        modifyBy: [
          { required: true, message: '修改人不能为空', trigger: 'blur' }
        ],
        modifyTime: [
          { required: true, message: '修改时间不能为空', trigger: 'blur' }
        ]
      }
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
              this.dataForm.createTime = data.patientDiagnose.createTime
              this.dataForm.modifyBy = data.patientDiagnose.modifyBy
              this.dataForm.modifyTime = data.patientDiagnose.modifyTime
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
            url: this.$http.adornUrl(`/user/patientdiagnose/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'patientRecordId': this.dataForm.patientRecordId,
              'doctorId': this.dataForm.doctorId,
              'title': this.dataForm.title,
              'content': this.dataForm.content,
              'delFlag': this.dataForm.delFlag,
              'createBy': this.dataForm.createBy,
              'createTime': this.dataForm.createTime,
              'modifyBy': this.dataForm.modifyBy,
              'modifyTime': this.dataForm.modifyTime
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
