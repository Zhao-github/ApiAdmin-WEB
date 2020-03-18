<style lang="less">
  @import "menu.less";
</style>
<template>
  <div class="search">
    <Card>
      <Row class="operation">
        <Button @click="add" class="margin-right-5" type="primary" icon="md-add">添加子菜单</Button>
        <Button @click="addRoot" class="margin-right-5" icon="md-add">添加顶级菜单</Button>
        <Button @click="delAll" class="margin-right-5" icon="md-trash">批量删除</Button>
        <Dropdown @on-click="handleDropdown">
          <Button>
            更多操作
            <Icon type="md-arrow-dropdown"></Icon>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem name="refresh">刷新菜单</DropdownItem>
            <DropdownItem name="expandOne">收合所有</DropdownItem>
            <DropdownItem name="expandTwo">展开一级</DropdownItem>
            <DropdownItem name="expandAll">展开所有</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Row>
      <Row>
        <Col :md="8" :lg="8" :xl="6">
          <Alert show-icon>
            当前选择编辑：
            <span class="select-title">{{editTitle}}</span>
            <a class="select-clear" v-if="form.id" @click="cancelEdit">取消选择</a>
          </Alert>
          <Input
            v-model="searchKey"
            suffix="ios-search"
            @on-change="search"
            placeholder="输入节点名搜索"
            clearable
          />
          <div class="tree-bar" :style="{maxHeight: maxHeight}">
            <Tree
              ref="tree"
              :data="data"
              :load-data="loadData"
              show-checkbox
              @on-check-change="changeSelect"
              @on-select-change="selectTree"
              :check-strictly="!strict"
            ></Tree>
            <Spin size="large" fix v-if="loading"></Spin>
          </div>
        </Col>
        <Col :md="15" :lg="13" :xl="9" style="margin-left:10px;">
          <Form ref="form" :model="form" :label-width="100" :rules="formValidate">
            <FormItem label="上级节点" prop="parentTitle">
              <div style="display:flex;">
                <Input v-model="form.parentTitle" readonly style="margin-right:10px;" />
                <Poptip transfer trigger="click" placement="right-start" title="选择上级节点" width="250">
                  <Button icon="md-list">选择分类</Button>
                  <div slot="content" style="position:relative;min-height:5vh">
                    <Tree :data="dataEdit" :load-data="loadData" @on-select-change="selectTreeEdit"></Tree>
                    <Spin size="large" fix v-if="loadingEdit"></Spin>
                  </div>
                </Poptip>
              </div>
            </FormItem>
            <FormItem label="节点名称" prop="title">
              <Input v-model="form.title" />
            </FormItem>
            <FormItem label="节点图标" prop="icon">
              <icon-choose v-model="formAdd.icon"></icon-choose>
            </FormItem>
            <FormItem label="节点排序" prop="sortOrder">
              <Tooltip trigger="hover" placement="right" content="值越小越靠前，支持小数">
                <InputNumber :max="1000" :min="0" v-model="form.sortOrder"></InputNumber>
              </Tooltip>
            </FormItem>
            <FormItem label="是否启用" prop="status">
              <i-switch size="large" v-model="form.status" :true-value="0" :false-value="-1">
                <span slot="open">启用</span>
                <span slot="close">禁用</span>
              </i-switch>
            </FormItem>
            <Form-item>
              <Button
                @click="submitEdit"
                :loading="submitLoading"
                type="primary"
                icon="ios-create-outline"
                style="margin-right:5px"
              >修改并保存</Button>
              <Button @click="handleReset">重置</Button>
            </Form-item>
          </Form>
        </Col>
      </Row>
    </Card>

    <Modal :title="modalTitle" v-model="modalVisible" :mask-closable="false" :width="500">
      <Form ref="formAdd" :model="formAdd" :label-width="100" :rules="formValidate">
        <div v-if="showParent">
          <FormItem label="上级节点">{{form.title}}</FormItem>
        </div>
        <FormItem label="节点名称" prop="title">
          <Input v-model="formAdd.title" />
        </FormItem>
        <FormItem label="节点排序" prop="sortOrder">
          <Tooltip trigger="hover" placement="right" content="值越小越靠前，支持小数">
            <InputNumber :max="1000" :min="0" v-model="formAdd.sortOrder"></InputNumber>
          </Tooltip>
        </FormItem>
        <FormItem label="是否启用" prop="status">
          <i-switch size="large" v-model="formAdd.status" :true-value="0" :false-value="-1">
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="modalVisible=false">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submitAdd">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import IconChoose from '_c/icon-choose'
import { getList } from '@/api/menu'

