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
                <Option :value="1">接口组标识</Option>
                <Option :value="2">接口组名称</Option>
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
            <Button type="primary" v-has="'InterfaceGroup/add'" @click="alertAdd" icon="md-add">{{ $t('add_button') }}</Button>
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
        <span>{{formItem.id ? '编辑' : '新增'}}接口组</span>
      </p>
      <Form ref="myForm" :rules="ruleValidate" :model="formItem" :label-width="80">
        <FormItem label="组名称" prop="name">
          <Input v-model="formItem.name" placeholder="请输入接口组名称"></Input>
        </FormItem>
        <FormItem label="组头像" prop="image">
          <div class="demo-upload-list" v-if="formItem.image">
            <img :src="formItem.image">
            <div class="demo-upload-list-cover">
              <Icon type="ios-trash-outline" @click.native="handleImgRemove()"></Icon>
            </div>
          </div>
          <input v-if="formItem.image" v-model="formItem.image" type="hidden" name="image">
          <Upload type="drag"
                  :action="uploadUrl"
                  :headers="uploadHeader"
                  v-if="!formItem.image"
                  :format="['jpg','jpeg','png']"
                  :max-size="5120"
                  :on-success="handleImgSuccess"
                  :on-format-error="handleImgFormatError"
                  :on-exceeded-size="handleImgMaxSize"
                  style="display: inline-block;width:58px">
            <div style="width: 58px;height:58px;line-height: 58px">
              <Icon type="md-camera" size="20"></Icon>
            </div>
          </Upload>
        </FormItem>
        <FormItem label="组标识" prop="hash">
          <Input style="width: 300px" disabled v-model="formItem.hash"></Input>
          <Tag color="error" class="margin-left-5">系统自动生成，不允许修改</Tag>
        </FormItem>
        <FormItem label="组描述" prop="description">
          <Input v-model="formItem.description" :autosize="{maxRows: 10, minRows: 4}" type="textarea"
                 placeholder="请输入接口组描述"></Input>
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
import { getList, changeStatus, add, edit, del } from '@/api/interface-group'
import { baseUrl } from '@/libs/api.request'
import { getToken } from '@/libs/util'
import { getHash } from '@/api/interface'

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
          vm.formItem.id = currentRow.id
          vm.formItem.name = currentRow.name
          vm.formItem.hash = currentRow.hash
          vm.formItem.image = currentRow.image
          vm.formItem.description = currentRow.description
          vm.modalSetting.show = true
          vm.modalSetting.index = index
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
        title: '您确定要删除此接口分组么? 如当前分组下仍有接口，将自动划归于默认分组！',
        transfer: true
      },
      on: {
        'on-ok': () => {
          del(currentRow.hash).then(response => {
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
  name: 'interface_group',
  data () {
    return {
      uploadUrl: baseUrl + 'Index/upload',
      uploadHeader: { 'apiAuth': getToken() },
      columnsList: [
        {
          title: '序号',
          type: 'index',
          width: 65,
          align: 'center'
        },
        {
          title: '接口组名称',
          align: 'center',
          key: 'name'
        },
        {
          title: '接口组描述',
          align: 'center',
          key: 'description'
        },
        {
          title: '接口组热度',
          align: 'center',
          width: 120,
          render: (h, params) => {
            if (params.row.hot > 10000) {
              let hot = (parseInt(params.row.hot) / 10000).toFixed(1) + '万'
              return h('span', hot)
            } else {
              return h('span', params.row.hot)
            }
          }
        },
        {
          title: '接口组标识',
          align: 'center',
          key: 'hash',
          width: 140
        },
        {
          title: '接口组状态',
          align: 'center',
          width: 110,
          render: (h, params) => {
            let vm = this
            return h('i-switch', {
              attrs: {
                size: 'large'
              },
              props: {
                'true-value': 1,
                'false-value': 0,
                value: params.row.status,
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
        description: '',
        name: '',
        hash: '',
        image: '',
        id: 0
      },
      ruleValidate: {
        name: [
          { required: true, message: '接口组名称不能为空', trigger: 'blur' }
        ]
      },
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
    vm.hasRule('InterfaceGroup/edit').then(res => {
      vm.buttonShow.edit = res
    })
    vm.hasRule('InterfaceGroup/del').then(res => {
      vm.buttonShow.del = res
    })
    vm.hasRule('InterfaceGroup/changeStatus').then(res => {
      vm.buttonShow.changeStatus = res
    })
  },
  methods: {
    alertAdd () {
      let vm = this
      getHash().then(response => {
        vm.formItem.hash = response.data.data.hash
      })
      vm.modalSetting.show = true
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
    handleImgFormatError (file) {
      this.$Notice.warning({
        title: '文件类型不合法',
        desc: file.name + '的文件类型不正确，请上传jpg或者png图片。'
      })
    },
    handleImgRemove () {
      this.formItem.image = ''
    },
    handleImgSuccess (response) {
      if (response.code === 1) {
        this.$Message.success(response.msg)
        this.formItem.image = response.data.fileUrl
      } else {
        this.$Message.error(response.msg)
      }
    },
    handleImgMaxSize (file) {
      this.$Notice.warning({
        title: '文件大小不合法',
        desc: file.name + '太大啦请上传小于5M的文件。'
      })
    },
    doCancel (data) {
      if (!data) {
        this.formItem.id = 0
        this.formItem.image = ''
        this.$refs['myForm'].resetFields()
        this.modalSetting.loading = false
        this.modalSetting.index = 0
      }
    }
  }
}
</script>
