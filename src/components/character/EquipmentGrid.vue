<template>
  <div v-if="items && items.length > 0">
    <div class="text-subtitle2 text-weight-bold q-mb-xs">{{ title }}</div>
    <div class="row q-gutter-sm items-start">
      <div
        v-for="item in items"
        :key="item.itemId"
        class="text-center item-wrapper"
        style="width: 70px"
      >
        <CachedImage
          :src="item.itemImageURL"
          :alt="item.itemName"
          :tooltip-text="item.itemName"
          :tooltip-subtext="item.slotName"
          size="48px"
          :rarity="item.itemRarity"
          :reinforce="item.reinforce"
          :refine="item.refine"
        />
        <div
          class="item-name text-caption q-mt-xs"
          :style="getRarityTextStyle(item.itemRarity)"
        >
          {{ item.itemName }}
        </div>

        <div v-if="item.enchant && item.enchant.status" class="enchant-details text-grey-7">
          <div v-for="(status, index) in item.enchant.status" :key="index">
            {{ status.name }} +{{ status.value }}
          </div>
        </div>

        <div v-if="item.fusionOption" class="fusion-details text-light-blue-4 q-mt-xs">
          <div v-for="(option, index) in item.fusionOption.options" :key="index">
            {{ option.explain.split('\\n')[0] }}
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

const getRarityTextStyle = (rarity) => {
  switch (rarity) {
    case '태초':
      return {
        backgroundImage: 'linear-gradient(180deg, #57e95b, #3a8390)',
        backgroundClip: 'text',
        color: 'transparent',
        fontWeight: 'bold',
        '-webkit-background-clip': 'text', // 웹킷 브라우저 호환성
      };
    case '신화':
      return { color: '#d091e6' };
    case '에픽':
      return { color: '#efb100', fontWeight: 'bold' };
    case '유니크':
      return { color: '#db00db' };
    case '레전더리':
      return { color: '#ef7000' };
    case '레어':
      return { color: '#9351ed' };
    case '언커먼':
      return { color: '#ffffff' };
    case '커먼':
    default:
      return { color: '#cccccc' };
  }
};
</script>

<style lang="scss" scoped>
.item-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 110px;
}

.item-name {
  word-break: keep-all;
  min-height: 2.1rem;
  line-height: 1.1;
}

.enchant-details, .fusion-details {
  font-size: 0.7rem;
  line-height: 1.2;
  word-break: keep-all;
}
</style>
