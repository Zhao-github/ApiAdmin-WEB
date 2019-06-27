<style lang="less" scoped>
  @import './menu.less';
</style>

<template>
  <div>
    <Row>
      <Col span="24">
        <Card>
          <p slot="title" style="height: 32px">
            <Button type="primary" @click="alertAdd" icon="md-add">{{ $t('add_button') }}</Button>
          </p>
          <div>
            <Table :columns="columnsList" :data="tableData" border disabled-hover></Table>
          </div>
        </Card>
      </Col>
    </Row>
    <Modal v-model="modalSetting.show" width="668" :styles="{top: '30px'}" @on-visible-change="doCancel">
      <p slot="header" style="color:#2d8cf0">
        <Icon type="md-alert" />
        <span>{{formItem.id ? '编辑' : '新增'}}菜单</span>
      </p>
      <Form ref="myForm" :rules="ruleValidate" :model="formItem" :label-width="80">
        <FormItem label="菜单名称" prop="name">
          <Input v-model="formItem.name" placeholder="请输入菜单名称"></Input>
        </FormItem>
        <FormItem label="父级菜单" prop="fid">
          <Select v-model="formItem.fid" filterable>
            <Option :value="0">顶级菜单</Option>
            <Option v-for="item in tableData" :value="item.id" :key="item.id">{{ item.showName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="菜单URL" prop="url">
          <Input v-model="formItem.url" placeholder="请输入菜单URL">
            <span slot="prepend">admin/</span>
          </Input>
        </FormItem>
        <FormItem label="菜单排序" prop="sort">
          <InputNumber :min="0" v-model="formItem.sort"></InputNumber>
          <Tag color="error" class="margin-left-5">数字越小越靠前</Tag>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancel" style="margin-right: 8px">取消</Button>
        <Button type="primary" @click="submit" :loading="modalSetting.loading">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getList, changeStatus, add, edit, del } from '@/api/menu'

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
        vm.formItem.fid = currentRow.fid
        vm.formItem.url = currentRow.url.slice(6)
        vm.formItem.sort = currentRow.sort
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
export default {
  name: 'system_menu',
  data () {
    return {
      columnsList: [
        {
          title: '序号',
          type: 'index',
          width: 65,
          align: 'center'
        },
        {
          title: '菜单名称',
          align: 'left',
          key: 'showName'
        },
        {
          title: '排序',
          align: 'center',
          key: 'sort',
          width: 80
        },
        {
          title: '菜单URL',
          align: 'left',
          key: 'url',
          width: 200
        },
        {
          title: '状态',
          align: 'center',
          key: 'hide',
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
                value: params.row.hide
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
              }, vm.$t('hide_choose')),
              h('span', {
                slot: 'close'
              }, vm.$t('show_choose'))
            ])
          }
        },
        {
          title: '操作',
          align: 'center',
          key: 'handle',
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
      modalSetting: {
        show: false,
        loading: false,
        index: 0
      },
      formItem: {
        name: '',
        fid: 0,
        url: '',
        sort: 0,
        id: 0
      },
      ruleValidate: {
        name: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    alertAdd () {
      this.modalSetting.show = true
    },
    submit () {
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
    getList () {
      let vm = this
      getList().then(response => {
        vm.tableData = response.data.data.list
      })
    }
  }
}
</script>
