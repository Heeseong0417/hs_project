import { useState } from "react";

export interface CurreentClass {
  name: string;
  type: string;
  currentPath: string;
}

const useCurrentClass = ({
  name = "",
  type = "",
  currentPath = "/",
}: CurreentClass) => {
  const [isCurrentClass, setIsCurrentClass] = useState<CurreentClass>({
    name,
    type,
    currentPath,
  });

  return { isCurrentClass, setIsCurrentClass };
};
export default useCurrentClass;
