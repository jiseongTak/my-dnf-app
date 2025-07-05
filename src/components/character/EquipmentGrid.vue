<template>
  <div v-if="items && items.length > 0">
    <div class="text-subtitle2 text-weight-bold q-mb-xs">{{ title }}</div>
    <div class="row q-gutter-xs items-center">
      <CachedImage
        v-for="item in items"
        :key="item.itemId"
        :src="item.itemImageURL"
        :alt="item.itemName"
        :tooltip-text="item.itemName"
        :tooltip-subtext="item.slotName"
      />
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
