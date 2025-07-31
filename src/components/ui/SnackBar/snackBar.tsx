import { useEffect, useState } from "react";
import s from "./snackBar.module.scss";
import { Button } from "../Button/button";

interface SnackBar {
  children: string;
}

export const SnackBar: React.FC<SnackBar> = ({ children }) => {
  const [isHide, setIsHide] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setIsHide((prev) => !prev);
    }, 5000);
  }, []);

  const handleCloseSnackBar = () => {
    setIsHide((prev) => !prev);
  }

  return (
    <div className={`${s.snackBarContainer} ${isHide ? s.close : ''}`}>
      {children}
      <Button onClick={handleCloseSnackBar} className={s.snackBarCloseBtn}>
        X
      </Button>
    </div>
  );
};
