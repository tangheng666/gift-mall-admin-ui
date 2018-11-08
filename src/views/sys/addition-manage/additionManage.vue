<style lang="less">
@import './additionManage.less';
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
              <Form-item label="申请状态" prop="status">
                <Select v-model="searchForm.status" style="width:200px">
                  <Option v-for="item in statusAll" :value="item.key" :key="item.key">{{ item.value }}</Option>
                </Select>
              </Form-item>
              <Form-item label="用户账号" prop="search">
                <Input type="text" v-model="searchForm.search" clearable placeholder="请输入用户账号" style="width: 200px" />
              </Form-item>
              <Form-item style="margin-left:-35px;" class="br">
                <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                <Button @click="handleReset">重置</Button>
              </Form-item>
            </Form>
          </Row>
          <Row class="operation">
            <!-- <Button @click="add" type="primary" icon="md-add">添加礼品</Button> -->
            <Button @click="delAll" icon="md-trash">批量审核</Button>
            <Dropdown @on-click="handleDropdown">
              <Button>
                更多操作
                <Icon type="md-arrow-dropdown" />
              </Button>
              <DropdownMenu slot="list">
                <DropdownItem name="refresh">刷新</DropdownItem>
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
            <Table :loading="loading" border :columns="columns" :data="data" sortable="custom" @on-selection-change="showSelect" ref="table"></Table>
          </Row>
          <Row type="flex" justify="end" class="page">
            <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]" size="small" show-elevator show-sizer></Page>
          </Row>
        </Card>
      </i-col>
    </Row>
    <!-- <Modal :title="modalTitle" v-model="giftModelVisible" :mask-closable='false' :width="600" :styles="{top: '30px'}">
      <Form ref="giftForm" :model="giftForm" :label-width="100" :rules="giftFormValidate">
        <FormItem label="外部礼品编号" prop="goodNo">
          <Input v-model="giftForm.goodNo" autocomplete="off" />
        </FormItem>
        <FormItem label="净重（kg）" prop="weight">
          <Input v-model="giftForm.weight" />
        </FormItem>
        <FormItem label="单价" prop="price">
          <Input v-model="giftForm.price" />
        </FormItem>
        <FormItem label="库存" prop="stock">
          <Input v-model="giftForm.stock" />
        </FormItem>

        <FormItem label="规格" prop="standard">
          <Input v-model="giftForm.standard" />
        </FormItem>

        <Form-item label="照片" prop="photo">
          <Poptip trigger="hover" title="图片预览" placement="right" width="350">
            <Input v-model="giftForm.photo" placeholder="可直接填入网络图片链接" clearable />
            <div slot="content">
              <img :src="giftForm.photo" alt="无效的图片链接" style="width: 100%;margin: 0 auto;display: block;">
              <a @click="viewPic()" style="margin-top:5px;text-align:right;display:block">查看原图</a>
            </div>
          </Poptip>
          <Upload :action="uploadFileUrl" :on-success="handleSuccess" :on-error="handleError" :format="['jpg','jpeg','png','gif']" :max-size="5120" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="beforeUpload" ref="up" class="upload">
            <Button icon="ios-cloud-upload-outline">上传图片</Button>
          </Upload>
        </Form-item>
        <FormItem label="礼品简介" prop="summary">
          <Input v-model="giftForm.summary" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请填写礼品简介" />
        </FormItem>

      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelGift">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submitGift">提交</Button>
      </div>
    </Modal>
    <Modal title="图片预览" v-model="viewImage" :styles="{top: '30px'}" draggable>
      <img :src="giftForm.photo" alt="无效的图片链接" style="width: 100%;margin: 0 auto;display: block;">
      <div slot="footer">
        <Button @click="viewImage=false">关闭</Button>
      </div>
    </Modal> -->
  </div>
</template>

