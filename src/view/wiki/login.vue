<style lang="less">
  @import 'login.less';
</style>

<template>
  <div class="wiki-login" @keydown.enter="handleSubmit">
    <div class="wiki-login-con">
      <div class="form-con">
        <span style="font-size: 20px;">ApiAdmin文档中心</span>
        <Form ref="loginForm" :model="form" :rules="rules" class="margin-top-15">
          <FormItem prop="username">
            <Input v-model="form.username" placeholder="请输入AppId">
                <span slot="prepend">
                  <Icon :size="16" type="ios-person"></Icon>
                </span>
            </Input>
          </FormItem>
          <FormItem prop="password">
            <Input type="password" v-model="form.password" placeholder="请输入AppSecret">
                <span slot="prepend">
                  <Icon :size="14" type="md-lock"></Icon>
                </span>
            </Input>
          </FormItem>
          <FormItem class="margin-bottom-15">
            <Button type="primary" long :loading="loading" @click="handleSubmit">登录</Button>
          </FormItem>
        </Form>
        <div class="wiki-login-tip">
          如没有账号请联系管理员
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/wiki'
import { setToken } from '@/libs/util'

export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: 'AppId不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'AppSecret不能为空', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    handleSubmit () {
      let vm = this
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          vm.loading = true
          login(vm.form).then(response => {
            vm.$Message.success(response.data.msg)
            setToken(response.data.data.apiAuth)
            sessionStorage.setItem('ApiAdmin_AppInfo', response.data.data.app_id)
            vm.$router.push({
              name: 'wiki_list'
            })
            vm.loading = false
          }).catch(() => {
            vm.loading = false
          })
        }
      })
    }
  }
}
</script>
