import ajmalDp from "../../assets/images/ajmalDp.png";
export default function Navbar() {
  return (
    <div
      id="dashNavbar"
      className="bg-[#141414] z-50 min-h-10 fixed top-0 right-0 left-[235px] m-1 mb-0 rounded-lg flex justify-between items-center"
    >
      <span className="text-[#9685FF] font-semibold pl-3">TeamSync</span>
      <div className="inline-flex items-center gap-3 pr-3">
        <svg
          width={22}
          height={22}
          viewBox="0 0 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <rect
            x="0.107056"
            width="24.8989"
            height={25}
            fill="url(#pattern0)"
          />
          <defs>
            <pattern
              id="pattern0"
              patternContentUnits="objectBoundingBox"
              width={1}
              height={1}
            >
              <use
                xlinkHref="#image0_412_106"
                transform="matrix(0.01 0 0 0.00995954 0 0.00202293)"
              />
            </pattern>
            <image
              id="image0_412_106"
              width={100}
              height={100}
              xlinkHref="data:image/png;base64,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"
            />
          </defs>
        </svg>
        <img src={ajmalDp} alt="userDP" className="size-7" />
      </div>
    </div>
  );
}
