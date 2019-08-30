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
        <MenuItem name="4">
          <Icon type="ios-contact" />
          58282746
        </MenuItem>
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
import { errorCode } from '@/api/wiki'
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
