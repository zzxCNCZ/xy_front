<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <!--<el-form-item label="病人id" prop="patientId">-->
      <!--<el-input v-model="dataForm.patientId" placeholder="病人id"></el-input>-->
    <!--</el-form-item>-->
    <el-form-item label="床号" prop="bedNum">
      <el-input v-model="dataForm.bedNum" placeholder="床号"></el-input>
    </el-form-item>
    <el-form-item label="住院号" prop="inpatientNum">
      <el-input v-model="dataForm.inpatientNum" placeholder="住院号"></el-input>
    </el-form-item>
    <el-form-item label="科室(单位编码)" prop="deptNum">
      <el-input v-model="dataForm.deptNum" placeholder="科室(单位编码)"></el-input>
    </el-form-item>
    <el-form-item label="护理级别" prop="nurseLevel">
      <el-input v-model="dataForm.nurseLevel" placeholder="护理级别"></el-input>
    </el-form-item>
    <el-form-item label="管床医师" prop="bedDoctor">
      <el-select v-model="dataForm.bedDoctor" style="display: grid"   placeholder="请选择">
        <el-option
          v-for="item in bedDoctorOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="主治医师" prop="mainDoctor">
      <el-select v-model="dataForm.mainDoctor" style="display: grid"   placeholder="请选择">
        <el-option
          v-for="item in mainDoctorOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="主任医师" prop="chiefDoctor">
      <el-select v-model="dataForm.chiefDoctor" style="display: grid"   placeholder="请选择">
        <el-option
          v-for="item in chiefDoctorOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <!--<el-form-item label="是否出院 1 出院  0 未出院" prop="status">-->
      <!--<el-input v-model="dataForm.status" placeholder="是否出院 1 出院  0 未出院"></el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="入院日期" prop="startTime">-->
      <!--<el-input v-model="dataForm.startTime" placeholder="入院日期"></el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="出院日期" prop="endTime">-->
      <!--<el-input v-model="dataForm.endTime" placeholder="出院日期"></el-input>-->
    <!--</el-form-item>-->
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
        patientId: '',
        bedNum: '',
        inpatientNum: '',
        deptNum: '',
        nurseLevel: '',
        bedDoctor: '',
        mainDoctor: '',
        chiefDoctor: '',
        status: '',
        startTime: '',
        endTime: '',
        delFlag: '',
        createBy: '',
        createTime: '',
        modifyBy: '',
        modifyTime: ''
      },
      bedDoctorOptions: [],
      mainDoctorOptions: [],
      chiefDoctorOptions: [],
      dataRule: {
        patientId: [
          { required: true, message: '病人id不能为空', trigger: 'blur' }
        ],
        bedNum: [
          { required: true, message: '床号不能为空', trigger: 'blur' }
        ],
        inpatientNum: [
          { required: true, message: '住院号不能为空', trigger: 'blur' }
        ],
        deptNum: [
          { required: true, message: '科室(单位编码)不能为空', trigger: 'blur' }
        ],
        nurseLevel: [
          { required: true, message: '护理级别不能为空', trigger: 'blur' }
        ],
        bedDoctor: [
          { required: true, message: '管床医师不能为空', trigger: 'blur' }
        ],
        mainDoctor: [
          { required: true, message: '主治医师不能为空', trigger: 'blur' }
        ],
        chiefDoctor: [
          { required: true, message: '主任医师不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '是否出院 1 出院  0 未出院不能为空', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '入院日期不能为空', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '出院日期不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    initRecord (patientId) {
      this.dataForm.patientId = patientId
      this.visible = true
      this.init(0)
    },
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.getBedDoctorOption()
      this.getMainDoctorOption()
      this.getChiefDoctorOption()
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/user/patientrecord/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.patientId = data.patientRecord.patientId
              this.dataForm.bedNum = data.patientRecord.bedNum
              this.dataForm.inpatientNum = data.patientRecord.inpatientNum
              this.dataForm.deptNum = data.patientRecord.deptNum
              this.dataForm.nurseLevel = data.patientRecord.nurseLevel
              this.dataForm.bedDoctor = data.patientRecord.bedDoctor
              this.dataForm.mainDoctor = data.patientRecord.mainDoctor
              this.dataForm.chiefDoctor = data.patientRecord.chiefDoctor
              this.dataForm.status = data.patientRecord.status
              this.dataForm.startTime = data.patientRecord.startTime
              this.dataForm.endTime = data.patientRecord.endTime
            }
          })
        }
      })
    },
    getBedDoctorOption () {
      this.bedDoctorOptions = []
      this.$http({
        url: this.$http.adornUrl('/user/doctor/getDoctorByJob'),
        method: 'get',
        params: this.$http.adornParams({
          job: 'bed'
        })
      }).then(({data}) => {
        data.doctor.map(item => {
          let option = {}
          option.value = item.id
          option.label = item.name
          this.bedDoctorOptions.push(option)
        })
      })
    },
    getMainDoctorOption () {
      this.mainDoctorOptions = []
      this.$http({
        url: this.$http.adornUrl('/user/doctor/getDoctorByJob'),
        method: 'get',
        params: this.$http.adornParams({
          job: 'main'
        })
      }).then(({data}) => {
        data.doctor.map(item => {
          let option = {}
          option.value = item.id
          option.label = item.name
          this.mainDoctorOptions.push(option)
        })
      })
    },
    getChiefDoctorOption () {
      this.chiefDoctorOptions = []
      this.$http({
        url: this.$http.adornUrl('/user/doctor/getDoctorByJob'),
        method: 'get',
        params: this.$http.adornParams({
          job: 'chief'
        })
      }).then(({data}) => {
        data.doctor.map(item => {
          let option = {}
          option.value = item.id
          option.label = item.name
          this.chiefDoctorOptions.push(option)
        })
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/user/patientrecord/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'patientId': this.dataForm.patientId,
              'bedNum': this.dataForm.bedNum,
              'inpatientNum': this.dataForm.inpatientNum,
              'deptNum': this.dataForm.deptNum,
              'nurseLevel': this.dataForm.nurseLevel,
              'bedDoctor': this.dataForm.bedDoctor,
              'mainDoctor': this.dataForm.mainDoctor,
              'chiefDoctor': this.dataForm.chiefDoctor,
              'status': this.dataForm.status,
              'startTime': this.dataForm.startTime,
              'endTime': this.dataForm.endTime
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
