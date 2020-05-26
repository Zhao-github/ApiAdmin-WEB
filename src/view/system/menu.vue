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
        <Col :md="8" :lg="8" :xl="11" :xxl="8">
          <Alert show-icon>
            当前选择编辑：
            <span class="select-title">{{editTitle}}</span>
            <a class="select-clear" v-if="form.id" @click="cancelEdit">取消选择</a>
          </Alert>
          <Input
            v-model="searchKey"
            suffix="ios-search"
            @on-change="search"
            placeholder="输入菜单名搜索"
            clearable
          />
          <div class="tree-bar" :style="{maxHeight: maxHeight}">
            <Tree
              ref="tree"
              :data="data"
              show-checkbox
              @on-check-change="changeSelect"
              @on-select-change="selectTree"
            ></Tree>
            <Spin size="large" fix v-if="loading"></Spin>
          </div>
        </Col>
        <Col :md="15" :lg="13" :xl="12" :xxl="9" style="margin-left:10px;">
          <Form ref="form" :model="form" :label-width="100" :rules="formValidate">
            <FormItem label="菜单名称" prop="title">
              <Input v-model="form.title" />
            </FormItem>
            <FormItem label="菜单鉴权" prop="permission">
              <Checkbox :true-value="1" :false-value="0" border v-model="form.auth"> 需要登录 </Checkbox>
              <Checkbox :true-value="1" :false-value="0" border v-model="form.permission"> 访问鉴权 </Checkbox>
              <Checkbox :true-value="1" :false-value="0" border v-model="form.log"> 记录日志 </Checkbox>
              <Checkbox :true-value="1" :false-value="0" border v-model="form.show"> 显示与否 </Checkbox>
            </FormItem>
            <FormItem label="菜单类型" prop="level">
              <RadioGroup v-model="form.level">
                <Radio label="1" border disabled>顶级菜单</Radio>
                <Radio label="2" border disabled>二级菜单</Radio>
                <Radio label="3" border disabled>页内按钮</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="请求方式" prop="method">
              <RadioGroup v-model="form.method">
                <Radio :label="1" border > GET </Radio>
                <Radio :label="2" border > POST </Radio>
                <Radio :label="3" border > PUT </Radio>
                <Radio :label="4" border > DELETE </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="菜单图标" prop="icon">
              <icon-choose v-model="form.icon"></icon-choose>
            </FormItem>
            <FormItem label="后端类库" prop="url">
              <Input v-model="form.url">
                <span slot="prepend">admin/</span>
              </Input>
            </FormItem>
            <FormItem label="前端路由" prop="router">
              <Input v-model="form.router" />
            </FormItem>
            <FormItem label="前端组件" prop="component">
              <Input v-model="form.component" />
            </FormItem>
            <FormItem label="菜单排序" prop="sort">
              <Tooltip trigger="hover" placement="right" content="值越小越靠前，支持小数">
                <InputNumber :max="1000" :min="0" v-model="form.sort"></InputNumber>
              </Tooltip>
            </FormItem>
            <Form-item>
              <Button
                @click="submitEdit"
                :loading="submitLoading"
                type="primary"
                icon="ios-create-outline"
                class="margin-right-5"
              >修改并保存</Button>
              <Button @click="handleReset">重置</Button>
            </Form-item>
          </Form>
        </Col>
      </Row>
    </Card>

    <Modal :title="modalTitle" v-model="modalVisible" :mask-closable="false" :width="600">
      <Form ref="formAdd" :model="formAdd" :label-width="100" :rules="formValidate">
        <div v-if="showParent">
          <FormItem label="上级菜单">
            <Tag size="medium" color="blue">{{form.title}}</Tag>
          </FormItem>
        </div>
        <FormItem label="菜单名称" prop="title">
          <Input v-model="formAdd.title" />
        </FormItem>
        <FormItem label="菜单鉴权" prop="permission">
          <Checkbox :true-value="1" :false-value="0" border v-model="formAdd.auth"> 需要登录 </Checkbox>
          <Checkbox :true-value="1" :false-value="0" border v-model="formAdd.permission"> 访问鉴权 </Checkbox>
          <Checkbox :true-value="1" :false-value="0" border v-model="formAdd.log"> 记录日志 </Checkbox>
          <Checkbox :true-value="1" :false-value="0" border v-model="formAdd.show"> 显示与否 </Checkbox>
        </FormItem>
        <FormItem label="菜单类型" prop="level">
          <RadioGroup v-model="formAdd.level">
            <Radio label="1" border disabled>顶级菜单</Radio>
            <Radio label="2" border disabled>二级菜单</Radio>
            <Radio label="3" border disabled>页内按钮</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="请求方式" prop="method">
          <RadioGroup v-model="formAdd.method">
            <Radio :label="1" border > GET </Radio>
            <Radio :label="2" border > POST </Radio>
            <Radio :label="3" border > PUT </Radio>
            <Radio :label="4" border > DELETE </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="菜单图标" prop="icon">
          <icon-choose v-model="formAdd.icon"></icon-choose>
        </FormItem>
        <FormItem label="后端类库" prop="url">
          <Input v-model="formAdd.url" >
            <span slot="prepend">admin/</span>
          </Input>
        </FormItem>
        <FormItem label="前端路由" prop="router">
          <Input v-model="formAdd.router" />
        </FormItem>
        <FormItem label="前端组件" prop="component">
          <Input v-model="formAdd.component" />
        </FormItem>
        <FormItem label="菜单排序" prop="sort">
          <Tooltip trigger="hover" placement="right" content="值越小越靠前，支持小数">
            <InputNumber :max="1000" :min="0" v-model="formAdd.sort"></InputNumber>
          </Tooltip>
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
import { getList, add, edit, del } from '@/api/menu'

