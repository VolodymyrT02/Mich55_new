# Мультиязычная структура лендинга

## Общие принципы
- Основной язык: украинский (страница открывается на нем по умолчанию)
- Дополнительный язык: английский
- Переключение через заметную кнопку "ENG" в шапке сайта
- Сохранение текущей позиции просмотра при переключении языка
- Полное дублирование всего контента на обоих языках

## Технические аспекты реализации
- Использование атрибута `lang` для HTML-элементов (`lang="uk"` и `lang="en"`)
- Хранение текстов в отдельных JSON-файлах для каждого языка
- Динамическая подгрузка текстов при переключении языка без перезагрузки страницы
- Сохранение выбранного языка в localStorage для запоминания предпочтений пользователя
- URL-структура с языковым префиксом (например, `/en/` для английской версии)

## Структура текстовых блоков

### Шапка сайта
```json
{
  "uk": {
    "language_switch": "ENG",
    "contact_us": "Зв'язатися з нами",
    "menu": {
      "home": "Головна",
      "about": "Про комплекс",
      "apartments": "Квартири",
      "location": "Розташування",
      "contacts": "Контакти"
    }
  },
  "en": {
    "language_switch": "УКР",
    "contact_us": "Contact us",
    "menu": {
      "home": "Home",
      "about": "About",
      "apartments": "Apartments",
      "location": "Location",
      "contacts": "Contacts"
    }
  }
}
```

### Hero-секция
```json
{
  "uk": {
    "title": "BOUTIQUE APARTMENTS KYIV",
    "address": "вулиця Ломаківська / Мічуріна, 55",
    "status": "Здано в експлуатацію лютий 2025р."
  },
  "en": {
    "title": "BOUTIQUE APARTMENTS KYIV",
    "address": "Lomakivska / Michurina Street, 55",
    "status": "Commissioned February 2025"
  }
}
```

### Первая часть описания
```json
{
  "uk": {
    "description": "6 резиденцій на Печерських схилах. Приватність історичного центру з видами на Києво-Печерську Лавру та Ботанічний сад.\n\nЕксклюзивна локація для тих, хто цінує автентичність та незалежність. Поєднання культурної спадщини з сучасним комфортом у серці історичного району.\n\nВсі апартаменти з документами на право власності."
  },
  "en": {
    "description": "6 residences on Pechersk slopes. Privacy of the historic centre with views of Kyiv Pechersk Lavra and the Botanical Garden.\n\nAn exclusive location for those who value authenticity and independence. The fusion of cultural heritage with contemporary comfort in the heart of the historic district.\n\nAll apartments come with property ownership documents."
  }
}
```

### Вторая часть описания (технологии)
```json
{
  "uk": {
    "title": "ТЕХНОЛОГІЇ",
    "engineering": {
      "title": "Інженерні системи преміум-класу:",
      "content": "Індивідуальні теплові насоси для кожної резиденції забезпечують енергоефективність та автономність. Незалежні системи опалення, кондиціонування, вентиляції та гарячого водопостачання.\n\nЦентралізована система водопідготовки та фільтрації Ecosoft.\n\nІнтелектуальна система диспетчеризації та контролю управління будинком.\n\nЛіфт Schindler з доступом до підземного паркінгу."
    },
    "materials": {
      "title": "Матеріали та конструкції:",
      "content": "Вентильований фасад з широкоформатними керамогранітними панелями. Утеплення кашированою базальтовою ватою для максимального збереження тепла.\n\nЗовнішні та внутрішні стіни з керамічної цегли Porotherm Wienerberger.\n\nВіконні системи з алюмінієвого профілю SCHÜCO AWS 75Si+ з двокамерним склопакетом товщиною 50 мм SunGuard."
    }
  },
  "en": {
    "title": "TECHNOLOGY",
    "engineering": {
      "title": "Premium-class engineering systems:",
      "content": "Individual heat pumps for each residence ensure energy efficiency and autonomy. Independent heating, air conditioning, ventilation, and domestic hot water systems.\n\nCentralised water treatment and filtration system by Ecosoft.\n\nIntelligent building management and control system.\n\nSchindler lift with access to underground parking."
    },
    "materials": {
      "title": "Materials and construction:",
      "content": "Ventilated façade with large-format ceramic granite panels. Insulation with laminated basalt wool for maximum heat retention.\n\nExternal and internal walls of Porotherm Wienerberger ceramic brick.\n\nWindow systems with SCHÜCO AWS 75Si+ aluminium profile featuring double-glazed units 50mm thick with SunGuard coating."
    }
  }
}
```

