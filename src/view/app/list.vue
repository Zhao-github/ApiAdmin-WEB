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
                            <Option :value="1">AppId</Option>
                            <Option :value="2">应用名称</Option>
                        </Select>
                    </FormItem>
                    <FormItem style="margin-bottom: 0">
                        <Input v-model="searchConf.keywords" placeholder=""></Input>
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
                <span>{{formItem.id ? '编辑' : '新增'}}应用</span>
            </p>
            <Form ref="myForm" :rules="ruleValidate" :model="formItem" :label-width="80">
                <FormItem label="应用名称" prop="app_name">
                    <Input v-model="formItem.app_name" placeholder="请输入应用名称"></Input>
                </FormItem>
                <FormItem label="AppId" prop="app_id">
                    <Input style="width: 300px" disabled v-model="formItem.app_id" placeholder="请输入AppId"></Input>
                    <Badge count="系统自动生成，不允许修改" style="margin-left:5px"></Badge>
                </FormItem>
                <FormItem label="AppSecret" prop="app_secret">
                    <Input style="width: 300px" disabled v-model="formItem.app_secret"
                           placeholder="请输入AppSecret">
                        <Button slot="append" icon="refresh" @click="refreshAppSecret"></Button>
                    </Input>
                </FormItem>
                <FormItem label="应用分组" prop="app_group">
                    <Select v-model="formItem.app_group" style="width:200px">
                        <Option v-for="(v, i) in appGroup" :value="v.hash" :key="v.hash"> {{v.name}} </Option>
                    </Select>
                </FormItem>
                <FormItem label="应用描述" prop="app_info">
                    <Input v-model="formItem.app_info" type="textarea"></Input>
                </FormItem>
                <FormItem label="接口访问" prop="app_api">
                    <div class="api-box">
                        <div class="api-group" v-for="(apiArr, groupId) in groupList" :key="groupId">
                            <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
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
                <Button type="text" @click="cancel" style="margin-right: 8px">取消</Button>
                <Button type="primary" @click="submit" :loading="modalSetting.loading">确定</Button>
            </div>
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
                    vm.formItem.app_name = currentRow.app_name;
                    vm.formItem.app_info = currentRow.app_info;
                    vm.formItem.app_id = currentRow.app_id;
                    vm.formItem.app_secret = currentRow.app_secret;
                    vm.formItem.app_group = currentRow.app_group;
                    axios.get('App/getAppInfo', {
                        params: {
                            id: currentRow.id
                        }
                    }).then(function (response) {
                        let res = response.data;
                        if (res.code === 1) {
                            vm.groupInfo = res.data.groupInfo;
                            vm.groupList = res.data.apiList;
                            for (let index in vm.groupInfo) {
                                if (res.data.app_detail === null || typeof (res.data.app_detail[index]) === 'undefined') {
                                    vm.$set(vm.checkAllStatus, index, false);
                                    vm.$set(vm.checkAllIndeterminate, index, false);
                                    vm.$set(vm.formItem.app_api, index, []);
                                } else {
                                    let hasLength = res.data.app_detail[index].length;
                                    if (hasLength === 0) {
                                        vm.$set(vm.checkAllStatus, index, false);
                                        vm.$set(vm.checkAllIndeterminate, index, false);
                                        vm.$set(vm.formItem.app_api, index, []);
                                    } else if (vm.groupList[index].length === hasLength) {
                                        vm.$set(vm.checkAllStatus, index, true);
                                        vm.$set(vm.checkAllIndeterminate, index, false);
                                        vm.$set(vm.formItem.app_api, index, res.data.app_detail[index]);
                                    } else {
                                        vm.$set(vm.checkAllStatus, index, false);
                                        vm.$set(vm.checkAllIndeterminate, index, true);
                                        vm.$set(vm.formItem.app_api, index, res.data.app_detail[index]);
                                    }
                                }
                            }
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
                    axios.get('App/del', {
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
                        key: 'app_name'
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
                        key: 'app_status',
                        width: 120
                    },
                    {
                        title: '操作',
                        align: 'center',
                        key: 'handle',
                        width: 175,
                        handle: ['edit', 'delete']
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
                        {required: true, message: '用户名不能为空', trigger: 'blur'}
                    ]
                },
                checkAllStatus: {},
                checkAllIndeterminate: {}
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
                    if (item.handle) {
                        item.render = (h, param) => {
                            let currentRowData = vm.tableData[param.index];
                            return h('div', [
                                editButton(vm, h, currentRowData, param.index),
                                deleteButton(vm, h, currentRowData, param.index)
                            ]);
                        };
                    }
                    if (item.key === 'app_status') {
                        item.render = (h, param) => {
                            let currentRowData = vm.tableData[param.index];
                            return h('i-switch', {
                                attrs: {
                                    size: 'large'
                                },
                                props: {
                                    'true-value': 1,
                                    'false-value': 0,
                                    value: currentRowData.app_status
                                },
                                on: {
                                    'on-change': function (status) {
                                        axios.get('App/changeStatus', {
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
            },
            alertAdd () {
                let vm = this;
                axios.get('AppGroup/getAll').then(function (response) {
                    let res = response.data;
                    if (res.code === 1) {
                        vm.appGroup = res.data.list;
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
                axios.get('App/getAppInfo').then(function (response) {
                    let res = response.data;
                    if (res.code === 1) {
                        vm.formItem.app_id = res.data.app_id;
                        vm.formItem.app_secret = res.data.app_secret;
                        vm.groupInfo = res.data.groupInfo;
                        vm.groupList = res.data.apiList;
                        for (let index in vm.groupInfo) {
                            vm.$set(vm.checkAllStatus, index, false);
                            vm.$set(vm.checkAllIndeterminate, index, false);
                            vm.$set(vm.formItem.app_api, index, []);
                        }
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
                let self = this;
                this.$refs['myForm'].validate((valid) => {
                    if (valid) {
                        self.modalSetting.loading = true;
                        let target = '';
                        if (this.formItem.id === 0) {
                            target = 'App/add';
                        } else {
                            target = 'App/edit';
                        }
                        axios.post(target, self.formItem).then(function (response) {
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
                this.formItem.id = 0;
                this.$refs['myForm'].resetFields();
                this.modalSetting.show = false;
                this.modalSetting.loading = false;
                this.modalSetting.index = 0;
            },
            changePage (page) {
                this.tableShow.currentPage = page;
                this.getList();
            },
            changeSize (size) {
                this.tableShow.pageSize = size;
                this.getList();
            },
            handleCheckAll (groupId) {
                if (this.checkAllStatus[groupId]) {
                    this.checkAllStatus[groupId] = false;
                } else {
                    this.checkAllStatus[groupId] = !this.checkAllStatus[groupId];
                }
                this.checkAllIndeterminate[groupId] = false;

                if (this.checkAllStatus[groupId]) {
                    let vm = this;
                    this.groupList[groupId].forEach(item => {
                        vm.formItem.app_api[groupId].push(item.hash);
                    });
                } else {
                    this.formItem.app_api[groupId] = [];
                }
            },
            checkAllGroupChange (groupId) {
                if (this.formItem.app_api[groupId].length === this.groupList[groupId].length) {
                    this.checkAllIndeterminate[groupId] = false;
                    this.checkAllStatus[groupId] = true;
                } else if (this.formItem.app_api[groupId].length > 0) {
                    this.checkAllIndeterminate[groupId] = true;
                    this.checkAllStatus[groupId] = false;
                } else {
                    this.checkAllIndeterminate[groupId] = false;
                    this.checkAllStatus[groupId] = false;
                }
            },
            search () {
                this.tableShow.currentPage = 1;
                this.getList();
            },
            refreshAppSecret () {
                let vm = this;
                axios.get('App/refreshAppSecret', {
                    params: {
                        id: vm.formItem.id
                    }
                }).then(function (response) {
                    let res = response.data;
                    if (res.code === 1) {
                        vm.formItem.app_secret = res.data.app_secret;
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
            getList () {
                let vm = this;
                axios.get('App/index', {
                    params: {
                        page: vm.tableShow.currentPage,
                        size: vm.tableShow.pageSize,
                        type: vm.searchConf.type,
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
            doCancel (data) {
                if (!data) {
                    this.formItem.id = 0;
                    this.$refs['myForm'].resetFields();
                    this.modalSetting.loading = false;
                    this.modalSetting.index = 0;
                }
            }
        }
    };
</script>
