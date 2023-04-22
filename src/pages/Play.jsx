import React from "react";
import image from "../assets/play-illustration-blueSkyMan.jpg";
import { tracks } from "../assets/tracks.js";
import ProgressBar from "../components/audioPlayer/ProgressBar";

const Play = () => {
  const audioPlayer = React.useRef();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTrack, setCurrentTrack] = React.useState(null);
  const [currentTime, setCurrentTime] = React.useState("00:00");
  const [duration, setDuration] = React.useState("00:00");

  React.useEffect(() => {
    console.log("Play UseEffect");
    audioPlayer.current = new Audio(tracks[1].src);
    audioPlayer.current.addEventListener("loadedmetadata", onLoadedMetadata);
    audioPlayer.current.addEventListener("timeupdate", () => {
      setCurrentTime(audioPlayer.current.currentTime);
    });
  }, []);

  const onLoadedMetadata = () => {
    console.log("onLoadedMetadata");
    setCurrentTrack(audioPlayer.current);
    setDuration(audioPlayer.current.duration);
  };

  const handleControl = (ev) => {
    const buttonID = ev.currentTarget.id;
    console.log("handle control for button:", buttonID);
    switch (buttonID) {
      case "10sBack":
        audioPlayer.current.currentTime -= 10;
        break;

      case "play":
        audioPlayer.current.play();
        setIsPlaying(true);
        break;

      case "pause":
        audioPlayer.current.pause();
        setIsPlaying(false);
        break;

      case "setting":
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Playing Banner */}
      <div>
        <img
          className="w-full overflow-hidden object-cover aspect-square rounded-3xl border-8 border-white"
          src={image}
          alt="a man mediating with smiling face"
        />
      </div>

      {/* Option buttons */}
      <div className="flex justify-between mx-[33px] mt-[45px]">
        <div className="btn-elevated flex items-center justify-center rounded-[6.25rem] shadow-lg text-xs bg-primary-20 w-3/12 h-[26px]">
          10 mins
        </div>
        <div className="btn-elevated flex items-center justify-center  rounded-[6.25rem] shadow-lg text-xs bg-primary-20 w-3/12 h-[26px]">
          10 mins
        </div>
        <div className="btn-elevated flex items-center justify-center  rounded-[6.25rem] shadow-lg text-xs bg-primary-20 w-3/12 h-[26px]">
          10 mins
        </div>
      </div>

      {/* Progress bar */}
      <ProgressBar currentTime={currentTime} duration={duration}></ProgressBar>

      {/* Control buttons */}
      <div className="flex items-center justify-between mx-[53px] mt-[17px]">
        <div
          className=" hover:cursor-pointer"
          id="10sBack"
          onClick={handleControl}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.55 21.67C18.84 20.54 22 16.64 22 12C22 6.48 17.56 2 12 2C5.33 2 2 7.56 2 7.56M2 7.56V3M2 7.56H4.01H6.44"
              stroke="#060047"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 12C2 17.52 6.48 22 12 22"
              stroke="#060047"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="3 3"
            />
            <path
              d="M9.86799 8.72727V16H8.76713V9.82812H8.72452L6.98446 10.9645V9.91335L8.79909 8.72727H9.86799ZM14.3673 16.1207C13.8062 16.1184 13.3268 15.9704 12.9291 15.6768C12.5313 15.3833 12.2271 14.956 12.0164 14.3949C11.8057 13.8338 11.7004 13.1579 11.7004 12.3672C11.7004 11.5788 11.8057 10.9053 12.0164 10.3466C12.2295 9.78788 12.5349 9.36174 12.9326 9.06818C13.3327 8.77462 13.8109 8.62784 14.3673 8.62784C14.9236 8.62784 15.4007 8.7758 15.7984 9.07173C16.1961 9.36529 16.5003 9.79143 16.711 10.3501C16.9241 10.9065 17.0306 11.5788 17.0306 12.3672C17.0306 13.1603 16.9253 13.8374 16.7146 14.3984C16.5039 14.9571 16.1997 15.3845 15.8019 15.6804C15.4042 15.974 14.926 16.1207 14.3673 16.1207ZM14.3673 15.1726C14.8597 15.1726 15.2444 14.9323 15.5214 14.4517C15.8008 13.9711 15.9404 13.2763 15.9404 12.3672C15.9404 11.7635 15.8765 11.2533 15.7487 10.8366C15.6232 10.4176 15.4421 10.1004 15.2053 9.88494C14.971 9.66714 14.6916 9.55824 14.3673 9.55824C13.8772 9.55824 13.4925 9.79972 13.2132 10.2827C12.9338 10.7656 12.7929 11.4605 12.7906 12.3672C12.7906 12.9732 12.8533 13.4858 12.9788 13.9048C13.1066 14.3215 13.2877 14.6375 13.5221 14.853C13.7565 15.0661 14.0382 15.1726 14.3673 15.1726Z"
              fill="#060047"
            />
          </svg>
        </div>

        {/* Play and Pause button */}
        {isPlaying ? (
          <div
            className=" hover:cursor-pointer"
            id="pause"
            onClick={handleControl}
          >
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g filter="url(#filter0_f_71_718)">
                <circle
                  cx="40"
                  cy="40"
                  r="39"
                  transform="rotate(90 40 40)"
                  fill="url(#paint0_radial_71_718)"
                />
              </g>
              <g filter="url(#filter1_f_71_718)">
                <circle cx="40.0002" cy="38.0002" r="34.9528" fill="#449756" />
              </g>
              <g filter="url(#filter2_f_71_718)">
                <rect
                  x="29"
                  y="22"
                  width="5"
                  height="31"
                  rx="2.5"
                  fill="#FFE661"
                />
                <rect
                  x="47"
                  y="22"
                  width="5"
                  height="31"
                  rx="2.5"
                  fill="#FFE661"
                />
              </g>
              <defs>
                <filter
                  id="filter0_f_71_718"
                  x="0"
                  y="0"
                  width="80"
                  height="80"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                  />
                  <feGaussianBlur
                    stdDeviation="0.5"
                    result="effect1_foregroundBlur_71_718"
                  />
                </filter>
                <filter
                  id="filter1_f_71_718"
                  x="4.04736"
                  y="2.04736"
                  width="71.9056"
                  height="71.9058"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                  />
                  <feGaussianBlur
                    stdDeviation="0.5"
                    result="effect1_foregroundBlur_71_718"
                  />
                </filter>
                <filter
                  id="filter2_f_71_718"
                  x="28.5"
                  y="21.5"
                  width="24"
                  height="32"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                  />
                  <feGaussianBlur
                    stdDeviation="0.25"
                    result="effect1_foregroundBlur_71_718"
                  />
                </filter>
                <radialGradient
                  id="paint0_radial_71_718"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(77.1604 13.5094) rotate(140.342) scale(82.4391 64.1254)"
                >
                  <stop stopColor="#E3BF00" />
                  <stop offset="1" stopColor="#E3BF00" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        ) : (
          <div
            className=" hover:cursor-pointer"
            id="play"
            onClick={handleControl}
          >
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g filter="url(#filter0_f_46_756)">
                <circle
                  cx="40"
                  cy="40"
                  r="39"
                  transform="rotate(90 40 40)"
                  fill="url(#paint0_radial_46_756)"
                />
              </g>
              <g filter="url(#filter1_f_46_756)">
                <circle cx="40.0002" cy="40.0002" r="34.9528" fill="#449756" />
              </g>
              <path
                d="M55.3679 38.5057C57.3679 39.6604 57.3679 42.5472 55.3679 43.7019L32.9104 56.6677C30.9104 57.8224 28.4104 56.379 28.4104 54.0696L28.4104 28.1379C28.4104 25.8285 30.9104 24.3851 32.9104 25.5398L55.3679 38.5057Z"
                fill="#FFE661"
              />
              <defs>
                <filter
                  id="filter0_f_46_756"
                  x="0"
                  y="0"
                  width="80"
                  height="80"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                  />
                  <feGaussianBlur
                    stdDeviation="0.5"
                    result="effect1_foregroundBlur_46_756"
                  />
                </filter>
                <filter
                  id="filter1_f_46_756"
                  x="4.04736"
                  y="4.04736"
                  width="71.9058"
                  height="71.9058"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                  />
                  <feGaussianBlur
                    stdDeviation="0.5"
                    result="effect1_foregroundBlur_46_756"
                  />
                </filter>
                <radialGradient
                  id="paint0_radial_46_756"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(77.1604 13.5094) rotate(140.342) scale(82.4391 64.1254)"
                >
                  <stop stopColor="#E3BF00" />
                  <stop offset="1" stopColor="#E3BF00" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        )}

        <div
          className=" hover:cursor-pointer"
          id="setting"
          onClick={handleControl}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.90029 7.75963L3.78029 6.23542C4.30029 5.33476 5.46641 5.01498 6.37574 5.53998C7.94324 6.44498 9.2241 5.70646 9.22102 3.8918C9.22069 2.85238 10.0742 1.99413 11.1222 1.9988L13.1155 2.00643C14.0346 1.9944 14.778 2.74689 14.79 3.66605L14.7903 3.88559C14.7847 5.69525 16.0664 6.43525 17.6395 5.53059L17.8297 5.42105C18.6318 4.97189 19.6551 5.2394 20.1043 6.04143L21.1075 7.7638C21.6356 8.66913 21.3191 9.83738 20.4187 10.3568C18.8456 11.2615 18.8465 12.74 20.414 13.645C21.3147 14.165 21.6345 15.3311 21.1095 16.2404L20.2295 17.7646C19.7095 18.6653 18.5433 18.9851 17.634 18.4601C16.0665 17.5551 14.7856 18.2936 14.7887 20.1082C14.7841 21.1563 13.9356 22.0059 12.8875 22.0013L10.8943 21.9936C9.97513 22.0057 9.23178 21.2532 9.21975 20.334L9.21948 20.1145C9.22506 18.3048 7.94334 17.5648 6.37026 18.4695L6.18 18.579C5.37797 19.0282 4.35462 18.7607 3.90546 17.9586L2.90224 16.2363C2.37415 15.3309 2.69069 14.1627 3.59102 13.6432C5.1641 12.7386 5.16324 11.2601 3.59574 10.3551C2.68641 9.83008 2.38029 8.66029 2.90029 7.75963Z"
              stroke="#1B1B1B"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.25 12C15.25 10.2051 13.7949 8.75 12 8.75C10.2051 8.75 8.75 10.2051 8.75 12C8.75 13.7949 10.2051 15.25 12 15.25C13.7949 15.25 15.25 13.7949 15.25 12Z"
              stroke="#1B1B1B"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>

      {/* Audio player */}
      <audio ref={audioPlayer}></audio>
    </div>
  );
};

export default Play;
