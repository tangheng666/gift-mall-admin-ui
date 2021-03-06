<style lang="less">
@import 'salveOrderManage.less';

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
            <Form ref="searchForm" :model="searchForm" inline :label-width="75" class="search-form">
              <Form-item label="主订单编号" prop="oid">
                <Input type="text" v-model="searchForm.oid" clearable placeholder="请输入主订单编号" style="width: 200px" />
              </Form-item>
              <Form-item label="查询条件" prop="search">
                <Input type="text" v-model="searchForm.search" clearable placeholder="请输入查询条件" style="width: 200px" />
              </Form-item>

              <Form-item label="订单状态" prop="state">
                <Select v-model="searchForm.state" placeholder="请选择订单状态" clearable style="width: 200px">
                  <Option v-for="stateItem in stateAll" :value="stateItem.key" :key="stateItem.key">{{ stateItem.value }}</Option>
                </Select>
              </Form-item>
              <Form-item label="开始时间">
                <DatePicker v-model="startTimeNoF" type="datetime" format="yyyy-MM-dd mm:hh:ss" clearable placeholder="选择开始时间" style="width: 200px" @on-change='startTimeChange'></DatePicker>
              </Form-item>
              <Form-item label="结束时间">
                <DatePicker v-model="endTimeNoF" type="datetime" format="yyyy-MM-dd mm:hh:ss" clearable placeholder="选择结束时间" style="width: 200px" @on-change='endTimeChange'></DatePicker>
              </Form-item>
              <Form-item style="margin-left:-35px;" class="br">
                <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                <Button @click="handleReset">重置</Button>
              </Form-item>
            </Form>
          </Row>
          <Row class="operation">
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
            <Page :total="total" :current="searchForm.current" :page-size="searchForm.limit" @on-change="changePage" @on-page-size-change="changelimit" :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
          </Row>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import { getSalveOrderList, orderRefund } from '@/api/salveOrder'
import expandRow from './expand.vue'
import circleLoading from '../../my-components/circle-loading.vue'

export default {
  name: 'salve-order-manage',
  components: {
    circleLoading,
    expandRow
  },
  data() {
    return {
      loading: true,
      operationLoading: false,
      drop: false,
      stateAll: [
        { key: 'CREATED', value: '已创建' },
        { key: 'PAYED', value: '待发货' },
        { key: 'EXPRESSED', value: '已发货' },
        { key: 'REFUND', value: '待退款' },
        { key: 'REFUNDED', value: '已退款' },
        { key: 'FINISHED', value: '已完成' },
        { key: 'CANCELED', value: '已取消' }
      ],
      selectCount: 0,
      selectList: [],
      searchForm: {
        current: 1,
        limit: 10,
        startTime: '',
        endTime: '',
        state: '',
        search: '',
        oid: ''
      },
      startTimeNoF: null,
      endTimeNoF: null,
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
          title: '子订单编号',
          key: 'id',
          width: 100
        },
        {
          title: '主订单编号',
          key: 'oid',
          width: 100
        },
        {
          title: '礼品数量',
          key: 'number',
          align: 'center',
          width: 100
        },
        {
          title: '总价(元)',
          key: 'totalPrice',
          width: 150
        },
        {
          title: '订单状态',
          key: 'state',
          width: 150,
          align: 'center',
          render: (h, params) => {
            const row = params.row
            const color =
              row.state === 'CREATED'
                ? '#a593ec'
                : row.state === 'PAYED'
                  ? '#20a0ea'
                  : row.state === 'EXPRESSED'
                    ? '#e195ea'
                    : row.state === 'REFUND'
                      ? '#541768'
                      : row.state === 'REFUNDED'
                        ? '#dd2230'
                        : row.state === 'CANCELED'
                          ? '#db5224'
                          : '#00ff80'
            const text =
              row.state === 'CREATED'
                ? '已创建'
                : row.state === 'PAYED'
                  ? '待发货'
                  : row.state === 'EXPRESSED'
                    ? '已发货'
                    : row.state === 'REFUND'
                      ? '待退款'
                      : row.state === 'REFUNDED'
                        ? '已退款'
                        : row.state === 'CANCELED'
                          ? '已取消'
                          : '已完成'

            return h(
              'span',
              {
                attrs: {
                  style: 'font-size:14px;color:' + color
                }
              },
              text
            )
          }
        },
        {
          title: '创建时间',
          align: 'center',
          width: 150,
          key: 'dateCreated'
        },
        {
          title: '快递单号',
          key: 'expressNo',
          width: 200
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
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.refund(params.row.id)
                    }
                  }
                },
                '退款'
              )
            ])
          }
        }
      ],
      data: [],
      total: 0
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    $route(to, from) {
      if (to.path === '/sys/salve-order-manage') {
        this.init()
      }
      // 对路由变化作出响应...
    }
  },
  methods: {
    init() {
      this.getSalveOrderList()
    },
    startTimeChange(v) {
      this.searchForm.startTime = v
    },
    endTimeChange(v) {
      this.searchForm.endTime = v
    },
    changePage(v) {
      this.searchForm.current = v
      this.getSalveOrderList()
      this.clearSelectAll()
    },
    changelimit(v) {
      this.searchForm.limit = v
      this.getSalveOrderList()
    },
    // selectDateRange(v) {
    //   if (v) {
    //     this.searchForm.createDate = v
    //   }
    // },
    getSalveOrderList() {
      this.loading = true
      this.searchForm.oid = this.$route.params.oid
      getSalveOrderList(this.searchForm).then(res => {
        this.loading = false
        if (res.returnCode === '0000') {
          this.data = res.data
          this.total = res.total
        }
      })
    },
    handleSearch() {
      this.searchForm.current = 1
      this.searchForm.limit = 10
      this.getSalveOrderList()
    },
    handleReset() {
      this.$refs.searchForm.resetFields()
      this.searchForm.current = 1
      this.searchForm.limit = 10
      this.endTimeNoF = null
      this.startTimeNoF = null
      // 重新加载数据
      this.getSalveOrderList()
    },
    changeSort(e) {
      // this.searchForm.sort = e.key
      // this.searchForm.order = e.order
      // if (e.order === 'normal') {
      //   this.searchForm.order = ''
      // }
      this.getSalveOrderList()
    },
    handleDropdown(name) {
      if (name === 'refresh') {
        this.getSalveOrderList()
      }
    },
    showSelect(e) {
      this.exportData = e
      this.selectList = e
      this.selectCount = e.length
    },
    clearSelectAll() {
      this.$refs.table.selectAll(false)
    },
    refund(id) {
      this.$Modal.confirm({
        title: '订单退款',
        content: '您确认该单要退款吗?',
        onOk: () => {
          orderRefund(id).then(res => {
            if (res.success === true) {
              this.$Message.success('操作成功')
            } else {
              this.$Message.info(res.returnMessage)
            }
          })
        }
      })
    }
  }
}
</script>