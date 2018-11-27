<style lang="less">
@import 'masterOrderManage.less';

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
            <!-- <Button @click="add" type="primary" icon="md-add">添加公告</Button> -->
            <!-- <Button @click="delAll" icon="md-trash">批量删除</Button> -->
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
import { getMasterOrderList } from '@/api/masterOrder'
import expandRow from './expand.vue'
import circleLoading from '../../my-components/circle-loading.vue'

export default {
  name: 'master-order-manage',
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
        { key: 'CREATED', value: '待付款' },
        { key: 'PAYED', value: '已支付未发货' },
        { key: 'CANCELED', value: '已取消' }
      ],
      selectCount: 0,
      selectList: [],
      searchKey: '',
      searchForm: {
        current: 1,
        limit: 10,
        startTime: '',
        endTime: '',
        state: '',
        usrid: ''
      },
      startTimeNoF: null,
      endTimeNoF: null,
      modalType: 0,
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
          title: '订单编号',
          key: 'id',
          width: 100
        },
        {
          title: '总包裹数',
          key: 'totalCount',
          align: 'center'
        },
        {
          title: '应付总价(元)',
          key: 'totalPrice',
          width: 150
        },
        {
          title: '订单状态',
          key: 'state',
          align: 'center',
          // width: 120,
          render: (h, params) => {
            const row = params.row
            const color =
              row.state === 'CREATED'
                ? '#a593ec'
                : row.state === 'PAYED'
                  ? '#00ff80'
                  : '#db5224'
            const text =
              row.state === 'CREATED'
                ? '待支付'
                : row.state === 'PAYED'
                  ? '已支付待发货'
                  : '已取消'

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
          title: '礼品单价(元)',
          align: 'center',
          key: 'price'
        },
        {
          title: '礼品单重(kg)',
          align: 'center',
          key: 'weight'
        },
        {
          title: '创建时间',
          align: 'center',
          width: 150,
          key: 'dateCreated'
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
                      this.goSalveOrder(params.row)
                    }
                  }
                },
                '转到子订单'
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
      if (to.path === '/sys/master-order-manage') {
        this.init()
      }
      // 对路由变化作出响应...
    }
  },
  methods: {
    init() {
      this.getMasterOrderList()
    },
    startTimeChange(v) {
      this.searchForm.startTime = v
    },
    endTimeChange(v) {
      this.searchForm.endTime = v
    },
    changePage(v) {
      this.searchForm.current = v
      this.getMasterOrderList()
      this.clearSelectAll()
    },
    changelimit(v) {
      this.searchForm.limit = v
      this.getMasterOrderList()
    },
    getMasterOrderList() {
      this.loading = true
      getMasterOrderList(this.searchForm).then(res => {
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
      this.getMasterOrderList()
    },
    handleReset() {
      this.$refs.searchForm.resetFields()
      this.searchForm.current = 1
      this.searchForm.limit = 10
      this.startTimeNoF = null
      this.endTimeNoF = null
      // 重新加载数据
      this.getMasterOrderList()
    },
    changeSort(e) {
      // this.searchForm.sort = e.key
      // this.searchForm.order = e.order
      // if (e.order === 'normal') {
      //   this.searchForm.order = ''
      // }
      this.getMasterOrderList()
    },
    handleDropdown(name) {
      if (name === 'refresh') {
        this.getMasterOrderList()
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
    goSalveOrder(item) {
      this.$router.push({
        name: 'salve-order-manage',
        params: { oid: item.id }
      })
    }
  }
}
</script>