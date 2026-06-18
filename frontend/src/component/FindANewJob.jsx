import { useState } from "react";
import Header from "./Header";
import "./FindANew.css";

const FindANewJob = () => {
  const [showBanner, setShowBanner] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [location, setLocation] = useState("");

  return (
    <div>
      <div>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Apply for All Restaurant jobs near Jabalpur, MP. Thousands of great foodservice jobs available at seasoned.co!"
        />

        <link
          rel="shortcut icon"
          type="image/png"
          href="https://www.seasoned.co/favicon.png"
        />
        <title>All jobs near Jabalpur, MP @ Seasoned</title>
        <svg xmlns="http://www.w3.org/2000/svg" className="hidden">
          <symbol id="icon-bolt" viewBox="0 0 24 24">
            <path
              d="M15.92 1.66001C15.5502 1.47222 15.1311 1.40407 14.7208 1.46499C14.3105 1.5259 13.9293 1.71287 13.63 2.00001L4.83 10.3C4.56179 10.553 4.36872 10.8752 4.27213 11.231C4.17553 11.5868 4.17917 11.9624 4.28264 12.3163C4.38612 12.6701 4.58539 12.9885 4.85846 13.2362C5.13152 13.484 5.46775 13.6514 5.83 13.72L8.17 14.17L7 19.37C6.90216 19.7885 6.94175 20.2274 7.11288 20.6217C7.28402 21.0159 7.57761 21.3445 7.95016 21.5589C8.3227 21.7732 8.75437 21.8618 9.18122 21.8116C9.60807 21.7614 10.0074 21.575 10.32 21.28L19.1 13C19.3682 12.747 19.5613 12.4249 19.6579 12.069C19.7545 11.7132 19.7508 11.3376 19.6474 10.9838C19.5439 10.6299 19.3446 10.3115 19.0715 10.0638C18.7985 9.81606 18.4622 9.64864 18.1 9.58001L16.17 9.18001L17 3.71001C17.055 3.29848 16.9806 2.88002 16.7871 2.51268C16.5936 2.14534 16.2905 1.84734 15.92 1.66001ZM17.73 11.58L8.93 19.81L10.35 13.58C10.3811 13.4495 10.3856 13.3141 10.3633 13.1818C10.3409 13.0495 10.2922 12.9231 10.22 12.81C10.1458 12.6955 10.049 12.5974 9.93549 12.5218C9.82199 12.4461 9.69421 12.3945 9.56 12.37L6.2 11.74L15 3.43001L14.11 9.85001C14.0656 10.1054 14.1221 10.3681 14.2676 10.5826C14.4131 10.7972 14.6363 10.9468 14.89 11L17.73 11.58Z"
              fill="currentColor"
            />
          </symbol>
          <symbol id="icon-chevron_right" viewBox="0 0 24 24">
            <path
              d="M7.04999 21.19C7.14261 21.2845 7.25305 21.3597 7.37493 21.4112C7.4968 21.4627 7.62769 21.4895 7.75999 21.49C8.02376 21.4862 8.27536 21.3784 8.45999 21.19L17 12.71C17.0937 12.617 17.1681 12.5064 17.2189 12.3846C17.2697 12.2627 17.2958 12.132 17.2958 12C17.2958 11.868 17.2697 11.7373 17.2189 11.6154C17.1681 11.4936 17.0937 11.383 17 11.29L8.45999 2.81001C8.26869 2.64618 8.02262 2.56057 7.77094 2.5703C7.51926 2.58002 7.28052 2.68435 7.10243 2.86244C6.92434 3.04054 6.82 3.27928 6.81028 3.53095C6.80056 3.78263 6.88617 4.02871 7.04999 4.22001L14.83 12L7.04999 19.78C6.86374 19.9674 6.7592 20.2208 6.7592 20.485C6.7592 20.7492 6.86374 21.0026 7.04999 21.19Z"
              fill="currentColor"
            />
          </symbol>
          <symbol id="icon-clock" viewBox="0 0 24 24">
            <path
              d="M12 1C9.82441 1 7.69767 1.64514 5.88873 2.85383C4.07979 4.06253 2.66989 5.78049 1.83733 7.79048C1.00477 9.80047 0.786929 12.0122 1.21137 14.146C1.6358 16.2798 2.68345 18.2398 4.22183 19.7782C5.76021 21.3166 7.72022 22.3642 9.85401 22.7886C11.9878 23.2131 14.1995 22.9952 16.2095 22.1627C18.2195 21.3301 19.9375 19.9202 21.1462 18.1113C22.3549 16.3023 23 14.1756 23 12C23 9.08262 21.8411 6.28473 19.7782 4.22183C17.7153 2.15893 14.9174 1 12 1ZM12 21C10.22 21 8.47992 20.4722 6.99987 19.4832C5.51983 18.4943 4.36628 17.0887 3.68509 15.4442C3.0039 13.7996 2.82567 11.99 3.17294 10.2442C3.5202 8.49836 4.37737 6.89471 5.63604 5.63604C6.89472 4.37737 8.49836 3.5202 10.2442 3.17293C11.99 2.82567 13.7996 3.0039 15.4442 3.68508C17.0887 4.36627 18.4943 5.51983 19.4832 6.99987C20.4722 8.47991 21 10.22 21 12C21 14.3869 20.0518 16.6761 18.364 18.364C16.6761 20.0518 14.387 21 12 21Z"
              fill="currentColor"
            />
            <path
              d="M17 11H13V7C13 6.73478 12.8946 6.48043 12.7071 6.29289C12.5196 6.10536 12.2652 6 12 6C11.7348 6 11.4804 6.10536 11.2929 6.29289C11.1054 6.48043 11 6.73478 11 7V12C11 12.2652 11.1054 12.5196 11.2929 12.7071C11.4804 12.8946 11.7348 13 12 13H17C17.2652 13 17.5196 12.8946 17.7071 12.7071C17.8946 12.5196 18 12.2652 18 12C18 11.7348 17.8946 11.4804 17.7071 11.2929C17.5196 11.1054 17.2652 11 17 11Z"
              fill="currentColor"
            />
          </symbol>
          <symbol id="icon-close" viewBox="0 0 24 24">
            <path
              d="M3.63001 20.37C3.81737 20.5562 4.07082 20.6608 4.33501 20.6608C4.59919 20.6608 4.85265 20.5562 5.04001 20.37L12.04 13.37L19.04 20.37C19.2274 20.5562 19.4808 20.6608 19.745 20.6608C20.0092 20.6608 20.2626 20.5562 20.45 20.37C20.6363 20.1826 20.7408 19.9292 20.7408 19.665C20.7408 19.4008 20.6363 19.1473 20.45 18.96L13.45 11.96L20.45 4.95999C20.5748 4.76188 20.626 4.52628 20.5949 4.29424C20.5638 4.0622 20.4523 3.84843 20.2798 3.69018C20.1072 3.53193 19.8846 3.43923 19.6508 3.42823C19.4169 3.41723 19.1866 3.48863 19 3.62999L12 10.63L5.00001 3.62999C4.80896 3.51685 4.5857 3.4705 4.36541 3.49826C4.14512 3.52602 3.94033 3.62631 3.78333 3.78331C3.62633 3.94031 3.52604 4.1451 3.49828 4.36539C3.47052 4.58568 3.51687 4.80894 3.63001 4.99999L10.63 12L3.63001 19C3.45563 19.1854 3.35855 19.4304 3.35855 19.685C3.35855 19.9396 3.45563 20.1845 3.63001 20.37Z"
              fill="currentColor"
            />
          </symbol>
          <symbol id="icon-location" viewBox="0 0 24 24">
            <path
              d="M12.76 2.00001C12.2312 1.95003 11.6988 1.95003 11.17 2.00001C9.84932 2.13438 8.58624 2.60967 7.5046 3.37927C6.42295 4.14887 5.55988 5.18636 5 6.39001C4.37311 7.66214 4.08947 9.07598 4.17717 10.4915C4.26487 11.907 4.72087 13.275 5.5 14.46L10.6 21.46C10.7862 21.7116 11.029 21.916 11.3086 22.0566C11.5882 22.1973 11.897 22.2704 12.21 22.27C12.529 22.2663 12.8426 22.1863 13.1244 22.0367C13.4062 21.887 13.6481 21.6722 13.83 21.41L18.66 14.41C19.389 13.2137 19.801 11.8513 19.8569 10.4515C19.9129 9.05168 19.6111 7.66071 18.98 6.41001C18.4129 5.19998 17.5417 4.15766 16.4516 3.38474C15.3614 2.61183 14.0895 2.13473 12.76 2.00001ZM17 13.29L12.2 20.29L7.11 13.35C6.52638 12.4535 6.18627 11.4205 6.12315 10.3527C6.06003 9.28486 6.27606 8.21899 6.75 7.26001C7.15995 6.35836 7.8017 5.58158 8.60981 5.00888C9.41791 4.43618 10.3635 4.08805 11.35 4.00001C11.759 3.96001 12.171 3.96001 12.58 4.00001C13.5641 4.08684 14.5084 4.42975 15.3189 4.99465C16.1294 5.55955 16.7779 6.32676 17.2 7.22001C17.6864 8.16506 17.9233 9.21869 17.8883 10.281C17.8533 11.3433 17.5475 12.379 17 13.29Z"
              fill="currentColor"
            />
            <path
              d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
              fill="currentColor"
            />
          </symbol>
          <symbol id="icon-location_2" viewBox="0 0 24 24">
            <path
              d="M20.33 2.32999L11.23 6.82999L2.81 10.64C2.60567 10.7323 2.43828 10.8906 2.33472 11.0894C2.23116 11.2883 2.19744 11.5162 2.23897 11.7365C2.2805 11.9569 2.39487 12.1569 2.56372 12.3044C2.73256 12.4519 2.94609 12.5384 3.17 12.55L11 13L11.44 20.84C11.4516 21.0632 11.5377 21.2762 11.6846 21.4447C11.8314 21.6133 12.0305 21.7278 12.25 21.77H12.44C12.6313 21.7705 12.8187 21.7161 12.9799 21.6133C13.1412 21.5105 13.2697 21.3636 13.35 21.19L17.14 12.8L21.66 3.66999C21.7529 3.48248 21.7846 3.27056 21.7507 3.06406C21.7168 2.85757 21.619 2.66691 21.4711 2.51894C21.3231 2.37097 21.1324 2.27315 20.9259 2.23925C20.7194 2.20535 20.5075 2.23709 20.32 2.32999H20.33ZM15.33 11.94L13.2 16.65L13 12C13 11.7348 12.8946 11.4804 12.7071 11.2929C12.5196 11.1053 12.2652 11 12 11L7.34 10.74L12.08 8.59999L18.56 5.38999L15.33 11.94Z"
              fill="currentColor"
            />
          </symbol>
          <symbol id="icon-store" viewBox="0 0 24 24">
            <path
              d="M22.989 8.71662C22.9575 8.78562 22.8307 9.01512 22.5367 9.01512H19.8367L18.2182 4.96662H20.2882L22.9057 8.13987C23.1157 8.37987 23.0227 8.64162 22.989 8.71662ZM20.061 23.0401H15.9862V15.5049C15.9862 15.2401 15.771 15.0249 15.5062 15.0249H8.49521C8.23046 15.0249 8.01521 15.2401 8.01521 15.5049V23.0401H3.94046V9.97512H20.061V23.0401ZM8.97446 23.0401V15.9849H15.0255V23.0401H8.97446ZM1.01096 8.71587C0.977956 8.64162 0.883456 8.37987 1.09421 8.13987L1.10471 8.12937L3.71171 4.96737H5.78171L4.16171 9.01587H1.46246C1.16771 9.01587 1.04246 8.78637 1.01021 8.71662L1.01096 8.71587ZM15.8992 9.01512L15.09 4.96662H17.184L18.8025 9.01512H15.8992ZM12.48 4.96737H14.1112L14.9205 9.01587H12.4807L12.48 4.96737ZM5.19596 9.01512L6.81596 4.96662H8.90996L8.10071 9.01512H5.19596ZM9.08021 9.01512L9.88946 4.96662H11.5207V9.01512H9.08021ZM20.0332 0.96012V4.00737H3.96596V0.96012H20.0332ZM23.637 7.51812L20.994 4.31487V0.48087C20.994 0.21612 20.7802 0.000869751 20.514 0.000869751H3.48596C3.22121 0.000869751 3.00596 0.21612 3.00596 0.48087V4.31487L0.368956 7.51362C-0.0202939 7.95912 -0.108044 8.57187 0.135706 9.11187C0.376456 9.64437 0.885706 9.97587 1.46321 9.97587H2.97971V23.5209C2.97971 23.7856 3.19346 24.0009 3.45971 24.0009H20.5402C20.805 24.0009 21.0202 23.7856 21.0202 23.5209V9.97587H22.5367C23.1142 9.97587 23.6227 9.64437 23.8635 9.11262C24.1095 8.56812 24.0187 7.95237 23.6355 7.51812H23.637Z"
              fill="currentColor"
            />
          </symbol>
          <symbol id="icon-chevron_up" viewBox="0 0 24 24">
            <path
              d="M21.19 15.54L12.71 7.05001C12.617 6.95628 12.5064 6.88189 12.3846 6.83112C12.2627 6.78035 12.132 6.75421 12 6.75421C11.868 6.75421 11.7373 6.78035 11.6154 6.83112C11.4936 6.88189 11.383 6.95628 11.29 7.05001L2.81 15.54C2.6164 15.727 2.505 15.9832 2.50031 16.2523C2.49562 16.5214 2.59803 16.7814 2.78501 16.975C2.97198 17.1686 3.22821 17.28 3.49733 17.2847C3.76644 17.2894 4.0264 17.187 4.22 17L12 9.17001L19.78 17C19.9674 17.1863 20.2208 17.2908 20.485 17.2908C20.7492 17.2908 21.0026 17.1863 21.19 17C21.2899 16.9065 21.3696 16.7934 21.424 16.6678C21.4785 16.5423 21.5066 16.4069 21.5066 16.27C21.5066 16.1331 21.4785 15.9977 21.424 15.8722C21.3696 15.7466 21.2899 15.6335 21.19 15.54Z"
              fill="currentColor"
            />
          </symbol>
          <symbol id="icon-chevron_down" viewBox="0 0 24 24">
            <path
              d="M21.19 7.05001C21.0026 6.86376 20.7492 6.75922 20.485 6.75922C20.2208 6.75922 19.9674 6.86376 19.78 7.05001L12 14.83L4.22 7.05001C4.0287 6.88618 3.78262 6.80058 3.53095 6.8103C3.27927 6.82002 3.04053 6.92435 2.86244 7.10245C2.68434 7.28054 2.58001 7.51928 2.57029 7.77096C2.56057 8.02263 2.64617 8.26871 2.81 8.46001L11.29 17C11.383 17.0937 11.4936 17.1681 11.6154 17.2189C11.7373 17.2697 11.868 17.2958 12 17.2958C12.132 17.2958 12.2627 17.2697 12.3846 17.2189C12.5064 17.1681 12.617 17.0937 12.71 17L21.19 8.51001C21.2899 8.41647 21.3696 8.30342 21.424 8.17785C21.4785 8.05228 21.5066 7.91687 21.5066 7.78001C21.5066 7.64314 21.4785 7.50774 21.424 7.38217C21.3696 7.2566 21.2899 7.14355 21.19 7.05001Z"
              fill="currentColor"
            />
          </symbol>
        </svg>
        {showBanner ? (
          <div className="h-20 c-app-download-banner items-center relative flex">
            <button
              type="button"
              className="js-banner-close-button"
              aria-label="Close banner"
              onClick={() => setShowBanner(false)}
            >
              <img
                className="mr-3.5 ml-4 opacity-25"
                src="https://d1oulfd0tdws93.cloudfront.net/img/ic-close.9999c51772ef7e7fbea42c3615a56346.svg"
                alt="Close Icon"
              />
            </button>
            <img
              className="h-13.5 mr-3 w-13.5"
              src="https://d1oulfd0tdws93.cloudfront.net/img/Icon_Member-App.71e4d0a37ae599db589d62a402265c5b.svg"
              alt="Seasoned App Logo"
            />
            <p className="font-bold mt-0 text-white text-base mb-0 w-39">
              Faster interviews, only in the app.
            </p>
            <div
              className="h-20 top-0 right-0 w-57 absolute"
              style={{
                backgroundImage:
                  'url("https://d1oulfd0tdws93.cloudfront.net/img/ic-app-download-banner.71b8da52e00ff38475a24be043809cbc.svg")',
              }}
            >
              <img
                className="h-16 top-2 right-6 absolute"
                src="https://d1oulfd0tdws93.cloudfront.net/img/ic-banner-qr.61482f60bcf7ee43ca02ee3466e5f5de.png"
                alt="Download the App"
              />
            </div>
          </div>
        ) : null}
        <Header />
        <h1 className="bg-darkest-gray m-0 text-white text-center p-0 px-8 pt-6 pb-2 text-4xl qa-search-page-title">
          <span className="relative before:bg-white before:h-0.75 before:text-white before:top-7 before:-left-0.5 before:w-13/12 before:absolute before:content-DEFAULT">
            86
          </span>
          the wait...
        </h1>
        <p className="bg-darkest-gray m-0 text-white text-center text-sm p-0 px-8 pb-4">
          Oops, it looks like we couldn’t find any jobs near Jabalpur, MP. Try
          searching in another location.
        </p>
        <div className="js-search-sticky-detector" />
        <section className="search-form-component">
          <div className="px-6 flex justify-end">
            <button className="c-search-cancel js-search__cancel qa-cancel-search-criteria-button">
              Cancel
            </button>
          </div>
          <div className="mx-auto p-4 max-w-208 lg:flex lg:items-center lg:justify-between c-search-inputs js-search-inputs">
            <form
              action="/jobs"
              method="POST"
              id="job-search-form"
              className="lg:w-72 js-search-inputs__form"
            >
              <fieldset>
                <input
                  className="c-search-input js-search-input qa-jobs-search-input"
                  name="search_text"
                  type="text"
                  placeholder="Positions or restaurants..."
                  autoComplete="off"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <datalist id="job-titles-data">
                  <option value="Administrative">Administrative</option>{" "}
                  <option value="Assistant Manager">Assistant Manager</option>{" "}
                  <option value="Baker">Baker</option>{" "}
                  <option value="Bar-back">Bar-back</option>{" "}
                  <option value="Barista">Barista</option>{" "}
                  <option value="Bartender">Bartender</option>{" "}
                  <option value="Busser">Busser</option>{" "}
                  <option value="Butcher">Butcher</option>{" "}
                  <option value="Cashier">Cashier</option>{" "}
                  <option value="Catering & Events">
                    Catering &amp; Events
                  </option>{" "}
                  <option value="Chef">Chef</option>{" "}
                  <option value="Cook">Cook</option>{" "}
                  <option value="Crew">Crew</option>{" "}
                  <option value="Dishwasher">Dishwasher</option>{" "}
                  <option value="Driver">Driver</option>{" "}
                  <option value="Drive-Thru">Drive-Thru</option>{" "}
                  <option value="General Manager">General Manager</option>{" "}
                  <option value="Guest Services">Guest Services</option>{" "}
                  <option value="Host">Host</option>{" "}
                  <option value="Line Cook">Line Cook</option>{" "}
                  <option value="Manager">Manager</option>{" "}
                  <option value="Pastry Chef">Pastry Chef</option>{" "}
                  <option value="Prep Cook">Prep Cook</option>{" "}
                  <option value="Runner/Expo">Runner/Expo</option>{" "}
                  <option value="Security">Security</option>{" "}
                  <option value="Server">Server</option>{" "}
                  <option value="Sommelier">Sommelier</option>{" "}
                  <option value="Sous Chef">Sous Chef</option>{" "}
                  <option value="Supervisor">Supervisor</option>{" "}
                  <option value="Team Member">Team Member</option>{" "}
                  <option value="Trainer">Trainer</option>
                </datalist>
                <input
                  className="js-city-input"
                  type="hidden"
                  name="city"
                  defaultValue="Jabalpur"
                />
                <input
                  className="js-state-input"
                  type="hidden"
                  name="state"
                  defaultValue="MP"
                />
                <input
                  className="js-lat-input"
                  type="hidden"
                  name="lat"
                  defaultValue="23.16697"
                />
                <input
                  className="js-lng-input"
                  type="hidden"
                  name="lng"
                  defaultValue="79.95006"
                />
                <input
                  className="js-coordinates-input"
                  type="hidden"
                  name="coordinates"
                  defaultValue
                />
                <input
                  className="js-min-age-input"
                  type="hidden"
                  name="minAge"
                  defaultValue="false"
                />
                <input
                  className="js-full-time-input"
                  type="hidden"
                  name="fullTime"
                  defaultValue="false"
                />
                <input
                  className="js-part-time-input"
                  type="hidden"
                  name="partTime"
                  defaultValue="false"
                />
                <input
                  className="js-distance-input"
                  type="hidden"
                  name="distance"
                  defaultValue="false"
                />
              </fieldset>
            </form>
            <input
              className="c-search-location js-search__location qa-jobs-search-search-location"
              name="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City or Zip"
            />
            <button
              type="button"
              className="c-search-submit btn js-search-button"
              onClick={() => {
                const params = new URLSearchParams();

                if (searchText.trim()) {
                  params.append("search_text", searchText);
                }

                if (location.trim()) {
                  params.append("location", location);
                }

                window.location.href = `/jobs?${params.toString()}`;
              }}
            >
              Find Jobs
            </button>
          </div>
        </section>
        <div className="bg-darkest-gray flex p-0 pb-12 whitespace-nowrap overflow-x-scroll no-scrollbar js-search__category-pills__container">
          <div className="flex flex-row mr-auto ml-5 w-200 lg:ml-auto">
            <a
              className="mr-4 mx-auto  js-min-age-pill"
              href="/jobs/all_restaurant_for-14-year-olds-jobs_in-jabalpur-mp?lat=23.16697&lng=79.95006"
            >
              <div className="btn btn-secondary-white-outline border-dark-gray hover:border-secondary ">
                Hires 14+
              </div>
            </a>
            <a
              className="mx-auto mr-4 js-full-time-pill"
              href="/jobs/all_restaurant_full-time-jobs_in-jabalpur-mp?lat=23.16697&lng=79.95006"
            >
              <div className="btn btn-secondary-white-outline border-dark-gray hover:border-secondary ">
                Full-time
              </div>
            </a>
            <a
              className="mx-auto mr-4 js-part-time-pill"
              href="/jobs/all_restaurant_part-time-jobs_in-jabalpur-mp?lat=23.16697&lng=79.95006"
            >
              <div className="btn btn-secondary-white-outline border-dark-gray hover:border-secondary ">
                Part-time
              </div>
            </a>
            <a
              className="mr-4 mx-auto  js-server-pill"
              href="/jobs/all_server-jobs_in-jabalpur-mp?lat=23.16697&lng=79.95006"
            >
              <div className="btn btn-secondary-white-outline border-dark-gray hover:border-secondary ">
                Server
              </div>
            </a>
            <a
              className="mr-4 mx-auto  js-bartender-pill"
              href="/jobs/all_bartender-jobs_in-jabalpur-mp?lat=23.16697&lng=79.95006"
            >
              <div className="btn btn-secondary-white-outline border-dark-gray hover:border-secondary ">
                Bartender
              </div>
            </a>
            <div className="js-distance-container-dropdown mr-2">
              <a className="mr-4 mx-auto js-distance-pill" href="#">
                <div className="btn btn-gray-white-outline w-full hover:bg-secondary hover:border-secondary border-dark-gray js-distance-style ">
                  Any Distance
                  <span className="ml-3 mt-0.5 tform js-distance-chevron">
                    <svg
                      role="img"
                      aria-labelledby="icon-chevron_down-title"
                      className="w-3 h-3 "
                    >
                      <title id="icon-chevron_down-title">
                        icon-chevron_down
                      </title>
                      <use href="#icon-chevron_down" />
                    </svg>
                  </span>
                </div>
              </a>
              <ul
                className="hidden absolute bg-white z-2 flex flex-col rounded-xl items-start pt-0 px-0 pb-2 mt-4 min-w-44 max-w-44 js-distance-dropdown"
                style={{ boxShadow: "0 0.25rem 0.75rem rgba(0, 0, 0, 0.15)" }}
              >
                <a
                  className="hover:bg-secondary hover:font-bold w-full"
                  style={{ borderRadius: "0.75rem 0.75rem 0 0" }}
                  href="/jobs/all_restaurant-jobs_in-jabalpur-mp?lat=23.16697&lng=79.95006"
                  data-distance="null"
                >
                  <li className="flex flex-row items-center py-3 px-4 gap-2.5 text-black font-bold">
                    Any Distance
                  </li>
                </a>
                <a
                  className="hover:bg-secondary hover:font-bold w-full"
                  href="/jobs/all_restaurant_within-5-miles-jobs_in-jabalpur-mp?lat=&lng="
                  data-distance={5}
                >
                  <li className="flex flex-row items-center py-3 px-4 gap-2.5 text-black ">
                    Within 5 miles
                  </li>
                </a>
                <a
                  className="hover:bg-secondary hover:font-bold w-full"
                  href="/jobs/all_restaurant_within-10-miles-jobs_in-jabalpur-mp?lat=&lng="
                  data-distance={10}
                >
                  <li className="flex flex-row items-center py-3 px-4 gap-2.5 text-black ">
                    Within 10 miles
                  </li>
                </a>
                <a
                  className="hover:bg-secondary hover:font-bold w-full"
                  href="/jobs/all_restaurant_within-15-miles-jobs_in-jabalpur-mp?lat=&lng="
                  data-distance={15}
                >
                  <li className="flex flex-row items-center py-3 px-4 gap-2.5 text-black ">
                    Within 15 miles
                  </li>
                </a>
                <a
                  className="hover:bg-secondary hover:font-bold w-full"
                  href="/jobs/all_restaurant_within-20-miles-jobs_in-jabalpur-mp?lat=&lng="
                  data-distance={20}
                >
                  <li className="flex flex-row items-center py-3 px-4 gap-2.5 text-black ">
                    Within 20 miles
                  </li>
                </a>
              </ul>
            </div>
          </div>
        </div>
        <div className="c-request-location js-request-location">
          <button className="flex items-center justify-center font-700 underline mr-1 js-request-location__cta">
            <svg
              role="img"
              aria-labelledby="icon-location_2-title"
              className="h-4 w-4 mr-1"
            >
              <title id="icon-location_2-title">icon-location_2</title>
              <use href="#icon-location_2" />
            </svg>
            Share location
          </button>
          to view jobs near you
        </div>
        <section className="mx-auto m-0 max-w-260 p-0 no-underline">
          <h3 className="m-0 mx-6 mt-10 text-normal mb-2 qa-total-jobs js-total-jobs">
            All 0 jobs
          </h3>
          <ul className="border-solid border-light-gray list-none border-t-1 m-0 mx-6 p-0 js-search-results__list"></ul>
        </section>
        <div className="flex m-4 min-h-10 items-center justify-center">
          <button className="hidden btn btn-black p-0 py-1 px-8 text-sm w-36 h-8 hover:not-disabled:bg-secondary transition ease-in duration-300 js-search-results__show-more-button">
            <span className="c-search-results__show-more-label qa-show-more-button">
              Show More
            </span>
            <span className="c-search-results__loading-spinner" />
          </button>
        </div>
        <footer className="js-footer footer-shadow">
          <div className="max-w-1600px">
            <div className="flex w-full mb-10 justify-between items-start flex-col lg:flex-row lg:justify-center">
              <a
                href="https://www.seasoned.co"
                aria-current="page"
                className="h-15 mb-10 max-h-15 max-w-full min-w-15 flex h-auto"
              >
                <img
                  src="https://static.seasoned.co/images/Seasoned.svg"
                  alt="Seasoned icon"
                  className="lg:w-7/10"
                />
              </a>
              <div className="flex flex-col lg:w-1/2 justify-around sm:flex-row">
                <nav>
                  <h4>Products</h4>
                  <ul>
                    <li>
                      <a
                        aria-label="Find Jobs"
                        href="https://www.seasoned.co/jobs"
                      >
                        Find a Restaurant Job
                      </a>
                    </li>
                    <li>
                      <a
                        aria-label="Get Connected"
                        href="https://www.seasoned.co/community.html"
                      >
                        Discover the Community
                      </a>
                    </li>
                    <li>
                      <a
                        aria-label="Be Successful"
                        href="https://www.seasoned.co/hiring-features.html"
                      >
                        Hiring with Recruit
                      </a>
                    </li>
                  </ul>
                </nav>
                <nav>
                  <h4>Company</h4>
                  <ul>
                    <li>
                      <a
                        aria-label="About us"
                        href="https://www.seasoned.co/about.html"
                      >
                        About Us
                      </a>
                    </li>
                    <li>
                      <a aria-label="Press" href="https://news.seasoned.co">
                        News &amp; Press
                      </a>
                    </li>
                  </ul>
                </nav>
                <nav>
                  <h4>Resources</h4>
                  <ul>
                    <li>
                      <a
                        aria-label="Support"
                        href="https://support.seasoned.co"
                        target="_blank"
                        rel="noopener"
                      >
                        Support
                      </a>
                    </li>
                    <li>
                      <a
                        aria-label="Privacy Policy"
                        href="https://www.seasoned.co/privacypolicy.html"
                      >
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a
                        aria-label="Terms of Service"
                        href="https://www.seasoned.co/termsofservice.html"
                      >
                        Terms of Use
                      </a>
                    </li>
                    <li>
                      <a
                        aria-label="Community Guidelines"
                        href="https://www.seasoned.co/communityguidelines.html"
                      >
                        Community Guidelines
                      </a>
                    </li>
                    <li>
                      <a
                        aria-label="Site Map"
                        href="https://www.seasoned.co/restaurant-jobs/"
                        target="_blank"
                        rel="noopener"
                      >
                        Site Map
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
              <div className="social">
                <a
                  rel="noopener"
                  href="https://www.facebook.com/beseasoned/"
                  target="_blank"
                  className="social-block w-inline-block"
                >
                  <img
                    src="https://static.seasoned.co/images/facebook.svg"
                    loading="lazy"
                    alt="Facebook logo"
                  />
                </a>
                <a
                  rel="noopener"
                  href="https://www.instagram.com/seasoned_community/"
                  target="_blank"
                  className="social-block w-inline-block"
                >
                  <img
                    src="https://static.seasoned.co/images/instagram.svg"
                    loading="lazy"
                    alt="Instagram logo"
                  />
                </a>
                <a
                  rel="noopener"
                  href="https://twitter.com/beseasoned/"
                  target="_blank"
                  className="social-block w-inline-block"
                >
                  <img
                    src="https://static.seasoned.co/images/twitter.svg"
                    loading="lazy"
                    alt="Twitter logo"
                  />
                </a>
              </div>
            </div>
            <div className="text-xs lg:text-center">
              Copyright © 2020-2026 JobGet Inc. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default FindANewJob;
