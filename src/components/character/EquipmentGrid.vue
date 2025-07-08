<template>
  <div v-if="items && items.length > 0">
    <div class="text-subtitle2 text-weight-bold q-mb-xs">{{ title }}</div>
    <div class="row q-gutter-sm items-start">
      <div
        v-for="item in items"
        :key="item.itemId"
        class="text-center"
        style="width: 70px"
      >
        <CachedImage
          :src="item.itemImageURL"
          :alt="item.itemName"
          :tooltip-text="item.itemName"
          :tooltip-subtext="item.slotName"
          size="48px"
        />
        <div
          v-if="item.enchant && item.enchant.status"
          class="enchant-details text-grey-7 q-mt-xs"
        >
          <div v-for="(status, index) in item.enchant.status" :key="index">
            {{ status.name }} +{{ status.value }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import CachedImage from './CachedImage.vue';

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.enchant-details {
  font-size: 0.7rem;    /* 폰트 크기 축소 */
  line-height: 1.2;     /* 줄 간격 조정 */
  word-break: keep-all; /* 단어 단위로 줄바꿈 */
  min-height: 2.1rem;   /* 높이를 확보하여 레이아웃 깨짐 방지 */
}
</style>
