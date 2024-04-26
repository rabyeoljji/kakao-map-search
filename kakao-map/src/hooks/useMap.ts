import { createContext, useContext } from "react";

// context를 이용해 전역변수관리
export const KakaoMapContext = createContext<kakao.maps.Map | null>(null);

// map 객체를 가져올 수 있는 커스텀 훅
export const useMap = () => {
  const kakaoMap = useContext(KakaoMapContext);

  if (!kakaoMap) {
    throw new Error("kakaoMap not found");
  }

  return kakaoMap;
};
