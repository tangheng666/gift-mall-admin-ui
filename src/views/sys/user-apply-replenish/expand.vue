<style scoped>
.expand-row {
  margin-bottom: 16px;
}
</style>
<template>
    <div>
        <Row class="expand-row">

            <i-col span="6">
                <span>申请补发用户QQ: </span>
                <span>{{ row.qq }}</span>
            </i-col>
            <i-col span="6">
                <span>申请补发用户微信: </span>
                <span>{{ row.wechat }}</span>
            </i-col>
            <i-col span="6">
                <span>申请补发用户电话: </span>
                <span>{{ row.mobile }}</span>
            </i-col>
            <i-col span="6">
                <span>申请补发用户头像: </span>
                <span>
                    <Avatar :src="row.avatar" /></span>
            </i-col>
        </Row>
        <Row>
            <i-col span="24">
                <span>审核原因: </span>
                <span>{{ row.reason }}</span>
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