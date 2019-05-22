<template>
  <div class="login">
    <div class="box">
      <div class="account">
        <span class="icon-account"></span>
        <input type="text" placeholder="请输入手机号" v-model="account">
      </div>
      <div class="password">
        <span class="icon-password"></span>
        <input type="password" placeholder="请输入密码" v-model="password">
      </div>
      <div class="btn btn-login" @click="login">登录</div>
      <div class="register fl">注册</div>
      <div class="forget fr">忘记密码？</div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  name: "Login",
  data() {
    return {
      account: "",
      password: ""
    };
  },
  components: {
    [Toast.name]: Toast
  },
  methods: {
    login() {
      let loginUrl = `/api/login/cellphone?phone=${this.account}&password=${
        this.password
      }`;
      this.axios
        .get(loginUrl)
        .then(res => {
          this.$set(this.$store.state.currentUser, "id", res.data.account.id);
          console.log(this.$store.state.currentUser.id)
          this.$router.push("/");
          console.log(res.data);
        })
        .catch(error => {
          this.$toast("账号或密码错误");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  background: url("../../public/images/login_bg.jpg") no-repeat;
  background-size: cover;
  overflow: hidden;
  .box {
    width: 50%;
    margin: 60% auto;
    overflow: hidden;
  }
  .account,
  .password {
    border-bottom: 1px solid rgb(190, 189, 189);
  }
  .password {
    margin-top: 20px;
  }
  input {
    width: 80%;
    margin-left: 20px;
    outline: none;
    border: 0;
    background-color: transparent;
    color: rgb(158, 157, 157);
  }
  ::placeholder {
    font-size: 25px;
  }
  .btn {
    width: 100%;
    height: 60px;
    margin-top: 20px;
    color: white;
    line-height: 60px;
    text-align: center;
    border: 1px solid rgb(238, 162, 162);
    background-color: rgb(243, 32, 4);
  }
  .register,
  .forget {
    margin-top: 20px;
    color: rgb(158, 157, 157);
    font-size: 30px;
  }
}
</style>