export default {
  name: 'system_menu',
  components: {
    IconChoose
  },
  data () {
    return {
      loading: false, // 树加载状态
      maxHeight: '',
      strict: true,
      loadingEdit: false, // 编辑上级树加载状态
      modalVisible: false, // 添加显示
      selectList: [], // 多选数据
      selectCount: 0, // 多选计数
      showParent: false, // 显示上级标识
      modalTitle: '', // 添加标题
      editTitle: '', // 编辑节点名称
      searchKey: '', // 搜索树
      form: {
        // 编辑对象初始化数据
        id: '',
        title: '',
        parentId: '',
        parentTitle: '',
        sortOrder: 0,
        status: 0
      },
      formAdd: {
        // 添加对象初始化数据
      },
      formValidate: {
        // 表单验证规则
        title: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        sortOrder: [
          {
            required: true,
            type: 'number',
            message: '排序值不能为空',
            trigger: 'blur'
          }
        ]
      },
      submitLoading: false,
      data: [],
      dataEdit: []
    }
  },
  methods: {
    init () {
      this.getList()
    },
    handleDropdown (name) {
      if (name === 'expandOne') {
        this.expandMenu(1)
        console.log(this.data)
      } else if (name === 'expandTwo') {
        this.expandLevel = 2
      } else if (name === 'expandAll') {
        this.expandLevel = 4
      } else if (name === 'refresh') {
        this.getList()
      }
    },
    expandMenu (level) {
      this.data.forEach(function (e) {
        if (e.level >= level) {
          e.expand = false
        } else {
          e.expand = true
        }
        if (e.children && e.children.length > 0) {
          e.children.forEach(function (c) {
            if (c.level >= level) {
              c.expand = false
            } else {
              e.expand = true
            }
          })
        }
      })
    },
    getList () {
      let vm = this
      vm.loading = true
      getList().then(response => {
        vm.data = response.data.data.list
        vm.loading = false
      })
    },
    loadData (item, callback) {
      // 异步加载树子节点数据
      // this.getRequest("请求路径，如/tree/getByParentId/" + item.id).then(res => {
      //   if (res.success) {
      //     res.result.forEach(function(e) {
      //       if (e.isParent) {
      //         e.loading = false;
      //         e.children = [];
      //       }
      //     });
      //     callback(res.result);
      //   }
      // });
    },
    search () {
      // 搜索树
      if (this.searchKey) {
        // 模拟请求
        // this.loading = true;
        // this.getRequest("搜索请求路径", { title: this.searchKey }).then(res => {
        //   this.loading = false;
        //   if (res.success) {
        //     this.data = res.result;
        //   }
        // });
        // 模拟请求成功
        this.data = [
          {
            title: '这里需要请求后端接口',
            id: '1',
            parentId: '0',
            parentTitle: '一级节点',
            status: 0
          },
          {
            title: '所以这里是假数据',
            id: '4',
            parentId: '0',
            parentTitle: '一级节点',
            status: 0
          },
          {
            title: '我是被禁用的节点',
            id: '5',
            parentId: '0',
            parentTitle: '一级节点',
            status: -1
          }
        ]
      } else {
        // 为空重新加载
        this.getList()
      }
    },
    selectTree (v) {
      if (v.length > 0) {
        for (let attr in v[0]) {
          if (v[0][attr] == null) {
            v[0][attr] = ''
          }
        }
        let str = JSON.stringify(v[0])
        let data = JSON.parse(str)
        this.form = data
        this.editTitle = data.title
      } else {
        this.cancelEdit()
      }
    },
    cancelEdit () {
      let data = this.$refs.tree.getSelectedNodes()[0]
      if (data) {
        data.selected = false
      }
      this.$refs.form.resetFields()
      this.form.id = ''
      this.editTitle = ''
    },
    selectTreeEdit (v) {
      if (v.length > 0) {
        for (let attr in v[0]) {
          if (v[0][attr] == null) {
            v[0][attr] = ''
          }
        }
        let str = JSON.stringify(v[0])
        let data = JSON.parse(str)
        this.form.parentId = data.id
        this.form.parentTitle = data.title
      }
    },
    handleReset () {
      this.$refs.form.resetFields()
      this.form.status = 0
    },
    submitEdit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.form.id) {
            this.$Message.warning('请先点击选择要修改的节点')
            return
          }
          this.submitLoading = true
          // 避免传入null字符串
          // this.postRequest("请求路径，如/tree/edit", this.form).then(res => {
          //   this.submitLoading = false;
          //   if (res.success) {
          //     this.$Message.success("编辑成功");
          //     this.init();
          //     this.modalVisible = false;
          //   }
          // });
          // 模拟成功
          this.submitLoading = false
          this.$Message.success('编辑成功')
          this.modalVisible = false
        }
      })
    },
    submitAdd () {
      this.$refs.formAdd.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // this.postRequest("请求路径，如/tree/add", this.formAdd).then(res => {
          //   this.submitLoading = false;
          //   if (res.success) {
          //     this.$Message.success("添加成功");
          //     this.init();
          //     this.modalVisible = false;
          //   }
          // });
          // 模拟成功
          this.submitLoading = false
          this.$Message.success('添加成功')
          this.modalVisible = false
        }
      })
    },
    add () {
      if (!this.form.id) {
        this.$Message.warning('请先点击选择一个节点')
        return
      }
      this.modalTitle = '添加子节点'
      this.showParent = true
      this.formAdd = {
        parentId: this.form.id,
        sortOrder: 0,
        status: 0
      }
      this.modalVisible = true
    },
    addRoot () {
      this.modalTitle = '添加一级节点'
      this.showParent = false
      this.formAdd = {
        parentId: 0,
        sortOrder: 0,
        status: 0
      }
      this.modalVisible = true
    },
    changeSelect (v) {
      this.selectCount = v.length
      this.selectList = v
    },
    delAll () {
      if (this.selectCount <= 0) {
        this.$Message.warning('您还未勾选要删除的数据')
        return
      }
      this.$Modal.confirm({
        title: '确认删除',
        content: '您确认要删除所选的 ' + this.selectCount + ' 条数据及其下级所有数据?',
        loading: true,
        onOk: () => {
          this.selectList.forEach(function (e) {
            ids += e.id + ','
          })
          ids = ids.substring(0, ids.length - 1)
          // this.deleteRequest("请求路径，如/tree/delByIds/" + ids).then(res => {
          //   this.$Modal.remove();
          //   if (res.success) {
          //     this.$Message.success("删除成功");
          //     this.selectList = [];
          //     this.selectCount = 0;
          //     this.cancelEdit();
          //     this.init();
          //   }
          // });
          // 模拟成功
          this.$Modal.remove()
          this.$Message.success('删除成功')
          this.selectList = []
          this.selectCount = 0
          this.cancelEdit()
        }
      })
    }
  },
  mounted () {
    // 计算高度
    let height = document.documentElement.clientHeight
    this.maxHeight = Number(height - 310) + 'px'
    this.init()
  }
}
</script>
