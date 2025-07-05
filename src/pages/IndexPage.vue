<template>
  <q-page class="q-pa-md">
    <div v-if="isLoading" class="q-mt-md">
      <div class="text-center text-h6 q-mb-md">힐더 서버 캐릭터 정보 로딩 중...</div>
      <div class="row q-gutter-md justify-center">
        <div v-for="n in myCharacterList.length" :key="n" style="width: 380px">
          <q-card flat bordered>
            <q-card-section class="column items-center q-pa-md">
              <q-skeleton type="QAvatar" size="200px" square class="q-mb-md" />
              <div class="text-center">
                <q-skeleton type="text" width="80px" class="q-mb-sm" />
                <q-skeleton type="text" width="120px" />
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section class="row q-gutter-xs justify-center q-pa-sm">
              <q-skeleton v-for="i in 12" :key="i" type="QAvatar" size="40px" square />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <div v-else-if="dnfStore.customCharacters.length > 0" class="q-mt-md">
      <div class="text-center text-h6 q-mb-md">힐더 서버 캐릭터 장비 현황</div>
      <div class="row q-gutter-md justify-center">
        <q-card
          v-for="char in dnfStore.customCharacters"
          :key="char.characterId"
          class="character-card"
        >
          <q-card-section class="column items-center q-pa-md">
            <q-avatar size="200px" square class="q-mb-md">
              <img :src="char.characterImageURL" :alt="char.characterName" style="image-rendering: pixelated;"/>
            </q-avatar>
            <div class="text-center">
              <div class="text-weight-bold">{{ char.characterName }}</div>
              <div class="text-caption">
                {{ char.level }}Lv. | {{ char.jobGrowName }}
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section class="row q-gutter-xs justify-center q-pa-sm">
            <q-avatar
              v-for="equip in char.equipment"
              :key="equip.slotId"
              size="40px"
              square
            >
              <img :src="equip.itemImageURL" :alt="equip.itemName" />
              <q-tooltip> {{ equip.itemName }} ({{ equip.slotName }}) </q-tooltip>
            </q-avatar>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div v-else class="text-center text-grey q-mt-xl">
      힐더 서버에서 캐릭터 정보를 찾을 수 없습니다. API 키나 캐릭터 이름을 확인해주세요.
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDnfStore } from 'stores/dnf-store'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const dnfStore = useDnfStore()

const server = 'hilder'
const myCharacterList = ref([
  '엡손',
  '비그요',
  '그저어마신',
  '털잡이X',
  '비가그쳐요',
  '활잡이X',
])

const isLoading = computed(() => $q.loading.isActive)

// onMounted: 컴포넌트(페이지)가 로드될 때 자동으로 실행됩니다.
onMounted(() => {
  dnfStore.fetchCustomCharacters(server, myCharacterList.value)
})
</script>

<style lang="scss" scoped>
.character-card {
  width: 100%;
  max-width: 420px;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
}
</style>
