<style scoped>
.expand-row {
  margin-bottom: 16px;
}
</style>
<template>
    <div>
        <Row class="expand-row">

            <i-col span="6">
                <span>订单编号(外): </span>
                <span>{{ row.orderNo }}</span>
            </i-col>
            <i-col span="6">
                <span>收货人姓名(外): </span>
                <span>{{ row.person }}</span>
            </i-col>
            <i-col span="6">
                <span>收货人电话(外): </span>
                <span>{{ row.mobile }}</span>
            </i-col>
            <i-col span="6">
                <span>收货地址(外): </span>
                <span>
                    {{ row.address}}
                </span>
            </i-col>
        </Row>
        <Row>
            <i-col span="24">
                <span>订单描述: </span>
                <span>{{ row.note }}</span>
            </i-col>
        </Row>
    </div>
</template>
<script>
export default {
  name: 'expandRow',
  props: {
    row: Object
  }
}
</script>