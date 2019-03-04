<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="单位名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="单位名称"></el-input>
    </el-form-item>
    <el-form-item label="单位编码" prop="deptNum">
      <el-input v-model="dataForm.deptNum" placeholder="单位编码"></el-input>
    </el-form-item>
    <!--<el-form-item label="父机构id" prop="parentId">-->
      <!--<el-input v-model="dataForm.parentId" placeholder="父机构id"></el-input>-->
    <!--</el-form-item>-->
      <el-form-item label="上级部门" prop="parentName">
        <el-popover
          ref="deptListPopover"
          placement="bottom-start"
          trigger="click">
          <el-tree
            :data="deptList"
            :props="deptListTreeProps"
            node-key="id"
            ref="deptListTree"
            @current-change="deptListTreeCurrentChangeHandle"
            :default-expand-all="true"
            :highlight-current="true"
            :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:deptListPopover :readonly="true" placeholder="点击选择上级部门" class="menu-list__input"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from '@/utils'

export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: 0,
        name: '',
        deptNum: '',
        parentId: '',
        parentName: ''
      },
      dataRule: {
        name: [
          { required: true, message: '单位名称不能为空', trigger: 'blur' }
        ],
        deptNum: [
          { required: true, message: '单位编码不能为空', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '父机构id不能为空', trigger: 'blur' }
        ]
      },
      deptList: [],
      deptListTreeProps: {
        label: 'name',
        children: 'children'
      }
    }
  },
  computed: {
    userName: {
      get () { return this.$store.state.user.name }
    }
  },
  methods: {
    // 单位数选中
    deptListTreeCurrentChangeHandle (data, node) {
      this.dataForm.parentId = data.id
      this.dataForm.parentName = data.name
    },
    // 单位树设置当前选中节点
    deptListTreeSetCurrentNode () {
      this.$refs.deptListTree.setCurrentKey(this.dataForm.parentId)
      this.dataForm.parentName = (this.$refs.deptListTree.getCurrentNode() || {})['name']
    },
    initAdd (parentId) {
      console.log(parentId)
      this.dataForm.parentId = parentId
      this.init(0)
    },
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$http({
        url: this.$http.adornUrl('/user/dept/all'),
        method: 'get',
        params: this.$http.adornParams({
          'deptId': this.dataForm.deptId
        })
      }).then(({data}) => {
        this.deptList = treeDataTranslate(data.deptList, 'id')
      }).then(() => {
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      }).then(() => {
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/user/dept/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.name = data.dept.name
              this.dataForm.deptNum = data.dept.deptNum
              this.dataForm.parentId = data.dept.parentId
              this.dataForm.createBy = data.dept.createBy
              this.deptListTreeSetCurrentNode()
            }
          })
        } else {
          this.deptListTreeSetCurrentNode()
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/user/dept/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'name': this.dataForm.name,
              'deptNum': this.dataForm.deptNum,
              'parentId': this.dataForm.parentId,
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
