export const download = async (url) => {
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: {}
    });
    let buffer = await response.arrayBuffer();
    const _url = window.URL.createObjectURL(new Blob([buffer]));
    const link = document.createElement("a");
    link.href = _url;
    link.setAttribute("download", "nft_image.png"); //or any other extension
    document.body.appendChild(link);
    link.click();
    // alert("Your card has been downloaded to your download folder.");
  } catch(err) {
    alert (`Your card could not be downloaded. Please save it from ${url}.`);
    console.log(err);
  };
};