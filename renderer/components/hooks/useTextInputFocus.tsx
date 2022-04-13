import { useRef } from "react";
const useTextInputFocus = () => {
  const inputRef = useRef(null);
  const setInputFocus = () => {
    inputRef.current && inputRef.current.focus();
  };

  return { inputRef, setInputFocus };
};
export default useTextInputFocus;
