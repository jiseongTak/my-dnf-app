<template>
  <q-page class="q-pa-md">
    <div v-if="isLoading" class="q-mt-md">
      <div class="text-center text-h6 q-mb-md">힐더 서버 캐릭터 정보 로딩 중...</div>
      <div class="row q-gutter-md justify-center">
        <div v-for="n in myCharacterList.length" :key="n" style="width: 380px">
          <q-card flat bordered>
            <q-item>
              <q-item-section avatar>
                <q-skeleton type="QAvatar" size="60px" />
              </q-item-section>

              <q-item-section>
                <q-item-label>
                  <q-skeleton type="text" width="40%" />
                </q-item-label>
                <q-item-label caption>
                  <q-skeleton type="text" width="65%" />
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-skeleton height="60px" square />
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
          <q-card-section class="row items-center no-wrap">
            <q-avatar size="60px">
              <img :src="char.characterImageURL" />
            </q-avatar>
            <div class="q-ml-sm">
              <div class="text-weight-bold">{{ char.characterName }}</div>
              <div class="text-caption">
                {{ char.level }}Lv. | {{ char.jobGrowName }}
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section class="row q-gutter-xs justify-center">
            <q-avatar
              v-for="equip in char.equipment"
              :key="equip.slotId"
              size="40px"
              square
            >
              <img :src="equip.itemImageURL" />
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

// 서버를 'hilder'로 고정합니다.
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
  max-width: 380px;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
}
</style>
