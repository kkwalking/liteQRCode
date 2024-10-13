let showIcon = true;
let qrSize = 128;

chrome.storage.sync.get(["showIcon", "qrSize"], function (result) {
  showIcon = result.showIcon !== false;
  updateQRCode();
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "updateSettings") {
    chrome.storage.sync.get(["showIcon", "qrSize"], function (result) {
      showIcon = result.showIcon !== false;
      updateQRCode();
    });
  }
});

function updateQRCode() {
  const existingContainer = document.getElementById("qr-code-container");
  if (existingContainer) {
    existingContainer.remove();
  }

  if (showIcon) {
    createQRCode();
  }
}

function createQRCode() {
  const url = window.location.href;
  const qrContainer = document.createElement("div");
  qrContainer.id = "qr-code-container";

  // 创建图标按钮
  const iconButton = document.createElement("div");
  iconButton.id = "qr-icon-button";
  iconButton.innerHTML = '<img src="' + getFavicon() + '" alt="QR Code">';
  qrContainer.appendChild(iconButton);

  // 创建 QR 码容器
  const qrCodeWrapper = document.createElement("div");
  qrCodeWrapper.id = "qr-code-wrapper";
  qrCodeWrapper.style.display = "none";
  qrContainer.appendChild(qrCodeWrapper);

  // 创建 QR 码
  const qrCodeElement = document.createElement("div");
  qrCodeElement.id = "qr-code";
  qrCodeWrapper.appendChild(qrCodeElement);

  const qrCode = new QRCode(qrCodeElement, {
    text: url,
    width: 128,
    height: 128,
  });

  // 添加网页图标
  const iconImg = document.createElement("img");
  iconImg.id = "page-icon";
  iconImg.src = getFavicon();
  qrCodeElement.appendChild(iconImg);

  document.body.appendChild(qrContainer);

  // 添加点击事件
  qrContainer.addEventListener("click", toggleQRCode);
}

function getFavicon() {
  const favicon = document.querySelector('link[rel*="icon"]');
  return favicon ? favicon.href : "/favicon.ico";
}

function toggleQRCode() {
  const qrContainer = document.getElementById("qr-code-container");
  const qrCodeWrapper = document.getElementById("qr-code-wrapper");
  const iconButton = document.getElementById("qr-icon-button");

  if (qrContainer.classList.contains("expanded")) {
    qrContainer.classList.remove("expanded");
    qrCodeWrapper.style.display = "none";
    iconButton.style.display = "flex";
  } else {
    qrContainer.classList.add("expanded");
    qrCodeWrapper.style.display = "block";
    iconButton.style.display = "none";
  }
}

updateQRCode();
