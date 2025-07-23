import loader from "../../../assets/icons/Loader.svg";
import s from "./loader.module.scss";

export const Loader = () => {
  return (
    <div className={s.loaderContainer}>
      <img src={loader} alt="loader" />
    </div>
  );
};
