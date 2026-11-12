// Слова по темам и фразы. Слова — в «паузальной» форме (без окончаний), как произносят при остановке.
export interface Item {
  id: string;
  ar: string;
  tr: string;
  uz: string;
  ru: string;
}
export interface Topic {
  id: string;
  icon: string;
  uz: string;
  ru: string;
  items: Item[];
}

const T = (id: string, icon: string, uz: string, ru: string, rows: [string, string, string, string][]): Topic => ({
  id,
  icon,
  uz,
  ru,
  items: rows.map(([ar, tr, u, r], i) => ({ id: `${id}-${i + 1}`, ar, tr, uz: u, ru: r })),
});

export const TOPICS: Topic[] = [
  T('family', '👨‍👩‍👧', 'Oila', 'Семья', [
    ['أَب', 'ab', 'ota', 'отец'], ['أُمّ', 'umm', 'ona', 'мать'], ['أَخ', 'akh', 'aka, uka', 'брат'], ['أُخْت', 'ukht', 'opa, singil', 'сестра'],
    ['اِبْن', 'ibn', 'oʻgʻil', 'сын'], ['بِنْت', 'bint', 'qiz', 'дочь, девочка'], ['زَوْج', 'zawj', 'er', 'муж'], ['زَوْجَة', 'zawja', 'xotin', 'жена'],
    ['جَدّ', 'jadd', 'bobo', 'дедушка'], ['جَدَّة', 'jadda', 'buvi', 'бабушка'], ['عَائِلَة', 'ʻāʼila', 'oila', 'семья'], ['وَلَد', 'walad', 'bola, oʻgʻil bola', 'мальчик, ребёнок'],
  ]),
  T('numbers', '🔢', 'Sonlar', 'Числа', [
    ['وَاحِد', 'wāḥid', 'bir (1)', 'один (1)'], ['اِثْنَان', 'ithnān', 'ikki (2)', 'два (2)'], ['ثَلَاثَة', 'thalātha', 'uch (3)', 'три (3)'], ['أَرْبَعَة', 'arbaʻa', 'toʻrt (4)', 'четыре (4)'],
    ['خَمْسَة', 'khamsa', 'besh (5)', 'пять (5)'], ['سِتَّة', 'sitta', 'olti (6)', 'шесть (6)'], ['سَبْعَة', 'sabʻa', 'yetti (7)', 'семь (7)'], ['ثَمَانِيَة', 'thamāniya', 'sakkiz (8)', 'восемь (8)'],
    ['تِسْعَة', 'tisʻa', 'toʻqqiz (9)', 'девять (9)'], ['عَشَرَة', 'ʻashara', 'oʻn (10)', 'десять (10)'],
  ]),
  T('home', '🏠', 'Uy', 'Дом', [
    ['بَيْت', 'bayt', 'uy', 'дом'], ['بَاب', 'bāb', 'eshik', 'дверь'], ['نَافِذَة', 'nāfidha', 'deraza', 'окно'], ['غُرْفَة', 'ghurfa', 'xona', 'комната'],
    ['سَرِير', 'sarīr', 'karavot', 'кровать'], ['كُرْسِيّ', 'kursiyy', 'stul', 'стул'], ['طَاوِلَة', 'ṭāwila', 'stol', 'стол'], ['مِفْتَاح', 'miftāḥ', 'kalit', 'ключ'],
    ['مَطْبَخ', 'maṭbakh', 'oshxona', 'кухня'], ['سَيَّارَة', 'sayyāra', 'mashina', 'машина'],
  ]),
  T('food', '🍞', 'Taom', 'Еда', [
    ['خُبْز', 'khubz', 'non', 'хлеб'], ['مَاء', 'māʼ', 'suv', 'вода'], ['حَلِيب', 'ḥalīb', 'sut', 'молоко'], ['شَاي', 'shāy', 'choy', 'чай'],
    ['قَهْوَة', 'qahwa', 'qahva', 'кофе'], ['لَحْم', 'laḥm', 'goʻsht', 'мясо'], ['أَرُزّ', 'aruzz', 'guruch', 'рис'], ['تُفَّاح', 'tuffāḥ', 'olma', 'яблоки'],
    ['تَمْر', 'tamr', 'xurmo', 'финики'], ['عَسَل', 'ʻasal', 'asal', 'мёд'], ['سُكَّر', 'sukkar', 'shakar', 'сахар'], ['مِلْح', 'milḥ', 'tuz', 'соль'],
  ]),
  T('study', '📚', 'Oʻqish', 'Учёба', [
    ['رَجُل', 'rajul', 'erkak', 'мужчина'], ['اِمْرَأَة', 'imraʼa', 'ayol', 'женщина'], ['طَالِب', 'ṭālib', 'talaba', 'студент'], ['مُعَلِّم', 'muʻallim', 'oʻqituvchi', 'учитель'],
    ['كِتَاب', 'kitāb', 'kitob', 'книга'], ['قَلَم', 'qalam', 'qalam', 'ручка'], ['دَفْتَر', 'daftar', 'daftar', 'тетрадь'], ['مَدْرَسَة', 'madrasa', 'maktab', 'школа'],
    ['دَرْس', 'dars', 'dars', 'урок'], ['لُغَة', 'lugha', 'til', 'язык'], ['كَلِمَة', 'kalima', 'soʻz', 'слово'], ['سُؤَال', 'suʼāl', 'savol', 'вопрос'],
  ]),
  T('time', '🌙', 'Vaqt va tabiat', 'Время и природа', [
    ['شَمْس', 'shams', 'quyosh', 'солнце'], ['قَمَر', 'qamar', 'oy', 'луна'], ['نَجْم', 'najm', 'yulduz', 'звезда'], ['سَمَاء', 'samāʼ', 'osmon', 'небо'],
    ['يَوْم', 'yawm', 'kun', 'день'], ['لَيْل', 'layl', 'tun', 'ночь'], ['صَبَاح', 'ṣabāḥ', 'tong', 'утро'], ['مَسَاء', 'masāʼ', 'kech', 'вечер'],
    ['سَنَة', 'sana', 'yil', 'год'], ['شَهْر', 'shahr', 'oy (30 kun)', 'месяц'], ['أُسْبُوع', 'usbūʻ', 'hafta', 'неделя'], ['الْيَوْم', 'al-yawm', 'bugun', 'сегодня'],
    ['غَدًا', 'ghadan', 'ertaga', 'завтра'], ['أَمْس', 'ams', 'kecha', 'вчера'],
  ]),
  T('adj', '✨', 'Sifatlar', 'Прилагательные', [
    ['كَبِير', 'kabīr', 'katta', 'большой'], ['صَغِير', 'ṣaghīr', 'kichik', 'маленький'], ['جَمِيل', 'jamīl', 'chiroyli', 'красивый'], ['جَدِيد', 'jadīd', 'yangi', 'новый'],
    ['قَدِيم', 'qadīm', 'eski', 'старый'], ['طَوِيل', 'ṭawīl', 'uzun', 'длинный'], ['قَصِير', 'qaṣīr', 'qisqa', 'короткий'], ['حَارّ', 'ḥārr', 'issiq', 'горячий'],
    ['بَارِد', 'bārid', 'sovuq', 'холодный'], ['سَهْل', 'sahl', 'oson', 'лёгкий'], ['صَعْب', 'ṣaʻb', 'qiyin', 'трудный'],
  ]),
  T('colors', '🎨', 'Ranglar', 'Цвета', [
    ['أَبْيَض', 'abyaḍ', 'oq', 'белый'], ['أَسْوَد', 'aswad', 'qora', 'чёрный'], ['أَحْمَر', 'aḥmar', 'qizil', 'красный'],
    ['أَخْضَر', 'akhḍar', 'yashil', 'зелёный'], ['أَزْرَق', 'azraq', 'koʻk', 'синий'], ['أَصْفَر', 'aṣfar', 'sariq', 'жёлтый'],
  ]),
  T('verbs', '🏃', 'Feʼllar', 'Глаголы', [
    ['كَتَبَ', 'kataba', 'yozdi', 'написал'], ['قَرَأَ', 'qaraʼa', 'oʻqidi', 'прочитал'], ['ذَهَبَ', 'dhahaba', 'ketdi', 'ушёл, пошёл'], ['جَلَسَ', 'jalasa', 'oʻtirdi', 'сел'],
    ['أَكَلَ', 'akala', 'yedi', 'поел'], ['شَرِبَ', 'shariba', 'ichdi', 'выпил'], ['فَتَحَ', 'fataḥa', 'ochdi', 'открыл'], ['سَمِعَ', 'samiʻa', 'eshitdi', 'услышал'],
    ['عَرَفَ', 'ʻarafa', 'bildi', 'узнал'], ['دَخَلَ', 'dakhala', 'kirdi', 'вошёл'], ['خَرَجَ', 'kharaja', 'chiqdi', 'вышел'],
  ]),
];

