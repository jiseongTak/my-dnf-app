<template>
  <div v-if="items && items.length > 0">
    <div class="text-subtitle2 text-weight-bold q-mb-xs">{{ title }}</div>
    <div class="row q-gutter-xs items-center">
      <q-avatar v-for="item in items" :key="item.itemId" size="38px" square>
        <img :src="item.itemImageURL" :alt="item.itemName" />
        <q-tooltip>
          <div class="text-center">
            <div>{{ item.itemName }}</div>
            <div v-if="item.slotName" class="text-caption text-grey-5">({{ item.slotName }})</div>
          </div>
        </q-tooltip>
      </q-avatar>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [], // 아이템 목록이 없는 경우를 대비해 기본값 설정
  },
  title: {
    type: String,
    required: true,
  },
})
</script>
