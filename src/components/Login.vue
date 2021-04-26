<template>
  <div class="login-container">
    <!--路由占位符-->
    <div class="login-box">
        <!-- 头像区域 -->
     <div class="avatar-box">
      <img src="../assets/logo.png" alt="">
     </div>
        <!-- 登录表单区域 -->
     <div class="login-input">
     <el-form ref="loginFormRef" :model='loginForm' label-width="65px" class="login-form" :rules="loginFormRules">
        <el-form-item prop="username" label="用户名">
            <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
            <el-input v-model="loginForm.password" placeholder="请输入密码"
            prefix-icon="el-icon-goods"
            type="password"
            ></el-input>
        </el-form-item>
        <el-form-item  class="login-btns">
         <el-button @click="submitForm('loginFormRef')" type="primary">登录</el-button>
         <el-button @click="resetForm('loginFormRef')" type="primary">重置</el-button>
        </el-form-item>
     </el-form>
     </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'w2b',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '账号不能为空', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      console.log(this)
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          await this.$http.post('login', {
            name: this.loginForm.username,
            password: this.loginForm.password
          })
          this.$message({
            message: '登录成功~',
            type: 'success'
          })
          this.$router.push('/home')
        } else {
          this.$message({
            message: '登录失败~',
            type: 'warning'
          })
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style lang='less' scoped>
.login-container{
 background-color: #bfa;
 height: 100%;
}
.login-box{
 width: 450px;
 height: 300px;
 background-color: #fff;
 border-radius: 3px;
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translate(-50%,-50%);
 .avatar-box{
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      box-shadow: 0 0 10px #ddd;
      padding: 10px;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
  }
  }
 .login-input{
   .login-form{
       box-sizing: border-box;
       position: absolute;
       bottom: 0;
       padding: 0 10px;
       width: 100%;
        .login-btns{
            display: flex;
            justify-content: flex-end;
        }
   }
 }

}
</style>
