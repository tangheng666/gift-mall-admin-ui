<style lang="less">
@import 'userApplyReplenish.less';

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
              <Form-item label="补发状态" prop="state">
                <Select v-model="searchForm.state" placeholder="请选择补发订单状态" clearable style="width: 200px">
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
import { getUserApplyReplacement } from '@/api/userApplyReplenish'
import expandRow from './expand.vue'
import circleLoading from '../../my-components/circle-loading.vue'

export default {
  name: 'user-apply-replenish',
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
        { key: 'REVIEW', value: '待审核' },
        { key: 'REJECT', value: '未通过审核' },
        { key: 'PASS', value: '通过审核' }
      ],
      selectCount: 0,
      selectList: [],
      searchForm: {
        current: 1,
        limit: 10,
        startTime: '',
        endTime: '',
        state: ''
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
          title: '补发编号',
          key: 'id',
          width: 100
        },
        {
          title: '子订单编号',
          key: 'sid',
          width: 100
        },
        {
          title: '原快递号',
          key: 'oldExpressNo',
          width: 180
        },
        {
          title: '新发出快递号',
          key: 'newExpressNo',
          align: 'center',
          width: 180
        },
        {
          title: '补发状态',
          key: 'state',
          width: 150,
          align: 'center',
          render: (h, params) => {
            const row = params.row
            const color =
              row.state === 'REVIEW'
                ? '#20a0ea'
                : row.state === 'REJECT'
                  ? '#19BE6B'
                  : '#ed2842'
            const text =
              row.state === 'REVIEW'
                ? '待审核'
                : row.state === 'REJECT'
                  ? '未通过审核'
                  : '通过审核'

            return h(
              'span',
              {
                attrs: {
                  style: 'color:' + color
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
          title: '操作',
          key: 'action',
          width: 240,
          align: 'center',
          fixed: 'right',
          render: (h, params) => {
            const row = params.row
            if ('REVIEW' === row.state) {
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
                        this.preview(params.row)
                      }
                    }
                  },
                  '审核'
                )
              ])
            }
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
      if (to.path === '/sys/user-apply-replenish') {
        this.init()
      }
    }
  },
  methods: {
    init() {
      this.getUserApplyRelanishList()
    },
    startTimeChange(v) {
      this.searchForm.startTime = v
    },
    endTimeChange(v) {
      this.searchForm.endTime = v
    },
    changePage(v) {
      this.searchForm.current = v
      this.getUserApplyRelanishList()
      this.clearSelectAll()
    },
    changelimit(v) {
      this.searchForm.limit = v
      this.getUserApplyRelanishList()
    },
    getUserApplyRelanishList() {
      this.loading = true 
      getUserApplyReplacement(this.searchForm).then(res => {
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
      this.getUserApplyRelanishList()
    },
    handleReset() {
      this.$refs.searchForm.resetFields()
      this.searchForm.current = 1
      this.searchForm.limit = 10
      this.endTimeNoF = null
      this.startTimeNoF = null
      // 重新加载数据
      this.getUserApplyRelanishList()
    },
    changeSort(e) {
      this.getUserApplyRelanishList()
    },
    handleDropdown(name) {
      if (name === 'refresh') {
        this.getUserApplyRelanishList()
      }
    },
    showSelect(e) {
      this.exportData = e
      this.selectList = e
      this.selectCount = e.length
    },
    clearSelectAll() {
      this.$refs.table.selectAll(false)
    }
  }
}
</script>