/**
 * 던전앤파이터 API 호출을 관리하는 서비스
 */
import { api } from 'boot/axios'

// 공통 이미지 URL 생성 함수
const createItemImageUrl = (itemId) => `https://img-api.neople.co.kr/df/items/${itemId}`
const createCharacterImageUrl = (serverId, characterId) =>
  `https://img-api.neople.co.kr/df/servers/${serverId}/characters/${characterId}?zoom=1`

/**
 * 캐릭터 기본 정보와 명성을 조회합니다.
 * @param {string} serverId - 서버 ID
 * @param {string} characterName - 캐릭터 이름
 */
export async function searchCharacter(serverId, characterName) {
  const response = await api.get(`/df/servers/${serverId}/characters`, {
    params: { characterName, wordType: 'match' },
  })
  const character = response.data.rows[0]
  if (character) {
    character.characterImageURL = createCharacterImageUrl(serverId, character.characterId)
  }
  return character
}

/**
 * 캐릭터의 모든 상세 정보를 병렬로 조회합니다.
 * @param {string} serverId - 서버 ID
 * @param {string} characterId - 캐릭터 ID
 */
export async function fetchCharacterDetails(serverId, characterId) {
  const endpoints = {
    equipment: `/df/servers/${serverId}/characters/${characterId}/equip/equipment`,
    avatar: `/df/servers/${serverId}/characters/${characterId}/equip/avatar`,
    creature: `/df/servers/${serverId}/characters/${characterId}/equip/creature`,
    buffEquipment: `/df/servers/${serverId}/characters/${characterId}/skill/buff/equip/equipment`,
    buffAvatar: `/df/servers/${serverId}/characters/${characterId}/skill/buff/equip/avatar`,
    buffCreature: `/df/servers/${serverId}/characters/${characterId}/skill/buff/equip/creature`,
  }

  const [
    equipRes,
    avatarRes,
    creatureRes,
    buffEquipmentRes,
    buffAvatarRes,
    buffCreatureRes,
  ] = await Promise.all(Object.values(endpoints).map((url) => api.get(url).catch(() => null)))

  // 안전하게 데이터를 가져오는 헬퍼 함수
  const getData = (response, path) => {
    if (!response || !response.data) return null
    return path.split('.').reduce((p, c) => (p && p[c]) ? p[c] : null, response.data)
  }

  // 장착 장비 정보 가공
  const equipment = (getData(equipRes, 'equipment') || []).map((e) => ({
    ...e,
    itemImageURL: createItemImageUrl(e.itemId),
  }))

  // 아바타 정보 가공
  const avatar = (getData(avatarRes, 'avatar') || []).map((a) => ({
    ...a,
    itemImageURL: createItemImageUrl(a.itemId),
  }))

  // 크리처 정보 가공
  const creatureData = getData(creatureRes, 'creature')
  const creature = creatureData
    ? {
      ...creatureData,
      itemImageURL: createItemImageUrl(creatureData.itemId),
      artifact: (creatureData.artifact || []).map((art) => ({
        ...art,
        itemImageURL: createItemImageUrl(art.itemId),
      })),
    }
    : null

  // 버프 스킬 강화 정보 가공
  const buffSkillData = getData(buffEquipmentRes, 'skill.buff')
  const buffAvatarData = getData(buffAvatarRes, 'skill.buff.avatar')
  const buffCreatureArray = getData(buffCreatureRes, 'skill.buff.creature')

  const buffSkill = buffSkillData
    ? {
      skillInfo: buffSkillData.skillInfo,
      equipment: (buffSkillData.equipment || []).map((e) => ({
        ...e,
        itemImageURL: createItemImageUrl(e.itemId),
      })),
      avatar: (buffAvatarData || []).map((a) => ({
        ...a,
        itemImageURL: createItemImageUrl(a.itemId),
      })),
      // 크리처는 배열로 오므로 첫 번째 아이템을 사용
      creature:
        buffCreatureArray && buffCreatureArray.length > 0
          ? {
            ...buffCreatureArray[0],
            itemImageURL: createItemImageUrl(buffCreatureArray[0].itemId),
          }
          : null,
    }
    : null

  return { equipment, avatar, creature, buffSkill }
}
