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
              <Button type="primary" long :loading="loading" @click="handleSubmit">登录</Button>
            </FormItem>
          </Form>
          <div style="padding-top:10px;font-size: 11px;border-top: 1px solid #e9eaec;">
            <span style="vertical-align:middle;">其他登录：</span>
            <img style="vertical-align:middle;" @click="qqLogin" :src="qq_login" alt=""> &nbsp;
            <img style="vertical-align:middle;" @click="wxLogin" :src="wx_login" alt="">
          </div>
        </div>
      </Card>
    </div>
    <Modal v-model="wxQrModel" width="360">
      <p slot="header" style="color:#2d8cf0;">
        <Icon type="information-circled"></Icon>
        <span>请用微信扫码登录</span>
      </p>
      <div style="text-align:center">
        <img :src="wxQrUrl" alt="">
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="wxQrModel = false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { loginByQQ, wx, getQQCode, getQr, checkWxLogin, getWxCode } from '@/api/third-login'
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
      },
      wxQrModel: false,
      wxQrUrl: '',
      loading: false
    }
  },
  created () {
    let p = this.$route.params.loginType
    let q = this.$route.query
    if (p) {
      this.$Spin.show()
      let vm = this
      switch (p) {
        case 'qq':
          loginByQQ(q).then(response => {
            vm.$Spin.hide()
            vm.$store.commit('setUserInfo', response.data.data)
            vm.$store.commit('setToken', response.data.data.apiAuth)
            sessionStorage.setItem('ApiAdmin_AppInfo', '管理员')
            vm.$router.push({
              name: 'home'
            })
          })
          break
        case 'wx':
          wx(q).then(response => {
            vm.$Spin.hide()
            vm.$store.commit('setUserInfo', response.data.data)
            vm.$store.commit('setToken', response.data.data.apiAuth)
            sessionStorage.setItem('ApiAdmin_AppInfo', '管理员')
            vm.$router.push({
              name: 'home'
            })
          })
          break
        default :
          this.$Spin.hide()
          break
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
          vm.loading = true
          vm.handleLogin({ username, password }).then(() => {
            sessionStorage.setItem('ApiAdmin_AppInfo', '管理员')
            vm.$router.push({
              name: 'home'
            })
            vm.loading = false
          }).catch(() => {
            vm.loading = false
          })
        }
      })
    },
    qqLogin () {
      getQQCode().then(response => {
        window.location.href = 'https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=' +
          response.data.data.appId + '&redirect_uri=' + response.data.data.redirectUri +
          '&response_type=code&state=' + response.data.data.state
      })
    },
    wxLoginBak () {
      let vm = this
      vm.wxQrModel = true
      getQr().then(function (response) {
        vm.wxQrUrl = response.data.data.qrUrl
        let checkWx = setInterval(function () {
          checkWxLogin({ state: response.data.data.state }).then(res => {
            if (res.data.code === 1) {
              vm.$store.commit('setUserInfo', res.data.data)
              vm.$store.commit('setToken', res.data.data.apiAuth)
              vm.$Message.success(res.data.msg)
              vm.$router.push({
                name: 'home'
              })
              clearInterval(checkWx)
            }
          }).catch(() => {
            clearInterval(checkWx)
          })
        }, 3000)
      })
    },
    wxLogin () {
      getWxCode().then(response => {
        window.location.href = 'https://open.weixin.qq.com/connect/qrconnect?appid=' +
          response.data.data.appId + '&redirect_uri=' + response.data.data.redirectUri +
          '&response_type=code&scope=snsapi_login&state=' + response.data.data.state + '#wechat_redirect'
      })
    }
  }
}
</script>
