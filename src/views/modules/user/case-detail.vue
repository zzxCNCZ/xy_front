<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '病案详情'"
    :close-on-click-modal="false"
    :fullscreen="true"
    append-to-body
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
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
      visible: false,
      dataForm: {
        id: 0,
        patientRecordId: '',
        doctorId: '',
        title: '',
        // 病案内容
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
    ueConfig: {
      get () { return this.$store.state.config.ueConfig }
    },
    caseDetail: {
      get () { return this.$store.state.templates.caseDetail }
    },
    doctorId: {
      get () { return this.$store.state.user.doctorId }
    },
    userName: {
      get () { return this.$store.state.user.name }
    }
  },
  created () {
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
            url: this.$http.adornUrl(`/user/patient/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              let caseDetail = this.caseDetail.html
              caseDetail = caseDetail.replace('name', data.patient.name)
              caseDetail = caseDetail.replace('sex', data.patient.sex)
              caseDetail = caseDetail.replace('age', data.patient.age)
              caseDetail = caseDetail.replace('id_num', data.patient.idNumber)
              caseDetail = caseDetail.replace('address', data.patient.address)
              caseDetail = caseDetail.replace('mobile', data.patient.mobile)
              caseDetail = caseDetail.replace('emergency_connect_name', data.patient.emergencyConnectName)
              caseDetail = caseDetail.replace('emergency_connect_mobile', data.patient.emergencyConnectMobile)
              this.dataForm.content = caseDetail
            }
          }).then(() => {
            this.$http({
              url: this.$http.adornUrl('/user/patientrecord/queryAllRecordByPatientId'),
              method: 'get',
              params: this.$http.adornParams({
                'patientId': id
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                let caseDetail = this.dataForm.content
                caseDetail = caseDetail.replace('main_doctor', data.allRecord[0].mainDoctorName)
                caseDetail = caseDetail.replace('chief_doctor', data.allRecord[0].chiefDoctorName)
                caseDetail = caseDetail.replace('bed_doctor', data.allRecord[0].bedDoctorName)
                caseDetail = caseDetail.replace('start_time', data.allRecord[0].startTime)
                caseDetail = caseDetail.replace('end_time', data.allRecord[0].endTime)
                // 入院次数
                caseDetail = caseDetail.replace('times', data.allRecord.length)
                // 住院号
                caseDetail = caseDetail.replace('inPatientNum', data.allRecord[0].inpatientNum)
                this.dataForm.content = caseDetail
              }
              return data.allRecord[0].id
            }).then((data) => {
              console.log(data)
              this.$http({
                url: this.$http.adornUrl('/user/patientdiagnose/queryAllDiagnoseByRecordId'),
                method: 'get',
                params: this.$http.adornParams({
                  'recordId': data
                })
              }).then(({data}) => {
                if (data && data.code === 0) {
                  let caseDetail = this.dataForm.content
                  for (let i = 0; i < 6; i++) {
                    if (i < data.allDiagnose.length) {
                      caseDetail = caseDetail.replace('diagnose' + i, data.allDiagnose[i].title)
                    } else {
                      caseDetail = caseDetail.replace('diagnose' + i, '无')
                    }
                  }
                  this.dataForm.content = caseDetail
                }
              })
            })
          })
        }
      })
    }
  }
}
</script>
