<style lang="less">
@import './userManage.less';
.ivu-poptip {
  display: inline-block;
  width: auto;
}
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  .ivu-modal {
    top: 0;
  }
}
u {
  color: red;
  font-size: 16px;
}
</style>
<template>
  <div class="search">
    <Row>
      <i-col>
        <Card>
          <Row>
            <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
              <Form-item label="用户账号" prop="search">
                <Input type="text" v-model="searchForm.search" clearable placeholder="请输入用户账号" style="width: 200px" />
              </Form-item>

              <!-- <span v-if="drop">
                      <Form-item label="QQ号码" prop="search">
                  <Input type="text" v-model="searchForm.search" clearable placeholder="请输入手机号" style="width: 200px" />
                </Form-item>
                <Form-item label="微信" prop="search">
                  <Input type="text" v-model="searchForm.search" clearable placeholder="请输入邮箱" style="width: 200px" />
                </Form-item>
                <Form-item label="性别" prop="sex">
                  <Select v-model="searchForm.sex" placeholder="请选择" clearable style="width: 200px">
                    <Option value="0">女</Option>
                    <Option value="1">男</Option>
                  </Select>
                </Form-item>
                <Form-item label="用户类型" prop="type">
                  <Select v-model="searchForm.type" placeholder="请选择" clearable style="width: 200px">
                    <Option value="0">普通用户</Option>
                    <Option value="1">管理员</Option>
                  </Select>
                </Form-item>
                <Form-item label="用户状态" prop="status">
                  <Select v-model="searchForm.status" placeholder="请选择" clearable style="width: 200px">
                    <Option value="0">正常</Option>
                    <Option value="-1">禁用</Option>
                  </Select>
                </Form-item>
                <Form-item label="创建时间">
                  <DatePicker v-model="selectDate" type="daterange" format="yyyy-MM-dd" clearable @on-change="selectDateRange" placeholder="选择起始时间" style="width: 200px"></DatePicker>
                </Form-item>
              </span> -->
              <Form-item style="margin-left:-35px;" class="br">
                <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                <Button @click="handleReset">重置</Button>
                <!-- <a class="drop-down" @click="dropDown">{{dropDownContent}}
                  <Icon :type="dropDownIcon"></Icon>
                </a> -->
              </Form-item>
            </Form>
          </Row>
          <Row class="operation">
            <Button @click="add" type="primary" icon="md-add">添加用户</Button>
            <Button @click="delAll" icon="md-trash">批量删除</Button>
            <Dropdown @on-click="handleDropdown">
              <Button>
                更多操作
                <Icon type="md-arrow-dropdown" />
              </Button>
              <DropdownMenu slot="list">
                <DropdownItem name="refresh">刷新</DropdownItem>
                <!-- <DropdownItem name="exportData">导出所选数据</DropdownItem> -->
                <!-- <DropdownItem name="exportAll">导出全部数据</DropdownItem> -->
              </DropdownMenu>
            </Dropdown>
            <circleLoading v-if="operationLoading" />
          </Row>
          <Row>
            <Alert show-icon>
              已选择 <span class="select-count">{{selectCount}}</span> 项
              <a class="select-clear" @click="clearSelectAll">清空</a>
            </Alert>
          </Row>
          <Row>
            <Table :loading="loading" border :columns="columns" :data="data" sortable="custom" @on-sort-change="changeSort" @on-selection-change="showSelect" ref="table"></Table>
            <!-- <Table :columns="exportColumns" :data="exportData" ref="exportTable" style="display:none"></Table> -->
          </Row>
          <Row type="flex" justify="end" class="page">
            <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]" size="small" show-elevator show-sizer></Page>
          </Row>
        </Card>
      </i-col>
    </Row>
    <Modal :title="modalTitle" v-model="userModalVisible" :mask-closable='false' :width="500" :styles="{top: '30px'}">
      <Form ref="userForm" :model="userForm" :label-width="70" :rules="userFormValidate">
        <FormItem label="用户名" prop="username">
          <Input v-model="userForm.username" autocomplete="off" />
        </FormItem>
        <FormItem label="密码" prop="password" v-if="modalType===0" :error="errorPass">
          <Input type="password" v-model="userForm.password" autocomplete="off" />
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input v-model="userForm.email" />
        </FormItem>
        <FormItem label="手机号" prop="mobile">
          <Input v-model="userForm.mobile" />
        </FormItem>
        <FormItem label="性别" prop="sex">
          <RadioGroup v-model="userForm.sex">
            <Radio :label="1">男</Radio>
            <Radio :label="0">女</Radio>
          </RadioGroup>
        </FormItem>
        <Form-item label="头像" prop="avatar">
          <Poptip trigger="hover" title="图片预览" placement="right" width="350">
            <Input v-model="userForm.avatar" placeholder="可直接填入网络图片链接" clearable />
            <div slot="content">
              <img :src="userForm.avatar" alt="无效的图片链接" style="width: 100%;margin: 0 auto;display: block;">
              <a @click="viewPic()" style="margin-top:5px;text-align:right;display:block">查看原图</a>
            </div>
          </Poptip>
          <Upload :action="uploadFileUrl" :headers="accessToken" :on-success="handleSuccess" :on-error="handleError" :format="['jpg','jpeg','png','gif']" :max-size="5120" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="beforeUpload" ref="up" class="upload">
            <Button icon="ios-cloud-upload-outline">上传图片</Button>
          </Upload>
        </Form-item>
        <FormItem label="用户类型" prop="type">
          <Select v-model="userForm.type" placeholder="请选择">
            <Option :value="0">普通用户</Option>
            <Option :value="1">管理员</Option>
          </Select>
        </FormItem>
        <FormItem label="角色分配" prop="roles">
          <Select v-model="userForm.roles" multiple>
            <Option v-for="item in roleList" :value="item.id" :key="item.id" :label="item.name">
              <span style="margin-right:10px;">{{ item.name }}</span>
              <span style="color:#ccc;">{{ item.description }}</span>
              <!-- </div> -->
            </Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelUser">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submitUser">提交</Button>
      </div>
    </Modal>
    <Modal title="图片预览" v-model="viewImage" :styles="{top: '30px'}" draggable>
      <img :src="userForm.avatar" alt="无效的图片链接" style="width: 100%;margin: 0 auto;display: block;">
      <div slot="footer">
        <Button @click="viewImage=false">关闭</Button>
      </div>
    </Modal>
    <!-- <Modal
            v-model="modalExportAll"
            title="确认导出"
            :loading="loadingExport"
            @on-ok="exportAll">
            <p>您确认要导出全部 {{total}} 条数据？</p>
        </Modal> -->

    <Modal title="用户加款" v-model="addMoneyModel" :mask-closable='false' :width="500" :styles="{top: '30px'}" class-name="vertical-center-modal">
      <Form ref="userAddMoneyFrom" :model="userAddMoneyFrom" :label-width="70" :rules="addMoneyFormValidate">
        <FormItem label="用户名" prop="username">
          <u>{{userAddMoneyFrom.mobile }}</u>
        </FormItem>
        <FormItem label="加款金额" prop="amount">
          <InputNumber v-model="userAddMoneyFrom.amount"></InputNumber>（元）
        </FormItem>

      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelAddMoney">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submitAddMoney">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  getUserListData,
  addUser,
  editUser,
  enableUser,
  disableUser,
  deleteUser,
  getAllUserData,
  charge
} from '@/api/user'
import { getAllRoleList } from '@/api/role'
import { uploadFile } from '@/api/index'
import expandRow from './expand.vue'
import circleLoading from '../../my-components/circle-loading.vue'
import numeral from 'numeral'
export default {
  name: 'user-manage',
  components: {
    circleLoading,
    expandRow
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度不得小于6位'))
      } else {
        callback()
      }
    }
    const validateMobile = (rule, value, callback) => {
      var reg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (!reg.test(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
    return {
      accessToken: {},
      uploadFileUrl: uploadFile,
      loading: true,
      operationLoading: false,
      loadingExport: true,
      // modalExportAll: false,
      drop: false,
      dropDownContent: '展开',
      dropDownIcon: 'ios-arrow-down',
      selectCount: 0,
      selectList: [],
      viewImage: false,
      selectDep: [],
      searchKey: '',
      searchForm: {
        offset: 1,
        limit: 10,
        sort: '',
        order: 'desc',
        search: ''
      },
      selectDate: null,
      modalType: 0,
      userModalVisible: false,
      modalTitle: '',
      userForm: {
        sex: 1,
        type: 0,
        avatar: 'https://s1.ax1x.com/2018/05/19/CcdVQP.png',
        roles: []
      },
      userAddMoneyFrom: {
        usrid: '',
        mobile: '',
        amount: 0
      },
      userRoles: [],
      roleList: [],
      errorPass: '',
      userFormValidate: {
        username: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址' },
          { type: 'email', message: '邮箱格式不正确' }
        ]
      },
      addMoneyFormValidate: {
        amount: [{ required: true, message: '请输入加款金额' }]
      },
      submitLoading: false,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          type: 'expand',
          width: 50,
          fixed: 'left',
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row
              }
            })
          }
        },
        {
          type: 'index',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '用户账号',
          key: 'mobile',
          width: 145,
          sortable: true,
          fixed: 'left'
        },

        {
          title: 'QQ号码',
          key: 'qq',
          width: 180,
          sortable: true
        },
        {
          title: '微信',
          key: 'wechat',
          width: 180,
          align: 'center'
        },
        {
          title: '可用余额',
          key: 'wealth',
          align: 'center',
          width: 100,
          render: (h, params) => {
            return h('span', numeral(params.row.wealth).format('0.00'))
          }
        },
        {
          title: '创建时间',
          key: 'createTime',
          sortable: true,
          sortType: 'desc',
          width: 150
        },
        {
          title: '操作',
          key: 'action',
          width: 240,
          align: 'center',
          fixed: 'right',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'info',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.addMoney(params.row)
                    }
                  }
                },
                '加款'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.edit(params.row)
                    }
                  }
                },
                '编辑'
              ),
              h(
                'Button',
                {
                  props: {
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.disable(params.row)
                    }
                  }
                },
                '禁用'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.remove(params.row)
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],
      data: [],
      total: 0,
      addMoneyModel: false
    }
  },
  methods: {
    init() {
      this.accessToken = {
        accessToken: this.getStore('accessToken')
      }
      this.getUserList()
    },

    changePage(v) {
      this.searchForm.pageNumber = v
      this.getUserList()
      this.clearSelectAll()
    },
    changePageSize(v) {
      this.searchForm.pageSize = v
      this.getUserList()
    },
    selectDateRange(v) {
      if (v) {
        this.searchForm.startDate = v[0]
        this.searchForm.endDate = v[1]
      }
    },
    getUserList() {
      // 多条件搜索用户列表
      this.loading = true
      getUserListData(this.searchForm).then(res => {
        this.loading = false
        if (res.returnCode === '0000') {
          this.data = res.data
          if (!res.next) {
            this.total = res.data.length
          }
          this.total = res.data.length + 1
        }
      })
    },
    handleSearch() {
      this.searchForm.offset = 1
      this.searchForm.limit = 10
      this.getUserList()
    },
    handleReset() {
      this.$refs.searchForm.resetFields()
      this.searchForm.offset = 1
      this.searchForm.limit = 10
      this.selectDep = []
      // 重新加载数据
      this.getUserList()
    },
    changeSort(e) {
      this.searchForm.sort = e.key
      this.searchForm.order = e.order
      if (e.order === 'normal') {
        this.searchForm.order = ''
      }
      this.getUserList()
    },
    getRoleList() {
      getAllRoleList().then(res => {
        if (res.success === true) {
          this.roleList = res.result
        }
      })
    },
    handleDropdown(name) {
      if (name === 'refresh') {
        this.getUserList()
      } else if (name === 'exportData') {
        if (this.selectCount <= 0) {
          this.$Message.warning('您还未选择要导出的数据')
          return
        }
        this.$Modal.confirm({
          title: '确认导出',
          content: '您确认要导出所选 ' + this.selectCount + ' 条数据?',
          onOk: () => {
            this.$refs.exportTable.exportCsv({
              filename: '用户数据'
            })
          }
        })
      }
      // } else if (name === "exportAll") {
      //   this.modalExportAll = true;
      // }
    },
    // exportAll() {
    //   getAllUserData().then(res => {
    //     this.modalExportAll = false
    //     if (res.success) {
    //       this.exportData = res.result
    //       setTimeout(() => {
    //         this.$refs.exportTable.exportCsv({
    //           filename: '用户全部数据'
    //         })
    //       }, 1000)
    //     }
    //   })
    // },
    submitAddMoney() {
      this.$refs.userAddMoneyFrom.validate(valid => {
        if (valid) {
          charge(this.userAddMoneyFrom).then(res => {
            if (res.returnCode === '0000') {
              this.$Message.success('操作成功')
              this.getUserList()
              this.addMoneyModel = false
            } else {
              this.$Message.info(res.returnMessage)
            }
          })
        }
      })
    },
    cancelAddMoney() {
      this.addMoneyModel = false
    },
    cancelUser() {
      this.userModalVisible = false
    },
    submitUser() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          if (this.modalType === 0) {
            // 添加用户 避免编辑后传入id
            delete this.userForm.id
            delete this.userForm.status
            if (
              this.userForm.password == '' ||
              this.userForm.password == undefined
            ) {
              this.errorPass = '密码不能为空'
              return
            }
            if (this.userForm.password.length < 6) {
              this.errorPass = '密码长度不得少于6位'
              return
            }
            this.submitLoading = true
            addUser(this.userForm).then(res => {
              this.submitLoading = false
              if (res.success === true) {
                this.$Message.success('操作成功')
                this.getUserList()
                this.userModalVisible = false
              }
            })
          } else {
            // 编辑
            this.submitLoading = true
            editUser(this.userForm).then(res => {
              this.submitLoading = false
              if (res.success === true) {
                this.$Message.success('操作成功')
                this.getUserList()
                this.userModalVisible = false
              }
            })
          }
        }
      })
    },
    viewPic() {
      this.viewImage = true
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: '不支持的文件格式',
        desc:
          '所选文件‘ ' +
          file.name +
          ' ’格式不正确, 请选择 .jpg .jpeg .png .gif格式文件'
      })
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: '文件大小过大',
        desc: '所选文件‘ ' + file.name + ' ’大小过大, 不得超过 5M.'
      })
    },
    beforeUpload() {
      if (!this.$route.meta.permTypes.includes('upload')) {
        this.$Message.error('此处您没有上传权限(为演示功能，该按钮未配置隐藏)')
        return false
      }
      return true
    },
    handleSuccess(res, file) {
      if (res.success === true) {
        file.url = res.result
        this.userForm.avatar = res.result
      } else {
        this.$Message.error(res.message)
      }
    },
    handleError(error, file, fileList) {
      this.$Message.error(error.toString())
    },
    add() {
      this.modalType = 0
      this.modalTitle = '添加用户'
      this.$refs.userForm.resetFields()
      this.userModalVisible = true
    },
    addMoney(v) {
      this.$refs.userAddMoneyFrom.resetFields()
      let str = JSON.stringify(v)
      let userInfo = JSON.parse(str)
      this.userAddMoneyFrom.usrid = userInfo.id
      this.userAddMoneyFrom.mobile = userInfo.mobile
      this.addMoneyModel = true
    },
    edit(v) {
      this.modalType = 1
      this.modalTitle = '编辑用户'
      this.$refs.userForm.resetFields()
      // 转换null为""
      for (let attr in v) {
        if (v[attr] === null) {
          v[attr] = ''
        }
      }
      let str = JSON.stringify(v)
      let userInfo = JSON.parse(str)
      this.userForm = userInfo
      let selectRolesId = []
      this.userForm.roles.forEach(function(e) {
        selectRolesId.push(e.id)
      })
      this.userForm.roles = selectRolesId
      this.userModalVisible = true
    },
    enable(v) {
      this.$Modal.confirm({
        title: '确认启用',
        content: '您确认要启用用户 ' + v.username + ' ?',
        onOk: () => {
          this.operationLoading = true
          enableUser(v.id).then(res => {
            this.operationLoading = false
            if (res.success === true) {
              this.$Message.success('操作成功')
              this.getUserList()
            }
          })
        }
      })
    },
    disable(v) {
      this.$Modal.confirm({
        title: '确认禁用',
        content: '您确认要禁用用户 ' + v.username + ' ?',
        onOk: () => {
          this.operationLoading = true
          disableUser(v.id).then(res => {
            this.operationLoading = false
            if (res.success === true) {
              this.$Message.success('操作成功')
              this.getUserList()
            }
          })
        }
      })
    },
    remove(v) {
      this.$Modal.confirm({
        title: '确认删除',
        content: '您确认要删除用户 ' + v.username + ' ?',
        onOk: () => {
          this.operationLoading = true
          deleteUser(v.id).then(res => {
            this.operationLoading = false
            if (res.success === true) {
              this.$Message.success('删除成功')
              this.getUserList()
            }
          })
        }
      })
    },
    dropDown() {
      if (this.drop) {
        this.dropDownContent = '展开'
        this.dropDownIcon = 'ios-arrow-down'
      } else {
        this.dropDownContent = '收起'
        this.dropDownIcon = 'ios-arrow-up'
      }
      this.drop = !this.drop
    },
    showSelect(e) {
      this.exportData = e
      this.selectList = e
      this.selectCount = e.length
    },
    clearSelectAll() {
      this.$refs.table.selectAll(false)
    },
    delAll() {
      if (this.selectCount <= 0) {
        this.$Message.warning('您还未选择要删除的数据')
        return
      }
      this.$Modal.confirm({
        title: '确认删除',
        content: '您确认要删除所选的 ' + this.selectCount + ' 条数据?',
        onOk: () => {
          let ids = ''
          this.selectList.forEach(function(e) {
            ids += e.id + ','
          })
          ids = ids.substring(0, ids.length - 1)
          this.operationLoading = true
          deleteUser(ids).then(res => {
            this.operationLoading = false
            if (res.success === true) {
              this.$Message.success('删除成功')
              this.clearSelectAll()
              this.getUserList()
            }
          })
        }
      })
    }
  },
  mounted() {
    this.init()
    //   this.getRoleList()
  }
}
</script>