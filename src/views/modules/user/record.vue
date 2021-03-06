<template>
  <el-dialog
    :title="!dataForm.id ? '住院记录' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="70%"
    append-to-body
  >
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @submit.native.prevent  @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.inpatientNum" placeholder="住院号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <!--<el-button v-if="isAuth('user:patientrecord:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>-->
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        prop="bedNum"
        header-align="center"
        align="center"
        label="床号">
      </el-table-column>
      <el-table-column
        prop="inpatientNum"
        header-align="center"
        align="center"
        label="住院号">
      </el-table-column>
      <el-table-column
        prop="deptNum"
        header-align="center"
        align="center"
        label="科室(单位编码)">
      </el-table-column>
      <el-table-column
        prop="nurseLevel"
        header-align="center"
        align="center"
        label="护理级别">
        <template slot-scope="scope">
          {{scope.row.nurseLevel | nurseLevelFilter}}
        </template>
      </el-table-column>
      <el-table-column
        prop="bedDoctorName"
        header-align="center"
        align="center"
        label="管床医师">
      </el-table-column>
      <el-table-column
        prop="mainDoctorName"
        header-align="center"
        align="center"
        label="主治医师">
      </el-table-column>
      <el-table-column
        prop="chiefDoctorName"
        header-align="center"
        align="center"
        label="主任医师">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="是否出院">
        <template slot-scope="scope">
          {{scope.row.status | statusFilter}}
        </template>
      </el-table-column>
      <el-table-column
        prop="startTime"
        header-align="center"
        align="center"
        label="入院日期">
      </el-table-column>
      <el-table-column
        prop="endTime"
        header-align="center"
        align="center"
        label="出院日期">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="病程">
        <template slot-scope="scope">
          <el-button  type="text" size="small" @click="getDiagnoseList(scope.row.id)">历史记录</el-button>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="缴费">
        <template slot-scope="scope">
          <el-button  type="text" size="small" @click="getPatientCostList(scope.row.id)">历史记录</el-button>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <!-- 病历历史-->
    <diagnose-list v-if="diagnoseListVisible" ref="diagnoseList" @refreshDataList="getDataList"></diagnose-list>
    <!-- 缴费历史-->
    <patient-cost-list v-if="patientCostListVisible" ref="patientCostList" @refreshDataList="getDataList"></patient-cost-list>
  </div>
  </el-dialog>
</template>

<script>
import AddOrUpdate from './patientrecord-add-or-update'
import DiagnoseList from './diagnose'
import PatientCostList from './cost'

export default {
  data () {
    return {
      dataForm: {
        patientId: '',
        inpatientNum: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      visible: false,
      diagnoseListVisible: false,
      patientCostListVisible: false
    }
  },
  components: {
    AddOrUpdate,
    DiagnoseList,
    PatientCostList
  },
  activated () {
    // this.getDataList()
  },
  filters: {
    statusFilter: status => {
      if (status === 1) {
        return '是'
      } else {
        return '否'
      }
    },
    nurseLevelFilter: level => {
      if (level === '1') {
        return '普通护理'
      } else if (level === '2') {
        return '特殊护理'
      } else if (level === '3') {
        return '紧急护理'
      } else {
        return '其他'
      }
    }
  },
  methods: {
    initRecordList (patientId) {
      this.dataForm.patientId = patientId
      this.getDataList()
    },
    // 病历记录
    getDiagnoseList (recordId) {
      this.diagnoseListVisible = true
      this.$nextTick(() => {
        this.$refs.diagnoseList.initDiagnoseList(recordId)
      })
    },
    // 缴费记录
    getPatientCostList (recordId) {
      this.patientCostListVisible = true
      this.$nextTick(() => {
        this.$refs.patientCostList.initPatientCostList(recordId)
      })
    },
    // 获取数据列表
    getDataList () {
      this.visible = true
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/user/patientrecord/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'patientId': this.dataForm.patientId,
          'inpatientNum': this.dataForm.inpatientNum
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle (id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/user/patientrecord/delete'),
          method: 'post',
          data: this.$http.adornData(ids, false)
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    }
  }
}
</script>
