// Огласовки (харакаты) и правила чтения — от простого к сложному.
export interface Haraka {
  id: string;
  sign: string; // знак на букве ب для примера
  name: string; // название по-арабски
  tr: string;
  uz: string;
  ru: string;
  ex: { ar: string; tr: string; uz: string; ru: string }[];
}

export const HARAKAT: Haraka[] = [
  { id: 'fatha', sign: 'بَ', name: 'فَتْحَة', tr: 'fatḥa', uz: 'Harf ustidagi qiyshiq chiziq — “a” tovushi.', ru: 'Косая черта над буквой — звук «а».',
    ex: [{ ar: 'كَتَبَ', tr: 'kataba', uz: 'yozdi', ru: 'написал' }, { ar: 'ذَهَبَ', tr: 'dhahaba', uz: 'ketdi', ru: 'ушёл' }] },
  { id: 'kasra', sign: 'بِ', name: 'كَسْرَة', tr: 'kasra', uz: 'Harf ostidagi qiyshiq chiziq — “i” tovushi.', ru: 'Косая черта под буквой — звук «и».',
    ex: [{ ar: 'سَمِعَ', tr: 'samiʻa', uz: 'eshitdi', ru: 'услышал' }, { ar: 'شَرِبَ', tr: 'shariba', uz: 'ichdi', ru: 'выпил' }] },
  { id: 'damma', sign: 'بُ', name: 'ضَمَّة', tr: 'ḍamma', uz: 'Harf ustidagi kichik “و” — “u” tovushi.', ru: 'Маленькая «و» над буквой — звук «у».',
    ex: [{ ar: 'كُتُب', tr: 'kutub', uz: 'kitoblar', ru: 'книги' }, { ar: 'رُسُل', tr: 'rusul', uz: 'elchilar', ru: 'посланники' }] },
  { id: 'sukun', sign: 'بْ', name: 'سُكُون', tr: 'sukūn', uz: 'Harf ustidagi kichik doira — unli yoʻq, harf yopiq oʻqiladi.', ru: 'Кружок над буквой — гласного нет, согласный читается без гласной.',
    ex: [{ ar: 'قَلْب', tr: 'qalb', uz: 'yurak', ru: 'сердце' }, { ar: 'بِنْت', tr: 'bint', uz: 'qiz', ru: 'девочка' }] },
  { id: 'long', sign: 'بَا بِي بُو', name: 'مَدّ', tr: 'madd', uz: 'Choʻziq unlilar: ـَا = ā, ـِي = ī, ـُو = ū. Ikki baravar uzunroq aytiladi.', ru: 'Долгие гласные: ـَا = ā, ـِي = ī, ـُو = ū. Тянутся вдвое дольше.',
    ex: [{ ar: 'بَاب', tr: 'bāb', uz: 'eshik', ru: 'дверь' }, { ar: 'فِيل', tr: 'fīl', uz: 'fil', ru: 'слон' }, { ar: 'نُور', tr: 'nūr', uz: 'nur', ru: 'свет' }] },
  { id: 'shadda', sign: 'بّ', name: 'شَدَّة', tr: 'shadda', uz: 'Harf ustidagi “w” shaklidagi belgi — harf ikki marta (qoʻsh) aytiladi.', ru: 'Знак в виде «w» над буквой — согласный удваивается.',
    ex: [{ ar: 'أُمّ', tr: 'umm', uz: 'ona', ru: 'мать' }, { ar: 'مُعَلِّم', tr: 'muʻallim', uz: 'oʻqituvchi', ru: 'учитель' }] },
  { id: 'tanwin', sign: 'بٌ بٍ بً', name: 'تَنْوِين', tr: 'tanwīn', uz: 'Qoʻsh belgi soʻz oxirida — “un”, “in”, “an”. Noaniq otni bildiradi.', ru: 'Двойной знак в конце слова — «ун», «ин», «ан». Показывает неопределённость.',
    ex: [{ ar: 'كِتَابٌ', tr: 'kitābun', uz: 'bir kitob', ru: '(какая-то) книга' }, { ar: 'شُكْرًا', tr: 'shukran', uz: 'rahmat', ru: 'спасибо' }] },
  { id: 'al', sign: 'الْ', name: 'أَلْ', tr: 'al-', uz: '“al-” — aniqlik artikli. Quyosh harflari (ت ث د ذ ر ز س ش ص ض ط ظ ل ن) oldida “l” oʻqilmaydi, keyingi harf qoʻsh aytiladi.', ru: '«аль-» — определённый артикль. Перед «солнечными» буквами (ت ث د ذ ر ز س ش ص ض ط ظ ل ن) «л» не читается, следующая буква удваивается.',
    ex: [{ ar: 'الْقَمَر', tr: 'al-qamar', uz: 'oy (oy harfi)', ru: 'луна (лунная буква)' }, { ar: 'الشَّمْس', tr: 'ash-shams', uz: 'quyosh (quyosh harfi)', ru: 'солнце (солнечная буква)' }] },
];
