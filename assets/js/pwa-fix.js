/**
 * Fix Chirpy PWA update toast — 点击"更新"按钮后正确消失
 */
(function() {
  'use strict';
  
  // 使用 MutationObserver 等待 toast 渲染
  function fixUpdateButton() {
    var notification = document.getElementById('notification');
    if (!notification) {
      setTimeout(fixUpdateButton, 200);
      return;
    }
    
    var updateBtn = notification.querySelector('.toast-body > button');
    if (!updateBtn) {
      setTimeout(fixUpdateButton, 200);
      return;
    }
    
    // 确保 toast 实例存在
    if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
      var toastInstance = bootstrap.Toast.getOrCreateInstance(notification);
      
      // 覆盖更新按钮的行为
      updateBtn.addEventListener('click', function() {
        // 立即隐藏 toast
        toastInstance.hide();
        
        // 如果有 waiting service worker，通知它跳过等待
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
          navigator.serviceWorker.ready.then(function(registration) {
            if (registration.waiting) {
              registration.waiting.postMessage('SKIP_WAITING');
            }
          });
        }
      });
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixUpdateButton);
  } else {
    fixUpdateButton();
  }
})();
