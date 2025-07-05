import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Loading, Notify } from 'quasar'
import { searchCharacter, fetchCharacterDetails } from 'src/api/dnf'
import { getCharacter, saveCharacter } from 'src/utils/db'

export const useDnfStore = defineStore('dnf', () => {
  const characters = ref([])

  async function fetchCustomCharacters(serverId, characterNames) {
    Loading.show({ message: '캐릭터 정보를 업데이트하는 중...' })

    try {
      const promises = characterNames.map(async (name) => {
        // 1. 캐릭터 이름으로 최신 기본 정보 조회 (레벨, 명성 등)
        const basicInfo = await searchCharacter(serverId, name)
        if (!basicInfo) return null

        // 2. IndexedDB에서 캐시된 상세 정보 확인
        let details = await getCharacter(basicInfo.characterId)

        // 3. 캐시가 없거나 만료되었으면 API로 상세 정보 새로 조회
        if (!details) {
          console.log(`[API] ${basicInfo.characterName} 님의 상세 정보를 서버에서 새로고침합니다.`);
          details = await fetchCharacterDetails(serverId, basicInfo.characterId)
        } else {
          console.log(`[Cache] ${basicInfo.characterName} 님의 상세 정보를 로컬 DB에서 불러왔습니다.`);
        }

        // 4. 최신 기본 정보와 (캐시되거나 새로 가져온) 상세 정보를 합침
        const fullCharacterData = {
          ...details, // 상세 정보가 먼저 오고
          ...basicInfo, // 최신 기본 정보로 덮어쓰기 (fame, level 등)
          characterImageURL: `https://img-api.neople.co.kr/df/servers/${serverId}/characters/${basicInfo.characterId}?zoom=1`,
        };

        // 5. 최종 데이터를 IndexedDB에 저장 (캐시 업데이트)
        await saveCharacter(fullCharacterData);

        return fullCharacterData;
      })

      const results = (await Promise.all(promises)).filter(c => c)
      characters.value = results

      Notify.create({
        type: 'positive',
        message: `${results.length}명의 캐릭터 정보를 성공적으로 업데이트했습니다.`,
      })

    } catch (error) {
      console.error(error)
      Notify.create({
        type: 'negative',
        message: error.message || '정보 업데이트 중 오류가 발생했습니다.',
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
