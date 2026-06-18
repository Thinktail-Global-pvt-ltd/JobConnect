import Footer from "./Footer";
import Header from "./Header";

const Home = () => {
  return (
    <div>
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta
        name="google-site-verification"
        content="EUkZ851B022HFRcIJ3mT6MwjNE9-t8UaK9ovCmNeDu4"
      />
      <meta name="fragment" content="!" />
      {/*  <meta name="apple-itunes-app" content="app-id=1267314777">  */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700&display=swap"
        rel="stylesheet"
      />{" "}
      {/*  preload is not needed as we have dns-prefetch above  */}
      {/*  Global site tag (gtag.js) - Google Analytics  */}
      <style
        dangerouslySetInnerHTML={{
          __html:
            '\nhtml, body {\n\toverflow-x: hidden;\n }\nbody {\n\t-webkit-font-smoothing: antialiased;\n  -moz-font-smoothing: antialiased;\n  -o-font-smoothing: antialiased;\n}\n .text-stroke {\n    -webkit-text-stroke: 2px #d9dbdc; \n  }\n@media screen and (max-width: 1100px){\n.w-nav[data-collapse="medium"] .w-nav-menu, .w-nav[data-collapse="medium"] .recruit-actions {\n    display: none;\n    }\n .w-nav[data-collapse="medium"] .w-nav-button {\n    display: block;\n     }\n  }\n .w-container {\n   max-width: 1100px;\n  }\n',
        }}
      />
      <style
        dangerouslySetInnerHTML={{
          __html:
            "\n@media (min-width: 992px) and (max-width: 1200px) {\n  .heroimgcontainer {\n  \tright: -3%;\n  }\n  .recruithero1 {\n  \tright: 3vw;\n  }\n}\n",
        }}
      />
    <Header/>
      <div className="hero home-page">
        <div className="content-wrapper">
          <div className="content-block hero-content">
            <h1 className="hero-title-light">
              <strong>Making life easier for the service industry.</strong>
            </h1>
            <h2 className="subtitle-light">
              Better jobs, better hires, and the only community exclusively for
              the service industry in your city.
            </h2>
            <div className="qr-block">
              <div className="qr-text">Scan to get the app 👉</div>
              <img
                src="https://static.seasoned.co/images/s-member-qr.png"
                loading="lazy"
                width={565}
                sizes="(max-width: 991px) 100vw, 70px"
                alt="QR code to install the Seasoned Member App."
                srcSet="https://static.seasoned.co/images/s-member-qr-p-500.png 500w, https://static.seasoned.co/images/s-member-qr-p-800.png 800w, https://static.seasoned.co/images/s-member-qr-p-1080.png 1080w, https://static.seasoned.co/images/s-member-qr.png 1130w"
                className="qr-image"
              />
            </div>
            <a
              href="https://getseasoned.onelink.me/Mfy7/homepg"
              className="button-primary member-btn w-button"
            >
              Get the Seasoned app
            </a>
            <div className="app-store-logos">
              <img
                src="https://static.seasoned.co/images/Apple.svg"
                loading="lazy"
                alt="Apple logo"
                className="app-store-icon"
              />
              <img
                src="https://static.seasoned.co/images/Google.svg"
                loading="lazy"
                alt="Google Play Store logo"
                className="app-store-icon"
              />
            </div>
          </div>
          <div className="hero-img">
            <img
              src="https://static.seasoned.co/images/admin_recruit.png"
              loading="lazy"
              alt="Candidates tab in the Seasoned Recruit app"
              width={261}
              className="image-17"
            />
            <img
              src="https://static.seasoned.co/images/member_jobs.png"
              loading="lazy"
              alt="Jobs tab in the Seasoned app"
              width={384}
              className="image-18 img_shadow"
            />
            <div className="icon-group">
              <img
                src="https://static.seasoned.co/images/iconGroup.png"
                loading="lazy"
                alt
                width={818}
                className="image-14"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="community-home">
        <div className="content-wrapper community-home">
          <div className="content-img">
            <img
              src="https://static.seasoned.co/images/jobs2x.png"
              loading="lazy"
              width={376}
              alt="Product mock showing two jobs"
              className="img-card"
            />
            <img
              src="https://static.seasoned.co/images/PostCard2x.png"
              loading="lazy"
              width={375}
              alt="Image of a post from the Seasoned community."
              className="image-16"
            />
          </div>
          <div className="content-block">
            <div className="section-label text-light">
              Seasoned Community App
            </div>
            <h2 className="section-title-dark">
              <strong className="bold-text-10">
                Local jobs and community, just for the service industry.
              </strong>
            </h2>
            <h3 className="subtitle-dark">
              The Seasoned App is where you find a job search as fast as you,
              get advice from people that get it, and grow your industry family.
            </h3>
            <div className="qr-block">
              <div className="qr-text text-dartk">Scan to get the app 👉</div>
              <img
                src="https://static.seasoned.co/images/s-member-qr.png"
                loading="lazy"
                width={565}
                sizes="(max-width: 991px) 100vw, 70px"
                alt="QR code to install the Seasoned Member App."
                srcSet="https://static.seasoned.co/images/s-member-qr-p-500.png 500w, https://static.seasoned.co/images/s-member-qr-p-800.png 800w, https://static.seasoned.co/images/s-member-qr-p-1080.png 1080w, https://static.seasoned.co/images/s-member-qr.png 1130w"
                className="qr-image"
              />
            </div>
            <a
              href="https://getseasoned.onelink.me/Mfy7/homepg"
              className="button-primary member-btn w-button"
            >
              Get the Seasoned app
            </a>
            <div className="member-quote-block">
              <h3 className="subtitle-dark">
                “I came here and within 5 min had an interview and in less than
                24hrs a new job.”
              </h3>
              <p>
                <strong>—Jarrad B</strong>.<br />
                Seasoned Member
              </p>
            </div>
          </div>
        </div>
        <div className="div-block-4" />
      </div>
      <div className="recruit">
        <div className="content-wrapper home-recruit">
          <div className="content-block home-recruit-content">
            <div className="section-label">Seasoned Recruit App</div>
            <h2 className="section-title-dark recruit-section">
              <strong>Hire on the fly with the Recruit App.</strong>
            </h2>
            <h3 className="subtitle-dark home-recuit-sub">
              Unlock an entire community of industry-only candidates, turn
              applicants into interviews in one tap, and hire in as little as 24
              hours for half the cost.
            </h3>
            <a
              href="hiring-features.html"
              className="button-primary-recruit w-button"
            >
              More about hiring
            </a>
          </div>
        </div>
      </div>
      <div className="section">
        <div className="content-wrapper recruit-img-group">
          <div className="recruit-img-block">
            <div className="recruit-img-container first-img">
              <h3 className="center-img-title">
                Industry-only candidates, just for you.
              </h3>
              <img
                src="https://static.seasoned.co/images/recruit_1.png"
                loading="lazy"
                width={375}
                alt="Image of Candidates view from Recruit App"
                className="img-shadow"
              />
            </div>
            <div className="recruit-img-container second-img">
              <h3 className="center-img-title">
                Turn applicants into interviews in one tap.
              </h3>
              <img
                src="https://static.seasoned.co/images/recruit_2.png"
                loading="lazy"
                width={375}
                alt="Image of applicant card from Recruit App"
                className="img-shadow"
              />
            </div>
            <div className="recruit-img-container third-img">
              <h3 className="center-img-title">
                Hire in as little as 24 hours, for half the cost.
              </h3>
              <img
                src="https://static.seasoned.co/images/recruit_3.png"
                loading="lazy"
                width={375}
                alt="Image of post interview candidate view from Recruit App"
                className="img-shadow"
              />
            </div>
          </div>
          <div className="recruit-applicant-carousel">
            <img
              src="https://static.seasoned.co/images/Applicant_Card.png"
              loading="lazy"
              width={335}
              alt="Applicant card"
              className="recriut-carousel-img img_shadow"
            />
            <img
              src="https://static.seasoned.co/images/Applicant_Card2.png"
              loading="lazy"
              width={335}
              alt="Applicant card"
              className="recriut-carousel-img img_shadow"
            />
            <img
              src="https://static.seasoned.co/images/img_applicant32x.png"
              loading="lazy"
              width={335}
              alt="Pic of applicant card."
              className="recriut-carousel-img"
            />
          </div>
          <div className="recruit-quote-block">
            <h3 className="subtitle-dark">
              “I can make hires while brushing my teeth.”
            </h3>
            <p>
              <strong>—Steve</strong>
              <br />
              General Manager
            </p>
          </div>
        </div>
        <div className="gradient-bg-right" />
      </div>
      <div className="brands">
        <div className="brands-container">
          <h2 className="section-title-dark centered">
            A sampling of brands we work with:
          </h2>
          <div className="brand-logo-wrapper">
            <div className="brand-logos">
              <div
                id="w-node-_2606d6fb-95ef-929e-b813-07c9d6a9b6e2-57c4ff7a"
                className="brand-wrapper"
              >
                <img
                  src="https://static.seasoned.co/images/img_brand_11x.png"
                  loading="lazy"
                  alt="McDonald's logo"
                  className="brandimg"
                />
              </div>
              <div className="brand-wrapper">
                <img
                  src="https://static.seasoned.co/images/img_brand_21x.png"
                  loading="lazy"
                  alt="Schlotzsky's logo"
                  className="brandimg"
                />
              </div>
              <div className="brand-wrapper">
                <img
                  src="https://static.seasoned.co/images/img_brand_mainevent.png"
                  loading="lazy"
                  sizes="(max-width: 479px) 26vw, (max-width: 767px) 100vw, (max-width: 991px) 20px, 100vw"
                  srcSet="https://static.seasoned.co/images/img_brand_mainevent-p-500.png 500w, https://static.seasoned.co/images/img_brand_mainevent.png 512w"
                  alt
                  className="brandimg"
                />
              </div>
              <div className="brand-wrapper">
                <img
                  src="https://static.seasoned.co/images/img_brand_31x.png"
                  loading="lazy"
                  alt="Customer logo for P.F. Chang's"
                  className="brandimg"
                />
              </div>
              <div className="brand-wrapper">
                <img
                  src="https://static.seasoned.co/images/img_brand_41x.png"
                  loading="lazy"
                  alt="Firehouse Subs logo"
                  className="brandimg"
                />
              </div>
              <div className="brand-wrapper">
                <img
                  src="https://static.seasoned.co/images/img_brand_51x.png"
                  loading="lazy"
                  alt="Wingstop logo"
                  className="brandimg"
                />
              </div>
              <div className="brand-wrapper">
                <img
                  src="https://static.seasoned.co/images/img_brand_61x.png"
                  loading="lazy"
                  alt="Oh My BBQ logo"
                  className="brandimg"
                />
              </div>
              <div className="brand-wrapper">
                <img
                  src="https://static.seasoned.co/images/img_brand_71x.png"
                  loading="lazy"
                  alt="The Rustic logo"
                  className="brandimg"
                />
              </div>
              <div className="brand-wrapper">
                <img
                  src="https://static.seasoned.co/images/img_brand_81x.png"
                  loading="lazy"
                  alt="Panda Express logo"
                  className="brandimg"
                />
              </div>
              <div className="brand-wrapper">
                <img
                  src="https://static.seasoned.co/images/img_brand_91x.png"
                  loading="lazy"
                  alt="Taco Bell logo"
                  className="brandimg"
                />
              </div>
              <div className="brand-wrapper">
                <img
                  src="https://static.seasoned.co/images/img_brand_101x.png"
                  loading="lazy"
                  alt="HG Supply logo"
                  className="brandimg"
                />
              </div>
              <div className="brand-wrapper">
                <img
                  src="https://static.seasoned.co/images/img_brand_db.png"
                  loading="lazy"
                  sizes="(max-width: 479px) 26vw, (max-width: 767px) 100vw, (max-width: 991px) 20px, 100vw"
                  srcSet="https://static.seasoned.co/images/img_brand_db-p-500.png 500w, https://static.seasoned.co/images/img_brand_db.png 512w"
                  alt
                  className="brandimg"
                />
              </div>
              <div className="brand-wrapper">
                <img
                  src="https://static.seasoned.co/images/img_brand_121x.png"
                  loading="lazy"
                  alt="Golden Chick logo"
                  className="brandimg"
                />
              </div>
              <div className="brand-wrapper">
                <img
                  src="https://static.seasoned.co/images/img_brand_141x.png"
                  loading="lazy"
                  alt="Saltgrass logo"
                  className="brandimg"
                />
              </div>
              <div className="brand-wrapper">
                <img
                  src="https://static.seasoned.co/images/img_brand_401x.png"
                  loading="lazy"
                  sizes="(max-width: 479px) 26vw, (max-width: 767px) 100vw, (max-width: 991px) 20px, 100vw"
                  srcSet="https://static.seasoned.co/images/img_brand_401x-p-500.png 500w, https://static.seasoned.co/images/img_brand_401x.png 512w"
                  alt="Ihop logo"
                  className="brandimg"
                />
              </div>
              <div className="brand-wrapper">
                <img
                  src="https://static.seasoned.co/images/img_brand_371x.png"
                  loading="lazy"
                  sizes="(max-width: 479px) 26vw, (max-width: 767px) 100vw, (max-width: 991px) 20px, 100vw"
                  srcSet="https://static.seasoned.co/images/img_brand_371x-p-500.png 500w, https://static.seasoned.co/images/img_brand_371x.png 512w"
                  alt="Cheddar's logo"
                  className="brandimg"
                />
              </div>
              <div className="brand-wrapper">
                <img
                  src="https://static.seasoned.co/images/img_brand_351x.png"
                  loading="lazy"
                  sizes="(max-width: 479px) 26vw, (max-width: 767px) 100vw, (max-width: 991px) 20px, 100vw"
                  srcSet="https://static.seasoned.co/images/img_brand_351x-p-500.png 500w, https://static.seasoned.co/images/img_brand_351x.png 512w"
                  alt="Pizza Hut logo"
                  className="brandimg"
                />
              </div>
              <div className="brand-wrapper">
                <img
                  src="https://static.seasoned.co/images/img_brand_391x.png"
                  loading="lazy"
                  sizes="(max-width: 479px) 26vw, (max-width: 767px) 100vw, (max-width: 991px) 20px, 100vw"
                  srcSet="https://static.seasoned.co/images/img_brand_391x-p-500.png 500w, https://static.seasoned.co/images/img_brand_391x.png 512w"
                  alt="Rising Roll logo"
                  className="brandimg"
                />
              </div>
              <div className="brand-wrapper">
                <img
                  src="https://static.seasoned.co/images/img_brand_321x.png"
                  loading="lazy"
                  sizes="(max-width: 479px) 26vw, (max-width: 767px) 100vw, (max-width: 991px) 20px, 100vw"
                  srcSet="https://static.seasoned.co/images/img_brand_321x-p-500.png 500w, https://static.seasoned.co/images/img_brand_321x.png 512w"
                  alt="Lada logo"
                  className="brandimg"
                />
              </div>
              <div className="brand-wrapper">
                <img
                  src="https://static.seasoned.co/images/img_brand_171x.png"
                  loading="lazy"
                  sizes="(max-width: 479px) 26vw, (max-width: 767px) 100vw, (max-width: 991px) 20px, 100vw"
                  srcSet="https://static.seasoned.co/images/img_brand_171x-p-500.png 500w, https://static.seasoned.co/images/img_brand_171x.png 512w"
                  alt="Customer logo for P.F. Chang's"
                  className="brandimg"
                />
              </div>
              <div className="brand-wrapper">
                <img
                  src="https://static.seasoned.co/images/img_brand_311x.png"
                  loading="lazy"
                  sizes="(max-width: 479px) 26vw, (max-width: 767px) 100vw, (max-width: 991px) 20px, 100vw"
                  srcSet="https://static.seasoned.co/images/img_brand_311x-p-500.png 500w, https://static.seasoned.co/images/img_brand_311x.png 512w"
                  alt="Uncle Julio's logo"
                  className="brandimg"
                />
              </div>
              <div className="brand-wrapper">
                <img
                  src="https://static.seasoned.co/images/img_brand_291x.png"
                  loading="lazy"
                  sizes="(max-width: 479px) 26vw, (max-width: 767px) 100vw, (max-width: 991px) 20px, 100vw"
                  srcSet="https://static.seasoned.co/images/img_brand_291x-p-500.png 500w, https://static.seasoned.co/images/img_brand_291x.png 512w"
                  alt="Chipotle logo"
                  className="brandimg"
                />
              </div>
              <div className="brand-wrapper">
                <img
                  src="https://static.seasoned.co/images/img_brand_301x.png"
                  loading="lazy"
                  sizes="(max-width: 479px) 26vw, (max-width: 767px) 100vw, (max-width: 991px) 20px, 100vw"
                  srcSet="https://static.seasoned.co/images/img_brand_301x-p-500.png 500w, https://static.seasoned.co/images/img_brand_301x.png 512w"
                  alt="Sky Blossom logo"
                  className="brandimg"
                />
              </div>
              <div className="brand-wrapper">
                <img
                  src="https://static.seasoned.co/images/img_brand_281x.png"
                  loading="lazy"
                  sizes="(max-width: 479px) 26vw, (max-width: 767px) 100vw, (max-width: 991px) 20px, 100vw"
                  srcSet="https://static.seasoned.co/images/img_brand_281x-p-500.png 500w, https://static.seasoned.co/images/img_brand_281x.png 512w"
                  alt="Itso Vegan logo"
                  className="brandimg"
                />
              </div>
              <div className="brand-wrapper">
                <img
                  src="https://static.seasoned.co/images/img_brand_271x.png"
                  loading="lazy"
                  sizes="(max-width: 479px) 26vw, (max-width: 767px) 100vw, (max-width: 991px) 20px, 100vw"
                  srcSet="https://static.seasoned.co/images/img_brand_271x-p-500.png 500w, https://static.seasoned.co/images/img_brand_271x.png 512w"
                  alt="Paris 7th logo"
                  className="brandimg"
                />
              </div>
              <div className="brand-wrapper">
                <img
                  src="https://static.seasoned.co/images/img_brand_361x.png"
                  loading="lazy"
                  sizes="(max-width: 479px) 26vw, (max-width: 767px) 100vw, (max-width: 991px) 20px, 100vw"
                  srcSet="https://static.seasoned.co/images/img_brand_361x-p-500.png 500w, https://static.seasoned.co/images/img_brand_361x.png 512w"
                  alt="Captain D's logo"
                  className="brandimg"
                />
              </div>
              <div className="brand-wrapper">
                <img
                  src="https://static.seasoned.co/images/img_brand_261x.png"
                  loading="lazy"
                  sizes="(max-width: 479px) 26vw, (max-width: 767px) 100vw, (max-width: 991px) 20px, 100vw"
                  srcSet="https://static.seasoned.co/images/img_brand_261x-p-500.png 500w, https://static.seasoned.co/images/img_brand_261x.png 512w"
                  alt="Edohana logo"
                  className="brandimg"
                />
              </div>
              <div className="brand-wrapper">
                <img
                  src="https://static.seasoned.co/images/img_brand_201x.png"
                  loading="lazy"
                  sizes="(max-width: 479px) 26vw, (max-width: 767px) 100vw, (max-width: 991px) 20px, 100vw"
                  srcSet="https://static.seasoned.co/images/img_brand_201x-p-500.png 500w, https://static.seasoned.co/images/img_brand_201x.png 512w"
                  alt="Jersey Mikes logo"
                  className="brandimg"
                />
              </div>
              <div className="brand-wrapper">
                <img
                  src="https://static.seasoned.co/images/img_brand_241x.png"
                  loading="lazy"
                  sizes="(max-width: 479px) 26vw, (max-width: 767px) 100vw, (max-width: 991px) 20px, 100vw"
                  srcSet="https://static.seasoned.co/images/img_brand_241x-p-500.png 500w, https://static.seasoned.co/images/img_brand_241x.png 512w"
                  alt="Lo-Lo's logo"
                  className="brandimg"
                />
              </div>
              <div className="brand-wrapper">
                <img
                  src="https://static.seasoned.co/images/img_brand_251x.png"
                  loading="lazy"
                  sizes="(max-width: 479px) 26vw, (max-width: 767px) 100vw, (max-width: 991px) 20px, 100vw"
                  srcSet="https://static.seasoned.co/images/img_brand_251x-p-500.png 500w, https://static.seasoned.co/images/img_brand_251x.png 512w"
                  alt="The Catch logo"
                  className="brandimg"
                />
              </div>
              <div className="brand-wrapper">
                <img
                  src="https://static.seasoned.co/images/img_brand_231x.png"
                  loading="lazy"
                  sizes="(max-width: 479px) 26vw, (max-width: 767px) 100vw, (max-width: 991px) 20px, 100vw"
                  srcSet="https://static.seasoned.co/images/img_brand_231x-p-500.png 500w, https://static.seasoned.co/images/img_brand_231x.png 512w"
                  alt="Little Cesars logo"
                  className="brandimg"
                />
              </div>
              <div className="brand-wrapper">
                <img
                  src="https://static.seasoned.co/images/img_brand_211x.png"
                  loading="lazy"
                  sizes="(max-width: 479px) 26vw, (max-width: 767px) 100vw, (max-width: 991px) 20px, 100vw"
                  srcSet="https://static.seasoned.co/images/img_brand_211x-p-500.png 500w, https://static.seasoned.co/images/img_brand_211x.png 512w"
                  alt="Southern Eats logo"
                  className="brandimg"
                />
              </div>
              <div className="brand-wrapper">
                <img
                  src="https://static.seasoned.co/images/img_brand_221x.png"
                  loading="lazy"
                  sizes="(max-width: 479px) 26vw, (max-width: 767px) 100vw, (max-width: 991px) 20px, 100vw"
                  srcSet="https://static.seasoned.co/images/img_brand_221x-p-500.png 500w, https://static.seasoned.co/images/img_brand_221x.png 512w"
                  alt="Moxie's logo"
                  className="brandimg"
                />
              </div>
              <div className="brand-wrapper">
                <img
                  src="https://static.seasoned.co/images/img_brand_331x.png"
                  loading="lazy"
                  sizes="(max-width: 479px) 26vw, (max-width: 767px) 100vw, (max-width: 991px) 20px, 100vw"
                  srcSet="https://static.seasoned.co/images/img_brand_331x-p-500.png 500w, https://static.seasoned.co/images/img_brand_331x.png 512w"
                  alt="The Ginger Man logo"
                  className="brandimg"
                />
              </div>
              <div className="brand-wrapper">
                <img
                  src="https://static.seasoned.co/images/img_brand_191x.png"
                  loading="lazy"
                  sizes="(max-width: 479px) 26vw, (max-width: 767px) 100vw, (max-width: 991px) 20px, 100vw"
                  srcSet="https://static.seasoned.co/images/img_brand_191x-p-500.png 500w, https://static.seasoned.co/images/img_brand_191x.png 512w"
                  alt="Primo's logo"
                  className="brandimg"
                />
              </div>
              <div className="brand-wrapper">
                <img
                  src="https://static.seasoned.co/images/img_brand_181x.png"
                  loading="lazy"
                  sizes="(max-width: 479px) 26vw, (max-width: 767px) 100vw, (max-width: 991px) 20px, 100vw"
                  srcSet="https://static.seasoned.co/images/img_brand_181x-p-500.png 500w, https://static.seasoned.co/images/img_brand_181x.png 512w"
                  alt="BJ's Brewhouse"
                  className="brandimg"
                />
              </div>
              <div className="brand-wrapper">
                <img
                  src="https://static.seasoned.co/images/img_brand_341x.png"
                  loading="lazy"
                  sizes="(max-width: 479px) 26vw, (max-width: 767px) 100vw, (max-width: 991px) 20px, 100vw"
                  srcSet="https://static.seasoned.co/images/img_brand_341x-p-500.png 500w, https://static.seasoned.co/images/img_brand_341x.png 512w"
                  alt="Olive Burger logo"
                  className="brandimg"
                />
              </div>
              <div className="brand-wrapper">
                <img
                  src="https://static.seasoned.co/images/img_brand_161x.png"
                  loading="lazy"
                  sizes="(max-width: 479px) 26vw, (max-width: 767px) 100vw, (max-width: 991px) 20px, 100vw"
                  srcSet="https://static.seasoned.co/images/img_brand_161x-p-500.png 500w, https://static.seasoned.co/images/img_brand_161x.png 512w"
                  alt="Papa Johns logo"
                  className="brandimg"
                />
              </div>
            </div>
          </div>
          <a
            href="get-started.html"
            className="button-primary-recruit showhide w-button"
          >
            Start hiring now
          </a>
        </div>
      </div>
    <Footer/>
    </div>
  );
};

export default Home;
