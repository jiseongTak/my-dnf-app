<template>
  <q-page class="q-pa-md column items-center">
    <div class="q-gutter-md row items-start" style="width: 500px">
      <q-select
        v-model="server"
        :options="serverOptions"
        label="서버"
        style="width: 150px"
      />
      <q-input
        v-model="characterName"
        label="캐릭터명"
        @keyup.enter="searchCharacter"
      />
      <q-btn label="검색" color="primary" @click="searchCharacter" />
    </div>

    <q-card v-if="dnfStore.character" class="q-mt-xl" style="width: 500px">
      <q-card-section class="row items-center">
        <q-avatar size="72px">
          <img :src="dnfStore.character.characterImageURL" />
        </q-avatar>
        <div class="q-ml-md">
          <div class="text-h6">{{ dnfStore.character.characterName }}</div>
          <div class="text-subtitle2">
            {{ dnfStore.character.level }}Lv. | {{ dnfStore.character.jobGrowName }}
          </div>
          <div class="text-caption">{{ dnfStore.character.guildName }}</div>
        </div>
      </q-card-section>
    </q-card>

    <div v-else class="q-mt-xl text-grey">캐릭터를 검색해보세요.</div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useDnfStore } from 'stores/dnf-store' // 방금 만든 스토어 import

const server = ref('hilder') // 기본 서버 설정
const characterName = ref('')
const dnfStore = useDnfStore()

const serverOptions = [
  { label: '카인', value: 'cain' },
  { label: '디레지에', value: 'diregie' },
  { label: '시로코', value: 'siroco' },
  { label: '힐더', value: 'hilder' },
  // ... 나머지 서버 추가
]

function searchCharacter() {
  dnfStore.fetchCharacter(server.value, characterName.value)
}
</script>
