<style lang="less" scoped>
  @import './list.less';
</style>
<template>
  <div>
    <Row>
      <Col span="24">
        <Card class="margin-bottom-10">
          <Form inline>
            <FormItem class="margin-bottom-0">
              <Select v-model="searchConf.status" clearable placeholder='请选择状态' style="width:120px">
                <Option :value="1">启用</Option>
                <Option :value="0">禁用</Option>
              </Select>
            </FormItem>
            <FormItem class="margin-bottom-0">
              <Select v-model="searchConf.type" clearable placeholder="请选择类别" style="width:120px">
                <Option :value="1">AppId</Option>
                <Option :value="2">应用名称</Option>
              </Select>
            </FormItem>
            <FormItem class="margin-bottom-0">
              <Input v-model="searchConf.keywords" placeholder=""></Input>
            </FormItem>
            <FormItem class="margin-bottom-0">
              <Button type="primary" @click="search">{{ $t('find_button') }}/{{ $t('refresh_button') }}</Button>
            </FormItem>
          </Form>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <Card>
          <div class="margin-bottom-15">
            <Button type="primary" v-has="'App/add'" @click="alertAdd" icon="md-add">{{ $t('add_button') }}</Button>
          </div>
          <div>
            <Table :loading="listLoading" :columns="columnsList" :data="tableData" border disabled-hover></Table>
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
        <span>{{formItem.id ? '编辑' : '新增'}}应用</span>
      </p>
      <Form ref="myForm" :rules="ruleValidate" :model="formItem" :label-width="80">
        <FormItem label="应用名称" prop="app_name">
          <Input v-model="formItem.app_name" placeholder="请输入应用名称"></Input>
        </FormItem>
        <FormItem label="AppId" prop="app_id">
          <Input style="width: 300px" disabled v-model="formItem.app_id" placeholder="请输入AppId"></Input>
          <Tag color="error" class="margin-left-5">系统自动生成，不允许修改</Tag>
        </FormItem>
        <FormItem label="AppSecret" prop="app_secret">
          <Input style="width: 300px" disabled v-model="formItem.app_secret"
                 placeholder="请输入AppSecret">
            <Button slot="append" icon="md-refresh" @click="refreshAppSecret"></Button>
          </Input>
        </FormItem>
        <FormItem label="应用分组" prop="app_group">
          <Select v-model="formItem.app_group" style="width:200px">
            <Option v-for="(v, i) in appGroup" :value="v.hash" :kk="i" :key="v.hash"> {{v.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="应用描述" prop="app_info">
          <Input v-model="formItem.app_info" type="textarea"></Input>
        </FormItem>
        <FormItem label="接口访问" prop="app_api">
          <div class="api-box">
            <div class="api-group" v-for="(apiArr, groupId) in groupList" :key="groupId">
              <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px">
                <Checkbox
                    :indeterminate="checkAllIndeterminate[groupId]"
                    :value="checkAllStatus[groupId]"
                    @click.prevent.native="handleCheckAll(groupId)"> {{groupInfo[groupId]}}
                </Checkbox>
              </div>
              <CheckboxGroup v-model="formItem.app_api[groupId]"
                             @on-change="checkAllGroupChange(groupId)">
                <Checkbox :key="apiKey" :label="api.hash" v-for="(api, apiKey) in apiArr">
                  {{api.info}}
                </Checkbox>
              </CheckboxGroup>
            </div>
          </div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancel" class="margin-right-10">取消</Button>
        <Button type="primary" @click="submit" :loading="modalSetting.loading">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getList, changeStatus, add, edit, del, getAppInfo, refreshAppSecretApi } from '@/api/app'
import { getAll } from '@/api/app-group'

const editButton = (vm, h, currentRow, index) => {
  if (vm.buttonShow.edit) {
    return h('Button', {
      props: {
        type: 'primary'
      },
      style: {
        margin: '0 5px'
      },
      on: {
        'click': () => {
          getAll().then(response => {
            vm.appGroup = response.data.data.list
            vm.formItem.id = currentRow.id
            vm.formItem.app_name = currentRow.app_name
            vm.formItem.app_info = currentRow.app_info
            vm.formItem.app_id = currentRow.app_id
            vm.formItem.app_secret = currentRow.app_secret
            vm.formItem.app_group = currentRow.app_group
            getAppInfo(currentRow.id).then(response => {
              let res = response.data
              vm.groupInfo = res.data.groupInfo
              vm.groupList = res.data.apiList
              for (let index in vm.groupInfo) {
                if (res.data.app_detail === null || typeof (res.data.app_detail[index]) === 'undefined') {
                  vm.$set(vm.checkAllStatus, index, false)
                  vm.$set(vm.checkAllIndeterminate, index, false)
                  vm.$set(vm.formItem.app_api, index, [])
                } else {
                  let hasLength = res.data.app_detail[index].length
                  if (hasLength === 0) {
                    vm.$set(vm.checkAllStatus, index, false)
                    vm.$set(vm.checkAllIndeterminate, index, false)
                    vm.$set(vm.formItem.app_api, index, [])
                  } else if (vm.groupList[index].length === hasLength) {
                    vm.$set(vm.checkAllStatus, index, true)
                    vm.$set(vm.checkAllIndeterminate, index, false)
                    vm.$set(vm.formItem.app_api, index, res.data.app_detail[index])
                  } else {
                    vm.$set(vm.checkAllStatus, index, false)
                    vm.$set(vm.checkAllIndeterminate, index, true)
                    vm.$set(vm.formItem.app_api, index, res.data.app_detail[index])
                  }
                }
              }
            })
            vm.modalSetting.show = true
            vm.modalSetting.index = index
          })
        }
      }
    }, vm.$t('edit_button'))
  }
}
const deleteButton = (vm, h, currentRow, index) => {
  if (vm.buttonShow.del) {
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
          currentRow.loading = false
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
}

export default {
  name: 'interface_list',
  data () {
    return {
      appGroup: [],
      columnsList: [
        {
          title: '序号',
          type: 'index',
          width: 65,
          align: 'center'
        },
        {
          title: '应用名称',
          align: 'center',
          key: 'app_name',
          minWidth: 130
        },
        {
          title: 'AppId',
          align: 'center',
          key: 'app_id',
          width: 120
        },
        {
          title: 'AppSecret',
          align: 'center',
          key: 'app_secret',
          width: 285
        },
        {
          title: '应用说明',
          align: 'center',
          key: 'app_info',
          width: 160
        },
        {
          title: '应用状态',
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
                value: params.row.app_status,
                disabled: !vm.buttonShow.changeStatus
              },
              on: {
                'on-change': function (status) {
                  changeStatus(status, params.row.id).then(response => {
                    vm.$Message.success(response.data.msg)
                    vm.getList()
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
      tableData: [],
      groupInfo: {},
      groupList: {},
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
        app_name: '',
        app_id: '',
        app_secret: '',
        app_info: '',
        app_api: {},
        app_group: 'default',
        id: 0
      },
      ruleValidate: {
        app_name: [
          { required: true, message: '应用名称不能为空', trigger: 'blur' }
        ]
      },
      checkAllStatus: {},
      checkAllIndeterminate: {},
      buttonShow: {
        edit: true,
        del: true,
        changeStatus: true
      },
      listLoading: false
    }
  },
  created () {
    let vm = this
    vm.getList()
    vm.hasRule('App/edit').then(res => {
      vm.buttonShow.edit = res
    })
    vm.hasRule('App/del').then(res => {
      vm.buttonShow.del = res
    })
    vm.hasRule('App/changeStatus').then(res => {
      vm.buttonShow.changeStatus = res
    })
  },
  methods: {
    alertAdd () {
      let vm = this
      getAll().then(response => {
        vm.appGroup = response.data.data.list
      })
      getAppInfo().then(response => {
        let res = response.data
        vm.formItem.app_id = res.data.app_id
        vm.formItem.app_secret = res.data.app_secret
        vm.groupInfo = res.data.groupInfo
        vm.groupList = res.data.apiList
        for (let index in vm.groupInfo) {
          vm.$set(vm.checkAllStatus, index, false)
          vm.$set(vm.checkAllIndeterminate, index, false)
          vm.$set(vm.formItem.app_api, index, [])
        }
      })
      vm.modalSetting.show = true
    },
    submit () {
      let vm = this
      vm.$refs['myForm'].validate((valid) => {
        if (valid) {
          vm.modalSetting.loading = true
          if (vm.formItem.id === 0) {
            add(vm.formItem).then(response => {
              vm.$Message.success(response.data.msg)
              vm.getList()
              vm.cancel()
            }).catch(() => {
              vm.modalSetting.loading = false
            })
          } else {
            edit(vm.formItem).then(response => {
              vm.$Message.success(response.data.msg)
              vm.getList()
              vm.cancel()
            }).catch(() => {
              vm.modalSetting.loading = false
            })
          }
        }
      })
    },
    cancel () {
      this.formItem.id = 0
      this.$refs['myForm'].resetFields()
      this.modalSetting.show = false
      this.modalSetting.loading = false
      this.modalSetting.index = 0
    },
    changePage (page) {
      this.tableShow.currentPage = page
      this.getList()
    },
    changeSize (size) {
      this.tableShow.pageSize = size
      this.getList()
    },
    handleCheckAll (groupId) {
      if (this.checkAllStatus[groupId]) {
        this.checkAllStatus[groupId] = false
      } else {
        this.checkAllStatus[groupId] = !this.checkAllStatus[groupId]
      }
      this.checkAllIndeterminate[groupId] = false

      if (this.checkAllStatus[groupId]) {
        let vm = this
        this.groupList[groupId].forEach(item => {
          vm.formItem.app_api[groupId].push(item.hash)
        })
      } else {
        this.formItem.app_api[groupId] = []
      }
    },
    checkAllGroupChange (groupId) {
      if (this.formItem.app_api[groupId].length === this.groupList[groupId].length) {
        this.checkAllIndeterminate[groupId] = false
        this.checkAllStatus[groupId] = true
      } else if (this.formItem.app_api[groupId].length > 0) {
        this.checkAllIndeterminate[groupId] = true
        this.checkAllStatus[groupId] = false
      } else {
        this.checkAllIndeterminate[groupId] = false
        this.checkAllStatus[groupId] = false
      }
    },
    search () {
      this.tableShow.currentPage = 1
      this.getList()
    },
    refreshAppSecret () {
      let vm = this
      refreshAppSecretApi().then(response => {
        vm.formItem.app_secret = response.data.data.app_secret
      })
    },
    getList () {
      let vm = this
      vm.listLoading = true
      getList({
        page: vm.tableShow.currentPage,
        size: vm.tableShow.pageSize,
        type: vm.searchConf.type,
        keywords: vm.searchConf.keywords,
        status: vm.searchConf.status
      }).then(response => {
        vm.tableData = response.data.data.list
        vm.tableShow.listCount = response.data.data.count
        vm.listLoading = false
      })
    },
    doCancel (data) {
      if (!data) {
        this.formItem.id = 0
        this.$refs['myForm'].resetFields()
        this.modalSetting.loading = false
        this.modalSetting.index = 0
      }
    }
  }
}
</script>
