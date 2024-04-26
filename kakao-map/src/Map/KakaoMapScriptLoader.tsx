import { ReactNode, useEffect, useState } from "react";

const KAKAO_MAP_SCRIPT_ID = "kakao-map-script";
const KAKAO_MAP_APP_KEY = process.env.KAKAO_MAP_KEY;

// 이런식으로 타입을 따로 명시해주는 방법도 있지만 라이브러리를 이용할 예정
// declare interface Type {
//   window: {
//     kakao: any
//   }
// }

interface KakaoMapScriptLoaderProps {
  children: ReactNode;
}

const KakaoMapScriptLoader = (props: KakaoMapScriptLoaderProps) => {
  const [mapScriptLoaded, setMapScriptLoaded] = useState(false);

  useEffect(() => {
    const mapScript = document.getElementById(KAKAO_MAP_SCRIPT_ID);

    if (mapScript && !window.kakao) {
      return;
    }

    const $script = document.createElement("script");
    $script.id = KAKAO_MAP_SCRIPT_ID;
    $script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_APP_KEY}&libraries=services&autoload=false`;
    // libraries=services : 장소관련api서비스를 이용하기 위한 코드
    // autoload=false : 자동으로 지도를 로드하는 걸 막는 코드 (원하는 시점에 로드하기 위해)
    $script.onload = () => {
      window.kakao.maps.load(() => {
        setMapScriptLoaded(true);
      });
    };
    $script.onerror = () => {
      setMapScriptLoaded(false);
    };

    document.getElementById("root")?.appendChild($script);
  }, []);

  return <>{mapScriptLoaded ? props.children : <div>지도를 가져오는 중입니다.</div>}</>;
};

export default KakaoMapScriptLoader;
