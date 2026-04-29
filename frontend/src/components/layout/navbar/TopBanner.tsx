import bannerImg from "../../../assets/top-banner.png";
import "./TopBanner.css";

function TopBanner() {
  return (
    <section className="top-banner" aria-label="Top banner">
      <img className="top-banner-img" src={bannerImg} alt="" />
    </section>
  );
}

export default TopBanner;
