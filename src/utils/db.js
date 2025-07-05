/**
 * IndexedDB 헬퍼
 * 데이터베이스와 객체 저장소(테이블)를 관리합니다.
 */
const DB_NAME = 'my-dnf-app-db';
const DB_VERSION = 2;
const CHARACTER_STORE = 'characters';
const IMAGE_STORE = 'images';
// 캐시 유효기간 설정 (30분)
const CACHE_TTL = 1000 * 60 * 2;

let db;

/**
 * 데이터베이스를 열고 초기화합니다.
 */
function initDB() {
  // ... (이전과 동일한 코드) ...
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = (event) => {
      console.error('IndexedDB error:', event);
      reject('IndexedDB를 열 수 없습니다.');
    };
    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };
    request.onupgradeneeded = (event) => {
      const tempDb = event.target.result;
      if (!tempDb.objectStoreNames.contains(CHARACTER_STORE)) {
        tempDb.createObjectStore(CHARACTER_STORE, { keyPath: 'characterId' });
      }
      if (!tempDb.objectStoreNames.contains(IMAGE_STORE)) {
        tempDb.createObjectStore(IMAGE_STORE, { keyPath: 'url' });
      }
    };
  });
}

/**
 * 캐릭터 정보를 IndexedDB에서 가져옵니다. (유효기간 체크 추가)
 */
export async function getCharacter(characterId) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CHARACTER_STORE], 'readonly');
    const store = transaction.objectStore(CHARACTER_STORE);
    const request = store.get(characterId);

    request.onsuccess = () => {
      const result = request.result;
      if (result && (Date.now() - result.timestamp < CACHE_TTL)) {
        // 캐시가 유효하면 데이터 반환
        resolve(result);
      } else {
        // 캐시가 없거나 만료되었으면 null 반환
        if (result) {
          console.log(`[Cache Expired] ${result.characterName} 님의 캐시가 만료되었습니다.`);
        }
        resolve(null);
      }
    };
    request.onerror = (event) => reject('데이터를 가져오는 데 실패했습니다:', event);
  });
}

/**
 * 캐릭터 정보를 IndexedDB에 저장합니다. (타임스탬프 추가)
 */
export async function saveCharacter(characterData) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CHARACTER_STORE], 'readwrite');
    const store = transaction.objectStore(CHARACTER_STORE);
    // 저장하기 전에 현재 시간을 타임스탬프로 기록
    const dataToSave = { ...characterData, timestamp: Date.now() };
    const request = store.put(dataToSave);

    request.onsuccess = () => resolve();
    request.onerror = (event) => reject('데이터 저장에 실패했습니다:', event);
  });
}

// ... (getImage, cacheImage 함수는 그대로 유지) ...
export async function getCachedImage(url) {
  const db = await initDB();
  return new Promise((resolve) => {
    const transaction = db.transaction([IMAGE_STORE], 'readonly');
    const store = transaction.objectStore(IMAGE_STORE);
    const request = store.get(url);
    request.onsuccess = () => { resolve(request.result ? request.result.blob : null); };
    request.onerror = () => resolve(null);
  });
}
export async function cacheImage(url, blob) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([IMAGE_STORE], 'readwrite');
    const store = transaction.objectStore(IMAGE_STORE);
    const request = store.put({ url, blob });
    request.onsuccess = () => resolve();
    request.onerror = (event) => reject('이미지 저장에 실패했습니다:', event);
  });
}
