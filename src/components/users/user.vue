<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 顶部搜索 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.searchContent"
            clearable
            @clear="handleCurrentChange(1)"
          >
            <el-button
              @click="handleSearchClick"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="handleAddUser">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表数据 -->
      <el-table :data="showData" border style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="50px"
        ></el-table-column>
        <el-table-column prop="id" label="id" width="180" align="center">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="modifyUser(scope.row.id,'modify')"
              >修改</el-button
            >
            <el-button type="danger" size="mini" icon="el-icon-delete"
              @click="modifyUser(scope.row.id,'delete')"
              >删除</el-button
            >
            <el-button type="warning" size="mini" icon="el-icon-setting"
              @click="modifyUser(scope.row.id,'assign')"
              >分配</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="queryInfo.pageSize"
        layout=" total, sizes, prev, pager, next, jumper"
        :total="tableData.length"
      >
      </el-pagination>
    </div>
    <!-- 添加用户弹窗 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogFormVisible"
      @close="handleDialogClose"
    >
      <el-form :model="addUserform" :rules="addUserRules" ref="registerFormRef">
        <el-form-item label="用户名" :label-width="'130'" prop="name">
          <el-input v-model="addUserform.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="'130'" prop="password">
          <el-input
            v-model="addUserform.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="registerUser('registerFormRef')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 修改用户内容 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="modifyUserDialog"
      width="50%"
    >
      <div class="demo-image__placeholder">
      <div class="block ">
      <span class="demonstration">个人头像</span>
      <el-image
      style="width: 200px; height: 200px"
      :src="imgSrc"
      ></el-image>
    </div>
    <div class="block">
      <span class="demonstration">自定义</span>
      <!-- 文件上传 -->
      <el-upload
        ref='upload'
        action="#"
        :auto-upload="false"
        list-type="picture-card"
        :limit="fileLimit">
        <i slot="default" class="el-icon-plus"></i>
        <div slot="file" slot-scope="{file}">
        <img
          class="el-upload-list__item-thumbnail"
          :src="file.url" alt="新的图片"
        >
            <span class="el-upload-list__item-actions">
            <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
            >
            <i class="el-icon-zoom-in"></i>
            </span>
            <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
            >
            <i class="el-icon-download"></i>
            </span>
            <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
            >
            <i class="el-icon-delete"></i>
            </span>
            </span>
        </div>
      </el-upload>
      <el-dialog :visible.sync="dialogUploadVisibale" :modal='false'>
      <img width="100%" :src="dialogUploadImageUrl" alt="">
    </el-dialog>
    </div>
      </div>
      <span slot="footer" class="dialog-footer">
      <el-button @click="modifyUserDialog = false">取 消</el-button>
      <el-button type="primary" @click="modifyUserDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    //   自定义密码验证规则，顺带后台查询是否注册过了
    const checkIfExistNmae = (rule, value, callback) => {
      if (value.length === 1) {
        return callback(new Error('名字不能为单字'))
      }
      const that = this
      existBackend(that)

      async function existBackend(that) {
        const res = await that.$http.get(`users/${value}`)
        if (res.status === 400) {
          return callback()
        }
        callback(new Error('名字已被注册~'))
      }
    }
    return {
      // 通过网络获取的总数据
      tableData: [],
      // 展示到表格上的数据，对tabledata进行了slice截取
      showData: [],
      // 页导航相关
      queryInfo: {
        query: '',
        //   当前页数
        pagenum: 1,
        // 当前页显示条数
        pageSize: 2,
        // 搜索内容
        searchContent: ''
      },
      // 该值会决定增加用户form是否弹出
      dialogFormVisible: false,
      //   决定修改用户dialog是否弹出
      modifyUserDialog: false,
      // 添加用户的表单验证
      addUserform: {
        name: '',
        password: ''
      },
      addUserRules: {
        name: [
          { required: true, message: '名字不能为空', trigger: 'blur' },
          { min: 1, max: 5, message: '名字别太长啦' },
          { validator: checkIfExistNmae, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 3, max: 6, message: '密码3-6位啦', trigger: 'blur' }
        ]
      },
      // 用户头像src
      imgSrc: '',
      // 修改里的文件上传
      dialogUploadImageUrl: '',
      dialogUploadVisibale: false,
      disabled: false,
      fileLimit: 1
    }
  },
  methods: {
    async getUserList() {
      const res = await this.$http.get('users')
      res.forEach((element) => {
        this.tableData.push({
          id: element.id,
          name: element.name,
          createTime: element.createAt
        })
      })
      this.showData = this.tableData.slice(
        (this.queryInfo.pagenum - 1) * this.queryInfo.pageSize,
        this.queryInfo.pageSize
      )
    },
    async getSomeUser() {
      const res = await this.$http.get(`users/${this.queryInfo.searchContent}`)
      if (res.status === 400) {
        this.showData = []
        this.tableData = []
        this.$message({
          message: '无查询数据',
          type: 'warning'
        })
      }
      this.showData = []
      this.showData.push({
        id: res.data.id,
        name: res.data.name,
        createTime: res.data.createAt
      })
    },
    handleAddUser() {
      this.dialogFormVisible = true
    },
    handleSearchClick() {
      this.getSomeUser()
    },
    handleSizeChange(val) {
      this.queryInfo.pageSize = val
      const temp = (this.queryInfo.pagenum - 1) * this.queryInfo.pageSize
      this.showData = this.tableData.slice(temp, temp + this.queryInfo.pageSize)
      console.log(`每页${val}条`, this.showData)
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      console.log('pagenum =', val)
      console.log('pageSize =', this.queryInfo.pageSize)
      console.log('tableData', this.tableData)
      const temp = (this.queryInfo.pagenum - 1) * this.queryInfo.pageSize
      this.showData = this.tableData.slice(temp, temp + this.queryInfo.pageSize)
      console.log(`当前页${val}条`, this.showData)
    },
    registerUser(ref) {
      this.$refs[ref].validate(async (valid) => {
        //  验证通过后进行后台注册
        if (valid) {
          const res = await this.$http.post('users', {
            name: this.addUserform.name,
            password: this.addUserform.password
          })
          if (res) {
            this.$message({
              message: '注册成功',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.getUserList()
          }
        }
      })
    },
    // 用于当点击添加用户对话框关闭时，清除掉已填内容，避免下次进入还有之前数值
    handleDialogClose() {
      this.$refs.registerFormRef.resetFields()
    },
    // 修改按钮点击触发
    async modifyUser(id, method) {
      console.log('id=', id)
      let res = ''
      switch (method) {
        case 'modify':
          //   打开修改框
          this.modifyUserDialog = true
          this.imgSrc = `http://123.57.194.18:8080/users/${id}/avatar`
          break
        case 'delete':
          res = await this.$http.delete(`users/${id}`)
          console.log('delete=>', res)
          break
        case 'assign':
          console.log('ll')
          break
        default:
          break
      }
    },
    // 文件上传处理
    handleRemove(file) {
      console.log(`remove ${file}`)
      this.$refs.upload.clearFiles()
    },
    handlePictureCardPreview(file) {
      this.dialogUploadImageUrl = file.url
      this.dialogUploadVisibale = true
    },
    async handleDownload(file) {
      console.log(`download ${file}`, file)
      const formdata = new FormData()
      formdata.append('avatar', file.raw, file.name)
      const res = await this.$http.post('/upload/avatar', formdata)
      console.log('handledownload=', res)
      this.handleRemove(file)
      this.dialogUploadImageUrl = ''
    }
  },
  created() {
    this.getUserList()
  }
}
</script>
<style lang="less" scoped>
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 100%;
  margin-top: 20px;
}
.el-row {
  margin-bottom: 20px;
}
.demo-image__placeholder {
  display: flex;
  justify-content: space-around;
}
.block  {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.demonstration {
    padding-bottom: 12px;
}
</style>
