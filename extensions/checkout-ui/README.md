# Checkout UI Extension

Checkout UI extensions let app developers build custom functionality that merchants can install at defined targets in the checkout flow. You can learn more about checkout UI extensions in Shopify’s [developer documentation](https://shopify.dev/api/checkout-extensions/checkout).

## Prerequisites

Before you start building your extension, make sure that you’ve created a [development store](https://shopify.dev/docs/apps/tools/development-stores) with the [checkout extensibility developer preview](https://shopify.dev/docs/api/release-notes/developer-previews#previewing-new-features).

## Your new Extension

Your new extension contains the following files:

- `README.md`, the file you are reading right now.
- `shopify.extension.toml`, the configuration file for your extension. This file defines your extension’s name, where it will appear in the checkout, and other metadata.
- `src/Checkout.jsx`, the source code for your extension.
- `locales/en.default.json` and `locales/fr.json`, which contain translations used to [localized your extension](https://shopify.dev/docs/apps/checkout/best-practices/localizing-ui-extensions).

By default, your extension is configured to target the `purchase.checkout.block.render` [extension target](https://shopify.dev/docs/api/checkout-ui-extensions/extension-targets-overview). You will find the target both in your `shopify.extension.toml`, and in the source code of your extension. The default target allows the merchant to configure where in the checkout *they* want your extension to appear. If you are building an extension that is tied to existing UI element in the checkout, such as the cart lines or shipping options, you can change the extension target so that your UI extension will render in the correct location. Check out the list of [all available extension targets](https://shopify.dev/docs/api/checkout-ui-extensions/extension-targets-overview) to get some inspiration for the kinds of content you can provide with checkout UI extensions.

To build your extension, you will need to use APIs provided by Shopify that let you render content, and to read and write data in the checkout. The following resources will help you get started with checkout extensions:

- [Available components and their properties](https://shopify.dev/docs/api/checkout-ui-extensions/unstable/components)
- APIs for [reading](https://shopify.dev/docs/api/checkout-ui-extensions/unstable/apis/standardapi) and [writing checkout data](https://shopify.dev/docs/api/checkout-ui-extensions/unstable/apis/checkoutapi)
- [APIs by extension target](https://shopify.dev/docs/api/checkout-ui-extensions/unstable/apis/extensiontargets)

## Useful Links

- [Checkout app documentation](https://shopify.dev/apps/checkout)
- [Checkout UI extension documentation](https://shopify.dev/api/checkout-extensions)
  - [Configuration](https://shopify.dev/docs/api/checkout-ui-extensions/configuration)
  - [API Reference](https://shopify.dev/docs/api/checkout-ui-extensions/apis)
  - [UI Components](https://shopify.dev/docs/api/checkout-ui-extensions/components)
  - [Available React Hooks](https://shopify.dev/docs/api/checkout-ui-extensions/react-hooks)
- [Checkout UI extension tutorials](https://shopify.dev/docs/apps/checkout)
  - [Enable extended delivery instructions](https://shopify.dev/apps/checkout/delivery-instructions)
  - [Creating a custom banner](https://shopify.dev/apps/checkout/custom-banners)
  - [Thank you and order status pages](https://shopify.dev/docs/apps/checkout/thank-you-order-status)
  - [Adding field validation](https://shopify.dev/apps/checkout/validation)
  - [Localizing an extension](https://shopify.dev/apps/checkout/localize-ui-extensions)


<!-- 

היי


רציתי לתת פה הסברים על מה עובד ולא עובד


אציין שזו אכן פעם ראשונה שיצא לי לעבוד עם shopify 
בגדול היה לי תרגיל בית מאוד מלמד השקעתי בו הרבה זמן 
אך לצערי לא הצלחתי לממש את כל הפונקצינליות
אציין שהסתמכתי בעיקר על הדוקמנטצייה של shopify dev ולא נעזרתי  בעוד מקורות כי לא מצאתי יותר מידי.
החלק העיקר שבו נתקעתי במימוש היה השמירת נתונים אל הDB
אחרי שלקח לי זמן להבין שבקבצים מסוג extension נשמתמש אך ורק בקומפננטות פנימיות הצלחתי את החלק של הפרונט של להציג כפתור ומוצרים 
הצלחתי לחלץ את המידע של המוצרים בסל ואת הid של המשתמש שמחובר באמצעות hooks שמצאתי בדוקמנטציה (useApi,useCustomer,useCartLines)
יודע שבקובץ liquid יכלתי להשתמש גם באובייקט הגלובלי  על מנת לחלץ חלק מן הנתונים.
אחרי זה כתבתי פונקציה שתשגר event מתי שאלחץ על הכפתור היא תשלח את המוצרים שבסל אל הבקאנד
וכאן ממש הסתבכתי, ראיתי שיש לעשות שימוש בניתוב עם פרוקסי , ניסיתי לתת ניתוב בהגדרות האפליקצייה תחת הלשונית של App Proxy 
ובשליחה של הנתונים הוספתי לפני הניתוב לBackend את הכתובת של ה-proxy 
ניסתי עוד כמה וכמה וריאציות ללא כל הצלחה  
הוספתי:
# ...
[extensions.capabilities]
network_access = true
# ... 
בtoml file
הסתמכתי על הבעייה במקור הזה:https://community.shopify.com/c/extensions/networkaccessdeniederror-permission-to-use-fetch-in-checkout-ui/m-p/2194363
שאגב גם שם לא היה כל כך פיתרון
וזה גם לא עזר ואז ראיתי שזה כנראה קשור לsession tokem שהייתי צריך להגדיר אבל אני קצת ניהיתי מבולבל כאן, הסתמכתי על סמך המדריך הזה:https://shopify.dev/docs/apps/build/authentication-authorization/session-tokens/set-up-session-tokens#step-5-mark-shop-records-as-uninstalled-using-the-app-uninstalled-webhook 
שהוביל אותי בסוף לשימוש בזה :https://github.com/Shopify/shopify-app-js/tree/main/packages/apps/shopify-api
ולא הצלחתי.
אני הכנתי כבר route מוכן לשמירה והוצאה של נתונים מהDB וזה נמצא בindex.js 
הErrors שקיבלתי השתנו ולא היו עקביים והיה לי קשה לעלות על הבעייה 
בנוסף היו מקרים גם שמשום מה הextenstion שייצרתי משום התרנדר פעמיים על הדף ואחרי כמה רפרושים הוא חזר ליהיות אחד משהו קצת מוזר..
חיפשתי במלא פורומים וראיתי שהיו כאלו שנתקלו בזה כך אבל לרוב הפיתרונות לא היו נכונים או כיוונו לעמודים שהם כבר ללא תוכן ופג תוקפם
גם בכל פעם שניסיתי לשנות משהו היה נראה שהשינויים לא נקלטים (ונכנסתי לקישור מחדש)

חבל לי שעל זה נתקעתי וזה מנע ממני להתקדם , ממש רציתי לסיים את המשימה כבר בשביל עצמי כי הרגשתי שזה ממש על שטות וחסר לי פיק בשביל שהדברים יזוזו
בכל מקרה היה לי חשוב לשתף איך עבר לי המשימה , לומר שלמדתי ממנה המון והרגשתי שניסיתי מכל מיניי כיוונים אך שנתקעתי על השגיאה של הטוקנים התקשתי במציאת הבעייה תחת הזמן הנתון.

מודה לכם על ההזדמנות ומקווה לשמוע מכם.




 -->