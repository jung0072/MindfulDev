import { tracks } from "../assets/tracks";

export default function trackGenerator(playOption) {
  // console.log("trackGenerator", playOption);
  const duration = playOption.duration;
  const trackSourceList = [];

  switch (duration) {
    case "5mins":
      for (let i = 0; i <= 3; i++) {
        trackSourceList.push(tracks[i].src);
      }
      break;

    case "10mins":
      for (let i = 0; i <= 6; i++) {
        trackSourceList.push(tracks[i].src);
      }
      break;

    case "15mins":
      for (let i = 0; i <= 9; i++) {
        trackSourceList.push(tracks[i].src);
      }

    default:
      break;
  }
  // console.log("trackSourceList", trackSourceList);
  return trackSourceList;
}
