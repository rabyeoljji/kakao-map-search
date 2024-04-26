import styled from "@emotion/styled";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useMap } from "../hooks/useMap";
import { PlaceType } from "./mapTypes";

interface SearchLocationProps {
  onUpdatePlaces: (places: PlaceType[]) => void;
  onSelect: (placeId: string) => void;
}

const SearchLocation = (props: SearchLocationProps) => {
  const map = useMap();
  const [keyword, setKeyword] = useState("");
  const [places, setPlaces] = useState<PlaceType[]>([]);
  const placeService = useRef<kakao.maps.services.Places | null>(null);
  // 변하기는 하지만 리렌더링이 될 필요는 없는 요소를 담을 때 useRef를 사용할 수도 있다.

  useEffect(() => {
    if (placeService.current) {
      return;
    }

    placeService.current = new kakao.maps.services.Places();
  }, []);

  const searchPlaces = (keyword: string) => {
    if (!keyword.replace(/^\s+|\s+$/g, "")) {
      alert("키워드를 입력해주세요!");
      return;
    }

    // 이런식으로 코드 자동완성으로 ?가 붙었는데 null이면 안되는 경우 분기처리를 해주는 습관을 기르자
    if (!placeService.current) {
      // todo: placeService error handling
      alert("placeService 에러"); // 임시 에러 처리
      return;
    }
    // 실제 검색 처리를 하게되는 부분
    placeService.current.keywordSearch(keyword, (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        // 콘솔로 data를 찍어보면 keyword와 일치하는 장소들이 배열로 반환됨
        const placeInfos = data.map((placeSearchResultItem) => {
          return {
            id: placeSearchResultItem.id,
            position: new kakao.maps.LatLng(Number(placeSearchResultItem.y), Number(placeSearchResultItem.x)),
            title: placeSearchResultItem.place_name,
            address: placeSearchResultItem.address_name,
          };
        });
        props.onUpdatePlaces(placeInfos);
        setPlaces(placeInfos);
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert("검색 결과가 존재하지 않습니다.");
        return;
      } else if (status === kakao.maps.services.Status.ERROR) {
        alert("검색 결과 중 오류가 발생했습니다.");
        return;
      }
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    searchPlaces(keyword);
  };

  const handleItemClick = (place: PlaceType) => {
    map.setCenter(place.position);
    map.setLevel(4);
    props.onSelect(place.id);
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Input
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
        />
      </Form>
      <List>
        {places.map((item, idx) => {
          return (
            <Item key={item.id} onClick={() => handleItemClick(item)}>
              <label>{`${idx + 1}. ${item.title}`}</label>
              <span>{item.address}</span>
            </Item>
          );
        })}
      </List>
    </Container>
  );
};

export default SearchLocation;

// ---------------------- emotion css ----------------------
const Container = styled.div`
  position: absolute;
  z-index: 1;
  height: 100%;
  background: white;
  opacity: 0.8;
  overflow-y: auto;
`;

const Form = styled.form`
  display: flex;
  position: sticky;
  top: 0;
`;

const Input = styled.input`
  width: 100%;
  min-width: 200px;
  padding: 8px;
  border: 1px solid #c0c0c0;
`;

const List = styled.ul`
  margin: 0;
  padding: 0;
`;

const Item = styled.li`
  display: flex;
  flex-direction: column;
  padding: 8px;
  border-bottom: 1px dashed #d2d2d2;
  cursor: pointer;

  &:hover {
    background-color: #d2d2d2;
    opacity: 1;
    transition: background-color 0s;
  }
`;
