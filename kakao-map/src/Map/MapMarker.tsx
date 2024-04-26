import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import ReactDOM from "react-dom";
import { PlaceType } from "./mapTypes";
import { useMap } from "../hooks/useMap";
import styled from "@emotion/styled";

interface MapMarkerProps {
  place: PlaceType;
  showInfo?: boolean;
}

const MapMarker = (props: MapMarkerProps) => {
  const map = useMap();
  const container = useRef(document.createElement("div"));

  const marker = useMemo(() => {
    // marker객체 자체는 한 번만 생성되도록 useMemo이용
    const marker = new kakao.maps.Marker({
      position: props.place.position,
    });

    kakao.maps.event.addListener(marker, "click", function () {
      map.setCenter(props.place.position);
      map.setLevel(4, {
        animate: true,
      });
      infoWindow.setMap(map);
    });

    return marker;
  }, []);

  const infoWindow = useMemo(() => {
    container.current.style.position = "absolute";
    container.current.style.bottom = "40px";

    return new kakao.maps.CustomOverlay({
      position: props.place.position,
      content: container.current,
      // map: map,
    });
  }, []);

  // layout이 구성될 때, 렌더링 될 때 같이 마커 세팅
  useLayoutEffect(() => {
    marker.setMap(map);

    return () => {
      // 컴포넌트가 unmount될 때 마커 제거
      marker.setMap(null);
    };
  }, [map]);

  useEffect(() => {
    if (props.showInfo) {
      infoWindow.setMap(map);
      console.log(props.place.title);
      return;
    }
    // 선택 해제 코드
    return () => {
      infoWindow.setMap(null);
    };
  }, [props.showInfo]);

  return (
    <>
      {container.current
        ? ReactDOM.createPortal(
            <InfoTag
              onClick={() => {
                infoWindow.setMap(null);
              }}
            >
              <Title>{props.place.title}</Title>
              <Address>{props.place.address}</Address>
            </InfoTag>,
            container.current,
          )
        : null}
    </>
  );
};

export default MapMarker;

const InfoTag = styled.section`
  width: 180px;
  min-height: 50px;
  margin-left: -90px;

  background-color: white;
  border: 3px solid lightgray;
  border-radius: 16px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.label`
  font-weight: bold;
  padding: 6px 8px;
`;

const Address = styled.span`
  font-size: 12px;
  padding: 0 6px 6px;
`;
