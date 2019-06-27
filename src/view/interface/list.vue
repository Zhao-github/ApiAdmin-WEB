<style lang="less" scoped>
  @import './list.less';
</style>
<template>
  <div>
    <Row>
      <Col span="24">
        <Card style="margin-bottom: 10px">
          <Form inline>
            <FormItem style="margin-bottom: 0">
              <Select v-model="searchConf.status" clearable placeholder='请选择状态' style="width:100px">
                <Option :value="1">启用</Option>
                <Option :value="0">禁用</Option>
              </Select>
            </FormItem>
            <FormItem style="margin-bottom: 0">
              <Select v-model="searchConf.type" clearable placeholder="请选择类别" style="width:100px">
                <Option :value="1">接口标识</Option>
                <Option :value="2">接口名称</Option>
                <Option :value="3">真实类库</Option>
              </Select>
            </FormItem>
            <FormItem style="margin-bottom: 0">
              <Input v-model="searchConf.keywords" placeholder=""></Input>
            </FormItem>
            <FormItem style="margin-bottom: 0">
              <Button type="primary" @click="search">{{ $t('find_button') }}/{{ $t('refresh_button') }}</Button>
            </FormItem>
          </Form>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <Card>
          <p slot="title" style="height: 32px">
            <Button type="primary" @click="alertAdd" icon="plus-round">新增</Button>
            <Button type="warning" @click="confirmRefresh = true" icon="refresh">刷新路由</Button>
          </p>
          <div>
            <Table :columns="columnsList" :data="tableData" border disabled-hover></Table>
          </div>
          <div class="margin-top-15" style="text-align: center">
            <Page :total="tableShow.listCount" :current="tableShow.currentPage"
                  :page-size="tableShow.pageSize" @on-change="changePage"
                  @on-page-size-change="changeSize" show-elevator show-sizer show-total></Page>
          </div>
        </Card>
      </Col>
    </Row>
    <Modal v-model="modalSetting.show" width="668" :styles="{top: '30px'}" @on-visible-change="doCancel">
      <p slot="header" style="color:#2d8cf0">
        <Icon type="information-circled"></Icon>
        <span>{{formItem.id ? '编辑' : '新增'}}接口</span>
      </p>
      <Form ref="myForm" :rules="ruleValidate" :model="formItem" :label-width="80">
        <FormItem label="接口名称" prop="info">
          <Input v-model="formItem.info" placeholder="请输入接口名称"></Input>
        </FormItem>
        <FormItem label="真实类库" prop="apiClass">
          <Input v-model="formItem.apiClass" placeholder="请输入真实类库"></Input>
        </FormItem>
        <FormItem label="接口分组" prop="groupHash">
          <Select v-model="formItem.groupHash" style="width:200px">
            <Option v-for="(v, i) in apiGroup" :value="v.hash" :kk="i" :key="v.hash"> {{v.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="请求方式" prop="method">
          <Select v-model="formItem.method" style="width:200px">
            <Option :value="0" :key="0"> 不限</Option>
            <Option :value="1" :key="1"> POST</Option>
            <Option :value="2" :key="2"> GET</Option>
          </Select>
        </FormItem>
        <FormItem label="接口映射" prop="hash">
          <Input style="width: 300px" disabled v-model="formItem.hash"></Input>
          <Badge count="系统自动生成，不允许修改" style="margin-left:5px"></Badge>
        </FormItem>
        <FormItem label="AccessToken" prop="accessToken">
          <Select v-model="formItem.accessToken" style="width:200px">
            <Option :value="0" :key="0"> 忽略Token</Option>
            <Option :value="1" :key="1"> 验证Token</Option>
          </Select>
        </FormItem>
        <FormItem label="用户登录" prop="needLogin">
          <Select v-model="formItem.needLogin" style="width:200px">
            <Option :value="0" :key="0"> 忽略登录</Option>
            <Option :value="1" :key="1"> 验证登录</Option>
          </Select>
        </FormItem>
        <FormItem label="测试模式" prop="isTest">
          <Select v-model="formItem.isTest" style="width:200px">
            <Option :value="0" :key="0"> 生产模式</Option>
            <Option :value="1" :key="1"> 测试模式</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancel" style="margin-right: 8px">取消</Button>
        <Button type="primary" @click="submit" :loading="modalSetting.loading">确定</Button>
      </div>
    </Modal>
    <Modal v-model="confirmRefresh" width="360">
      <p slot="header" style="color:#f60text-align:center">
        <Icon type="information-circled"></Icon>
        <span>确定要刷新路由么</span>
      </p>
      <div style="text-align:center">
        <p>刷新路由是一个非常危险的操作，它有可能影响到您现有接口的访问，请确认无误后刷新！！</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long @click="refreshRoute">确定刷新</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import axios from 'axios'

const editButton = (vm, h, currentRow, index) => {
  return h('Button', {
    props: {
      type: 'primary'
    },
    style: {
      margin: '0 5px'
    },
    on: {
      'click': () => {
        vm.formItem.id = currentRow.id
        vm.formItem.apiClass = currentRow.apiClass
        vm.formItem.info = currentRow.info
        vm.formItem.method = currentRow.method
        vm.formItem.hash = currentRow.hash
        vm.formItem.groupHash = currentRow.groupHash
        vm.formItem.accessToken = currentRow.accessToken
        vm.formItem.isTest = currentRow.isTest
        vm.formItem.needLogin = currentRow.needLogin
        vm.modalSetting.show = true
        vm.modalSetting.index = index
      }
    }
  }, vm.$t('edit_button'))
}
const deleteButton = (vm, h, currentRow, index) => {
  return h('Poptip', {
    props: {
      confirm: true,
      title: '您确定要删除这条数据吗? ',
      transfer: true
    },
    on: {
      'on-ok': () => {
        axios.get('InterfaceList/del', {
          params: {
            hash: currentRow.hash
          }
        }).then(function (response) {
          currentRow.loading = false
          if (response.data.code === 1) {
            vm.tableData.splice(index, 1)
            vm.$Message.success(response.data.msg)
          } else {
            vm.$Message.error(response.data.msg)
          }
        })
      }
    }
  }, [
    h('Button', {
      style: {
        margin: '0 5px'
      },
      props: {
        type: 'error',
        placement: 'top',
        loading: currentRow.isDeleting
      }
    }, vm.$t('delete_button'))
  ])
}
const requestButton = (vm, h, currentRow, index) => {
  return h('Button', {
    style: {
      margin: '0 5px'
    },
    props: {
      type: 'info',
      placement: 'top',
      loading: currentRow.isDeleting
    },
    on: {
      click: () => {
        let hash = currentRow.hash
        vm.$router.push({
          name: 'interface_request',
          params: { hash: hash }
        })
      }
    }
  }, '请求参数')
}
const responseButton = (vm, h, currentRow, index) => {
  return h('Button', {
    style: {
      margin: '0 5px'
    },
    props: {
      type: 'warning',
      placement: 'top',
      loading: currentRow.isDeleting
    },
    on: {
      click: () => {
        let hash = currentRow.hash
        vm.$router.push({
          name: 'interface_response',
          params: { hash: hash }
        })
      }
    }
  }, '返回参数')
}

export default {
  name: 'interface_list',
  data () {
    return {
      confirmRefresh: false,
      columnsList: [
        {
          title: '序号',
          type: 'index',
          width: 65,
          align: 'center'
        },
        {
          title: '接口名称',
          align: 'center',
          key: 'info'
        },
        {
          title: '真实类库',
          align: 'center',
          key: 'apiClass',
          width: 190
        },
        {
          title: '接口映射',
          align: 'center',
          key: 'hash',
          width: 130
        },
        {
          title: '请求方式',
          align: 'center',
          key: 'method',
          width: 90
        },
        {
          title: '接口状态',
          align: 'center',
          key: 'status',
          width: 130
        },
        {
          title: '操作',
          align: 'center',
          key: 'handle',
          width: 355,
          handle: ['edit', 'delete']
        }
      ],
      tableData: [],
      apiGroup: [],
      tableShow: {
        currentPage: 1,
        pageSize: 10,
        listCount: 0
      },
      searchConf: {
        type: '',
        keywords: '',
        status: ''
      },
      modalSetting: {
        show: false,
        loading: false,
        index: 0
      },
      formItem: {
        apiClass: '',
        info: '',
        groupHash: 'default',
        method: 2,
        hash: '',
        accessToken: 1,
        isTest: 0,
        needLogin: 0,
        id: 0
      },
      ruleValidate: {
        apiClass: [
          { required: true, message: '真实类库不能为空', trigger: 'blur' }
        ],
        info: [
          { required: true, message: '接口名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.init()
    this.getList()
  },
  activated () {
    let vm = this
    axios.get('InterfaceGroup/getAll').then(function (response) {
      let res = response.data
      if (res.code === 1) {
        vm.apiGroup = res.data.list
      } else {
        if (res.code === -14) {
          vm.$store.commit('logout', vm)
          vm.$router.push({
            name: 'login'
          })
        } else {
          vm.$Message.error(res.msg)
        }
      }
    })
  },
  methods: {
    init () {
      let vm = this
      this.columnsList.forEach(item => {
        if (item.handle) {
          item.render = (h, param) => {
            let currentRowData = vm.tableData[param.index]
            return h('div', [
              editButton(vm, h, currentRowData, param.index),
              requestButton(vm, h, currentRowData, param.index),
              responseButton(vm, h, currentRowData, param.index),
              deleteButton(vm, h, currentRowData, param.index)
            ])
          }
        }
        if (item.key === 'method') {
          item.render = (h, param) => {
            let currentRowData = vm.tableData[param.index]
            if (currentRowData.isTest === 1) {
              return h('Badge', {
                attrs: {
                  count: '测试'
                }
              })
            } else {
              switch (currentRowData.method) {
                case 1:
                  return h('Badge', {
                    attrs: {
                      count: 'POST'
                    },
                    props: {
                      'class-name': 'badge-success'
                    }
                  })
                case 2:
                  return h('Badge', {
                    attrs: {
                      count: 'GET'
                    },
                    props: {
                      'class-name': 'badge-info'
                    }
                  })
                case 0:
                  return h('Badge', {
                    attrs: {
                      count: '不限'
                    },
                    props: {
                      'class-name': 'badge-warning'
                    }
                  })
              }
            }
          }
        }
        if (item.key === 'status') {
          item.render = (h, param) => {
            let currentRowData = vm.tableData[param.index]
            return h('i-switch', {
              attrs: {
                size: 'large'
              },
              props: {
                'true-value': 1,
                'false-value': 0,
                value: currentRowData.status
              },
              on: {
                'on-change': function (status) {
                  axios.get('InterfaceList/changeStatus', {
                    params: {
                      status: status,
                      hash: currentRowData.hash
                    }
                  }).then(function (response) {
                    let res = response.data
                    if (res.code === 1) {
                      vm.$Message.success(res.msg)
                    } else {
                      if (res.code === -14) {
                        vm.$store.commit('logout', vm)
                        vm.$router.push({
                          name: 'login'
                        })
                      } else {
                        vm.$Message.error(res.msg)
                        vm.getList()
                      }
                    }
                    vm.cancel()
                  })
                }
              }
            }, [
              h('span', {
                slot: 'open'
              }, vm.$t('open_choose')),
              h('span', {
                slot: 'close'
              }, vm.$t('close_choose'))
            ])
          }
        }
      })
    },
    alertAdd () {
      let vm = this
      axios.get('InterfaceList/getHash').then(function (response) {
        let res = response.data
        if (res.code === 1) {
          vm.formItem.hash = res.data.hash
        } else {
          if (res.code === -14) {
            vm.$store.commit('logout', vm)
            vm.$router.push({
              name: 'login'
            })
          } else {
            vm.$Message.error(res.msg)
          }
        }
      })
      this.modalSetting.show = true
    },
    submit () {
      let self = this
      this.$refs['myForm'].validate((valid) => {
        if (valid) {
          self.modalSetting.loading = true
          let target = ''
          if (this.formItem.id === 0) {
            target = 'InterfaceList/add'
          } else {
            target = 'InterfaceList/edit'
          }
          axios.post(target, self.formItem).then(function (response) {
            self.modalSetting.loading = false
            if (response.data.code === 1) {
              self.$Message.success(response.data.msg)
              self.getList()
              self.cancel()
            } else {
              self.$Message.error(response.data.msg)
            }
          })
        }
      })
    },
    cancel () {
      this.modalSetting.show = false
    },
    changePage (page) {
      this.tableShow.currentPage = page
      this.getList()
    },
    changeSize (size) {
      this.tableShow.pageSize = size
      this.getList()
    },
    search () {
      this.tableShow.currentPage = 1
      this.getList()
    },
    getList () {
      let vm = this
      axios.get('InterfaceList/index', {
        params: {
          page: vm.tableShow.currentPage,
          size: vm.tableShow.pageSize,
          type: vm.searchConf.type,
          keywords: vm.searchConf.keywords,
          status: vm.searchConf.status
        }
      }).then(function (response) {
        let res = response.data
        if (res.code === 1) {
          vm.tableData = res.data.list
          vm.tableShow.listCount = res.data.count
        } else {
          if (res.code === -14) {
            vm.$store.commit('logout', vm)
            vm.$router.push({
              name: 'login'
            })
          } else {
            vm.$Message.error(res.msg)
          }
        }
      })
    },
    doCancel (data) {
      if (!data) {
        this.formItem.id = 0
        this.$refs['myForm'].resetFields()
        this.modalSetting.loading = false
        this.modalSetting.index = 0
      }
    },
    refreshRoute () {
      let vm = this
      axios.get('InterfaceList/refresh').then(function (response) {
        let res = response.data
        if (res.code === 1) {
          vm.$Message.success(res.msg)
        } else {
          if (res.code === -14) {
            vm.$store.commit('logout', vm)
            vm.$router.push({
              name: 'login'
            })
          } else {
            vm.$Message.error(res.msg)
          }
        }
        vm.confirmRefresh = false
      })
    }
  }
}
</script>
