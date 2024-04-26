import styled from "@emotion/styled";
import { ReactNode, useEffect, useRef, useState } from "react";
import { KakaoMapContext } from "../hooks/useMap";

interface DynamicMapProps {
  children: ReactNode;
}

const DynamicMap = (props: DynamicMapProps) => {
  const [map, setMap] = useState<kakao.maps.Map>();
  const kakaoMapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!kakaoMapRef.current) {
      return;
    }

    const targetPoint = new kakao.maps.LatLng(33.450701, 126.570667); // 카카오 제주도 본사
    const options = {
      center: targetPoint, // 지도의 처음 위치
      level: 3, // 지도를 얼마까지 확대할지
    };

    setMap(new window.kakao.maps.Map(kakaoMapRef.current, options));
  }, []);

  return (
    <>
      <Container>
        <Map ref={kakaoMapRef} />
      </Container>
      {map ? (
        <KakaoMapContext.Provider value={map}>{props.children}</KakaoMapContext.Provider>
      ) : (
        <div>지도 정보를 가져오는데 실패했습니다.</div>
      )}
    </>
  );
};

export default DynamicMap;

const Container = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

const Map = styled.div`
  position: static;
  width: 100%;
  height: 100%;
`;
