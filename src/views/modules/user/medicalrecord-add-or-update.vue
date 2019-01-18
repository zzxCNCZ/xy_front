<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :fullscreen="dataForm.id"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="床号" prop="bedNum">
      <el-input v-model="dataForm.bedNum" placeholder="床号"></el-input>
    </el-form-item>
    <el-form-item label="住院号" prop="inpatientNum">
      <el-input v-model="dataForm.inpatientNum" placeholder="住院号"></el-input>
    </el-form-item>
    <el-form-item label="姓名" prop="name">
      <el-input v-model="dataForm.name" placeholder="姓名"></el-input>
    </el-form-item>
    <el-form-item label="性别" prop="sex">
      <el-input v-model="dataForm.sex" placeholder="性别"></el-input>
    </el-form-item>
    <el-form-item label="年龄" prop="age">
      <el-input v-model="dataForm.age" placeholder="年龄"></el-input>
    </el-form-item>
    <el-form-item label="护理级别" prop="nurseLevel">
      <el-input v-model="dataForm.nurseLevel" placeholder="护理级别"></el-input>
    </el-form-item>
    <el-form-item label="管床医师" prop="bedDoctor">
      <el-input v-model="dataForm.bedDoctor" placeholder="管床医师"></el-input>
    </el-form-item>
    <el-form-item label="主治医师" prop="visitingStaff">
      <el-input v-model="dataForm.visitingStaff" placeholder="主治医师"></el-input>
    </el-form-item>
    <el-form-item label="主任医师" prop="archiater">
      <el-input v-model="dataForm.archiater" placeholder="主任医师"></el-input>
    </el-form-item>
    <el-form-item label="住院日期" prop="hospitalDate">
      <el-date-picker
        v-model="dataForm.hospitalDate"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="住院日期">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="出院日期" prop="dischargeDate">
      <el-date-picker
        v-model="dataForm.dischargeDate"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="出院日期">
      </el-date-picker>
    </el-form-item>
    <el-form-item v-if="dataForm.id" label="病历" prop="record">
      <vue-ueditor-wrap  :config="ueConfig"  v-model="dataForm.record"></vue-ueditor-wrap>
      <!--<el-input v-model="dataForm.record" placeholder="病历"></el-input>-->
      <el-button  style="float: right;margin-top: 10px" @click="generatorRecord()">初始化病历</el-button>
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
        bedNum: '',
        inpatientNum: '',
        name: '',
        sex: '',
        age: '',
        nurseLevel: '',
        bedDoctor: '',
        visitingStaff: '',
        archiater: '',
        hospitalDate: '',
        dischargeDate: '',
        record: '',
        delFlag: '',
        createBy: '',
        createTime: '',
        modifyBy: '',
        modifyTime: ''
      },
      dataRule: {
        bedNum: [
          { required: true, message: '床号不能为空', trigger: 'blur' }
        ],
        inpatientNum: [
          { required: true, message: '住院号不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '性别不能为空', trigger: 'blur' }
        ],
        age: [
          { required: true, message: '年龄不能为空', trigger: 'blur' }
        ],
        nurseLevel: [
          { required: true, message: '护理级别不能为空', trigger: 'blur' }
        ],
        bedDoctor: [
          { required: true, message: '管床医师不能为空', trigger: 'blur' }
        ],
        visitingStaff: [
          { required: true, message: '主治医师不能为空', trigger: 'blur' }
        ],
        archiater: [
          { required: true, message: '主任医师不能为空', trigger: 'blur' }
        ],
        hospitalDate: [
          { required: true, message: '住院日期不能为空', trigger: 'blur' }
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
    }
  },
  methods: {
    generatorRecord () {
      console.log(this.record)
      let mdedicalRecord = this.record.html
      mdedicalRecord = mdedicalRecord.replace('name', this.dataForm.name)
      mdedicalRecord = mdedicalRecord.replace('bed_num', this.dataForm.bedNum)
      mdedicalRecord = mdedicalRecord.replace('inpatient_num', this.dataForm.inpatientNum)
      mdedicalRecord = mdedicalRecord.replace('sex', this.dataForm.sex)
      mdedicalRecord = mdedicalRecord.replace('age', this.dataForm.age)
      mdedicalRecord = mdedicalRecord.replace('hospital_date', this.dataForm.hospitalDate)
      this.dataForm.record = mdedicalRecord
    },
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/user/medicalrecord/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.bedNum = data.medicalRecord.bedNum
              this.dataForm.inpatientNum = data.medicalRecord.inpatientNum
              this.dataForm.name = data.medicalRecord.name
              this.dataForm.sex = data.medicalRecord.sex
              this.dataForm.age = data.medicalRecord.age
              this.dataForm.nurseLevel = data.medicalRecord.nurseLevel
              this.dataForm.bedDoctor = data.medicalRecord.bedDoctor
              this.dataForm.visitingStaff = data.medicalRecord.visitingStaff
              this.dataForm.archiater = data.medicalRecord.archiater
              this.dataForm.hospitalDate = data.medicalRecord.hospitalDate
              this.dataForm.dischargeDate = data.medicalRecord.dischargeDate
              this.dataForm.record = data.medicalRecord.record
              this.dataForm.delFlag = data.medicalRecord.delFlag
              this.dataForm.createBy = data.medicalRecord.createBy
              this.dataForm.createTime = data.medicalRecord.createTime
              this.dataForm.modifyBy = data.medicalRecord.modifyBy
              this.dataForm.modifyTime = data.medicalRecord.modifyTime
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
            url: this.$http.adornUrl(`/user/medicalrecord/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'bedNum': this.dataForm.bedNum,
              'inpatientNum': this.dataForm.inpatientNum,
              'name': this.dataForm.name,
              'sex': this.dataForm.sex,
              'age': this.dataForm.age,
              'nurseLevel': this.dataForm.nurseLevel,
              'bedDoctor': this.dataForm.bedDoctor,
              'visitingStaff': this.dataForm.visitingStaff,
              'archiater': this.dataForm.archiater,
              'hospitalDate': this.dataForm.hospitalDate,
              'dischargeDate': this.dataForm.dischargeDate,
              'record': this.dataForm.record,
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
