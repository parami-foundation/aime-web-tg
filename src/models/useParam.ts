import { charactersData } from "@/mocks/character";
import { useModel, history } from "@umijs/max";
import { useEffect } from "react";

export default () => {
  const { setRefer } = useModel("useAccess");
  const { setAddress, setSignature } = useModel("useWallet");
  const { setCharacter } = useModel("useSetting");
  const { setReconnect } = useModel("useChat");
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
      if (key === "refer" && !!value) {
        setRefer(value);
      }
      if (key === "reconnect" && !!value) {
        setReconnect(true);
      }
    });
  }, [miniAppParams, miniAppParams?.initData?.startParam]);
};
