import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { ref } from 'vue'
// useQuasar 대신 Loading, Notify를 직접 import 합니다.
import { Loading, Notify } from 'quasar'

export const useDnfStore = defineStore('dnf', () => {
  // const $q = useQuasar() // 이 줄을 삭제합니다.

  const character = ref(null)

  async function fetchCharacter(server, characterName) {
    if (!characterName) {
      // $q.notify 대신 Notify.create를 사용합니다.
      Notify.create({
        type: 'negative',
        message: '캐릭터명을 입력해주세요.',
      })
      return
    }

    // $q.loading 대신 Loading을 직접 사용합니다.
    Loading.show()
    character.value = null

    try {
      const searchRes = await api.get(`/df/servers/${server}/characters`, {
        params: { characterName },
      })

      if (!searchRes.data.rows || searchRes.data.rows.length === 0) {
        throw new Error('캐릭터를 찾을 수 없습니다.')
      }

      const characterId = searchRes.data.rows[0].characterId

      const infoRes = await api.get(
        `/df/servers/${server}/characters/${characterId}`
      )
      character.value = infoRes.data
    } catch (error) {
      console.error(error)
      Notify.create({
        type: 'negative',
        message: error.message || '캐릭터 정보 조회에 실패했습니다.',
      })
    } finally {
      Loading.hide()
    }
  }

  return {
    character,
    fetchCharacter,
  }
})
