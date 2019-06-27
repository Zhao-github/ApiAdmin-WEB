<style lang="less" scoped>
  @import './list.less';
</style>
<template>
  <div>
    <Row>
      <Col span="24">
        <Card>
          <p slot="title" style="height: 32px">
            <Button type="primary" @click="alertAdd" icon="plus-round">新增</Button>
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
        <span>{{formItem.id ? '编辑' : '新增'}}请求字段</span>
      </p>
      <Form ref="myForm" :rules="ruleValidate" :model="formItem" :label-width="80">
        <FormItem label="字段名称" prop="fieldName">
          <Input v-model="formItem.fieldName" placeholder="请输入字段名称"></Input>
        </FormItem>
        <FormItem label="数据类型" prop="dataType">
          <Select v-model="formItem.dataType" style="width:200px">
            <Option v-for="(v, i) in tableShow.dataType" :value="i" :key="i"> {{v}}</Option>
          </Select>
        </FormItem>
        <FormItem label="是否必填">
          <RadioGroup v-model="formItem.isMust">
            <Radio label="0">不必填</Radio>
            <Radio label="1">必填</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="默认值" prop="default" v-if="formItem.isMust.toString() === '0'">
          <Input style="width: 300px" v-model="formItem.defaults"></Input>
          <Badge count="仅在字段非必填的情况下生效" style="margin-left:5px"></Badge>
        </FormItem>
        <FormItem label="规则细节" prop="range">
          <Input v-model="formItem.range" type="textarea" placeholder="请输入符合要求的JSON字符串"></Input>
        </FormItem>
        <FormItem label="字段说明" prop="info">
          <Input v-model="formItem.info" type="textarea" placeholder="请输入字段描述"></Input>
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
        vm.formItem.fieldName = currentRow.fieldName
        vm.formItem.dataType = currentRow.dataType.toString()
        vm.formItem.defaults = currentRow.default
        vm.formItem.range = currentRow.range
        vm.formItem.isMust = currentRow.isMust.toString()
        vm.formItem.info = currentRow.info
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
        axios.get('Fields/del', {
          params: {
            id: currentRow.id
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
export default {
  name: 'interface_request',
  data () {
    return {
      hash: '',
      columnsList: [
        {
          title: '序号',
          type: 'index',
          width: 65,
          align: 'center'
        },
        {
          title: '字段名称',
          align: 'left',
          key: 'showName',
          width: 200
        },
        {
          title: '数据类型',
          align: 'center',
          key: 'dataType',
          width: 90
        },
        {
          title: '是否必须',
          align: 'center',
          key: 'isMust',
          width: 90
        },
        {
          title: '默认值',
          align: 'center',
          key: 'default',
          width: 160
        },
        {
          title: '字段说明',
          align: 'left',
          key: 'info'
        },
        {
          title: '操作',
          align: 'center',
          key: 'handle',
          width: 205,
          handle: ['edit', 'delete']
        }
      ],
      tableData: [],
      tableShow: {
        currentPage: 1,
        pageSize: 10,
        listCount: 0,
        dataType: {}
      },
      modalSetting: {
        show: false,
        loading: false,
        index: 0
      },
      formItem: {
        fieldName: '',
        dataType: '2',
        defaults: '',
        range: '',
        isMust: '1',
        info: '',
        type: 0,
        id: 0
      },
      ruleValidate: {
        fieldName: [
          { required: true, message: '字段名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.init()
  },
  activated () {
    this.hash = this.$route.params.hash.toString()
    this.getList()
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
              deleteButton(vm, h, currentRowData, param.index)
            ])
          }
        }
        if (item.key === 'isMust') {
          item.render = (h, param) => {
            let currentRowData = vm.tableData[param.index]
            if (currentRowData.isMust === 1) {
              return h('Badge', {
                attrs: {
                  count: '必填'
                }
              })
            } else {
              return h('Badge', {
                attrs: {
                  count: '可选'
                },
                props: {
                  'class-name': 'badge-success'
                }
              })
            }
          }
        }
        if (item.key === 'dataType') {
          item.render = (h, param) => {
            let type = vm.tableData[param.index].dataType
            return h('Badge', {
              attrs: {
                count: vm.tableShow.dataType[type]
              },
              props: {
                'class-name': 'badge-info'
              }
            })
          }
        }
      })
    },
    alertAdd () {
      this.modalSetting.show = true
    },
    submit () {
      this.formItem.hash = this.hash
      let self = this
      this.$refs['myForm'].validate((valid) => {
        if (valid) {
          self.modalSetting.loading = true
          let target = ''
          if (this.formItem.id === 0) {
            target = 'Fields/add'
          } else {
            target = 'Fields/edit'
          }
          axios.post(target, self.formItem).then(function (response) {
            if (response.data.code === 1) {
              self.$Message.success(response.data.msg)
            } else {
              self.$Message.error(response.data.msg)
            }
            self.getList()
            self.cancel()
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
      axios.get('Fields/request', {
        params: {
          page: vm.tableShow.currentPage,
          size: vm.tableShow.pageSize,
          hash: vm.hash
        }
      }).then(function (response) {
        let res = response.data
        if (res.code === 1) {
          vm.tableData = res.data.list
          vm.tableShow.listCount = res.data.count
          vm.tableShow.dataType = res.data.dataType
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
        this.formItem.defaults = ''
        this.formItem.isMust = '1'
        this.$refs['myForm'].resetFields()
        this.modalSetting.loading = false
        this.modalSetting.index = 0
      }
    }
  }
}
</script>
