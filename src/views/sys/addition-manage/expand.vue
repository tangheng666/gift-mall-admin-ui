<style scoped>
.expand-row {
  margin-bottom: 16px;
}
</style>
<template>
    <div>
        <Row class="expand-row">
            <i-col span="12">
                <span>处理原因: </span>
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