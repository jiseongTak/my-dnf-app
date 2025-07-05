<template>
  <q-avatar :size="size" square>
    <q-skeleton v-if="isLoading" type="QAvatar" />
    <img v-else :src="localSrc" :alt="alt" />
    <q-tooltip>
      <div class="text-center">
        <div>{{ tooltipText }}</div>
        <div v-if="tooltipSubtext" class="text-caption text-grey-5">({{ tooltipSubtext }})</div>
      </div>
    </q-tooltip>
  </q-avatar>
</template>

<script setup>
import { toRefs } from 'vue';
import { useImage } from 'src/composables/useImage';

const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: 'item' },
  size: { type: String, default: '38px' },
  tooltipText: { type: String, default: '' },
  tooltipSubtext: { type: String, default: '' },
});

const { src } = toRefs(props);
const { localSrc, isLoading } = useImage(src);
</script>
