<style lang="less" scoped>
  @import './auth.less';
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
              <Input v-model="searchConf.keywords" placeholder="请输入组名称"></Input>
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
            <Button type="primary" @click="alertAdd" icon="md-add">{{ $t('add_button') }}</Button>
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
        <Icon type="md-alert"></Icon>
        <span>{{formItem.id ? '编辑' : '新增'}}权限组</span>
      </p>
      <Form ref="myForm" :rules="ruleValidate" :model="formItem" :label-width="80">
        <FormItem label="组名称" prop="name">
          <Input v-model="formItem.name" placeholder="请输入权限组名称"></Input>
        </FormItem>
        <FormItem label="组描述" prop="description">
          <Input type="textarea" v-model="formItem.description" placeholder="请输入权限组描述"></Input>
        </FormItem>
        <FormItem label="组授权" prop="rules">
          <div class="rule-list">
            <Tree ref="formTree" :data="ruleList" show-checkbox multiple></Tree>
          </div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancel" style="margin-right: 8px">取消</Button>
        <Button type="primary" @click="submit" :loading="modalSetting.loading">确定</Button>
      </div>
    </Modal>
    <Modal v-model="memberSetting.show" width="998" :styles="{top: '30px'}">
      <p slot="header" style="color:#2d8cf0">
        <Icon type="information-circled"></Icon>
        <span>组成员列表</span>
      </p>
      <div>
        <Table :columns="memberColumns" :data="memberData" border disabled-hover></Table>
      </div>
      <div class="margin-top-15" style="text-align: center">
        <Page :total="memberShow.listCount" :current="memberShow.currentPage"
              :page-size="memberShow.pageSize" @on-change="changeMemberPage"
              @on-page-size-change="changeMemberSize" show-elevator show-sizer show-total></Page>
      </div>
      <p slot="footer"></p>
    </Modal>
  </div>
