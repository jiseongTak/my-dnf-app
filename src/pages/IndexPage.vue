<template>
  <q-page class="q-pa-md">
    <div v-if="isLoading" class="q-mt-md">
      <div class="text-center text-h6 q-mb-md">힐더 서버 캐릭터 정보 로딩 중...</div>
      <q-card v-for="n in myCharacterList.length" :key="n" class="q-mb-md">
        <q-card-section horizontal>
          <q-skeleton height="250px" width="35%" square />
          <q-card-actions vertical class="justify-around">
            <q-skeleton type="QBtn" width="100px" />
            <q-skeleton type="QBtn" width="100px" />
            <q-skeleton type="QBtn" width="100px" />
            <q-skeleton type="QBtn" width="100px" />
          </q-card-actions>
          <q-card-section class="q-gutter-y-md col">
            <q-skeleton height="30px" />
            <q-skeleton height="80px" />
            <q-skeleton height="40px" />
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>

    <div v-else-if="dnfStore.characters.length > 0" class="q-mt-md">
      <div class="text-center text-h5 q-mb-md">캐릭터 정보</div>
      <CharacterCard v-for="char in dnfStore.characters" :key="char.characterId" :character="char" />
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
import CharacterCard from 'components/character/CharacterCard.vue'

const $q = useQuasar()
const dnfStore = useDnfStore()

const server = 'hilder'
const myCharacterList = ref(['엡손', '비그요', '그저어마신', '털잡이X', '비가그쳐요', '활잡이X'])

const isLoading = computed(() => $q.loading.isActive)

onMounted(() => {
  dnfStore.fetchCustomCharacters(server, myCharacterList.value)
})
</script>
