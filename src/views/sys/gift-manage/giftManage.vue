<style lang="less">
@import './giftManage.less';
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
              <Form-item label="礼品编号" prop="search">
                <Input type="text" v-model="searchForm.search" clearable placeholder="请输入礼品编号" style="width: 200px" />
              </Form-item>
              <Form-item style="margin-left:-35px;" class="br">
                <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                <Button @click="handleReset">重置</Button>
              </Form-item>
            </Form>
          </Row>
          <Row class="operation">
            <Button @click="add" type="primary" icon="md-add">添加礼品</Button>
            <Button @click="delAll" icon="md-trash">批量删除</Button>
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
            <Page :current="searchForm.current" :page-size="searchForm.limit" :total="total" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]" size="small" show-elevator show-sizer></Page>
          </Row>
        </Card>
      </i-col>
    </Row>
    <Modal :title="modalTitle" v-model="giftModelVisible" :mask-closable='false' :width="600" :styles="{top: '30px'}">
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
        <FormItem label="禁发地区" prop="noArea">
          <Input v-model="giftForm.noArea" />
        </FormItem>
        <Form-item label="照片" prop="photo">
          <Poptip trigger="hover" title="图片预览" placement="right" width="350">
            <Input v-model="giftForm.photo" placeholder="可直接填入网络图片链接" clearable />
            <div slot="content">
              <img :src="giftForm.photo" alt="无效的图片链接" style="width: 100%;margin: 0 auto;display: block;">
              <a @click="viewPic()" style="margin-top:5px;text-align:right;display:block">查看原图</a>
            </div>
          </Poptip>
          <Upload :action="uploadFileUrl" :on-success="handleSuccess" :show-upload-list="false" name="fstream" :on-error="handleError" :format="['jpg','jpeg','png','gif']" :max-size="5120" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="beforeUpload" ref="up" class="upload">
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
    </Modal>
  </div>
</template>

<script>
import { getAllGiftData, addGift, editGift, deleteGift } from '@/api/gift'
import { uploadFile } from '@/api/index'
import circleLoading from '../../my-components/circle-loading.vue'
export default {
  name: 'gift-manage',
  components: {
    circleLoading
  },
  data() {
    return {
      uploadFileUrl: uploadFile,
      loading: true,
      operationLoading: false,
      loadingExport: true,
      drop: false,
      selectCount: 0,
      selectList: [],
      viewImage: false,
      selectDep: [],
      searchKey: '',
      searchForm: {
        current: 1,
        limit: 10,
        search: ''
      },
      selectDate: null,
      modalType: 0,
      giftModelVisible: false,
      modalTitle: '',
      giftForm: {
        standard: '',
        price: 0.0,
        stock: 0,
        summary: '',
        weight: 0.0,
        noArea:'',
        goodNo: '',
        id: '',
        photo: 'https://s1.ax1x.com/2018/05/19/CcdVQP.png'
      },
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
          type: 'index',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '礼品编号',
          key: 'id',
          width: 100
        },

        {
          title: '外部礼品编号',
          key: 'goodNo',
          width: 120
        },
        {
          title: '礼品简介',
          key: 'summary',
          width: 180
        },
        {
          title: '规格',
          key: 'standard',
          width: 180,
          align: 'center'
        },
        {
          title: '单价(元)',
          key: 'price',
          align: 'center',
          width: 100
        },
        {
          title: '重量(kg)',
          key: 'weight',
          width: 150
        },
        {
          title: '库存',
          key: 'stock',
          width: 150
        },
        {
          title: '禁发地区',
          key: 'noArea',
          width: 150
        },
        {
          title: '图片',
          key: 'photo',
          width: 80,
          align: 'center',
          render: (h, params) => {
            return h('Avatar', {
              props: {
                src: params.row.avatar
              }
            })
          }
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
      total: 0
    }
  },
  methods: {
    init() {
      this.getGiftList()
    },

    changePage(v) {
      this.searchForm.current = v
      this.getGiftList()
      this.clearSelectAll()
    },
    changePageSize(v) {
      this.searchForm.limit = v
      this.getGiftList()
    },

    getGiftList() {
      // 多条件搜索用户列表
      this.loading = true
      getAllGiftData(this.searchForm).then(res => {
        this.loading = false
        if (res.returnCode === '0000') {
          this.data = res.data
          if (res.next) {
            this.total = res.data.length + 1
          } else {
            this.total = res.data.length - 1
          }
        }
      })
    },
    handleSearch() {
      this.searchForm.current = 1
      this.searchForm.limit = 10
      this.getGiftList()
    },
    handleReset() {
      this.$refs.searchForm.resetFields()
      this.searchForm.current = 1
      this.searchForm.limit = 10
      this.selectDep = []
      // 重新加载数据
      this.getGiftList()
    },
    handleDropdown(name) {
      if (name === 'refresh') {
        this.getGiftList()
      }
    },
    cancelGift() {
      this.giftModelVisible = false
    },
    submitGift() {
      this.$refs.giftForm.validate(valid => {
        if (valid) {
          if (this.modalType === 0) {
            // 添加用户 避免编辑后传入id
            delete this.giftForm.id
            this.submitLoading = true
            addGift(this.giftForm).then(res => {
              this.submitLoading = false
              if (res.returnCode === '0000') {
                this.$Message.success('操作成功')
                this.getGiftList()
                this.giftModelVisible = false
              } else {
                this.$Message.info(res.returnMessage)
              }
            })
          } else {
            // 编辑
            this.submitLoading = true
            editGift(this.giftForm).then(res => {
              this.submitLoading = false
              if (res.returnCode === '0000') {
                this.$Message.success('操作成功')
                this.getGiftList()
                this.giftModelVisible = false
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
      return true
    },
    handleSuccess(res, file) {
      if (res.returnCode === '0000') {
        let resData = res.data[0]
        file.url = resData.resUrl
        this.giftForm.photo = resData.resUrl
      } else {
        this.$Message.error(res.message)
      }
    },
    handleError(error, file, fileList) {
      this.$Message.error(error.toString())
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
    remove(v) {
      this.$Modal.confirm({
        title: '确认删除',
        content: '您确认要删除该礼品吗?',
        onOk: () => {
          this.operationLoading = true
          deleteGift({ id: v.id }).then(res => {
            this.operationLoading = false
            if (res.returnCode === '0000') {
              this.$Message.success('删除成功')
              this.getGiftList()
            } else {
              this.$Message.success(res.returnMessage)
            }
          })
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
              this.getGiftList()
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