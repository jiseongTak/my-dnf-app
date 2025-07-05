import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { ref } from 'vue'
import { Loading, Notify } from 'quasar'

export const useDnfStore = defineStore('dnf', () => {
  const customCharacters = ref([]) // 사용자 정의 캐릭터 목록을 저장할 상태

  // 새로운 액션: 지정된 캐릭터 목록의 정보를 가져옵니다.
  async function fetchCustomCharacters(server, characterNames) {
    if (!characterNames || characterNames.length === 0) {
      Notify.create({ type: 'warning', message: '조회할 캐릭터가 없습니다.' })
      return
    }

    Loading.show({ message: '캐릭터 정보를 조회하는 중...' })
    customCharacters.value = [] // 이전 데이터 초기화

    try {
      // 1. 각 캐릭터의 ID를 동시에 조회합니다.
      const idPromises = characterNames.map((name) =>
        api.get(`/df/servers/${server}/characters`, { params: { characterName: name, wordType: 'match' } })
      )
      const idResponses = await Promise.all(idPromises)

      // API 응답에서 캐릭터 ID만 추출 (찾지 못한 경우 필터링)
      const charactersWithId = idResponses
        .map((res) => res.data.rows[0])
        .filter((char) => char) // 캐릭터를 찾지 못한 경우(undefined) 목록에서 제외

      if (charactersWithId.length === 0) {
        throw new Error('유효한 캐릭터를 찾을 수 없습니다.')
      }

      // 2. 조회된 캐릭터들의 장비 정보를 동시에 가져옵니다.
      Loading.show({ message: '장비 정보를 불러오는 중...' })
      const equipmentPromises = charactersWithId.map((char) =>
        api.get(`/df/servers/${server}/characters/${char.characterId}/equip/equipment`)
      )
      const equipmentResponses = await Promise.all(equipmentPromises)

      // 3. 최종적으로 캐릭터 정보와 장비 정보를 합쳐서 상태에 저장합니다.
      customCharacters.value = charactersWithId.map((char, index) => ({
        ...char,
        equipment: equipmentResponses[index].data.equipment,
      }))

      Notify.create({
        type: 'positive',
        message: `${customCharacters.value.length}명의 캐릭터 정보를 성공적으로 불러왔습니다.`,
      })

    } catch (error) {
      console.error(error)
      Notify.create({
        type: 'negative',
        message: error.message || '정보 조회 중 오류가 발생했습니다.',
      })
    } finally {
      Loading.hide()
    }
  }

  return {
    customCharacters,
    fetchCustomCharacters,
  }
})
