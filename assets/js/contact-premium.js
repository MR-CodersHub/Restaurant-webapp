// Copy to Clipboard Functionality
function copyToClipboard(text) {
  // Create a temporary textarea element
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  
  // Select and copy the text
  textarea.select();
  textarea.setSelectionRange(0, 99999); // For mobile devices
  
  try {
    document.execCommand('copy');
    
    // Show success feedback
    showCopyFeedback('Copied!');
  } catch (err) {
    console.error('Failed to copy:', err);
    showCopyFeedback('Failed to copy');
  }
  
  // Remove the temporary element
  document.body.removeChild(textarea);
}

// Show copy feedback toast
function showCopyFeedback(message) {
  // Remove existing toast if any
  const existingToast = document.querySelector('.copy-toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = 'copy-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: linear-gradient(135deg, var(--auburn), var(--dark-garnet));
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-family: var(--font-ui);
    font-size: 0.9rem;
    font-weight: 600;
    box-shadow: 0 4px 20px rgba(148, 27, 12, 0.4);
    z-index: 10000;
    animation: slideInUp 0.3s ease, slideOutDown 0.3s ease 2s forwards;
  `;
  
  document.body.appendChild(toast);
  
  // Remove toast after 2.3 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.remove();
    }
  }, 2300);
}

// Add CSS animations for toast
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInUp {
    from {
      transform: translateY(100px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutDown {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(100px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
