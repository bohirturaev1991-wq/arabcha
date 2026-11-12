// Арабский алфавит. tr — транскрипция латиницей (для узбекского интерфейса; для русского
// переводится в кириллицу функцией toCyr). Звуки описаны через знакомые звуки узбекского и русского.
export interface Letter {
  id: string;
  ar: string; // буква
  name: string; // название с огласовками (озвучивается)
  tr: string; // название латиницей
  sound: string; // звук латиницей
  joins: boolean; // соединяется со следующей буквой
  hard?: boolean; // звук, которого нет в узбекском/русском
  uz: string;
  ru: string;
  ex: { ar: string; tr: string; uz: string; ru: string };
}

export const LETTERS: Letter[] = [
  { id: 'alif', ar: 'ا', name: 'أَلِف', tr: 'alif', sound: 'ā / ʼ', joins: false,
    uz: 'Oʻzi tovush bermaydi: choʻziq “ā” ni bildiradi yoki hamza (ʼ) uchun tayanch boʻladi. Keyingi harfga ulanmaydi.',
    ru: 'Сама звука не даёт: обозначает долгое «а̄» или служит подставкой для хамзы (ʼ). Со следующей буквой не соединяется.',
    ex: { ar: 'أَسَد', tr: 'asad', uz: 'sher', ru: 'лев' } },
  { id: 'ba', ar: 'ب', name: 'بَاء', tr: 'bāʼ', sound: 'b', joins: true,
    uz: '“b” — oʻzbekchadagidek.', ru: '«б» — как в русском.',
    ex: { ar: 'بَاب', tr: 'bāb', uz: 'eshik', ru: 'дверь' } },
  { id: 'ta', ar: 'ت', name: 'تَاء', tr: 'tāʼ', sound: 't', joins: true,
    uz: '“t” — yumshoq, tilning uchi tishlarga tegadi.', ru: '«т» — как в русском.',
    ex: { ar: 'تُفَّاح', tr: 'tuffāḥ', uz: 'olma', ru: 'яблоко' } },
  { id: 'tha', ar: 'ث', name: 'ثَاء', tr: 'thāʼ', sound: 'th', joins: true, hard: true,
    uz: 'Ingliz “think” dagi “th”: tilning uchi tishlar orasida, shivirlab “s” aytiladi.',
    ru: 'Как английское «th» в слове think: кончик языка между зубами, произносится «с» шепеляво.',
    ex: { ar: 'ثَلْج', tr: 'thalj', uz: 'qor', ru: 'снег' } },
  { id: 'jim', ar: 'ج', name: 'جِيم', tr: 'jīm', sound: 'j', joins: true,
    uz: '“j” — “jon” soʻzidagidek.', ru: '«дж» — как в слове «джинсы».',
    ex: { ar: 'جَمَل', tr: 'jamal', uz: 'tuya', ru: 'верблюд' } },
  { id: 'ha', ar: 'ح', name: 'حَاء', tr: 'ḥāʼ', sound: 'ḥ', joins: true, hard: true,
    uz: 'Boʻgʻizdan chiqadigan kuchli “h”: tomoqni qisib, issiq havo chiqarayotgandek.',
    ru: 'Глубокое «х» из горла, без хрипа: как будто дышите на стекло, сжав горло.',
    ex: { ar: 'حَلِيب', tr: 'ḥalīb', uz: 'sut', ru: 'молоко' } },
  { id: 'kha', ar: 'خ', name: 'خَاء', tr: 'khāʼ', sound: 'kh', joins: true,
    uz: '“x” — oʻzbekcha “xat” soʻzidagidek.', ru: '«х» — как в русском «хлеб».',
    ex: { ar: 'خُبْز', tr: 'khubz', uz: 'non', ru: 'хлеб' } },
  { id: 'dal', ar: 'د', name: 'دَال', tr: 'dāl', sound: 'd', joins: false,
    uz: '“d” — oʻzbekchadagidek. Keyingi harfga ulanmaydi.', ru: '«д» — как в русском. Со следующей буквой не соединяется.',
    ex: { ar: 'دَار', tr: 'dār', uz: 'uy, hovli', ru: 'дом' } },
  { id: 'dhal', ar: 'ذ', name: 'ذَال', tr: 'dhāl', sound: 'dh', joins: false, hard: true,
    uz: 'Ingliz “this” dagi “th”: tilning uchi tishlar orasida, “z” aytiladi. Keyingi harfga ulanmaydi.',
    ru: 'Как английское «th» в слове this: кончик языка между зубами, произносится «з». Не соединяется со следующей.',
    ex: { ar: 'ذَهَب', tr: 'dhahab', uz: 'oltin', ru: 'золото' } },
  { id: 'ra', ar: 'ر', name: 'رَاء', tr: 'rāʼ', sound: 'r', joins: false,
    uz: '“r” — tilning uchi titraydi. Keyingi harfga ulanmaydi.', ru: '«р» — раскатистое. Со следующей буквой не соединяется.',
    ex: { ar: 'رَجُل', tr: 'rajul', uz: 'erkak', ru: 'мужчина' } },
  { id: 'zay', ar: 'ز', name: 'زَاي', tr: 'zāy', sound: 'z', joins: false,
    uz: '“z” — oʻzbekchadagidek. Keyingi harfga ulanmaydi.', ru: '«з» — как в русском. Со следующей буквой не соединяется.',
    ex: { ar: 'زَيْت', tr: 'zayt', uz: 'yogʻ', ru: 'масло' } },
  { id: 'sin', ar: 'س', name: 'سِين', tr: 'sīn', sound: 's', joins: true,
    uz: '“s” — oʻzbekchadagidek.', ru: '«с» — как в русском.',
    ex: { ar: 'سَمَك', tr: 'samak', uz: 'baliq', ru: 'рыба' } },
  { id: 'shin', ar: 'ش', name: 'شِين', tr: 'shīn', sound: 'sh', joins: true,
    uz: '“sh” — “shahar” soʻzidagidek.', ru: '«ш» — мягкое, как в «шёлк».',
    ex: { ar: 'شَمْس', tr: 'shams', uz: 'quyosh', ru: 'солнце' } },
  { id: 'sad', ar: 'ص', name: 'صَاد', tr: 'ṣād', sound: 'ṣ', joins: true, hard: true,
    uz: 'Qalin “s”: tilning orqasi koʻtariladi, ogʻiz “o” ga yaqin ochiladi. Yonidagi unlilar ham qalin eshitiladi.',
    ru: 'Твёрдое «с»: спинка языка приподнята, звук как будто «в бочке». Гласные рядом звучат глуше.',
    ex: { ar: 'صَبَاح', tr: 'ṣabāḥ', uz: 'tong', ru: 'утро' } },
  { id: 'dad', ar: 'ض', name: 'ضَاد', tr: 'ḍād', sound: 'ḍ', joins: true, hard: true,
    uz: 'Qalin “d” (ṣād kabi qalin talaffuz). Arab tiliga xos harf — “ḍād tili” deyiladi.',
    ru: 'Твёрдое «д» (произносится «в бочке», как ṣād). Особая буква — арабский называют «языком ḍād».',
    ex: { ar: 'ضَيْف', tr: 'ḍayf', uz: 'mehmon', ru: 'гость' } },
  { id: 'tah', ar: 'ط', name: 'طَاء', tr: 'ṭāʼ', sound: 'ṭ', joins: true, hard: true,
    uz: 'Qalin “t”: tilning orqasi koʻtariladi, tovush toʻq eshitiladi.', ru: 'Твёрдое «т»: спинка языка приподнята, звук глухой и плотный.',
    ex: { ar: 'طَالِب', tr: 'ṭālib', uz: 'talaba', ru: 'студент' } },
  { id: 'zah', ar: 'ظ', name: 'ظَاء', tr: 'ẓāʼ', sound: 'ẓ', joins: true, hard: true,
    uz: 'Qalin “dh” (ذ ning qalin varianti): til tishlar orasida, tovush toʻq.', ru: 'Твёрдое «dh» (твёрдый вариант ذ): язык между зубами, звук плотный.',
    ex: { ar: 'ظُهْر', tr: 'ẓuhr', uz: 'peshin', ru: 'полдень' } },
  { id: 'ayn', ar: 'ع', name: 'عَيْن', tr: 'ʻayn', sound: 'ʻ', joins: true, hard: true,
    uz: 'Boʻgʻizdan chiqadigan jarangli tovush: tomoqni qisib “a” aytilganda chiqadi. Oʻzbekchada yoʻq — koʻp tinglang.',
    ru: 'Звонкий звук из горла: получается, если сжать горло и сказать «а». В русском нет — слушайте чаще.',
    ex: { ar: 'عَيْن', tr: 'ʻayn', uz: 'koʻz', ru: 'глаз' } },
  { id: 'ghayn', ar: 'غ', name: 'غَيْن', tr: 'ghayn', sound: 'gh', joins: true,
    uz: '“gʻ” — oʻzbekcha “gʻisht” soʻzidagidek.', ru: 'Картавое «г» — как французское «r» или украинское «г», но глубже.',
    ex: { ar: 'غُرْفَة', tr: 'ghurfa', uz: 'xona', ru: 'комната' } },
  { id: 'fa', ar: 'ف', name: 'فَاء', tr: 'fāʼ', sound: 'f', joins: true,
    uz: '“f” — oʻzbekchadagidek.', ru: '«ф» — как в русском.',
    ex: { ar: 'فِيل', tr: 'fīl', uz: 'fil', ru: 'слон' } },
  { id: 'qaf', ar: 'ق', name: 'قَاف', tr: 'qāf', sound: 'q', joins: true,
    uz: '“q” — oʻzbekcha “qalam” soʻzidagidek, chuqur.', ru: 'Глубокое «к» из горла — как узбекское «q».',
    ex: { ar: 'قَلَم', tr: 'qalam', uz: 'qalam', ru: 'ручка, карандаш' } },
  { id: 'kaf', ar: 'ك', name: 'كَاف', tr: 'kāf', sound: 'k', joins: true,
    uz: '“k” — yumshoq, oʻzbekchadagidek.', ru: '«к» — как в русском.',
    ex: { ar: 'كِتَاب', tr: 'kitāb', uz: 'kitob', ru: 'книга' } },
  { id: 'lam', ar: 'ل', name: 'لَام', tr: 'lām', sound: 'l', joins: true,
    uz: '“l” — yumshoq.', ru: '«л» — мягкое, как в «лист».',
    ex: { ar: 'لَيْل', tr: 'layl', uz: 'tun', ru: 'ночь' } },
  { id: 'mim', ar: 'م', name: 'مِيم', tr: 'mīm', sound: 'm', joins: true,
    uz: '“m” — oʻzbekchadagidek.', ru: '«м» — как в русском.',
    ex: { ar: 'مَاء', tr: 'māʼ', uz: 'suv', ru: 'вода' } },
  { id: 'nun', ar: 'ن', name: 'نُون', tr: 'nūn', sound: 'n', joins: true,
    uz: '“n” — oʻzbekchadagidek.', ru: '«н» — как в русском.',
    ex: { ar: 'نُور', tr: 'nūr', uz: 'nur', ru: 'свет' } },
  { id: 'hah', ar: 'ه', name: 'هَاء', tr: 'hāʼ', sound: 'h', joins: true,
    uz: 'Yengil “h” — oʻzbekcha “hayot” soʻzidagidek, nafas bilan.', ru: 'Лёгкое «h» на выдохе — как английское «h» в слове home.',
    ex: { ar: 'هِلَال', tr: 'hilāl', uz: 'hilol (yarim oy)', ru: 'полумесяц' } },
  { id: 'waw', ar: 'و', name: 'وَاو', tr: 'wāw', sound: 'w / ū', joins: false,
    uz: 'Undosh sifatida — lablar bilan “w” (ingliz “water”); unli sifatida — choʻziq “ū”. Keyingi harfga ulanmaydi.',
    ru: 'Как согласный — губное «w» (английское water); как гласный — долгое «ӯ». Не соединяется со следующей.',
    ex: { ar: 'وَرْد', tr: 'ward', uz: 'atirgul', ru: 'розы' } },
  { id: 'ya', ar: 'ي', name: 'يَاء', tr: 'yāʼ', sound: 'y / ī', joins: true,
    uz: 'Undosh sifatida — “y”; unli sifatida — choʻziq “ī”.', ru: 'Как согласный — «й»; как гласный — долгое «ӣ».',
    ex: { ar: 'يَد', tr: 'yad', uz: 'qoʻl', ru: 'рука' } },
];