<script>
import { getAllAdditionData, dealAddition } from '@/api/addition'
import circleLoading from '../../my-components/circle-loading.vue'
import expandRow from './expand.vue'
export default {
  name: 'gift-manage',
  components: {
    circleLoading,
    expandRow
  },
  data() {
    return {
      loading: true,
      operationLoading: false,
      loadingExport: true,
      drop: false,
      selectCount: 0,
      selectList: [],
      selectDep: [],
      searchKey: '',
      searchForm: {
        offset: 1,
        limit: 10,
        status: '',
        search: ''
      },
      statusAll: [
        { key: 'REVIEW', value: '审核中' },
        { key: 'REJECT', value: '审核失败' },
        { key: 'PASS', value: '审核成功' }
      ],
      selectDate: null,
      modalType: 0,
      giftModelVisible: false,
      modalTitle: '',
      giftForm: {},
      giftFormValidate: {},
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
          title: '编号',
          key: 'id',
          align: 'center',
          width: 80
        },

        {
          title: '充值金额',
          key: 'amount',
          align: 'center',
          width: 100
        },
        {
          title: '支付宝充值订单号',
          key: 'aliNo',
          width: 300,
          align: 'center'
        },
        {
          title: '申请状态',
          key: 'status',
          align: 'center',
          width: 100,
          render: (h, params) => {
            if (params.row.status === 'REVIEW') {
              return h(
                'span',
                {
                  attrs: {
                    style: 'color: #2b8aef'
                  }
                },
                '审核中'
              )
            } else if (params.row.status === 'REJECT') {
              return h(
                'span',
                {
                  attrs: {
                    style: 'color: #f21f2b'
                  }
                },
                '审核失败'
              )
            } else {
              return h(
                'span',
                {
                  attrs: {
                    style: 'color: #19be6b'
                  }
                },
                '审核成功'
              )
            }
          }
        },
        {
          title: '申请人电话',
          key: 'mobile',
          align: 'center',
          width: 150
        },
        {
          title: '申请人QQ',
          key: 'qq',
          align: 'center',
          width: 150
        },
        {
          title: '申请人微信',
          key: 'wechat',
          width: 150,
          align: 'center'
        },
        {
          title: '创建时间',
          key: 'dateCreated',
          width: 180,
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          width: 240,
          align: 'center',
          fixed: 'right',
          render: (h, params) => {
            if (params.row.status === 'REVIEW') {
              return h('div', [
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
                        this.deal(params.row)
                      }
                    }
                  },
                  '处理'
                )
              ])
            }
          }
        }
      ],
      data: [],
      total: 0,
      dealForm: {
        allow: '',
        id: '',
        reason: ''
      }
    }
  },
  methods: {
    init() {
      this.getAdditionList()
    },

    changePage(v) {
      this.searchForm.pageNumber = v
      this.getAdditionList()
      this.clearSelectAll()
    },
    changePageSize(v) {
      this.searchForm.pageSize = v
      this.getAdditionList()
    },

    getAdditionList() {
      // 多条件搜索用户列表
      this.loading = true
      getAllAdditionData(this.searchForm).then(res => {
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
      this.getAdditionList()
      this.clearSelectAll()
    },
    handleReset() {
      this.$refs.searchForm.resetFields()
      this.searchForm.offset = 1
      this.searchForm.limit = 10
      this.selectDep = []
      // 重新加载数据
      this.getAdditionList()
    },
    handleDropdown(name) {
      if (name === 'refresh') {
        this.getAdditionList()
      }
    },
    add() {
      this.modalType = 0
      this.modalTitle = '添加礼品'
      this.$refs.giftForm.resetFields()
      this.giftModelVisible = true
    },
    edit(v) {
      this.modalType = 1
      this.modalTitle = '编辑礼品'
      this.$refs.giftForm.resetFields()
      // 转换null为""
      for (let attr in v) {
        if (v[attr] === null) {
          v[attr] = ''
        }
      }
      let str = JSON.stringify(v)
      let giftInfo = JSON.parse(str)
      this.giftForm = giftInfo
      this.giftModelVisible = true
    },
    deal(v) {
      this.dealForm.id = v.id
      this.$Modal.confirm({
        render: h => {
          return [
            h(
              'RadioGroup',
              {
                props: {
                  value: this.dealForm.allow
                },
                attrs: {
                  style: 'margin-top:20px; margin-bottom:20px;'
                },
                on: {
                  'on-change': status => {
                    this.dealForm.allow = status
                  }
                }
              },
              [
                h(
                  'Radio',
                  {
                    props: {
                      label: 'true'
                    }
                  },
                  [
                    h('Icon', { props: { type: 'md-checkmark' } }),

                    h('span', '成功')
                  ]
                ),
                h(
                  'Radio',
                  {
                    props: {
                      label: 'false'
                    }
                  },
                  [
                    h('Icon', { props: { type: 'md-close' } }),

                    h('span', '失败')
                  ]
                )
              ]
            ),

            h('Input', {
              props: {
                value: this.dealForm.reason,
                autofocus: true,
                placeholder: '请输入处理原因'
              },
              on: {
                input: val => {
                  this.dealForm.reason = val
                }
              }
            })
          ]
        },

        onOk: () => {
          if (this.dealForm.allow.trim() === '') {
            this.$Message.info('请选择处理结果 !')
            return
          }
          if (this.dealForm.reason.trim() === '') {
            this.$Message.info('原因必填的 !')
            return
          }
          dealAddition(this.dealForm).then(res => {
            if (res.returnCode === '0000') {
              this.$Message.success('操作成功 !')
              this.getAdditionList()
            } else {
              this.$Message.info(res.returnMessage)
            }
          })
        },
        onCancel: () => {
          // this.$Message.info('Clicked cancel')
        }
      })
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
        this.$Message.warning('您还未选择要审核的数据')
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
              this.getAdditionList()
            }
          })
        }
      })
    }
  },
  mounted() {
    this.init()
  }
}
</script>