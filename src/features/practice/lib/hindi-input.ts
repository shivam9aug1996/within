const DEVANAGARI = /[\u0900-\u097f]/u;
/** Canonical roman → Hindi pairs used as the first suggestion. */
export const ROMAN_HINDI: [string, string][] = [
  ["om", "ॐ"],
  ["ram", "राम"],
  ["rama", "राम"],
  ["sita", "सीता"],
  ["sita ram", "सीता राम"],
  ["krishna", "कृष्ण"],
  ["krishan", "कृष्ण"],
  ["radha", "राधा"],
  ["radhe", "राधे"],
  ["radha krishna", "राधा कृष्ण"],
  ["radhe krishna", "राधे कृष्ण"],
  ["hare krishna", "हरे कृष्ण"],
  ["gopal", "गोपाल"],
  ["govinda", "गोविंद"],
  ["hari", "हरि"],
  ["vishnu", "विष्णु"],
  ["narayan", "नारायण"],
  ["narayana", "नारायण"],
  ["madhav", "माधव"],
  ["madhava", "माधव"],
  ["murari", "मुरारी"],
  ["mohan", "मोहन"],
  ["shyam", "श्याम"],
  ["shyama", "श्यामा"],
  ["bal krishan", "बाल कृष्ण"],
  ["balram", "बलराम"],
  ["balaram", "बलराम"],
  ["jagannath", "जगन्नाथ"],
  ["damodar", "दामोदर"],
  ["keshav", "केशव"],
  ["kesav", "केशव"],
  ["mukund", "मुकुंद"],
  ["achyut", "अच्युत"],
  ["anant", "अनंत"],
  ["giridhar", "गिरिधर"],
  ["raghunath", "रघुनाथ"],
  ["raghav", "राघव"],
  ["ramchandra", "रामचंद्र"],
  ["janaki", "जानकी"],
  ["lakshman", "लक्ष्मण"],
  ["shiv", "शिव"],
  ["shiva", "शिव"],
  ["mahadev", "महादेव"],
  ["mahadeva", "महादेव"],
  ["bholenath", "भोलेनाथ"],
  ["bhole nath", "भोलेनाथ"],
  ["shankar", "शंकर"],
  ["rudra", "रुद्र"],
  ["neelkanth", "नीलकंठ"],
  ["nilkanth", "नीलकंठ"],
  ["somnath", "सोमनाथ"],
  ["vishwanath", "विश्वनाथ"],
  ["kedarnath", "केदारनाथ"],
  ["ganesh", "गणेश"],
  ["ganesha", "गणेश"],
  ["ganpati", "गणपति"],
  ["ganapati", "गणपति"],
  ["vighnaharta", "विघ्नहर्ता"],
  ["durga", "दुर्गा"],
  ["durga mata", "दुर्गा माता"],
  ["mata rani", "माता रानी"],
  ["devi", "देवी"],
  ["parvati", "पार्वती"],
  ["uma", "उमा"],
  ["bhavani", "भवानी"],
  ["kali", "काली"],
  ["mahakali", "महाकाली"],
  ["lakshmi", "लक्ष्मी"],
  ["laxmi", "लक्ष्मी"],
  ["saraswati", "सरस्वती"],
  ["hanuman", "हनुमान"],
  ["bajrangbali", "बजरंगबली"],
  ["bajrang bali", "बजरंग बली"],
  ["pawanputra", "पवनपुत्र"],
  ["pavanputra", "पवनपुत्र"],
  ["anjaneya", "अंजनेय"],
  ["maruti", "मारुति"],
  ["sankat mochan", "संकट मोचन"],
  ["jai hanuman", "जय हनुमान"],
  ["waheguru", "वाहेगुरु"],
  ["om namh shivay", "ॐ नमः शिवाय"],
  ["om namah shivay", "ॐ नमः शिवाय"],
  ["om namah shivaya", "ॐ नमः शिवाय"],
  ["om namo shivay", "ॐ नमो शिवाय"],
  ["om namo shivaya", "ॐ नमो शिवाय"],
  ["har har mahadev", "हर हर महादेव"],
  ["om namah parvati pataye", "ॐ नमः पार्वतीपतये"],
  ["jai shiv shankar", "जय शिव शंकर"],
  ["om namo narayan", "ॐ नमो नारायण"],
  ["om namo narayanaya", "ॐ नमो नारायणाय"],
  ["om namo bhagavate vasudevaya", "ॐ नमो भगवते वासुदेवाय"],
  ["om namo bhagwate vasudevay", "ॐ नमो भगवते वासुदेवाय"],
  ["hare krishna hare krishna", "हरे कृष्ण हरे कृष्ण"],
  ["krishna krishna hare hare", "कृष्ण कृष्ण हरे हरे"],
  ["hare ram hare ram", "हरे राम हरे राम"],
  ["ram ram hare hare", "राम राम हरे हरे"],
  ["hare ram hare krishna", "हरे राम हरे कृष्ण"],
  ["hare krishna hare ram", "हरे कृष्ण हरे राम"],
  ["radhe radhe", "राधे राधे"],
  ["jai shri ram", "जय श्री राम"],
  ["jai shree ram", "जय श्री राम"],
  ["jai sri ram", "जय श्री राम"],
  ["shri ram", "श्री राम"],
  ["shree ram", "श्री राम"],
  ["ram ram", "राम राम"],
  ["shri ram jai ram jai jai ram", "श्री राम जय राम जय जय राम"],
  ["shree ram jai ram jai jai ram", "श्री राम जय राम जय जय राम"],
  ["om ramaya namah", "ॐ रामाय नमः"],
  ["om ram ramaya namah", "ॐ राम रामाय नमः"],
  ["om namah hanumate", "ॐ नमः हनुमते"],
  ["om hanumate namah", "ॐ हनुमते नमः"],
  ["om shri hanumate namah", "ॐ श्री हनुमते नमः"],
  ["om anjaneyaya namah", "ॐ अञ्जनेयाय नमः"],
  ["jai bajrangbali", "जय बजरंगबली"],
  ["jai bajrang bali", "जय बजरंग बली"],
  ["om gan ganpataye namah", "ॐ गं गणपतये नमः"],
  ["om gam ganapataye namah", "ॐ गं गणपतये नमः"],
  ["om gan ganpati namah", "ॐ गं गणपति नमः"],
  ["om shri ganeshaya namah", "ॐ श्री गणेशाय नमः"],
  ["om shree ganeshaya namah", "ॐ श्री गणेशाय नमः"],
  ["vakratunda mahakaya", "वक्रतुण्ड महाकाय"],
  ["vakra tunda maha kaya", "वक्रतुण्ड महाकाय"],
  ["ganpati bappa moriya", "गणपति बप्पा मोरया"],
  ["mangal murti moriya", "मंगल मूर्ति मोरया"],
  ["om dum durgaye namah", "ॐ दुं दुर्गायै नमः"],
  ["om durgaye namah", "ॐ दुर्गायै नमः"],
  ["jai mata di", "जय माता दी"],
  ["jai maa durga", "जय माँ दुर्गा"],
  ["om aim hreem kleem chamundaye vichche", "ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे"],
  ["om aim hrim klim chamundaye vichche", "ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे"],
  ["ya devi sarva bhuteshu", "या देवी सर्वभूतेषु"],
  ["sarva mangala mangalye", "सर्वमंगल मांगल्ये"],
  ["om mahalakshmyai namah", "ॐ महालक्ष्म्यै नमः"],
  ["om maha lakshmi namah", "ॐ महालक्ष्मी नमः"],
  ["om shri mahalakshmi namah", "ॐ श्री महालक्ष्मी नमः"],
  ["om aim saraswatyai namah", "ॐ ऐं सरस्वत्यै नमः"],
  ["om saraswati namah", "ॐ सरस्वती नमः"],
  ["om kali kalikaye namah", "ॐ काली कालिकायै नमः"],
  ["om kalikayai namah", "ॐ कालिकायै नमः"],
  ["om namah vishnave", "ॐ नमः विष्णवे"],
  ["om vishnave namah", "ॐ विष्णवे नमः"],
  ["om namo venkateshaya", "ॐ नमो वेंकटेशाय"],
  ["om namo venkateshwaraya", "ॐ नमो वेंकटेश्वराय"],
  ["om namah jagannathaya", "ॐ नमः जगन्नाथाय"],
  ["jai jagannath", "जय जगन्नाथ"],
  ["om namah siddhivinayakaya", "ॐ नमः सिद्धिविनायकाय"],
  ["om namah siddhi vinayakaya", "ॐ नमः सिद्धि विनायकाय"],
  ["waheguru waheguru", "वाहेगुरु वाहेगुरु"],
  ["satnam waheguru", "सतनाम वाहेगुरु"],
  ["om shanti shanti shanti", "ॐ शान्तिः शान्तिः शान्तिः"],
  ["sarve bhavantu sukhinah", "सर्वे भवन्तु सुखिनः"],
  ["lokah samastah sukhino bhavantu", "लोकाः समस्ताः सुखिनो भवन्तु"],
  ["asato ma sadgamaya", "असतो मा सद्गमय"],
  ["tamaso ma jyotirgamaya", "तमसो मा ज्योतिर्गमय"],
  ["mrityor ma amritam gamaya", "मृत्योर्मा अमृतं गमय"],
  ["om purnamadah purnamidam", "ॐ पूर्णमदः पूर्णमिदम्"],
  ["om tryambakam yajamahe", "ॐ त्र्यम्बकं यजामहे"],
  ["om tryambakam yajamahey", "ॐ त्र्यम्बकं यजामहे"],
  ["mrityor mukshiya maamritat", "मृत्योर्मुक्षीय मामृतात्"],
  ["maha mrityunjaya mantra", "महामृत्युंजय मंत्र"],
  ["om rudraya namah", "ॐ रुद्राय नमः"],
  ["om shankaraya namah", "ॐ शंकराय नमः"],
  ["om mahadevaya namah", "ॐ महादेवाय नमः"],
  ["om bhavaya namah", "ॐ भवाय नमः"],
  ["om sharvaya namah", "ॐ शर्वाय नमः"],
  ["om pashupataye namah", "ॐ पशुपतये नमः"],
  ["om nilakanthaya namah", "ॐ नीलकण्ठाय नमः"],
  ["om gangadharaya namah", "ॐ गंगाधराय नमः"],
  ["om kapardine namah", "ॐ कपर्दिने नमः"],
  ["om vishwanathaya namah", "ॐ विश्वनाथाय नमः"],
  ["om kedarnathaya namah", "ॐ केदारनाथाय नमः"],
  ["om narayanaya namah", "ॐ नारायणाय नमः"],
  ["om vasudevaya namah", "ॐ वासुदेवाय नमः"],
  ["om achyutaya namah", "ॐ अच्युताय नमः"],
  ["om anantaya namah", "ॐ अनन्ताय नमः"],
  ["om govindaya namah", "ॐ गोविन्दाय नमः"],
  ["om madhavaya namah", "ॐ माधवाय नमः"],
  ["om keshavaya namah", "ॐ केशवाय नमः"],
  ["om hrishikeshaya namah", "ॐ हृषीकेशाय नमः"],
  ["om damodaraya namah", "ॐ दामोदराय नमः"],
  ["om krishnaya namah", "ॐ कृष्णाय नमः"],
  ["om shri krishnaya namah", "ॐ श्री कृष्णाय नमः"],
  ["om anjaneya namah", "ॐ अञ्जनेय नमः"],
  ["om marutaye namah", "ॐ मारुतये नमः"],
  ["sankat mochan hanuman", "संकट मोचन हनुमान"],
  ["om gan ganapataye namah", "ॐ गं गणपतये नमः"],
  ["om ganeshaya namah", "ॐ गणेशाय नमः"],
  ["om vakratundaya hum", "ॐ वक्रतुण्डाय हुं"],
  ["mangalam bhagavan vishnu", "मंगलं भगवान विष्णु"],
  ["mangalam garudadhwaja", "मंगलं गरुडध्वज"],
  ["mangalam pundarikaksha", "मंगलं पुण्डरीकाक्ष"],
  ["mangalaya tano hari", "मंगलाय तनो हरि"],
  ["om shri durgaye namah", "ॐ श्री दुर्गायै नमः"],
  ["om shri mahalakshmyai namah", "ॐ श्री महालक्ष्म्यै नमः"],
  ["om lakshmyai namah", "ॐ लक्ष्म्यै नमः"],
  ["om saraswatyai namah", "ॐ सरस्वत्यै नमः"],
  ["om shri saraswatyai namah", "ॐ श्री सरस्वत्यै नमः"],
  ["om parvatyai namah", "ॐ पार्वत्यै नमः"],
  ["om gauri namah", "ॐ गौरी नमः"],
  ["om mahakalikayai namah", "ॐ महाकालिकायै नमः"],
  ["sharanagata dinarta paritrana parayane", "शरणागत दीनार्त परित्राण परायणे"],
  ["sarvasyarti hare devi", "सर्वस्यार्तिहरे देवि"],
  ["narayani namostute", "नारायणि नमोऽस्तुते"],
  ["om aim hreem shreem namah", "ॐ ऐं ह्रीं श्रीं नमः"],
  ["om shreem maha lakshmyai namah", "ॐ श्रीं महालक्ष्म्यै नमः"],
  ["om hreem namah", "ॐ ह्रीं नमः"],
  ["om kreem kalikayai namah", "ॐ क्रीं कालिकायै नमः"],
  ["gayatri mantra", "गायत्री मंत्र"],
  ["om bhur bhuvah svah", "ॐ भूर्भुवः स्वः"],
  ["tat savitur varenyam", "तत्सवितुर्वरेण्यं"],
  ["bhargo devasya dhimahi", "भर्गो देवस्य धीमहि"],
  ["dhiyo yo nah prachodayat", "धियो यो नः प्रचोदयात्"],
  ["om bhur bhuvah swaha", "ॐ भूर्भुवः स्वः"],
  ["om adityaya namah", "ॐ आदित्याय नमः"],
  ["om somaya namah", "ॐ सोमाय नमः"],
  ["om angarakaya namah", "ॐ अंगारकाय नमः"],
  ["om budhaya namah", "ॐ बुधाय नमः"],
  ["om brihaspataye namah", "ॐ बृहस्पतये नमः"],
  ["om shukraya namah", "ॐ शुक्राय नमः"],
  ["om shanaischaraya namah", "ॐ शनैश्चराय नमः"],
  ["om rahave namah", "ॐ राहवे नमः"],
  ["om ketave namah", "ॐ केतवे नमः"],
  ["navagraha mantra", "नवग्रह मंत्र"],
  ["surya dev mantra", "सूर्य देव मंत्र"],
  ["om suryaya namah", "ॐ सूर्याय नमः"],
  ["om savitre namah", "ॐ सवित्रे नमः"],
  ["sarve santu niramayah", "सर्वे सन्तु निरामयाः"],
  ["sarve bhadrani pashyantu", "सर्वे भद्राणि पश्यन्तु"],
  ["ma kashchid dukha bhag bhavet", "मा कश्चिद्दुःखभाग्भवेत्"],
  ["om saha navavatu", "ॐ सह नाववतु"],
  ["saha nau bhunaktu", "सह नौ भुनक्तु"],
  ["saha viryam karavavahai", "सह वीर्यं करवावहै"],
  ["tejasvinavadhitamastu", "तेजस्विनावधीतमस्तु"],
  ["ma vidvishavahai", "मा विद्विषावहै"],
  ["om agne naya supatha", "ॐ अग्ने नय सुपथा"],
  ["om asato ma sadgamaya", "ॐ असतो मा सद्गमय"],
  ["om dyauh shantih", "ॐ द्यौः शान्तिः"],
  ["antariksham shantih", "अन्तरिक्षं शान्तिः"],
  ["prithivi shantih", "पृथिवी शान्तिः"],
  ["apah shantih", "आपः शान्तिः"],
  ["oshadhayah shantih", "ओषधयः शान्तिः"],
  ["vanaspatayah shantih", "वनस्पतयः शान्तिः"],
  ["vishvedevah shantih", "विश्वेदेवाः शान्तिः"],
  ["brahma shantih", "ब्रह्म शान्तिः"],
  ["sarvam shantih", "सर्वं शान्तिः"],
  ["shantireva shantih", "शान्तिरेव शान्तिः"],
  ["om tat sat", "ॐ तत् सत्"],
];
const NAMES: Record<string, string[]> = {
  ...Object.fromEntries(ROMAN_HINDI.map(([roman, hindi]) => [roman, [hindi]])),
  om: ["ॐ", "ओम"],
  rama: ["राम", "रामा"],
  krishana: ["कृष्ण"],
  shiva: ["शिव", "शिवा"],
  jai: ["जय"],
  ji: ["जी"],
  jee: ["जी"],
  shri: ["श्री"],
  sri: ["श्री"],
  shree: ["श्री"],
  mata: ["माता"],
  hare: ["हरे"],
  har: ["हर"],
  namah: ["नमः"],
  namh: ["नमः"],
  namo: ["नमो"],
  shivay: ["शिवाय"],
  shivaya: ["शिवाय"],
  "radha ji": ["राधा जी"],
  "ram ji": ["राम जी"],
  "krishna ji": ["कृष्ण जी"],
  "shiva ji": ["शिव जी"],
  "hanuman ji": ["हनुमान जी"],
};
const TOKENS: [string, string][] = [
  ["ksh", "क्ष"],
  ["chh", "छ"],
  ["shr", "श्र"],
  ["gy", "ज्ञ"],
  ["jn", "ज्ञ"],
  ["kh", "ख"],
  ["gh", "घ"],
  ["ch", "च"],
  ["jh", "झ"],
  ["th", "थ"],
  ["dh", "ध"],
  ["ph", "फ"],
  ["bh", "भ"],
  ["ng", "ङ"],
  ["sh", "श"],
  ["aa", "आ"],
  ["ee", "ई"],
  ["ii", "ई"],
  ["oo", "ऊ"],
  ["uu", "ऊ"],
  ["ai", "ऐ"],
  ["au", "औ"],
  ["ri", "ऋ"],
  ["a", "अ"],
  ["i", "इ"],
  ["u", "उ"],
  ["e", "ए"],
  ["o", "ओ"],
  ["k", "क"],
  ["g", "ग"],
  ["c", "च"],
  ["j", "ज"],
  ["t", "त"],
  ["d", "द"],
  ["n", "न"],
  ["p", "प"],
  ["b", "ब"],
  ["m", "म"],
  ["y", "य"],
  ["r", "र"],
  ["l", "ल"],
  ["v", "व"],
  ["w", "व"],
  ["s", "स"],
  ["h", "ह"],
  ["x", "क्ष"],
  ["f", "फ"],
];
const INDEPENDENT = new Set("अआइईउऊऋएऐओऔॐ".split(""));
const MATRA: Record<string, string> = {
  अ: "",
  आ: "ा",
  इ: "ि",
  ई: "ी",
  उ: "ु",
  ऊ: "ू",
  ऋ: "ृ",
  ए: "े",
  ऐ: "ै",
  ओ: "ो",
  औ: "ौ",
};
const ROMAN: [string, string][] = [
  ["क्ष", "ksh"],
  ["त्र", "tr"],
  ["ज्ञ", "gy"],
  ["श्र", "shr"],
  ["ख", "kh"],
  ["घ", "gh"],
  ["छ", "chh"],
  ["च", "ch"],
  ["झ", "jh"],
  ["थ", "th"],
  ["ध", "dh"],
  ["फ", "ph"],
  ["भ", "bh"],
  ["श", "sh"],
  ["ष", "sh"],
  ["क", "k"],
  ["ग", "g"],
  ["ज", "j"],
  ["ट", "t"],
  ["ठ", "th"],
  ["ड", "d"],
  ["ढ", "dh"],
  ["त", "t"],
  ["द", "d"],
  ["न", "n"],
  ["ण", "n"],
  ["प", "p"],
  ["ब", "b"],
  ["म", "m"],
  ["य", "y"],
  ["र", "r"],
  ["ल", "l"],
  ["व", "v"],
  ["स", "s"],
  ["ह", "h"],
  ["ङ", "n"],
  ["ञ", "n"],
  ["आ", "aa"],
  ["इ", "i"],
  ["ई", "ee"],
  ["उ", "u"],
  ["ऊ", "oo"],
  ["ऋ", "ri"],
  ["ए", "e"],
  ["ऐ", "ai"],
  ["ओ", "o"],
  ["औ", "au"],
  ["अ", "a"],
  ["ा", "aa"],
  ["ि", "i"],
  ["ी", "ee"],
  ["ु", "u"],
  ["ू", "oo"],
  ["ृ", "ri"],
  ["े", "e"],
  ["ै", "ai"],
  ["ो", "o"],
  ["ौ", "au"],
  ["ं", "n"],
  ["ँ", "n"],
  ["ः", "h"],
  ["्", ""],
  ["ॐ", "om"],
];
export function hasDevanagari(text: string) {
  return DEVANAGARI.test(text);
}
export function titleCase(text: string) {
  return text
    .normalize("NFC")
    .trim()
    .split(/\s+/u)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
function unique(values: string[], limit = 4) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const item = value.normalize("NFC").trim();
    if (!item || seen.has(item)) continue;
    seen.add(item);
    result.push(item);
    if (result.length === limit) break;
  }
  return result;
}
function tokenize(word: string) {
  const lower = word.toLowerCase();
  const tokens: string[] = [];
  let i = 0;
  while (i < lower.length) {
    if (lower[i] === " ") {
      tokens.push(" ");
      i += 1;
      continue;
    }
    const match = TOKENS.find(([latin]) => lower.startsWith(latin, i));
    if (!match) {
      i += 1;
      continue;
    }
    tokens.push(match[1]);
    i += match[0].length;
  }
  return tokens;
}
function lettersToHindi(tokens: string[], longA: boolean) {
  let out = "";
  let pending: string | null = null;
  const flush = (vowel?: string) => {
    if (!pending) {
      if (vowel) out += vowel;
      return;
    }
    out += pending;
    if (vowel && vowel !== "अ") out += MATRA[vowel] ?? "";
    pending = null;
  };
  for (const token of tokens) {
    if (token === " ") {
      flush();
      out += " ";
      continue;
    }
    if (INDEPENDENT.has(token)) {
      flush(token === "अ" && pending && longA ? "आ" : token);
      continue;
    }
    pending = pending ? `${pending}्${token}` : token;
  }
  flush();
  return out;
}
/** Unknown words: long `a` first (राम, बाल), then the short reading. */
function phoneticHindi(word: string) {
  const tokens = tokenize(word);
  if (!tokens.length) return [];
  return unique([lettersToHindi(tokens, true), lettersToHindi(tokens, false)]);
}
function knownSpellings(text: string) {
  if (NAMES[text]) return NAMES[text];
  for (let i = 0; i < text.length - 1; i++) {
    if (text[i] === " " || text[i + 1] === " " || text[i] === text[i + 1]) continue;
    const swapped = `${text.slice(0, i)}${text[i + 1]}${text[i]}${text.slice(i + 2)}`;
    if (NAMES[swapped]) return NAMES[swapped];
  }
}
/** Typed word is the known word, a swap, or a short prefix (`nam` → `namah`). */
function wordFitsKnown(typed: string, known: string) {
  if (typed === known) return true;
  const typedHindi = knownSpellings(typed)?.[0];
  if (typedHindi && typedHindi === NAMES[known]?.[0]) return true;
  return typed.length >= 3 && (known.startsWith(typed) || typed.startsWith(known));
}
/**
 * Whole-phrase “did you mean”, like Translate on `om nam shivay`.
 * Single words stay phonetic so `nam` alone is not नमः.
 */
