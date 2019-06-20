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
                            <Button type="primary" @click="search">查询/刷新</Button>
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
            <p slot="header" style="color:#2d8cf0;">
                <Icon type="information-circled"></Icon>
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
            <p slot="header" style="color:#2d8cf0;">
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
    import axios from 'axios';
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
                    vm.formItem.id = currentRow.id;
                    vm.formItem.name = currentRow.name;
                    vm.formItem.description = currentRow.description;
                    axios.get('Auth/getRuleList', {
                        params: {'groupId': currentRow.id}
                    }).then(function (response) {
                        let res = response.data;
                        if (res.code === 1) {
                            vm.ruleList = res.data.list;
                        } else {
                            if (res.code === -14) {
                                vm.$store.commit('logout', vm);
                                vm.$router.push({
                                    name: 'login'
                                });
                            } else {
                                vm.$Message.error(res.msg);
                            }
                        }
                    });
                    vm.modalSetting.show = true;
                    vm.modalSetting.index = index;
                }
            }
        }, '编辑');
    };
    const deleteButton = (vm, h, currentRow, index) => {
        return h('Poptip', {
            props: {
                confirm: true,
                title: '您确定要删除这条数据吗? ',
                transfer: true
            },
            on: {
                'on-ok': () => {
                    axios.get('Auth/del', {
                        params: {
                            id: currentRow.id
                        }
                    }).then(function (response) {
                        currentRow.loading = false;
                        if (response.data.code === 1) {
                            vm.tableData.splice(index, 1);
                            vm.$Message.success(response.data.msg);
                        } else {
                            vm.$Message.error(response.data.msg);
                        }
                    });
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
            }, '删除')
        ]);
    };
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
                    vm.memberSetting.show = true;
                    vm.memberShow.gid = currentRow.id;
                    vm.getMemberList();
                }
            }
        }, '组成员');
    };
    const memberDelButton = (vm, h, currentRow, index) => {
        return h('Poptip', {
            props: {
                confirm: true,
                title: '您确定要删除这条数据吗? ',
                transfer: true
            },
            on: {
                'on-ok': () => {
                    axios.get('Auth/delMember', {
                        params: {
                            uid: currentRow.id,
                            gid: vm.memberShow.gid
                        }
                    }).then(function (response) {
                        currentRow.loading = false;
                        if (response.data.code === 1) {
                            vm.memberData.splice(index, 1);
                            vm.$Message.success(response.data.msg);
                        } else {
                            vm.$Message.error(response.data.msg);
                        }
                    });
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
            }, '删除')
        ]);
    };

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
                        key: 'member',
                        width: 116,
                        handle: ['member']
                    },
                    {
                        title: '状态',
                        align: 'center',
                        key: 'status',
                        width: 100
                    },
                    {
                        title: '操作',
                        align: 'center',
                        key: 'handle',
                        width: 175,
                        handle: ['edit', 'delete']
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
                        key: 'loginTimes',
                        width: 90
                    },
                    {
                        title: '最后登录时间',
                        align: 'center',
                        key: 'lastLoginTime',
                        width: 160
                    },
                    {
                        title: '最后登录IP',
                        align: 'center',
                        key: 'lastLoginIp',
                        width: 160
                    },
                    {
                        title: '状态',
                        align: 'center',
                        key: 'status',
                        width: 100
                    },
                    {
                        title: '操作',
                        align: 'center',
                        key: 'handle',
                        width: 175,
                        handle: ['delete']
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
            };
        },
        created () {
            this.init();
            this.getList();
        },
        methods: {
            init () {
                let vm = this;
                this.columnsList.forEach(item => {
                    if (item.key === 'handle') {
                        item.render = (h, param) => {
                            let currentRowData = vm.tableData[param.index];
                            return h('div', [
                                editButton(vm, h, currentRowData, param.index),
                                deleteButton(vm, h, currentRowData, param.index)
                            ]);
                        };
                    }
                    if (item.key === 'member') {
                        item.render = (h, param) => {
                            let currentRowData = vm.tableData[param.index];
                            return h('div', [
                                memberButton(vm, h, currentRowData, param.index)
                            ]);
                        };
                    }
                    if (item.key === 'status') {
                        item.render = (h, param) => {
                            let currentRowData = vm.tableData[param.index];
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
                                    'on-change' : function (status) {
                                        axios.get('Auth/changeStatus', {
                                            params: {
                                                status: status,
                                                id: currentRowData.id
                                            }
                                        }).then(function (response) {
                                            let res = response.data;
                                            if (res.code === 1) {
                                                vm.$Message.success(res.msg);
                                            } else {
                                                if (res.code === -14) {
                                                    vm.$store.commit('logout', vm);
                                                    vm.$router.push({
                                                        name: 'login'
                                                    });
                                                } else {
                                                    vm.$Message.error(res.msg);
                                                    vm.getList();
                                                }
                                            }
                                            vm.cancel();
                                        });
                                    }
                                }
                            }, [
                                h('span', {
                                    slot: 'open'
                                }, '启用'),
                                h('span', {
                                    slot: 'close'
                                }, '禁用')
                            ]);
                        };
                    }
                });
                this.memberColumns.forEach(item => {
                    if (item.key === 'handle') {
                        item.render = (h, param) => {
                            let currentRowData = vm.memberData[param.index];
                            return h('div', [
                                memberDelButton(vm, h, currentRowData, param.index)
                            ]);
                        };
                    }
                    if (item.key === 'status') {
                        item.render = (h, param) => {
                            let currentRowData = vm.memberData[param.index];
                            if (currentRowData.status === 1) {
                                return h('Tag', {
                                    props: {
                                        'color': 'green'
                                    }
                                }, '启用');
                            } else {
                                return h('Tag', {
                                    props: {
                                        'color': 'red'
                                    }
                                }, '禁用');
                            }
                        };
                    }
                });
            },
            alertAdd () {
                let vm = this;
                axios.get('Auth/getRuleList').then(function (response) {
                    let res = response.data;
                    if (res.code === 1) {
                        vm.ruleList = res.data.list;
                    } else {
                        if (res.code === -14) {
                            vm.$store.commit('logout', vm);
                            vm.$router.push({
                                name: 'login'
                            });
                        } else {
                            vm.$Message.error(res.msg);
                        }
                    }
                });
                this.modalSetting.show = true;
            },
            submit () {
                this.formItem.rules = [];
                let ruleNodes = this.$refs['formTree'].getCheckedNodes();
                let ruleLength = ruleNodes.length;
                if (ruleLength) {
                    for (let i = 0; i <= ruleLength - 1; i++) {
                        this.formItem.rules.push(ruleNodes[i]['key']);
                    }
                }

                let self = this;
                this.$refs['myForm'].validate((valid) => {
                    if (valid) {
                        self.modalSetting.loading = true;
                        let target = '';
                        if (this.formItem.id === 0) {
                            target = 'Auth/add';
                        } else {
                            target = 'Auth/edit';
                        }
                        axios.post(target, this.formItem).then(function (response) {
                            if (response.data.code === 1) {
                                self.$Message.success(response.data.msg);
                            } else {
                                self.$Message.error(response.data.msg);
                            }
                            self.getList();
                            self.cancel();
                        });
                    }
                });
            },
            cancel () {
                this.modalSetting.show = false;
            },
            doCancel (data) {
                if (!data) {
                    this.formItem.id = 0;
                    this.$refs['myForm'].resetFields();
                    this.modalSetting.loading = false;
                    this.modalSetting.index = 0;
                }
            },
            changePage (page) {
                this.tableShow.currentPage = page;
                this.getList();
            },
            changeSize (size) {
                this.tableShow.pageSize = size;
                this.getList();
            },
            changeMemberPage (page) {
                this.memberShow.currentPage = page;
                this.getMemberList();
            },
            changeMemberSize (size) {
                this.memberShow.pageSize = size;
                this.getMemberList();
            },
            search () {
                this.tableShow.currentPage = 1;
                this.getList();
            },
            getList () {
                let vm = this;
                axios.get('Auth/index', {
                    params: {
                        page: vm.tableShow.currentPage,
                        size: vm.tableShow.pageSize,
                        keywords: vm.searchConf.keywords,
                        status: vm.searchConf.status
                    }
                }).then(function (response) {
                    let res = response.data;
                    if (res.code === 1) {
                        vm.tableData = res.data.list;
                        vm.tableShow.listCount = res.data.count;
                    } else {
                        if (res.code === -14) {
                            vm.$store.commit('logout', vm);
                            vm.$router.push({
                                name: 'login'
                            });
                        } else {
                            vm.$Message.error(res.msg);
                        }
                    }
                });
            },
            getMemberList () {
                let vm = this;
                axios.get('User/getUsers', {
                    params: {
                        page: vm.memberShow.currentPage,
                        size: vm.memberShow.pageSize,
                        gid: vm.memberShow.gid
                    }
                }).then(function (response) {
                    let res = response.data;
                    if (res.code === 1) {
                        vm.memberData = res.data.list;
                        vm.memberShow.listCount = res.data.count;
                    } else {
                        if (res.code === -14) {
                            vm.$store.commit('logout', vm);
                            vm.$router.push({
                                name: 'login'
                            });
                        } else {
                            vm.$Message.error(res.msg);
                        }
                    }
                });
            }
        }
    };
</script>
