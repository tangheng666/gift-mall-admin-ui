<style lang="less">
@import 'noticeManage.less';

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
      <Col>
      <Card>
        <Row>
          <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
            <Form-item label="公告标题" prop="title">
              <Input type="text" v-model="searchForm.title" clearable placeholder="请输入标题" style="width: 200px" />
            </Form-item>
            <Form-item label="创建时间">
              <DatePicker v-model="selectDate" type="date" format="yyyy-MM-dd" clearable @on-change="selectDateRange" placeholder="选择创建时间" style="width: 200px"></DatePicker>
            </Form-item>
            <Form-item style="margin-left:-35px;" class="br">
              <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
              <Button @click="handleReset">重置</Button>
            </Form-item>
          </Form>
        </Row>
        <Row class="operation">
          <Button @click="add" type="primary" icon="md-add">添加公告</Button>
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
          <Table :loading="loading" border :columns="columns" :data="data" sortable="custom" @on-sort-change="changeSort" @on-selection-change="showSelect" ref="table"></Table>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :current="searchForm.offset" :total="total" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change="changelimit" :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
        </Row>
      </Card>
      </Col>
    </Row>
    <Modal :title="modalTitle" v-model="noticeModalVisible" :mask-closable='false' :width="1000" @on-cancel="cancelNotice" :styles="{top: '30px'}">
      <Form ref="noticeForm" :model="noticeForm" :label-width="70" :rules="noticeFormValidate">
        <FormItem label="公告标题" prop="title">
          <Input v-model="noticeForm.title" autocomplete="off" />
        </FormItem>
        <FormItem label="公告内容" prop="content">
          <tinymce :height="300" v-model="noticeForm.content" :id="tinymceId" />
        </FormItem>
        <FormItem label="公告概要" prop="remark">
          <Input v-model="noticeForm.remark" type="textarea" :autosize="{minRows: 3,maxRows: 6}" placeholder="请填写公告概要" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelNotice">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submitNotice">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getNoticeList, addNotice, editNotice } from '@/api/notice'
import circleLoading from '../../my-components/circle-loading.vue'
import Tinymce from '@/components/Tinymce'

export default {
  name: 'notice-manage',
  components: {
    circleLoading,
    Tinymce
  },
  data() {
    return {
      loading: true,
      operationLoading: false,
      drop: false,
      selectCount: 0,
      selectList: [],
      searchKey: '',
      searchForm: {
        offset: 1,
        limit: 10,
        createDate: '',
        title: ''
      },
      selectDate: null,
      modalType: 0,
      noticeModalVisible: false,
      modalTitle: '',
      noticeForm: {
        title: '',
        content: '',
        remark: '',
        id: ''
      },
      tinymceId:
        'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + ''),
      noticeFormValidate: {
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        content: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
        remark: [{ required: true, message: '概要不能为空', trigger: 'blur' }]
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
          type: 'index',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '公告标题',
          key: 'title',
          width: 145,
          fixed: 'left'
        },
        {
          title: '内容',
          key: 'content',
          align: 'center'
        },
        {
          title: '创建时间',
          key: 'dateCreated',
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
                      this.look(params.row)
                    }
                  }
                },
                '预览'
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
              )
              // h(
              //   'Button',
              //   {
              //     props: {
              //       type: 'error',
              //       size: 'small'
              //     },
              //     on: {
              //       click: () => {
              //         this.remove(params.row)
              //       }
              //     }
              //   },
              //   '删除'
              // )
            ])
          }
        }
      ],
      data: [],
      exportData: [],
      total: 0
    }
  },
  methods: {
    init() {
      this.getNoticeList()
    },
    changePage(v) {
      this.searchForm.offset = v
      this.getNoticeList()
      this.clearSelectAll()
    },
    changelimit(v) {
      this.searchForm.limit = v
      this.getNoticeList()
    },
    selectDateRange(v) {
      if (v) {
        this.searchForm.createDate = v
      }
    },
    getNoticeList() {
      this.loading = true
      getNoticeList({
        offset: this.searchForm.offset - 1,
        limit: this.searchForm.limit
      }).then(res => {
        this.loading = false
        if (res.returnCode === '0000') {
          this.data = res.data
          if (!res.next) {
            this.total = res.data.length
          } else {
            this.total = res.data.length + 1
          }
        }
      })
    },
    handleSearch() {
      this.searchForm.offset = 1
      this.searchForm.limit = 10
      this.getNoticeList()
    },
    handleReset() {
      this.$refs.searchForm.resetFields()
      this.searchForm.offset = 1
      this.searchForm.limit = 10
      this.selectDate = null
      // 重新加载数据
      this.getNoticeList()
    },
    changeSort(e) {
      // this.searchForm.sort = e.key
      // this.searchForm.order = e.order
      // if (e.order === 'normal') {
      //   this.searchForm.order = ''
      // }
      this.getNoticeList()
    },
    handleDropdown(name) {
      if (name === 'refresh') {
        this.getNoticeList()
      }
    },
    cancelNotice() {
      this.noticeModalVisible = false
      window.tinymce.get(this.tinymceId).setContent('')

      this.noticeForm.content = `<h1 style="text-align: center;">欢迎使用 TinyMCE 富文本编辑器!</h1>`
    },
    submitNotice() {
      this.$refs.noticeForm.validate(valid => {
        if (valid) {
          if (this.modalType === 0) {
            delete this.noticeForm.id
            this.submitLoading = true
            addNotice(this.noticeForm).then(res => {
              this.submitLoading = false
              if (res.returnCode === '0000') {
                this.$Message.success('操作成功')
                this.getNoticeList()
                this.noticeModalVisible = false
              }
            })
          } else {
            // 编辑
            this.submitLoading = true
            editNotice(this.noticeForm).then(res => {
              this.submitLoading = false
              if (res.returnCode === '0000') {
                this.$Message.success('操作成功')
                this.getNoticeList()
                this.noticeModalVisible = false
              }
            })
          }
        }
      })
    },
    add() {
      this.modalType = 0
      this.modalTitle = '添加公告'
      this.$refs.noticeForm.resetFields()
      window.tinymce.get(this.tinymceId).setContent('')
      this.noticeModalVisible = true
    },
    edit(v) {
      this.modalType = 1
      this.modalTitle = '编辑公告'
      this.$refs.noticeForm.resetFields()
      // 转换null为""
      for (let attr in v) {
        if (v[attr] === null) {
          v[attr] = ''
        }
      }
      let str = JSON.stringify(v)
      let notice = JSON.parse(str)
      window.tinymce.get(this.tinymceId).setContent(notice.content)
      this.noticeForm = notice
      this.noticeModalVisible = true
    },
    remove(v) {
      this.$Modal.confirm({
        title: '确认删除',
        content: '您确认要删除公告 ' + v.title + ' ?',
        onOk: () => {
          this.operationLoading = true
          deleteUser(v.id).then(res => {
            this.operationLoading = false
            if (res.success === true) {
              this.$Message.success('删除成功')
              this.getNoticeList()
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
              this.getNoticeList()
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