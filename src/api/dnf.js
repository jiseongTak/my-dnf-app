/**
 * 던전앤파이터 API 호출을 관리하는 순수 서비스
 */
import { api } from 'boot/axios'

const createItemImageUrl = (itemId) => `https://img-api.neople.co.kr/df/items/${itemId}`

/**
 * 캐릭터 기본 정보를 조회합니다.
 */
export async function searchCharacter(serverId, characterName) {
  const response = await api.get(`/df/servers/${serverId}/characters`, {
    params: { characterName, wordType: 'match' },
  })
  return response.data.rows[0] || null
}

/**
 * 캐릭터의 상세 정보(장비, 아바타 등)를 API를 통해 조회합니다.
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
    equipRes, avatarRes, creatureRes,
    buffEquipmentRes, buffAvatarRes, buffCreatureRes
  ] = await Promise.all(Object.values(endpoints).map((url) => api.get(url).catch(() => null)))

  // ... (기존 데이터 가공 로직과 동일) ...
  const getData = (response, path) => response?.data ? path.split('.').reduce((p, c) => p?.[c], response.data) : null;
  const equipment = (getData(equipRes, 'equipment') || []).map((e) => ({ ...e, itemImageURL: createItemImageUrl(e.itemId) }));
  const avatar = (getData(avatarRes, 'avatar') || []).map((a) => ({ ...a, itemImageURL: createItemImageUrl(a.itemId) }));
  const creatureData = getData(creatureRes, 'creature');
  const creature = creatureData ? { ...creatureData, itemImageURL: createItemImageUrl(creatureData.itemId), artifact: (creatureData.artifact || []).map((art) => ({ ...art, itemImageURL: createItemImageUrl(art.itemId) })) } : null;
  const buffSkillData = getData(buffEquipmentRes, 'skill.buff');
  const buffAvatarData = getData(buffAvatarRes, 'skill.buff.avatar');
  const buffCreatureArray = getData(buffCreatureRes, 'skill.buff.creature');
  const buffSkill = buffSkillData ? { skillInfo: buffSkillData.skillInfo, equipment: (buffSkillData.equipment || []).map((e) => ({ ...e, itemImageURL: createItemImageUrl(e.itemId) })), avatar: (buffAvatarData || []).map((a) => ({ ...a, itemImageURL: createItemImageUrl(a.itemId) })), creature: buffCreatureArray?.[0] ? { ...buffCreatureArray[0], itemImageURL: createItemImageUrl(buffCreatureArray[0].itemId) } : null } : null;

  return { equipment, avatar, creature, buffSkill };
}