export default {
  name: 'system_menu',
  components: {
    IconChoose
  },
  data () {
    return {
      loading: false, // 树加载状态
      maxHeight: '',
      modalVisible: false, // 添加显示
      selectList: [], // 多选数据
      selectCount: 0, // 多选计数
      showParent: false, // 显示上级标识
      modalTitle: '', // 添加标题
      editTitle: '', // 编辑节点名称
      searchKey: '', // 搜索树
      form: {
        id: '',
        level: '',
        icon: '',
        router: '',
        method: 1,
        url: '',
        component: '',
        auth: 0,
        log: 0,
        permission: 0,
        show: 1,
        sort: 0
      },
      formAdd: {
        title: '',
        level: '',
        icon: '',
        router: '',
        method: 1,
        url: '',
        component: '',
        auth: 1,
        log: 1,
        permission: 1,
        show: 1,
        sort: 0
      },
      formValidate: {
        title: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        sort: [
          { required: true, type: 'number', message: '排序值不能为空', trigger: 'blur' }
        ]
      },
      submitLoading: false,
      data: []
    }
  },
  methods: {
    handleDropdown (name) {
      if (name === 'expandOne') {
        this.getList(1)
      } else if (name === 'expandTwo') {
        this.getList(2)
      } else if (name === 'expandAll') {
        this.getList(3)
      } else if (name === 'refresh') {
        this.getList()
      }
    },
    getList (level) {
      let vm = this
      level = level || 0
      let data = sessionStorage.getItem('menuList')
      if (data === null || level === 0) {
        vm.loading = true
        getList().then(response => {
          sessionStorage.setItem('menuList', JSON.stringify(response.data.data.list))
          vm.data = vm.reBuildMenu(response.data.data.list, level)
          vm.loading = false
        })
      } else {
        vm.data = vm.reBuildMenu(JSON.parse(data), level)
      }
      vm.selectCount = 0
      vm.selectList = []
    },
    reBuildMenu (data, level) {
      let vm = this
      data.forEach(function (e) {
        if (e.children && e.children.length > 0) {
          if (e.level < level) {
            e.expand = true
          }
          e.children = vm.reBuildMenu(e.children, level)
        }
      })
      return data
    },
    selectTree (v) {
      if (v[0] && v[0].id !== this.form.id) {
        this.form = JSON.parse(JSON.stringify(v[0]))
        this.form.level = this.form.level.toString()
        this.form.url = this.form.url.slice(6)
        this.editTitle = this.form.title
      } else {
        this.cancelEdit()
      }
    },
    cancelEdit () {
      let data = this.$refs.tree.getSelectedNodes()[0]
      if (data) {
        data.selected = false
      }
      this.handleReset()
      this.form.id = ''
      this.editTitle = ''
    },
    handleReset () {
      this.$refs.form.resetFields()
      this.form.level = ''
      this.form.auth = 0
      this.form.log = 0
      this.form.permission = 0
      this.form.show = 1
    },
    add () {
      if (!this.form.id) {
        this.$Message.warning('请先点击选择一个菜单')
        return
      }
      this.modalTitle = '添加子菜单'
      this.showParent = true
      this.formAdd = {
        fid: this.form.id,
        title: '',
        level: (parseInt(this.form.level) + 1).toString(),
        icon: '',
        router: '',
        url: '',
        method: 1,
        component: '',
        auth: 1,
        log: 1,
        permission: 1,
        show: 1,
        sort: 0
      }
      this.modalVisible = true
    },
    addRoot () {
      this.modalTitle = '添加顶级菜单'
      this.showParent = false
      this.formAdd = {
        fid: 0,
        title: '',
        level: '1',
        icon: '',
        router: '',
        url: '',
        method: 1,
        component: '',
        auth: 1,
        log: 1,
        permission: 1,
        show: 1,
        sort: 0
      }
      this.modalVisible = true
    },
    changeSelect (v) {
      this.selectCount = v.length
      this.selectList = v
    },
    submitAdd () {
      let vm = this
      vm.$refs.formAdd.validate(valid => {
        if (valid) {
          vm.submitLoading = true
          add(vm.formAdd).then(response => {
            vm.$Message.success(response.data.msg)
            vm.getList()
            vm.submitLoading = false
            vm.modalVisible = false
          }).catch(() => {
            vm.submitLoading = false
          })
        }
      })
    },
    submitEdit () {
      let vm = this
      vm.$refs.form.validate(valid => {
        if (valid) {
          if (!vm.form.id) {
            vm.$Message.warning('请先点击选择要修改的节点')
            return
          }
          vm.submitLoading = true
          edit(vm.form).then(response => {
            vm.$Message.success(response.data.msg)
            vm.getList()
            vm.submitLoading = false
            vm.modalVisible = false
          }).catch(() => {
            vm.submitLoading = false
          })
        }
      })
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
          let vm = this
          let ids = ''
          vm.selectList.forEach(function (e) {
            ids += e.id + ','
          })
          ids = ids.substring(0, ids.length - 1)
          del(ids).then(response => {
            vm.getList()
            vm.$Message.success(response.data.msg)
            vm.$Modal.remove()
            vm.cancelEdit()
          })
        }
      })
    },
    search () {
      let vm = this
      if (vm.searchKey) {
        vm.loading = true
        getList(vm.searchKey).then(response => {
          vm.data = response.data.data.list
          vm.loading = false
        })
      } else {
        vm.getList(1)
      }
    }
  },
  mounted () {
    // 计算高度
    let height = document.documentElement.clientHeight
    this.maxHeight = Number(height - 310) + 'px'
    this.getList()
  }
}
</script>
