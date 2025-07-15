<template>
  <div class="image-container" :style="{ width: size, height: size }">
    <q-avatar :size="size" square >
      <q-skeleton v-if="isLoading" type="QAvatar" />
      <img v-else :src="localSrc" :alt="alt" />
      <q-tooltip>
        <div class="text-center">
          <span :style="rarityTextStyle">{{ tooltipText }}</span>
          <div v-if="tooltipSubtext" class="text-caption text-grey-5">({{ tooltipSubtext }})</div>
        </div>
      </q-tooltip>
    </q-avatar>
    <div v-if="reinforceText" class="reinforce-badge">
      +{{ reinforceText }}
    </div>
  </div>
</template>

<script setup>
import { toRefs, computed } from 'vue';
import { useImage } from 'src/composables/useImage';

const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: 'item' },
  size: { type: String, default: '38px' },
  tooltipText: { type: String, default: '' },
  tooltipSubtext: { type: String, default: '' },
  rarity: { type: String, default: '커먼' },
  reinforce: { type: Number, default: 0 },
  refine: { type: Number, default: 0 },
});

const { src, rarity } = toRefs(props);
const { localSrc, isLoading } = useImage(src);

const rarityTextStyle = computed(() => {
  if (rarity.value === '태초') {
    return {
      backgroundImage: 'linear-gradient(180deg, #57e95b, #3a8390)',
      backgroundClip: 'text',
      color: 'transparent',
      fontWeight: 'bold',
      '-webkit-background-clip': 'text', // 웹킷 브라우저 호환성
    };
  }
  const color = getRarityColor(rarity.value);
  return { color };
});

const getRarityColor = (r) => {
  switch (r) {
    case '신화': return '#d091e6';
    case '에픽': return '#efb100';
    case '유니크': return '#db00db';
    case '레전더리': return '#ef7000';
    case '레어': return '#9351ed';
    case '언커먼': return '#ffffff';
    case '커먼':
    default: return '#cccccc';
  }
}

const reinforceText = computed(() => {
  if (props.refine > 0) return props.refine;
  if (props.reinforce > 0) return props.reinforce;
  return null;
});

</script>

<style lang="scss" scoped>
.image-container {
  position: relative;
  display: inline-block;
}

.reinforce-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0 4px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
  line-height: 1.2;
  border: 1px solid #fff;
}
</style>
