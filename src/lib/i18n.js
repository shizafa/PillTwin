export const LANGUAGES = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "ur", label: "اردو", dir: "rtl" },
];

const STRINGS = {
  en: {
    tagline: "Find your medicine's twin.",

    navHowItWorks: "How it works",
    navAbout: "About",
    navMenu: "Menu",
    switchLanguage: "Switch language",

    scanHeading: "Scan your medicine box",
    fileHint: "Choose a photo from your computer, or take one with your phone camera.",
    removePhoto: "Remove photo",
    scanButton: "Scan medicine",
    scanning: "Reading your box…",
    scanWait: "This can take up to a minute. Please keep this page open.",

    or: "or",

    searchHeading: "Search by name",
    searchPlaceholder: "Search your medicine name",
    searchButton: "Search",
    searching: "Searching…",
    heroHelper: "Type the name or scan the box",

    scrollStageText:
      "Find the same medicine for less. Scan any box and see cheaper alternatives with the same salt.",

    step1Heading: "Search or scan",
    step1Text: "Type the medicine name or scan the box with your camera.",
    step2Heading: "See alternatives",
    step2Text: "We show other medicines with the same salt, with prices side by side.",
    step3Heading: "Check and decide",
    step3Text:
      "See whether the medicine is registered and confirm with your pharmacist or doctor.",

    exampleLabel: "Example",
    confirmNote: "Confirm with your pharmacist or doctor.",
    goToStep: "Go to step {n}",

    whatWeRead: "What we read from your box",
    yourMedicine: "Your medicine",
    activeSalt: "Active salt / composition",
    contains: "Contains",
    sameSalt: "Same salt, same strength",
    sectionAlternatives: "Same medicine, other brands",

    badgeRegistered: "Registered",
    badgeRegisteredExplain: "Verified Active in DRAP's registry",
    badgeNotRegistered: "Not registered",
    badgeNotRegisteredExplain:
      'DRAP lists this registration as "{status}", not Active. Verify with your pharmacist.',
    badgeNotVerified: "Not verified",
    badgeNotVerifiedExplain:
      "We could not verify this in the DRAP list. Please check with your pharmacist.",
    sourceDrap: "Source: DRAP registry",
    sourceManual: "Source: manual entry",
    checkedOn: "checked",

    noAlternatives:
      "We could not find any other medicine with the same salt and strength in our records.",
    priceNotAvailable: "Price not available",
    priceNotListed: "Price not listed",
    pricesHelperNote: "Prices are not available yet for these medicines.",
    savingsBadge: "Save Rs. {amount}",
    perUnit: "per unit",
    loadingResults: "Loading results…",
    paginationPrev: "Previous",
    paginationNext: "Next",
    paginationPage: "Page {current} of {total}",

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

    footerCtaSubtext: "Search by name or scan the box to see cheaper medicines with the same salt.",
    footerLinksLabel: "Footer",

    footerDescription: "Find your medicine's twin — compare registered alternatives with the same salt.",
    footerContact: "Contact",
    footerSafetyNote:
      "PillTwin is for information only. Always confirm with a pharmacist or doctor before changing any medicine.",
    footerRights: "All rights reserved.",
  },

  ur: {
    tagline: "اپنی دوا کا جُڑواں تلاش کریں۔",

    navHowItWorks: "یہ کیسے کام کرتا ہے",
    navAbout: "تعارف",
    navMenu: "مینیو",
    switchLanguage: "زبان تبدیل کریں",

    scanHeading: "اپنی دوا کا ڈبہ اسکین کریں",
    fileHint: "اپنے کمپیوٹر سے تصویر منتخب کریں، یا فون کے کیمرے سے تصویر لیں۔",
    removePhoto: "تصویر ہٹائیں",
    scanButton: "دوا اسکین کریں",
    scanning: "آپ کا ڈبہ پڑھا جا رہا ہے…",
    scanWait: "اس میں ایک منٹ تک لگ سکتا ہے۔ براہِ کرم یہ صفحہ کھلا رکھیں۔",

    or: "یا",

    searchHeading: "نام سے تلاش کریں",
    searchPlaceholder: "اپنی دوا کا نام تلاش کریں",
    searchButton: "تلاش کریں",
    searching: "تلاش جاری ہے…",
    heroHelper: "نام لکھیں یا ڈبے کو اسکین کریں",

    scrollStageText:
      "وہی دوا، کم قیمت میں تلاش کریں۔ کسی بھی ڈبے کو اسکین کریں اور وہی سالٹ رکھنے والے سستے متبادل دیکھیں۔",

    step1Heading: "تلاش کریں یا اسکین کریں",
    step1Text: "دوا کا نام لکھیں یا اپنے کیمرے سے ڈبہ اسکین کریں۔",
    step2Heading: "متبادل دیکھیں",
    step2Text: "ہم وہی سالٹ رکھنے والی دیگر ادویات قیمتوں کے ساتھ دکھاتے ہیں۔",
    step3Heading: "تصدیق کریں اور فیصلہ کریں",
    step3Text: "دیکھیں کہ دوا رجسٹرڈ ہے یا نہیں اور اپنے فارماسسٹ یا ڈاکٹر سے تصدیق کریں۔",

    exampleLabel: "مثال",
    confirmNote: "اپنے فارماسسٹ یا ڈاکٹر سے تصدیق کریں۔",
    goToStep: "مرحلہ {n} پر جائیں",

    whatWeRead: "ہم نے آپ کے ڈبے سے کیا پڑھا",
    yourMedicine: "آپ کی دوا",
    activeSalt: "فعال سالٹ / اجزاء",
    contains: "شامل ہے",
    sameSalt: "وہی سالٹ، وہی طاقت",
    sectionAlternatives: "وہی دوا، دیگر برانڈز",

    badgeRegistered: "رجسٹرڈ",
    badgeRegisteredExplain: "ڈریپ کی رجسٹری میں ایکٹو کے طور پر تصدیق شدہ",
    badgeNotRegistered: "رجسٹرڈ نہیں",
    badgeNotRegisteredExplain:
      "ڈریپ کے مطابق اس رجسٹریشن کی حالت “{status}” ہے، ایکٹو نہیں۔ اپنے فارماسسٹ سے تصدیق کریں۔",
    badgeNotVerified: "تصدیق نہیں ہو سکی",
    badgeNotVerifiedExplain: "ہم اسے ڈریپ کی فہرست میں تصدیق نہیں کر سکے۔ براہِ کرم اپنے فارماسسٹ سے چیک کریں۔",
    sourceDrap: "ماخذ: ڈریپ رجسٹری",
    sourceManual: "ماخذ: دستی اندراج",
    checkedOn: "تاریخِ تصدیق",

    noAlternatives: "ہمارے ریکارڈ میں اسی سالٹ اور طاقت والی کوئی دوسری دوا نہیں ملی۔",
    priceNotAvailable: "قیمت دستیاب نہیں",
    priceNotListed: "قیمت درج نہیں",
    pricesHelperNote: "ان ادویات کے لیے ابھی قیمتیں دستیاب نہیں ہیں۔",
    savingsBadge: "Rs. {amount} کی بچت",
    perUnit: "فی یونٹ",
    loadingResults: "نتائج لوڈ ہو رہے ہیں…",
    paginationPrev: "پچھلا",
    paginationNext: "اگلا",
    paginationPage: "صفحہ {current} از {total}",

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

    footerCtaSubtext: "نام سے تلاش کریں یا ڈبہ اسکین کریں تاکہ وہی سالٹ رکھنے والی سستی ادویات دیکھ سکیں۔",
    footerLinksLabel: "فوٹر",

    footerDescription: "اپنی دوا کا جُڑواں تلاش کریں — وہی سالٹ رکھنے والے رجسٹرڈ متبادل موازنہ کریں۔",
    footerContact: "رابطہ",
    footerSafetyNote:
      "PillTwin صرف معلوماتی مقاصد کے لیے ہے۔ کوئی بھی دوا تبدیل کرنے سے پہلے ہمیشہ فارماسسٹ یا ڈاکٹر سے تصدیق کریں۔",
    footerRights: "جملہ حقوق محفوظ ہیں۔",
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
    EXPIRED: ({ expiry }) =>
      `This pack's printed expiry date (${expiry}) has passed. Please do not use it — ask your pharmacist for a replacement.`,
    EXPIRING_SOON: ({ expiry }) =>
      `This pack is close to its printed expiry date (${expiry}). Please check the date before using it.`,
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
    EXPIRED: ({ expiry }) =>
      `اس پیک کی میعاد ختم ہونے کی تاریخ (${expiry}) گزر چکی ہے۔ براہِ کرم اسے استعمال نہ کریں — اپنے فارماسسٹ سے نیا پیک لیں۔`,
    EXPIRING_SOON: ({ expiry }) =>
      `اس پیک کی میعاد ختم ہونے کی تاریخ (${expiry}) قریب ہے۔ براہِ کرم استعمال سے پہلے تاریخ چیک کریں۔`,
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