export const PHRASES: Topic[] = [
  T('greet', '👋', 'Salomlashish', 'Приветствие', [
    ['السَّلَامُ عَلَيْكُمْ', 'as-salāmu ʻalaykum', 'Assalomu alaykum', 'Мир вам (здравствуйте)'],
    ['وَعَلَيْكُمُ السَّلَامُ', 'wa ʻalaykumu s-salām', 'Va alaykum assalom', 'И вам мир (ответ)'],
    ['صَبَاحُ الْخَيْرِ', 'ṣabāḥu l-khayr', 'Xayrli tong', 'Доброе утро'],
    ['صَبَاحُ النُّورِ', 'ṣabāḥu n-nūr', 'Xayrli tong (javob)', 'Доброе утро (ответ)'],
    ['مَسَاءُ الْخَيْرِ', 'masāʼu l-khayr', 'Xayrli kech', 'Добрый вечер'],
    ['كَيْفَ حَالُكَ؟', 'kayfa ḥāluka?', 'Qalaysiz? (erkakka)', 'Как дела? (мужчине)'],
    ['كَيْفَ حَالُكِ؟', 'kayfa ḥāluki?', 'Qalaysiz? (ayolga)', 'Как дела? (женщине)'],
    ['أَنَا بِخَيْرٍ، الْحَمْدُ لِلّٰهِ', 'anā bi-khayr, al-ḥamdu li-llāh', 'Yaxshiman, Allohga hamd', 'Хорошо, слава Богу'],
    ['مَعَ السَّلَامَةِ', 'maʻa s-salāma', 'Xayr, salomat boʻling', 'До свидания'],
    ['إِلَى اللِّقَاءِ', 'ilā l-liqāʼ', 'Koʻrishguncha', 'До встречи'],
  ]),
  T('polite', '🙏', 'Odob soʻzlari', 'Вежливость', [
    ['شُكْرًا', 'shukran', 'Rahmat', 'Спасибо'],
    ['عَفْوًا', 'ʻafwan', 'Arzimaydi', 'Не за что'],
    ['مِنْ فَضْلِكَ', 'min faḍlik', 'Iltimos', 'Пожалуйста (прошу)'],
    ['نَعَمْ', 'naʻam', 'Ha', 'Да'],
    ['لَا', 'lā', 'Yoʻq', 'Нет'],
    ['آسِف', 'āsif', 'Kechirasiz', 'Извините'],
    ['تَشَرَّفْنَا', 'tasharrafnā', 'Tanishganimdan xursandman', 'Очень приятно'],
  ]),
  T('meet', '🤝', 'Tanishuv', 'Знакомство', [
    ['مَا اسْمُكَ؟', 'mā smuka?', 'Ismingiz nima?', 'Как тебя зовут?'],
    ['اِسْمِي ...', 'ismī ...', 'Mening ismim ...', 'Меня зовут ...'],
    ['مِنْ أَيْنَ أَنْتَ؟', 'min ayna anta?', 'Qayerdansiz?', 'Откуда ты?'],
    ['أَنَا مِنْ أُوزْبَكِسْتَانَ', 'anā min ūzbakistān', 'Men Oʻzbekistondanman', 'Я из Узбекистана'],
    ['أَيْنَ تَسْكُنُ؟', 'ayna taskun?', 'Qayerda yashaysiz?', 'Где ты живёшь?'],
    ['أَسْكُنُ فِي طَشْقَنْدَ', 'askunu fī ṭashqand', 'Toshkentda yashayman', 'Я живу в Ташкенте'],
    ['أَنَا طَالِبٌ', 'anā ṭālibun', 'Men talabaman', 'Я студент'],
    ['هِيَ مُعَلِّمَةٌ', 'hiya muʻallimatun', 'U oʻqituvchi (ayol)', 'Она учительница'],
    ['عِنْدِي أَخٌ وَأُخْتٌ', 'ʻindī akhun wa ukhtun', 'Mening akam va opam bor', 'У меня есть брат и сестра'],
  ]),
  T('learn', '🗣', 'Til oʻrganish', 'Изучение языка', [
    ['أَنَا أَتَعَلَّمُ اللُّغَةَ الْعَرَبِيَّةَ', 'anā ataʻallamu l-lughata l-ʻarabiyya', 'Men arab tilini oʻrganyapman', 'Я учу арабский язык'],
    ['هَلْ تَتَكَلَّمُ الْعَرَبِيَّةَ؟', 'hal tatakallamu l-ʻarabiyya?', 'Arabcha gapirasizmi?', 'Вы говорите по-арабски?'],
    ['قَلِيلًا', 'qalīlan', 'Ozgina', 'Немного'],
    ['أَنَا لَا أَفْهَمُ', 'anā lā afham', 'Men tushunmayapman', 'Я не понимаю'],
    ['تَكَلَّمْ بِبُطْءٍ مِنْ فَضْلِكَ', 'takallam bi-buṭʼ min faḍlik', 'Iltimos, sekinroq gapiring', 'Говорите медленнее, пожалуйста'],
    ['مَا مَعْنَى هٰذِهِ الْكَلِمَةِ؟', 'mā maʻnā hādhihi l-kalima?', 'Bu soʻzning maʼnosi nima?', 'Что значит это слово?'],
  ]),
  T('daily', '🕌', 'Kundalik', 'Повседневное', [
    ['بِسْمِ اللّٰهِ', 'bismi llāh', 'Bismillah', 'Во имя Аллаха'],
    ['الْحَمْدُ لِلّٰهِ', 'al-ḥamdu li-llāh', 'Alhamdulillah', 'Хвала Аллаху'],
    ['إِنْ شَاءَ اللّٰهُ', 'in shāʼa llāh', 'Inshaalloh', 'Если пожелает Аллах'],
    ['مَا شَاءَ اللّٰهُ', 'mā shāʼa llāh', 'Mashaalloh', 'Так пожелал Аллах (восхищение)'],
    ['جَزَاكَ اللّٰهُ خَيْرًا', 'jazāka llāhu khayran', 'Alloh sizni yaxshilik bilan mukofotlasin', 'Да вознаградит тебя Аллах благом'],
    ['أَيْنَ الْمَسْجِدُ؟', 'ayna l-masjid?', 'Masjid qayerda?', 'Где мечеть?'],
    ['كَمِ السَّاعَةُ؟', 'kami s-sāʻa?', 'Soat necha?', 'Который час?'],
    ['بِكَمْ هٰذَا؟', 'bi-kam hādhā?', 'Bu qancha turadi?', 'Сколько это стоит?'],
    ['أُرِيدُ مَاءً', 'urīdu māʼan', 'Suv xohlayman', 'Я хочу воды'],
    ['هٰذَا كِتَابٌ', 'hādhā kitābun', 'Bu kitob', 'Это книга'],
    ['هٰذِهِ سَيَّارَةٌ', 'hādhihi sayyāratun', 'Bu mashina', 'Это машина'],
    ['الْبَيْتُ كَبِيرٌ', 'al-baytu kabīrun', 'Uy katta', 'Дом большой'],
  ]),
];

export const ALL_ITEMS: Item[] = [...TOPICS, ...PHRASES].flatMap((t) => t.items);
