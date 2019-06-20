<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <div style="padding-top:10px;font-size: 11px;border-top: 1px solid #e9eaec;">
            <span style="vertical-align:middle;">其他登录：</span>
            <img style="vertical-align:middle;" :src="qq_login" alt=""> &nbsp;
            <img style="vertical-align:middle;" :src="wx_login" alt="">
          </div>
        </div>

      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
import qq_login from '@/assets/images/qq_login.png'
import wx_login from '@/assets/images/wx_login.png'
export default {
  components: {
    LoginForm
  },
  data () {
    return {
      qq_login,
      wx_login
    }
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ username, password }) {
      this.handleLogin({ username, password }).then(res => {
        this.$router.push({
          name: 'home'
        })
      })
    }
  }
}
</script>

<style>

</style>
