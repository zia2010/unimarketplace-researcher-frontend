export const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    script.onload = () => {
      if (window.Razorpay) {
        resolve(true);
      } else {
        reject(new Error('Razorpay SDK failed to load'));
      }
    };

    script.onerror = () => {
      reject(new Error('Failed to load Razorpay SDK'));
    };

    document.body.appendChild(script);
  });
};
