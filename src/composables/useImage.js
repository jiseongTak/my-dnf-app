import { ref, watch } from 'vue';
import { getCachedImage, cacheImage } from 'src/utils/db';

export function useImage(imageUrlRef) {
  const localSrc = ref('');
  const isLoading = ref(false);

  async function loadImage(url) {
    if (!url) {
      localSrc.value = '';
      return;
    }

    isLoading.value = true;

    try {
      const cachedBlob = await getCachedImage(url);
      if (cachedBlob) {
        localSrc.value = URL.createObjectURL(cachedBlob);
        return;
      }

      // 원본 URL을 프록시 URL로 변경
      const proxiedUrl = url.replace('https://img-api.neople.co.kr', '/img-api');

      // 변경된 프록시 URL로 fetch 요청
      const response = await fetch(proxiedUrl);
      if (!response.ok) throw new Error('이미지를 다운로드할 수 없습니다.');

      const blob = await response.blob();
      await cacheImage(url, blob); // 캐시할 때는 원본 URL을 key로 사용
      localSrc.value = URL.createObjectURL(blob);

    } catch (error) {
      console.error(`이미지 로드 실패: ${url}`, error);
      localSrc.value = '';
    } finally {
      isLoading.value = false;
    }
  }

  watch(imageUrlRef, (newUrl) => {
    loadImage(newUrl);
  }, { immediate: true });

  return { localSrc, isLoading };
}
