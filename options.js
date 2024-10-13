document.addEventListener("DOMContentLoaded", function () {
  const showIcon = document.getElementById("showIcon");
  const qrSize = document.getElementById("qrSize");
  const qrSizeValue = document.getElementById("qrSizeValue");
  const saveButton = document.getElementById("save");

  // 加载保存的设置
  chrome.storage.sync.get(["showIcon", "qrSize"], function (result) {
    showIcon.checked = result.showIcon !== false;
    qrSize.value = result.qrSize || 128;
    qrSizeValue.textContent = qrSize.value;
  });

  // 更新大小显示
  qrSize.addEventListener("input", function () {
    qrSizeValue.textContent = qrSize.value;
  });

  // 保存设置
  saveButton.addEventListener("click", function () {
    chrome.storage.sync.set(
      {
        showIcon: showIcon.checked,
        qrSize: parseInt(qrSize.value),
      },
      function () {
        alert("设置已保存");
      }
    );
  });
});
