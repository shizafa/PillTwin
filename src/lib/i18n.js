export const LANGUAGES = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "ur", label: "اردو", dir: "rtl" },
];

const STRINGS = {
  en: {
    tagline: "Find your medicine's twin.",

    scanHeading: "Scan your medicine box",
    fileHint: "Choose a photo from your computer, or take one with your phone camera.",
    removePhoto: "Remove photo",
    scanButton: "Scan medicine",
    scanning: "Reading your box…",
    scanWait: "This can take up to a minute. Please keep this page open.",

    or: "or",

    searchHeading: "Search by name",
    searchPlaceholder: "e.g. Panadol or Paracetamol",
    searchButton: "Search",
    searching: "Searching…",

    whatWeRead: "What we read from your box",
    yourMedicine: "Your medicine",
    sameSalt: "Same salt, same strength",
    noAlternatives:
      "We could not find any other medicine with the same salt and strength in our records.",
    priceNotAvailable: "Price not available",
    perUnit: "per unit",

    brand: "Brand",
    generic: "Generic",
    strength: "Strength",
    form: "Form",
    regNo: "Reg. No.",
    printedPrice: "Printed price",
    packSize: "Pack size",
    expiry: "Expiry",
    batch: "Batch",

    errTooShort: "Please type at least 2 characters.",
    errNoPhoto: "Please choose a photo of your medicine box first.",
    errNetwork: "Could not reach the server. Please check your connection.",
    errScan: "We could not read that photo. Please try a clearer picture.",
    errSearch: "Search failed. Please try again.",

    disclaimer: "Always ask your doctor or pharmacist before switching medicines.",
    dataNote: "Data from DRAP's provisional registry; may contain errors.",
  },

  ur: {
    tagline: "اپنی دوا کا جُڑواں تلاش کریں۔",

    scanHeading: "اپنی دوا کا ڈبہ اسکین کریں",
    fileHint: "اپنے کمپیوٹر سے تصویر منتخب کریں، یا فون کے کیمرے سے تصویر لیں۔",
    removePhoto: "تصویر ہٹائیں",
    scanButton: "دوا اسکین کریں",
    scanning: "آپ کا ڈبہ پڑھا جا رہا ہے…",
    scanWait: "اس میں ایک منٹ تک لگ سکتا ہے۔ براہِ کرم یہ صفحہ کھلا رکھیں۔",

    or: "یا",

    searchHeading: "نام سے تلاش کریں",
    searchPlaceholder: "مثلاً پیناڈول یا پیراسیٹامول",
    searchButton: "تلاش کریں",
    searching: "تلاش جاری ہے…",

    whatWeRead: "ہم نے آپ کے ڈبے سے کیا پڑھا",
    yourMedicine: "آپ کی دوا",
    sameSalt: "وہی سالٹ، وہی طاقت",
    noAlternatives: "ہمارے ریکارڈ میں اسی سالٹ اور طاقت والی کوئی دوسری دوا نہیں ملی۔",
    priceNotAvailable: "قیمت دستیاب نہیں",
    perUnit: "فی یونٹ",

    brand: "برانڈ",
    generic: "جنرک",
    strength: "طاقت",
    form: "شکل",
    regNo: "رجسٹریشن نمبر",
    printedPrice: "درج قیمت",
    packSize: "پیک سائز",
    expiry: "میعاد ختم",
    batch: "بیچ نمبر",

    errTooShort: "براہِ کرم کم از کم 2 حروف لکھیں۔",
    errNoPhoto: "براہِ کرم پہلے اپنی دوا کے ڈبے کی تصویر منتخب کریں۔",
    errNetwork: "سرور سے رابطہ نہیں ہو سکا۔ براہِ کرم اپنا انٹرنیٹ چیک کریں۔",
    errScan: "ہم یہ تصویر نہیں پڑھ سکے۔ براہِ کرم زیادہ واضح تصویر آزمائیں۔",
    errSearch: "تلاش ناکام رہی۔ براہِ کرم دوبارہ کوشش کریں۔",

    disclaimer: "دوا تبدیل کرنے سے پہلے ہمیشہ اپنے ڈاکٹر یا فارماسسٹ سے مشورہ کریں۔",
    dataNote: "معلومات ڈریپ کی عارضی رجسٹری سے لی گئی ہیں؛ ان میں غلطیاں ہو سکتی ہیں۔",
  },
};

const WARNINGS = {
  en: {
    PRODUCT_NOT_FOUND: () =>
      "We could not find this medicine in our records. Please verify with your pharmacist.",
    REGISTRATION_NOT_FOUND: ({ regNo }) =>
      `Registration number ${regNo} was not found in DRAP's registry. Please verify this pack with your pharmacist.`,
    STATUS_NOT_ACTIVE: ({ status }) =>
      `DRAP lists this medicine's registration as "${status}", not Active. Please verify with your pharmacist.`,
    LIVE_LOOKUP_UNAVAILABLE: () =>
      "Live DRAP lookup is unavailable right now, so these results come from our saved data only.",
  },
  ur: {
    PRODUCT_NOT_FOUND: () =>
      "یہ دوا ہمارے ریکارڈ میں نہیں ملی۔ براہِ کرم اپنے فارماسسٹ سے تصدیق کریں۔",
    REGISTRATION_NOT_FOUND: ({ regNo }) =>
      `رجسٹریشن نمبر ${regNo} ڈریپ کی رجسٹری میں نہیں ملا۔ براہِ کرم اس پیک کی تصدیق اپنے فارماسسٹ سے کریں۔`,
    STATUS_NOT_ACTIVE: ({ status }) =>
      `ڈریپ کے مطابق اس دوا کی رجسٹریشن کی حالت ”${status}“ ہے، ایکٹو نہیں۔ براہِ کرم اپنے فارماسسٹ سے تصدیق کریں۔`,
    LIVE_LOOKUP_UNAVAILABLE: () =>
      "ڈریپ سے براہِ راست معلومات اس وقت دستیاب نہیں، اس لیے یہ نتائج صرف ہمارے محفوظ ڈیٹا سے ہیں۔",
  },
};

export function t(lang, key) {
  return STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? key;
}

export function dirFor(lang) {
  return LANGUAGES.find((language) => language.code === lang)?.dir ?? "ltr";
}

export function warningText(lang, warning) {
  const build = WARNINGS[lang]?.[warning.code] ?? WARNINGS.en[warning.code];
  // Unknown codes fall back to whatever English the API sent.
  if (!build) return warning.message;
  return build(warning.params ?? {});
}
