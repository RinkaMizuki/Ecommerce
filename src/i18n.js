import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Mảng các ngôn ngữ và các chuỗi tương ứng
const resources = {
  en: {
    translation: {
      "language": "English",
      "top-header-title": "Summer Sale For All Laptop Gaming And Free Express Delivery - OFF 50%!",
      "shop-now": "Shop Now",
      "home": "Home",
      "contact": "Contact",
      "about": "About",
      "search-placeholder": "What are you looking for?",
      "today": "Today",
    }
  },
  vi: {
    translation: {
      "language": "Tiếng việt",
      "top-header-title": "Giảm giá mùa hè cho tất cả máy tính xách tay chơi game và giao hàng nhanh miễn phí - Khuyến mãi 50%!",
      "shop-now": "Mua sắm ngay",
      "home": "Trang chủ",
      "contact": "Liên hệ",
      "about": "Về chúng tôi",
      "search-placeholder": "Bạn đang tìm gì vậy?",
      "today": "Hôm nay",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // Ngôn ngữ mặc định
    interpolation: {
      escapeValue: false // không escape các giá trị
    }
  });

export default i18n;
