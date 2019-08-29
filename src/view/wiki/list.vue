<style scoped>
  .line-height-16 {
    line-height: 30px;
  }
  .url {
    width: 90%;
    display: inline-block;
  }
</style>
<template>
  <Layout style="height: 100%">
    <Menu mode="horizontal" theme="dark" active-name="list">
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
      <Card class="margin-top-15">
        <div>
          <h3 class="line-height-16">接口状态说明：</h3>
          <p class="line-height-16"><Tag color="warning">测试</Tag>系统将不过滤任何字段，也不进行AccessToken的认证，但在必要的情况下会进行UserToken的认证！</p>
          <p class="line-height-16"><Tag color="primary">启用</Tag>系统将严格过滤请求字段，并且进行全部必要认证！</p>
          <p class="line-height-16"><Tag color="error">禁用</Tag>系统将拒绝所有请求，一般应用于危机处理！</p>
        </div>
      </Card>
      <div class="wiki-layout-con">
        <Collapse>
          <Panel name="1">
            史蒂夫·乔布斯【2019-10-20 20:30:33】 <span style="float: right;margin-right: 20px;">接口数量20 | 项目热度20</span>
            <p slot="content">
              <span @click="value3 = true">
                <Alert>
                  <h3>/api/5d2d89ec8bffc</h3>
                  <template slot="desc"><Tag color="primary">GET</Tag>获取手机号/固定电话归属地</template>
                </Alert>
              </span>
              <span @click="value3 = true">
                <Alert>
                  <h3>/api/5d2d89ec8bffc</h3>
                  <template slot="desc"><Tag color="primary">GET</Tag>获取手机号/固定电话归属地</template>
                </Alert>
              </span>
              <span @click="value3 = true">
                <Alert>
                  <h3>/api/5d2d89ec8bffc</h3>
                  <template slot="desc"><Tag color="primary">GET</Tag>获取手机号/固定电话归属地</template>
                </Alert>
              </span>
            </p>
          </Panel>
          <Panel name="2">
            史蒂夫·乔布斯【2019-10-20 20:30:33】 <span style="float: right;margin-right: 20px;">接口数量20 | 项目热度20</span>
            <p slot="content">
              <span @click="value3 = true">
                <Alert>
                  <h3>/api/5d2d89ec8bffc</h3>
                  <template slot="desc"><Tag color="primary">GET</Tag>获取手机号/固定电话归属地</template>
                </Alert>
              </span>
              <span @click="value3 = true">
                <Alert>
                  <h3>/api/5d2d89ec8bffc</h3>
                  <template slot="desc"><Tag color="primary">GET</Tag>获取手机号/固定电话归属地</template>
                </Alert>
              </span>
              <span @click="value3 = true">
                <Alert>
                  <h3>/api/5d2d89ec8bffc</h3>
                  <template slot="desc"><Tag color="primary">GET</Tag>获取手机号/固定电话归属地</template>
                </Alert>
              </span>
            </p>
          </Panel>
          <Panel name="3">
            史蒂夫·乔布斯【2019-10-20 20:30:33】 <span style="float: right;margin-right: 20px;">接口数量20 | 项目热度20</span>
            <p slot="content">
              <span @click="value3 = true">
                <Alert>
                  <h3>/api/5d2d89ec8bffc</h3>
                  <template slot="desc"><Tag color="primary">GET</Tag>获取手机号/固定电话归属地</template>
                </Alert>
              </span>
              <span @click="value3 = true">
                <Alert>
                  <h3>/api/5d2d89ec8bffc</h3>
                  <template slot="desc"><Tag color="primary">GET</Tag>获取手机号/固定电话归属地</template>
                </Alert>
              </span>
              <span @click="value3 = true">
                <Alert>
                  <h3>/api/5d2d89ec8bffc</h3>
                  <template slot="desc"><Tag color="primary">GET</Tag>获取手机号/固定电话归属地</template>
                </Alert>
              </span>
            </p>
          </Panel>
        </Collapse>
        <ABackTop :height="100" :bottom="80" :right="60" container=".wiki-layout-con"></ABackTop>
      </div>
    </Content>
    <Footer class="wiki-footer-center">&copy; Powered  By ApiAdmin</Footer>
    <Drawer title="获取手机号/固定电话归属地" v-model="show_detail" width="820" :mask-closable="false">
      <Tabs type="card">
        <TabPane label="接口说明">
          <Form :model="formData" :label-width="80">
            <FormItem label="接口地址">
              <Tag color="primary">DELETE</Tag> <Alert class="url">{{formData.url}}</Alert>
            </FormItem>
            <FormItem label="请求头部">
              <Table border :columns="columns1" :data="data1"></Table>
            </FormItem>
            <FormItem label="请求参数">
              <Table border :columns="columns1" :data="data1"></Table>
            </FormItem>
            <FormItem label="返回参数">
              <Table border :columns="columns1" :data="data1"></Table>
            </FormItem>
            <FormItem label="返回示例">
              <div style="width: 100%" v-highlight>
                <pre><code>{{s}}</code></pre>
              </div>
            </FormItem>
          </Form>
        </TabPane>
        <TabPane label="接口测试">
          <Card style="width:100%">
            <div style="text-align:center">
              <img width="120px" src="https://cn.vuejs.org/images/logo.png">
              <h3>在线测试功能，即将到来</h3>
            </div>
          </Card>
        </TabPane>
      </Tabs>
    </Drawer>
  </Layout>
</template>
<script>
import './list.less'
import ABackTop from '@/components/main/components/a-back-top'

export default {
  name: 'wiki',
  components: {
    ABackTop
  },
  data () {
    return {
      show_detail: true,
      s: '',
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
      formData: {
        url: 'https://api.apiadmin.org/api/5d2d89ec8bffc',
        owner: '',
        type: '',
        approver: '',
        date: '',
        desc: ''
      },
      columns1: [
        {
          title: 'Name',
          key: 'name'
        },
        {
          title: 'Age',
          key: 'age'
        },
        {
          title: 'Address',
          key: 'address'
        }
      ],
      data1: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03'
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No. 1 Lake Park',
          date: '2016-10-01'
        }
      ]
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      let vm = this
      vm.s = JSON.parse('{"code":1,"msg":"\u64cd\u4f5c\u6210\u529f","data":{"list":[{"id":4,"uid":1,"value":50,"type":2,"time":1563631820,"note":"\u7b7e\u5230\u79ef\u5206","sub_type":4},{"id":5,"uid":1,"value":20,"type":2,"time":1563520210,"note":"\u7b7e\u5230\u79ef\u5206","sub_type":4},{"id":7,"uid":1,"value":5,"type":2,"time":1564503842,"note":"","sub_type":4}],"pointInfo":{"uid":1,"point":70}}}')
    }
  }
}
</script>
