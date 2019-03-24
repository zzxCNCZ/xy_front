<template>
  <el-dialog
    :title="!dataForm.id ? '缴费新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="项目" prop="item">
      <el-input v-model="dataForm.item" placeholder="项目"></el-input>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
    </el-form-item>
    <el-form-item label="费用" prop="cost">
      <el-input v-model="dataForm.cost" placeholder="费用"></el-input>
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
        item: '',
        remark: '',
        cost: '',
        delFlag: '',
        createBy: '',
        createTime: '',
        modifyBy: '',
        modifyTime: ''
      },
      dataRule: {
        item: [
          { required: true, message: '项目不能为空', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '备注不能为空', trigger: 'blur' }
        ],
        cost: [
          { required: true, message: '费用不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    initAddPatientCost (recordId) {
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
            url: this.$http.adornUrl(`/user/patientcost/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.patientRecordId = data.patientCost.patientRecordId
              this.dataForm.item = data.patientCost.item
              this.dataForm.remark = data.patientCost.remark
              this.dataForm.cost = data.patientCost.cost
              this.dataForm.createBy = data.patientCost.createBy
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
            url: this.$http.adornUrl(`/user/patientcost/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'patientRecordId': this.dataForm.patientRecordId,
              'item': this.dataForm.item,
              'remark': this.dataForm.remark,
              'cost': this.dataForm.cost,
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
