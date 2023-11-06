export const DecodeWalletConnectUri = (uri: string) => {
  console.log("uri", uri);
  const decodedURI = decodeURIComponent(uri);

  let onlyURI = decodedURI.split("?uri=")[1].split("#")[0];

  if (onlyURI.includes("@1")) {
    const bridgeEncoded = onlyURI.substring(
      onlyURI.indexOf("?bridge=") + 1,
      onlyURI.lastIndexOf("&")
    );

    const bridge = decodeURIComponent(bridgeEncoded);

    onlyURI = onlyURI.replace(bridgeEncoded, bridge);
  }

  return onlyURI;
};
