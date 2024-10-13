document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var currentUrl = tabs[0].url;
    new QRCode(document.getElementById("qrcode"), {
      text: currentUrl,
      width: 160,
      height: 160,
      correctLevel: QRCode.CorrectLevel.H,
    });
  });
});
