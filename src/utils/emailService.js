import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const NEWSLETTER_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_NEWSLETTER_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const sendContactEmail = async (formData) => {
  try {
    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_name: 'Restyle Support',
      },
      PUBLIC_KEY
    );
    return { success: true, message: 'Email sent successfully!' };
  } catch (error) {
    console.error('EmailJS error:', error);
    return { success: false, message: 'Failed to send email. Please try again.' };
  }
};

export const sendNewsletterSignup = async (email) => {
  try {
    const result = await emailjs.send(
      SERVICE_ID,
      NEWSLETTER_TEMPLATE_ID,
      {
        user_email: email,
        signup_date: new Date().toLocaleDateString(),
      },
      PUBLIC_KEY
    );
    return { success: true, message: 'Successfully subscribed!' };
  } catch (error) {
    return { success: false, message: 'Subscription failed.' };
  }
};