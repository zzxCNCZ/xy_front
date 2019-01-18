<template lang="html">
  <el-container style=" border: 1px solid #eee">
    <el-main>
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.projectName" placeholder="项目名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getUserInfo()">查询</el-button>
          <el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
          <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
          <el-button v-if="isAuth('user:ctuser:import')" type="primary" @click="listImportHandle()">导入</el-button>
          <el-button v-if="isAuth('user:ctuser:export')" type="primary" @click="listExportHandle1()">导出</el-button>
<!--
          <a :href="listExportHandle()"><el-button v-if="isAuth('user:ctuser:export')" type="primary" >导出</el-button></a>
-->
        </el-form-item>
      </el-form>
      <el-table :data="dataList"
                @sort-change="sortChangeHandle">
        <el-table-column prop="id" sortable="custom"
                         label="项目编号">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"
                         fixed
                         prop="proName"
                         label="名称"
                         sortable="custom"
                         width="180">
        </el-table-column>
        <el-table-column prop="status" label="状态">
        </el-table-column>
        <el-table-column prop="department" label="部门" width="180">
      </el-table-column>
        <el-table-column prop="customerId" label="客户ID" >
        </el-table-column>
        <el-table-column prop="joinname" label="录入人" width="180">
        </el-table-column>
        <el-table-column prop="productId" label="产品ID" width="180">
        </el-table-column>
        <el-table-column prop="jointime" label="日期" width="180">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
            <template slot-scope="scope">
              <el-button v-if="isAuth('user:project:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.userId)">修改</el-button>
              <el-button v-if="isAuth('user:project:delete')" type="text" size="small" @click="deleteHandle(scope.row.userId)">删除</el-button>
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
        <!--:page-size="20"
        :pager-count="11"
        layout="prev, pager, next"
        :total="1000">-->
      </el-pagination>
    </el-main>
    <list-import v-if="listImportVisible" ref="listImport" ></list-import>
  </el-container>
</template>

<style>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }
</style>

<script>
import ListImport from './user/list-import'
import Vue from 'vue'
export default {
  data () {
    return {
      dataForm: {
        projectName: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      sidx: '',
      order: '',
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      listImportVisible: false
    }
    /* return {
        tableData: []
      } */
  },
  components: {ListImport},
  created () {
    this.getUserInfo()
  },
  methods: {
    handleClick (row) {
      console.log(row)
    },
    listExportHandle () {
      var url = this.$http.adornUrl('/user/ctuser/export') + '?token=' + Vue.cookie.get('token')
      return url
      /* this.$http({
        url: this.$http.adornUrl('/user/ctuser/export')
      }) */
    },
    listExportHandle1 () {
      this.$http({
        url: this.$http.adornUrl('/user/ctuser/export'),
        responseType: 'arraybuffer'
      }).then((res) => {
        var myURL = window.URL || window.webkitURL
        let blob = new Blob([res.data], {type: 'application/vnd.ms-excel'})
        let link = document.createElement('a')
        link.href = myURL.createObjectURL(blob)
        link.download = '111.xls'
        link.click()
        /* let objectUrl = myURL.createObjectURL(blob)
        window.location.href = objectUrl */
      })
    },
    listImportHandle (val) {
      this.listImportVisible = true
      this.$nextTick(() => {
        this.$refs.listImport.init()
      })
    },
    sortChangeHandle (val) {
      this.sidx = val.prop
      this.order = val.order
      this.getUserInfo()
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getUserInfo()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getUserInfo()
    },
    getUserInfo () {
      console.log(this.sidx, this.order)
      this.$http({
        url: this.$http.adornUrl('/user/project/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'projectName': this.dataForm.projectName,
          'sidx': this.sidx,
          'order': this.order
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
      /* this.$http({
          url: this.$http.adornUrl('/sys/user/test'),
          method: 'post',
          params: ''
        }).then(({data}) => {
          console.log(data)
          this.tableData = Array(20).fill(data)
        }) */
    }
  }
}
</script>
