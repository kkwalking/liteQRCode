let currentUrl;
let faviconUrl;

document.addEventListener("DOMContentLoaded", function () {
  const showIconCheckbox = document.getElementById("showIcon");
  const qrSizeSlider = document.getElementById("qrSize");
  const qrSizeValue = document.getElementById("qrSizeValue");

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    currentUrl = tabs[0].url;
    faviconUrl = tabs[0].favIconUrl;

    chrome.storage.sync.get(["showIcon", "qrSize"], function (result) {
      const showIcon = result.showIcon !== false;
      const qrSize = result.qrSize || 160;

      showIconCheckbox.checked = showIcon;
      qrSizeSlider.value = qrSize;
      qrSizeValue.textContent = qrSize;

      createQRCode(currentUrl, qrSize, faviconUrl);
      adjustPopupSize(qrSize);
    });
  });

  showIconCheckbox.addEventListener("change", function () {
    chrome.storage.sync.set({ showIcon: this.checked });
    updateContentScript();
  });

  qrSizeSlider.addEventListener("input", function () {
    const size = parseInt(this.value);
    qrSizeValue.textContent = size;
    chrome.storage.sync.set({ qrSize: size });
    createQRCode(currentUrl, size, faviconUrl);
    adjustPopupSize(size);
  });
});

function createQRCode(url, size, faviconUrl) {
  const qrcodeElement = document.getElementById("qrcode");
  qrcodeElement.innerHTML = ""; // 清除之前的二维码

  // 创建 QR 码
  new QRCode(qrcodeElement, {
    text: url,
    width: size,
    height: size,
    correctLevel: QRCode.CorrectLevel.H,
  });

  // 添加网页图标
  if (faviconUrl) {
    const iconImg = document.createElement("img");
    iconImg.id = "page-icon";
    iconImg.src = faviconUrl;
    iconImg.style.position = "absolute";
    iconImg.style.top = "50%";
    iconImg.style.left = "50%";
    iconImg.style.transform = "translate(-50%, -50%)";
    iconImg.style.width = `${size * 0.2}px`; // 图标大小为二维码的 20%
    iconImg.style.height = `${size * 0.2}px`;
    iconImg.style.borderRadius = "50%";
    iconImg.style.backgroundColor = "white";
    iconImg.style.padding = "2px";

    // 创建一个包装器来容纳二维码和图标
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    wrapper.style.width = `${size}px`;
    wrapper.style.height = `${size}px`;

    qrcodeElement.appendChild(wrapper);
    wrapper.appendChild(qrcodeElement.querySelector("img")); // 移动二维码图片到包装器中
    wrapper.appendChild(iconImg);
  }
}

function adjustPopupSize(size) {
  // 设置 body 的宽度和高度，考虑到设置区域的高度
  document.body.style.height = size + 100 + "px";
}

function updateContentScript() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "updateSettings" });
  });
}
