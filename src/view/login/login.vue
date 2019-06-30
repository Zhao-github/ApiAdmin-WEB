<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login" @keydown.enter="handleSubmit">
    <div class="login-con">
      <Card icon="md-log-in" title="欢迎登录ApiAdmin后台管理系统" :bordered="false">
        <div class="form-con">
          <Form ref="loginForm" :model="form" :rules="rules">
            <FormItem prop="username">
              <Input v-model="form.username" placeholder="请使用微信/QQ登录">
                <span slot="prepend">
                  <Icon :size="16" type="ios-person"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="form.password" placeholder="请使用微信/QQ登录">
                <span slot="prepend">
                  <Icon :size="14" type="md-lock"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem style="margin-bottom: 15px;">
              <Button @click="handleSubmit" type="primary" long>登录</Button>
            </FormItem>
          </Form>
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
import { mapActions } from 'vuex'
import qq_login from '@/assets/images/qq-login.png'
import wx_login from '@/assets/images/wx-login.png'

export default {
  data () {
    return {
      qq_login,
      wx_login,
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapActions([
      'handleLogin'
    ]),
    handleSubmit () {
      let vm = this
      let username = vm.form.username
      let password = vm.form.password
      vm.$refs.loginForm.validate((valid) => {
        if (valid) {
          vm.handleLogin({ username, password }).then(res => {
            vm.$router.push({
              name: 'home'
            })
          })
        }
      })
    }
  }
}
</script>
