<template>
  <Layout style="height: 100%">
    <Menu mode="horizontal" theme="dark" active-name="error">
      <div class="wiki-logo"></div>
      <div class="wiki-nav">
        <MenuItem name="list" to="/wiki/list">
          <Icon type="md-list-box" />
          接口列表
        </MenuItem>
        <MenuItem name="error" to="/wiki/error">
          <Icon type="logo-markdown" />
          错误码
        </MenuItem>
        <MenuItem name="calculation" to="/wiki/calculation">
          <Icon type="ios-analytics" />
          算法详解
        </MenuItem>
        <Submenu name="4">
          <template slot="title">
            <Icon type="ios-contact" />
            {{app_id}}
          </template>
          <MenuItem name="4-1" @click.native="logout">
            <Icon type="md-exit" />
            用户登出
          </MenuItem>
        </Submenu>
      </div>
    </Menu>
    <Content class="wiki-content-con">
      <div class="wiki-error-code-layout-con">
        <template>
          <Table stripe :columns="columns" :data="data"></Table>
        </template>
        <ABackTop :height="100" :bottom="80" :right="60" container=".wiki-error-code-layout-con"></ABackTop>
      </div>
    </Content>
    <Footer class="wiki-footer-center">&copy; Powered  By <Tag color="primary">{{co}}</Tag></Footer>
  </Layout>
</template>
<script>
import './list.less'
import { errorCode, logout } from '@/api/wiki'
import { setToken } from '@/libs/util'
import ABackTop from '@/components/main/components/a-back-top'

export default {
  name: 'wiki',
  components: {
    ABackTop
  },
  created () {
    this.error()
  },
  data () {
    return {
      app_id: sessionStorage.getItem('ApiAdmin_AppInfo'),
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '英文标识',
          key: 'en_code'
        },
        {
          title: '错误码',
          key: 'code'
        },
        {
          title: '中文说明',
          key: 'chinese'
        }
      ],
      data: [],
      co: ''
    }
  },
  methods: {
    logout () {
      let vm = this
      logout().then(response => {
        vm.$Message.success(response.data.msg)
        setToken('')
        sessionStorage.removeItem('ApiAdmin_AppInfo')
        vm.$router.push({
          name: 'wiki_login'
        })
      })
    },
    error () {
      let vm = this
      errorCode().then(response => {
        vm.data = response.data.data.data
        vm.co = response.data.data.co
      })
    }
  }
}
</script>