### Квартиры
```json
{
  "uk": {
    "apartments": [
      {
        "title": "РЕЗИДЕНЦІЯ №1 (1-й поверх)",
        "status": "Здано в експлуатацію лютий 2025р.",
        "legal_area": "Юридична площа: 211,7 м²",
        "actual_area": "Фактично: 189,5 м² внутрішня площа + 74 м² тераса з зеленою зоною",
        "view": "Вид: Києво-Печерська Лавра, Батьківщина-Мати",
        "price": "Вартість: 1 100 000 $",
        "included": "Включено: 2 паркомісця + кладова"
      },
      {
        "title": "РЕЗИДЕНЦІЯ №2 (2-й поверх)",
        "status": "Здано в експлуатацію лютий 2025р.",
        "legal_area": "Юридична площа: 237 м²",
        "actual_area": "Фактично: 227 м² внутрішня площа + 33,3 м² тераса",
        "view": "Вид: Батьківщина-Мати, Києво-Печерська Лавра",
        "price": "Вартість: 1 185 000 $",
        "included": "Включено: 2 паркомісця + кладова"
      },
      {
        "title": "РЕЗИДЕНЦІЯ №3 (3-й поверх)",
        "status": "Здано в експлуатацію лютий 2025р.",
        "legal_area": "Юридична площа: 238,2 м²",
        "actual_area": "Фактично: 204 м² внутрішня площа + 30 м² балкони + 84 м² панорамна тераса на покрівлі",
        "view": "Вид: Ботанічний сад + панорама міста з покрівлі",
        "price": "Вартість: 1 085 000 $",
        "included": "Включено: 2 паркомісця + кладова"
      }
    ]
  },
  "en": {
    "apartments": [
      {
        "title": "RESIDENCE №1 (Ground floor)",
        "status": "Commissioned February 2025",
        "legal_area": "Legal area: 211.7 m²",
        "actual_area": "Actual: 189.5 m² internal area + 74 m² terrace with green zone",
        "view": "View: Kyiv Pechersk Lavra, Motherland Monument",
        "price": "Price: $1,100,000",
        "included": "Included: 2 parking spaces + storage room"
      },
      {
        "title": "RESIDENCE №2 (2nd floor)",
        "status": "Commissioned February 2025",
        "legal_area": "Legal area: 237 m²",
        "actual_area": "Actual: 227 m² internal area + 33.3 m² terrace",
        "view": "View: Motherland Monument, Kyiv Pechersk Lavra",
        "price": "Price: $1,185,000",
        "included": "Included: 2 parking spaces + storage room"
      },
      {
        "title": "RESIDENCE №3 (3rd floor)",
        "status": "Commissioned February 2025",
        "legal_area": "Legal area: 238.2 m²",
        "actual_area": "Actual: 204 m² internal area + 30 m² balconies + 84 m² panoramic rooftop terrace",
        "view": "View: Botanical Garden + city panorama from rooftop",
        "price": "Price: $1,085,000",
        "included": "Included: 2 parking spaces + storage room"
      }
    ]
  }
}
```

### Контакты и футер
```json
{
  "uk": {
    "contacts": {
      "title": "КОНТАКТИ",
      "phone_label": "Телефон:",
      "telegram_label": "Telegram:",
      "social_media": "Соціальні мережі:",
      "contact_us": "Зв'язатися з нами",
      "form": {
        "name": "Ім'я",
        "email": "Email",
        "phone": "Телефон",
        "message": "Повідомлення",
        "submit": "Надіслати"
      }
    },
    "footer": {
      "copyright": "© 2025 ID GROUP KYIV CITY. Всі права захищені.",
      "privacy": "Політика конфіденційності",
      "terms": "Умови використання"
    }
  },
  "en": {
    "contacts": {
      "title": "CONTACTS",
      "phone_label": "Phone:",
      "telegram_label": "Telegram:",
      "social_media": "Social media:",
      "contact_us": "Contact us",
      "form": {
        "name": "Name",
        "email": "Email",
        "phone": "Phone",
        "message": "Message",
        "submit": "Submit"
      }
    },
    "footer": {
      "copyright": "© 2025 ID GROUP KYIV CITY. All rights reserved.",
      "privacy": "Privacy Policy",
      "terms": "Terms of Use"
    }
  }
}
```

## Интерфейс админ-панели
- Возможность редактирования текстов на обоих языках
- Управление видимостью квартир (для скрытия проданных)
- Загрузка и управление медиа-файлами
- Простой интерфейс без необходимости знания программирования
