<template>
  <q-card class="character-card" flat bordered>
    <q-card-section class="q-pa-md">
      <div class="row items-center q-mb-md">
        <CachedImage
          :src="character.characterImageURL"
          :alt="character.characterName"
          size="150px"
          class="q-mr-md"
          :tooltip-text="character.characterName"
        />
        <div class="text-center">
          <div class="text-h6">{{ character.characterName }}</div>
          <div class="text-subtitle2">{{ character.level }}Lv. | {{ character.jobGrowName }}</div>
          <div class="text-weight-medium">명성 {{ character.fame?.toLocaleString() }}</div>
        </div>
      </div>

      <q-separator class="q-my-md" />
      <EquipmentGrid :items="character.equipment" title="장착 장비" />
      <q-separator class="q-my-md" />
      <EquipmentGrid :items="character.avatar" title="아바타" />
      <q-separator class="q-my-md" />
      <div v-if="character.creature">
        <EquipmentGrid :items="[character.creature]" title="크리처" />
        <EquipmentGrid :items="character.creature.artifact" title="아티팩트" class="q-mt-sm" />
      </div>
      <div v-else class="text-grey">장착한 크리처가 없습니다.</div>
      <q-separator class="q-my-md" />
      <div v-if="character.buffSkill?.skillInfo">
        <div class="text-subtitle1 q-mb-sm text-weight-bold">{{ character.buffSkill.skillInfo.name }} 강화</div>
        <EquipmentGrid :items="character.buffSkill.equipment" title="버프 스킬 강화 장착 장비" />
        <EquipmentGrid :items="character.buffSkill.avatar" title="버프 스킬 강화 장착 아바타" class="q-mt-sm" />
        <EquipmentGrid v-if="character.buffSkill.creature" :items="[character.buffSkill.creature]"
                       title="버프 스킬 강화 장착 크리처" class="q-mt-sm" />
      </div>
      <div v-else class="text-grey">버프 강화 정보가 없습니다.</div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import EquipmentGrid from './EquipmentGrid.vue';
// CachedImage 컴포넌트 import
import CachedImage from './CachedImage.vue';

defineProps({
  character: {
    type: Object,
    required: true,
  },
});
</script>
