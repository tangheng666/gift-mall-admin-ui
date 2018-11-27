<style lang="less">
@import 'expressFee.less';

.ivu-poptip {
  display: inline-block;
  width: auto;
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
            <Form ref="expressFeeForm" :model="expressFeeForm" :label-width="200" class="search-form" inline label-position="right">
              <Form-item label="第一阶段最大重量(KG)" prop="search">
                <Input type="text" v-model="expressFeeForm.firstWeight" clearable style="width: 200px" />
              </Form-item>
              <Form-item label="第二阶段最大重量(KG)" prop="search">
                <Input type="text" v-model="expressFeeForm.middleWeight" clearable style="width: 200px" />
              </Form-item>
              <Form-item label="第一阶段普通收费金额(元)" prop="search">
                <Input type="text" v-model="expressFeeForm.firstPrice" clearable style="width: 200px" />
              </Form-item>
              <Form-item label="第一阶段偏远收费金额(元)" prop="search">
                <Input type="text" v-model="expressFeeForm.farFirstPrice" clearable style="width: 200px" />
              </Form-item>

              <Form-item label="第二阶段普通收费金额(元)" prop="search">
                <Input type="text" v-model="expressFeeForm.middlePrice" clearable style="width: 200px" />
              </Form-item>
              <Form-item label="第二阶段偏远收费金额(元)" prop="search">
                <Input type="text" v-model="expressFeeForm.farMidllePrice" clearable style="width: 200px" />
              </Form-item>

              <Form-item label="第三阶段普通收费金额（元）" prop="search">
                <Input type="text" v-model="expressFeeForm.endPrice" clearable style="width: 200px" />
              </Form-item>

              <Form-item label="第三阶段偏远收费金额（元）" prop="search">
                <Input type="text" v-model="expressFeeForm.farEndPrice" clearable style="width: 200px" />
              </Form-item>

              <Form-item label="物流费用备注" prop="search">
                <Input v-model="expressFeeForm.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" clearable style="width: 300px" />
              </Form-item>
              <Form-item label="偏远地区说明(空格隔开)" prop="search">
                <Input v-model="expressFeeForm.note" type="textarea" :autosize="{minRows: 2,maxRows: 5}" clearable style="width: 300px" />
              </Form-item>
              <Form-item class="br">
                <Button @click="updateExpressFee" type="primary">保存</Button>
                <Button>返回</Button>
              </Form-item>
            </Form>
          </Row>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import { getExpressFee, updateFee } from '@/api/expressFee'
import circleLoading from '../../my-components/circle-loading.vue'

export default {
  name: 'express-fee',
  components: {
    circleLoading
  },
  data() {
    return {
      expressFeeForm: {
        id: 0,
        firstPrice: 0.0,
        firstWeight: 0.0,
        middlePrice: 0.0,
        middleWeight: 0.0,
        endPrice: 0.0,
        farFirstPrice: 0.0,
        farMidllePrice: 0.0,
        farEndPrice: 0.0,
        description: '',
        note: ''
      },
      startTimeNoF: null,
      endTimeNoF: null
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    $route(to, from) {
      if (to.path === '/sys/express-fee') {
        this.init()
      }
    }
  },
  methods: {
    init() {
      this.getExpressFee()
    },

    getExpressFee() {
      getExpressFee().then(res => {
        if (res.returnCode === '0000') {
          this.expressFeeForm = res.data
        }
      })
    },
    updateExpressFee() {
      this.$Modal.confirm({
        title: '修改物流价格',
        content: '您确认要修改物流价格吗?',
        onOk: () => {
          updateFee(this.expressFeeForm).then(res => {
            if (res.success === true) {
              this.$Message.success('修改成功')
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