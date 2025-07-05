import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Loading, Notify } from 'quasar'
import { searchCharacter, fetchCharacterDetails } from 'src/api/dnf'

export const useDnfStore = defineStore('dnf', () => {
  const characters = ref([])

  async function fetchCustomCharacters(serverId, characterNames) {
    if (!characterNames || characterNames.length === 0) {
      Notify.create({ type: 'warning', message: '조회할 캐릭터가 없습니다.' })
      return
    }

    Loading.show({ message: '캐릭터 정보를 조회하는 중...' })
    characters.value = []

    try {
      // 1. 기본 캐릭터 정보 병렬 조회
      const searchPromises = characterNames.map((name) => searchCharacter(serverId, name))
      const basicInfos = (await Promise.all(searchPromises)).filter((char) => char)

      if (basicInfos.length === 0) {
        throw new Error('유효한 캐릭터를 찾을 수 없습니다.')
      }

      // 2. 각 캐릭터의 상세 정보(장비, 아바타 등) 병렬 조회
      const detailPromises = basicInfos.map((char) =>
        fetchCharacterDetails(serverId, char.characterId)
      )
      const detailInfos = await Promise.all(detailPromises)

      // 3. 기본 정보와 상세 정보 합치기
      characters.value = basicInfos.map((basicInfo, index) => ({
        ...basicInfo,
        ...detailInfos[index],
      }))

      Notify.create({
        type: 'positive',
        message: `${characters.value.length}명의 캐릭터 정보를 성공적으로 불러왔습니다.`,
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
    characters,
    fetchCustomCharacters,
  }
})