function closePhraseSpellings(text: string) {
  const typed = text.split(" ");
  if (typed.length < 2) return;
  let best: { misses: number; hindi: string[] } | undefined;
  for (const [key, hindi] of Object.entries(NAMES)) {
    const known = key.split(" ");
    if (known.length !== typed.length) continue;
    if (!typed.every((word, i) => wordFitsKnown(word, known[i]))) continue;
    const misses = typed.filter((word, i) => word !== known[i]).length;
    if (!best || misses < best.misses) best = { misses, hindi };
  }
  return best?.hindi;
}
function spellingsForWord(word: string) {
  const known = knownSpellings(word);
  if (known) return unique(known);
  return phoneticHindi(word);
}
function spellingsForPhrase(words: string[]) {
  let phrases = [""];
  for (const word of words) {
    const next: string[] = [];
    for (const prefix of phrases) {
      for (const spelling of spellingsForWord(word)) {
        next.push(prefix ? `${prefix} ${spelling}` : spelling);
      }
    }
    // Cap after each word so longer mantras still include every token.
    phrases = unique(next);
  }
  return phrases.filter(Boolean);
}
export function suggestHindi(input: string) {
  const text = input.normalize("NFC").trim().toLowerCase().replace(/\s+/gu, " ");
  if (!text || hasDevanagari(text)) return [];
  const known = knownSpellings(text);
  if (known) return unique([...known, ...spellingsForPhrase(text.split(" "))]);
  const close = closePhraseSpellings(text);
  if (close) return unique(close);
  return unique(spellingsForPhrase(text.split(" ")));
}
function takePrefix(text: string, i: number) {
  for (const [hindi, latin] of ROMAN) {
    if (text.startsWith(hindi, i)) return { hindi, latin };
  }
  return text[i] ? { hindi: text[i], latin: text[i] } : null;
}
export function romanize(text: string) {
  const source = text.normalize("NFC");
  let out = "";
  let i = 0;
  while (i < source.length) {
    if (source[i] === " " || source[i] === "ॐ") {
      if (source[i] === "ॐ") out += out && !out.endsWith(" ") ? " om" : "om";
      else out += " ";
      i += 1;
      continue;
    }
    const part = takePrefix(source, i);
    if (!part) {
      i += 1;
      continue;
    }
    i += part.hindi.length;
    const consonant = !INDEPENDENT.has(part.hindi) && !MATRA[part.hindi] && part.hindi !== "्";
    out += part.latin;
    if (!consonant) continue;
    const next = takePrefix(source, i);
    if (!next || next.hindi === " " || INDEPENDENT.has(next.hindi)) out += "a";
    else if (next.hindi === "्") {
      i += next.hindi.length;
    } else if (MATRA[next.hindi] !== undefined && next.hindi !== "अ" && next.hindi.length === 1 && "ािीुूृेैोौंःँ".includes(next.hindi)) {
      // matra follows; do not add inherent a
    } else if (!"ािीुूृेैोौ्ंःँ".includes(next.hindi)) out += "a";
  }
  return out.replace(/\s+/gu, " ").trim();
}
function fromHindiDictionary(text: string) {
  const needle = text.normalize("NFC").trim();
  const matches: string[] = [];
  for (const [english, hindi] of Object.entries(NAMES)) {
    if (hindi.includes(needle)) matches.push(titleCase(english));
  }
  return matches;
}
export function suggestEnglish(input: string) {
  const text = input.normalize("NFC").trim();
  if (!text || !hasDevanagari(text)) return [];
  const roman = romanize(text);
  const dropped = roman.replace(/a$/u, "");
  return unique([
    ...fromHindiDictionary(text),
    titleCase(roman),
    titleCase(dropped),
  ]);
}
export function suggestOtherScript(input: string) {
  const text = input.trim();
  if (!text) return { script: "hi" as const, options: [] };
  if (hasDevanagari(text)) return { script: "en" as const, options: suggestEnglish(text) };
  return { script: "hi" as const, options: suggestHindi(text) };
}
/** Pair the typed name with a chosen (or first) spelling in the other script. */
export function resolveCustomChoice(typed: string, picked = "") {
  const text = typed.normalize("NFC").trim().replace(/\s+/gu, " ");
  const { options } = suggestOtherScript(text);
  const other = options.includes(picked.normalize("NFC").trim())
    ? picked.normalize("NFC").trim()
    : (options[0] ?? "");
  if (hasDevanagari(text)) {
    return {
      selection: "custom" as const,
      custom: text,
      customHindi: text,
      customEnglish: other,
    };
  }
  return {
    selection: "custom" as const,
    custom: other || text,
    customHindi: other,
    customEnglish: text ? titleCase(text) : "",
  };
}