</template>
<script>
import { getUsers } from '@/api/user'
import { getList, add, edit, del, delMember, getRuleList, changeStatus } from '@/api/auth'

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
        vm.formItem.name = currentRow.name
        vm.formItem.description = currentRow.description
        getRuleList({ 'group_id': currentRow.id }).then(response => {
          vm.ruleList = response.data.data.list
        })
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
        del(currentRow.id).then(response => {
          vm.tableData.splice(index, 1)
          vm.$Message.success(response.data.msg)
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
const memberButton = (vm, h, currentRow, index) => {
  return h('Button', {
    props: {
      type: 'primary'
    },
    style: {
      margin: '0 5px'
    },
    on: {
      'click': () => {
        vm.memberSetting.show = true
        vm.memberShow.gid = currentRow.id
        vm.getMemberList()
      }
    }
  }, '组成员')
}
const memberDelButton = (vm, h, currentRow, index) => {
  return h('Poptip', {
    props: {
      confirm: true,
      title: '您确定要删除这条数据吗? ',
      transfer: true
    },
    on: {
      'on-ok': () => {
        delMember({
          uid: currentRow.id,
          gid: vm.memberShow.gid
        }).then(response => {
          vm.memberData.splice(index, 1)
          vm.$Message.success(response.data.msg)
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

export default {
  name: 'system_auth',
  data () {
    return {
      ruleList: [],
      columnsList: [
        {
          title: '序号',
          type: 'index',
          width: 65,
          align: 'center'
        },
        {
          title: '权限组',
          align: 'center',
          key: 'name',
          width: 100
        },
        {
          title: '描述',
          align: 'center',
          key: 'description'
        },
        {
          title: '成员授权',
          align: 'center',
          width: 116,
          render: (h, params) => {
            return h('div', [
              memberButton(this, h, params.row, params.index)
            ])
          }
        },
        {
          title: '状态',
          align: 'center',
          width: 100,
          render: (h, params) => {
            let vm = this
            return h('i-switch', {
              attrs: {
                size: 'large'
              },
              props: {
                'true-value': 1,
                'false-value': 0,
                value: params.row.status
              },
              on: {
                'on-change': function (status) {
                  changeStatus(status, params.row.id).then(response => {
                    vm.$Message.success(response.data.msg)
                    vm.getList()
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
        },
        {
          title: '操作',
          align: 'center',
          width: 200,
          render: (h, params) => {
            return h('div', [
              editButton(this, h, params.row, params.index),
              deleteButton(this, h, params.row, params.index)
            ])
          }
        }
      ],
      memberColumns: [
        {
          title: '序号',
          type: 'index',
          width: 65,
          align: 'center'
        },
        {
          title: '用户账号',
          align: 'center',
          key: 'username'
        },
        {
          title: '真实姓名',
          align: 'center',
          key: 'nickname',
          width: 90
        },
        {
          title: '登录次数',
          align: 'center',
          key: 'login_times',
          width: 90
        },
        {
          title: '最后登录时间',
          align: 'center',
          key: 'last_login_time',
          width: 160
        },
        {
          title: '最后登录IP',
          align: 'center',
          key: 'last_login_ip',
          width: 160
        },
        {
          title: '状态',
          align: 'center',
          width: 100,
          render: (h, params) => {
            if (params.row.status === 1) {
              return h('Tag', {
                props: {
                  'color': 'green'
                }
              }, '启用')
            } else {
              return h('Tag', {
                props: {
                  'color': 'red'
                }
              }, vm.$t('close_choose'))
            }
          }
        },
        {
          title: '操作',
          align: 'center',
          width: 175,
          render: (h, params) => {
            return h('div', [
              memberDelButton(this, h, params.row, params.index)
            ])
          }
        }
      ],
      tableData: [],
      memberData: [],
      tableShow: {
        currentPage: 1,
        pageSize: 10,
        listCount: 0
      },
      memberShow: {
        currentPage: 1,
        pageSize: 10,
        listCount: 0,
        gid: 0
      },
      searchConf: {
        keywords: '',
        status: ''
      },
      modalSetting: {
        show: false,
        loading: false,
        index: 0
      },
      memberSetting: {
        show: false,
        loading: false,
        index: 0
      },
      formItem: {
        name: '',
        description: '',
        rules: [],
        id: 0
      },
      ruleValidate: {
        name: [
          { required: true, message: '组名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    alertAdd () {
      let vm = this
      getRuleList().then(response => {
        vm.ruleList = response.data.data.list
      })
      this.modalSetting.show = true
    },
    submit () {
      this.formItem.rules = []
      let ruleNodes = this.$refs['formTree'].getCheckedNodes()
      let ruleLength = ruleNodes.length
      if (ruleLength) {
        for (let i = 0; i <= ruleLength - 1; i++) {
          this.formItem.rules.push(ruleNodes[i]['key'])
        }
      }

      let vm = this
      this.$refs['myForm'].validate((valid) => {
        if (valid) {
          vm.modalSetting.loading = true
          if (vm.formItem.id === 0) {
            add(vm.formItem).then(response => {
              vm.$Message.success(response.data.msg)
              vm.getList()
              vm.cancel()
            }).catch(() => {
              vm.cancel()
            })
          } else {
            edit(vm.formItem).then(response => {
              vm.$Message.success(response.data.msg)
              vm.getList()
              vm.cancel()
            }).catch(() => {
              vm.cancel()
            })
          }
        }
      })
    },
    cancel () {
      this.modalSetting.show = false
    },
    doCancel (data) {
      if (!data) {
        this.formItem.id = 0
        this.$refs['myForm'].resetFields()
        this.modalSetting.loading = false
        this.modalSetting.index = 0
      }
    },
    changePage (page) {
      this.tableShow.currentPage = page
      this.getList()
    },
    changeSize (size) {
      this.tableShow.pageSize = size
      this.getList()
    },
    changeMemberPage (page) {
      this.memberShow.currentPage = page
      this.getMemberList()
    },
    changeMemberSize (size) {
      this.memberShow.pageSize = size
      this.getMemberList()
    },
    search () {
      this.tableShow.currentPage = 1
      this.getList()
    },
    getList () {
      let vm = this
      let params = {
        page: vm.tableShow.currentPage,
        size: vm.tableShow.pageSize,
        keywords: vm.searchConf.keywords,
        status: vm.searchConf.status
      }
      getList(params).then(response => {
        vm.tableData = response.data.data.list
        vm.tableShow.listCount = response.data.data.count
      })
    },
    getMemberList () {
      let vm = this
      let params = {
        page: vm.memberShow.currentPage,
        size: vm.memberShow.pageSize,
        gid: vm.memberShow.gid
      }
      getUsers(params).then(response => {
        vm.memberData = response.data.data.list
        vm.memberShow.listCount = response.data.data.count
      })
    }
  }
}
</script>