// Дополнительные знаки
export const EXTRA: Letter[] = [
  { id: 'hamza', ar: 'ء', name: 'هَمْزَة', tr: 'hamza', sound: 'ʼ', joins: false, hard: true,
    uz: 'Toʻxtash tovushi: ovozni bir lahza toʻxtatib, keyin aytish (“taʼlim” dagi tutuq).', ru: 'Гортанная смычка: короткая остановка голоса, как между «а» в «на-адо» при раздельном чтении.',
    ex: { ar: 'سُؤَال', tr: 'suʼāl', uz: 'savol', ru: 'вопрос' } },
  { id: 'tamarbuta', ar: 'ة', name: 'تَاء مَرْبُوطَة', tr: 'tāʼ marbūṭa', sound: '-a / -t', joins: false,
    uz: 'Faqat soʻz oxirida keladi, koʻpincha ayol jinsini bildiradi. Toʻxtab oʻqilganda “a”, davom ettirilganda “t” eshitiladi.',
    ru: 'Только в конце слова, часто показывает женский род. При остановке читается «а», в связной речи — «т».',
    ex: { ar: 'مَدْرَسَة', tr: 'madrasa', uz: 'maktab', ru: 'школа' } },
];

/** Формы буквы: отдельно, в начале, в середине, в конце слова (через соединитель ـ). */
export function forms(l: Letter) {
  const t = 'ـ';
  if (l.id === 'hamza') return { isol: l.ar, init: l.ar, med: l.ar, fin: l.ar };
  if (l.id === 'tamarbuta') return { isol: l.ar, init: '—', med: '—', fin: t + l.ar };
  return l.joins
    ? { isol: l.ar, init: l.ar + t, med: t + l.ar + t, fin: t + l.ar }
    : { isol: l.ar, init: l.ar, med: t + l.ar, fin: t + l.ar };
}

/** Слоги для тренировки: ба би бу, баа бии буу. */
export function syllables(l: Letter) {
  if (l.id === 'alif' || l.id === 'hamza' || l.id === 'tamarbuta') return [];
  const c = l.ar;
  return [
    { ar: c + 'َ', tr: base(l) + 'a' },
    { ar: c + 'ِ', tr: base(l) + 'i' },
    { ar: c + 'ُ', tr: base(l) + 'u' },
    { ar: c + 'َ' + 'ا', tr: base(l) + 'ā' },
    { ar: c + 'ِ' + 'ي', tr: base(l) + 'ī' },
    { ar: c + 'ُ' + 'و', tr: base(l) + 'ū' },
  ];
}
const base = (l: Letter) => ({ waw: 'w', ya: 'y' })[l.id as 'waw' | 'ya'] || l.sound;
