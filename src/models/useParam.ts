import { charactersData } from "@/mocks/character";
import { useModel, history } from "@umijs/max";
import { useEffect } from "react";

export default () => {
  const { setAddress, setSignature } = useModel("useAccess");
  const { setCharacter } = useModel("useSetting");
  const { miniAppParams } = useModel("useTelegram");

  useEffect(() => {
    if (!miniAppParams) return;
    miniAppParams?.initData?.startParam?.split("____")?.forEach((item) => {
      const [key, value] = item.split("__");
      if (key === "address" && !!value) {
        setAddress(value as `0x${string}`);
      }
      if (key === "signature" && !!value) {
        setSignature(value);
      }
      if (key === "characterId" && !!value) {
        setCharacter(charactersData.get(value) ?? {});
        history.push(`/chat/${value}`);
      }
    });
  }, [miniAppParams, miniAppParams?.initData?.startParam]);
};
