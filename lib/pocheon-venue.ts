/** 포천중앙침례교회 — ONENESS / 티켓 장소 안내 */

const VENUE_NAME = "포천중앙침례교회";
const VENUE_ADDRESS = "경기 포천시 중앙로105번길 23-2";

function naverSearchUrl(query: string) {
  return `https://map.naver.com/v5/search/${encodeURIComponent(query)}`;
}

function naverDirectionsUrl(mode: "car" | "transit" | "walk") {
  return `https://map.naver.com/v5/directions/-/${encodeURIComponent(VENUE_ADDRESS)}/-/${mode}`;
}

export type VenueRouteGuide = {
  id: string;
  label: string;
  summary: string;
  steps: string[];
  mapUrl: string;
};

export const POCHEON_CENTRAL_BAPTIST_VENUE = {
  name: VENUE_NAME,
  address: VENUE_ADDRESS,
  /** 장소 보기 — 네이버 지도 검색 */
  mapSearchUrl: naverSearchUrl(VENUE_NAME),
  /** 주소로 장소 보기 */
  mapAddressUrl: naverSearchUrl(VENUE_ADDRESS),
  directionUrls: {
    car: naverDirectionsUrl("car"),
    transit: naverDirectionsUrl("transit"),
    walk: naverDirectionsUrl("walk"),
  },
  routes: [
    {
      id: "car",
      label: "자가용",
      summary: "경춘고속도로 · 중앙로 방면",
      steps: [
        "경춘고속도로 이용 시 포천IC 또는 소흘IC에서 진출",
        "중앙로(중앙로105번길) 방향으로 이동",
        "포천중앙침례교회 도착 · 주차는 현장 안내에 따라 이용",
      ],
      mapUrl: naverDirectionsUrl("car"),
    },
    {
      id: "transit",
      label: "지하철 · 전철",
      summary: "의정부경전철 포천선",
      steps: [
        "의정부경전철 포천선 종점 포천역 하차",
        "택시 약 10–15분, 또는 시내버스로 중앙로 방면 이동",
        "네이버 지도 ‘대중교통’ 길찾기로 최신 환승 정보 확인 권장",
      ],
      mapUrl: naverDirectionsUrl("transit"),
    },
    {
      id: "bus",
      label: "시외·고속버스",
      summary: "포천종합터미널",
      steps: [
        "동서울·의정부 등에서 포천행 시외버스 이용",
        "포천종합터미널 하차 후 택시 또는 시내버스",
        "중앙로105번길 방면 이동 후 도착",
      ],
      mapUrl: naverDirectionsUrl("transit"),
    },
  ] satisfies VenueRouteGuide[],
};
