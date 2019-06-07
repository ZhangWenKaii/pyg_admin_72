<template>
  <div id="login-container">
    <div id="login-box">
      <div id="avatar-box">
        <img src="../assets/img/logo.png" alt="" />
      </div>

      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username">
            <i slot="prefix" class="iconfont icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" show-password>
            <i slot="prefix" class="iconfont icon-3702mima"></i>
          </el-input>
        </el-form-item>
        <el-row>
          <el-col :push="15">
            <el-button type="primary" @click="login()">登录</el-button>
            <el-button type="info" @click="$refs.loginFormRef.resetFields()"
              >重置</el-button
            >
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    // 管理员登录系统
    login() {
      // 登录表单做校验
      this.$refs.loginFormRef.validate(async valid => {
        // console.log(valid);
        // valid===true: 表单校验通过
        // valid===false: 表单校验失败
        if (valid === true) {
          // axios带着"用户名和密码"到达服务器端做有效性校验
          var { data: dt } = await this.$http.post("login", this.loginForm);
          console.log(dt);
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg);
          }

          // 在前端通过sessionStorage把服务器返回的token令牌存储好
          window.sessionStorage.setItem("token", dt.data.token);

          // 编程式导航，进行路由跳转执行/home
          this.$router.push("/home");
        }
      });
    }
  },
  data() {
    return {
      // 表单校验规则定义
      loginFormRules: {
        username: [{ required: true, message: "用户名必填", trigger: "blur" }],
        password: [{ required: true, message: "密码必填", trigger: "blur" }]
      },
      // form表单数据对象
      loginForm: {
        username: "admin", // 用户名称
        password: "123456" // 用户密码
      }
    };
  }
};
</script>

<style lang="less" scoped>
#login-container {
  background-color: #2b4b6b;
  height: 100%;
  overflow: hidden;
  #login-box {
    width: 450px;
    height: 304px;
    background-color: #fff;
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .el-form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
    }
    #avatar-box {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      border: 1px solid #eee;
      padding: 8px;
      box-shadow: 0 0 10px #eee;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
}
</style>
