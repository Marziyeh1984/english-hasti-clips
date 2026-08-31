import type { Dialogue, Vocab } from "@/components/LessonClip";
import clipVideo from "@/assets/clip01.mp4.asset.json";
import clipVideo2 from "@/assets/clip02.mp4.asset.json";
import clipVideo3 from "@/assets/clip03.mp4.asset.json";
import clipVideo4 from "@/assets/clip04.mp4.asset.json";
import clipVideo5 from "@/assets/clip05.mp4.asset.json";
import clipVideo6 from "@/assets/clip06.mp4.asset.json";
import clipVideo7 from "@/assets/clip07.mp4.asset.json";
import clipVideo8 from "@/assets/clip08.mp4.asset.json";
import clipVideo9 from "@/assets/clip09.mp4.asset.json";
import clipVideo10 from "@/assets/clip10.mp4.asset.json";
import clipVideo11 from "@/assets/clip11.mp4.asset.json";
import clipVideo12 from "@/assets/clip12.mp4.asset.json";


export type Lesson = {
  id: string;
  videoUrl: string;
  badge: string;
  title: string;
  dialogues: Dialogue[];
  vocab: Vocab[];
};

const CLIP1_DIALOGUES: Dialogue[] = [
  { en: "I got mixed up with loan sharks, man.", fa: "داداش، گرفتار رباخوارها شدم.", t: 0 },
  { en: "They won't back off.", fa: "ول‌کن ماجرا نیستن.", t: 2.12 },
  { en: "I'm trying to build an empire, okay?", fa: "دارم سعی می‌کنم یه کسب‌وکار بزرگ راه بندازم، باشه؟", t: 3.54 },
  { en: "So you owe them $10,000.", fa: "پس ۱۰ هزار دلار بهشون بدهکاری؟", t: 5.94 },
  { en: "Couldn't get the money anywhere else.", fa: "از هیچ جای دیگه‌ای نتونستم پول جور کنم.", t: 10.1 },
  {
    en: "I didn't know any black folks invest in their house music,",
    fa: "هیچ آدم سیاه‌پوستی رو نمی‌شناختم که حاضر باشه روی خانه موسیقی سرمایه‌گذاری کنه،",
    t: 11.9,
  },
  {
    en: "so until I pay them back, they're gonna keep coming in.",
    fa: "برای همین تا وقتی پولشون رو پس ندم، مدام سر و کله‌شون پیدا می‌شه.",
    t: 14.36,
  },
  { en: "What a money!", fa: "چه پولی؟! / این همه پول از کجا بیارم؟!", t: 16.3 },
  { en: "No, I just...", fa: "نه، من فقط... / نه، منظورم اینه که...", t: 17.0 },
];

const CLIP1_VOCAB: Vocab[] = [
  { en: "Get mixed up with (someone/something)", fa: "درگیرِ چیزی/کسی شدن، گرفتار شدن" },
  { en: "Loan sharks", fa: "نزول‌خوارها / رباخوارها (افرادی که با بهره‌های سنگین و غیرقانونی پول قرض می‌دهند)" },
  { en: "Back off", fa: "کوتاه آمدن، دست برداشتن، عقب کشیدن" },
  { en: "Build an empire", fa: "یک امپراتوری/کسب‌وکار بزرگ ساختن، موفقیت بزرگی ایجاد کردن" },
  { en: "Owe (someone) money", fa: "به کسی پول بدهکار بودن" },
  { en: "Get money / get the money", fa: "پول جور کردن، پول تهیه کردن" },
  { en: "Pay someone back", fa: "پول کسی را پس دادن، بدهی را پرداخت کردن" },
  { en: "Keep coming in", fa: "مدام آمدن، مرتب سر و کله پیدا کردن" },
  { en: "I just...", fa: "من فقط... / نه، منظورم اینه که..." },
];

const CLIP2_DIALOGUES: Dialogue[] = [
  { en: "Kelly, it's been a week. I was starting to worry.", fa: "کلی، یه هفته‌ست خبری ازت نبود. داشتم نگران می‌شدم.", t: 1.9 },
  { en: "No, I'm okay.", fa: "نه، خوبم.", t: 4.76 },
  { en: "My gallbladder was giving me trouble.", fa: "کیسه صفرا‌م اذیتم می‌کرد.", t: 5.8 },
  { en: "Oh.", fa: "اوه…", t: 8.88 },
  { en: "How'd the little one like the locket?", fa: "اون کوچولوهه از اون گردنبند (گردنبندِ قاب‌دار) خوشش اومد؟", t: 9.5 },
  { en: "Oh, I'm saving it for her birthday.", fa: "نه، گذاشتم برای تولدش / نگهش داشتم برای تولدش.", t: 12.36 },
  { en: "She'll love that. How much?", fa: "خیلی خوشحال میشه. چقدر شد؟", t: 15.1 },
  { en: "Five bucks.", fa: "پنج دلار.", t: 20.38 },
];

const CLIP2_VOCAB: Vocab[] = [
  { en: "It's been a week", fa: "یک هفته گذشته / یک هفته‌ست که..." },
  { en: "Give someone trouble", fa: "اذیت کردن، دردسر ایجاد کردن، مشکل ایجاد کردن" },
  { en: "Gallbladder", fa: "کیسه صفرا" },
  { en: "How'd (How did)", fa: "چطور / چگونه (شکل کوتاه و محاوره‌ای)" },
  { en: "The little one", fa: "کوچولو / بچه کوچولو — خطاب محبت‌آمیز برای کودک" },
  { en: "Locket", fa: "گردنبند قاب‌دار (معمولاً برای گذاشتن عکس یا یادگاری داخل آن)" },
  { en: "Save something for someone/something", fa: "چیزی را برای کسی یا چیزی نگه داشتن" },
  { en: "She'll love that", fa: "خیلی خوشش میاد / عاشقش میشه — will برای پیش‌بینی یا اطمینان از آینده" },
  { en: "How much?", fa: "چقدر؟ / قیمتش چنده؟" },
  { en: "Five bucks", fa: "پنج دلار — buck در محاوره یعنی «دلار» (20 bucks = ۲۰ دلار)" },
];

const CLIP3_DIALOGUES: Dialogue[] = [
  { en: "What's wrong?", fa: "چی شده؟", t: 0 },
  { en: "What's happened?", fa: "چی اتفاق افتاده؟", t: 1.6 },
  { en: "It's Nick.", fa: "درمورد نیکه.", t: 3.0 },
  { en: "He's having an affair.", fa: "داره به من خیانت می‌کنه / رابطه‌ی پنهانی داره.", t: 4.3 },
  { en: "I saw him with her. They were kissing in the street.", fa: "دیدمش با اون زن. داشتن تو خیابون همدیگه رو می‌بوسیدن.", t: 7.32 },
  { en: "It wasn't a friendly kiss.", fa: "اون یه بوسه‌ی دوستانه نبود.", t: 10.5 },
  { en: "So, it's okay for you, but not for him.", fa: "پس یعنی برای تو اوکیه، ولی برای اون نه؟", t: 13.32 },
  { en: "I know what Sam's about, but this thing with Nick…", fa: "من می‌دونم سم چه آدمیه و داستانش چیه، ولی این قضیه‌ی نیک…", t: 17.24 },
];

const CLIP3_VOCAB: Vocab[] = [
  { en: "What's wrong?", fa: "چی شده؟ / مشکل چیه؟ — برای پرسیدن دلیل ناراحتی یا مشکل" },
  { en: "What's happened?", fa: "چی اتفاق افتاده؟ — پرسش درباره‌ی اتفاقی که افتاده" },
  { en: "It's Nick.", fa: "نیکه / موضوع نیکه — یعنی مشکل مربوط به نیک است" },
  { en: "Have an affair", fa: "رابطه‌ی پنهانی داشتن / خیانت کردن" },
  { en: "They were kissing", fa: "داشتند همدیگر را می‌بوسیدند — were + ing یعنی کاری که در گذشته در حال انجام بوده" },
  { en: "A friendly kiss", fa: "بوسه‌ی دوستانه — بوسه‌ای بدون منظور عاشقانه" },
  { en: "What someone is about", fa: "شخصیت، هدف یا طرز فکر کسی" },
  { en: "This thing with Nick", fa: "این قضیه با نیک — thing with someone یعنی «موضوع یا ماجرا با یک نفر»" },
];

const CLIP4_DIALOGUES: Dialogue[] = [
  { en: "Thanks. Bye, Dad.", fa: "ممنون. خداحافظ، بابا.", t: 3.04 },
  { en: "Bye, sweetie.", fa: "خداحافظ، عزیزم.", t: 4.14 },
  { en: "I love you.", fa: "دوستت دارم.", t: 5.08 },
  { en: "I love you, too.", fa: "من هم دوستت دارم.", t: 6.0 },
];

const CLIP4_VOCAB: Vocab[] = [
  { en: "Sweetie", fa: "عزیزم / جانم / نازنینم — خطاب محبت‌آمیز، مخصوصاً از طرف والدین به فرزند یا بین افراد نزدیک" },
];

const CLIP5_DIALOGUES: Dialogue[] = [
  { en: "Excuse me. Where's the rice pudding?", fa: "ببخشید. پودینگ برنج کجاست؟", t: 0 },
  { en: "Uh, second aisle on the right next to the vacuum cleaner bags.", fa: "اِم، راهروی دوم سمت راست، کنار کیسه‌های جاروبرقی.", t: 4.4 },
  { en: "Thanks.", fa: "ممنون.", t: 7.48 },
  { en: "Sure. That's right.", fa: "خواهش می‌کنم. درست همینه.", t: 8.02 },
  { en: "Can I use my oil receipt?", fa: "می‌تونم از رسید روغنم استفاده کنم؟", t: 10.18 },
  { en: "Yes, please.", fa: "بله، لطفاً.", t: 11.78 },
  { en: "Have a nice day. Bye.", fa: "روز خوبی داشته باشید. خداحافظ.", t: 12.52 },
  { en: "Hello.", fa: "سلام.", t: 14.24 },
  { en: "Hello.", fa: "سلام.", t: 14.78 },
  { en: "Yeah, I think we got everything here.", fa: "آره، فکر کنم همه‌چیز رو گرفتیم.", t: 16.82 },
  { en: "592, please.", fa: "۵۹۲ لطفاً.", t: 19.26 },
  { en: "With pleasure.", fa: "با کمال میل. / خوشحال می‌شوم.", t: 21.28 },
];

const CLIP5_VOCAB: Vocab[] = [
  { en: "Where's ...?", fa: "... کجاست؟ — برای پرسیدن محل چیزی" },
  { en: "Aisle", fa: "راهروی فروشگاه (فضای بین قفسه‌ها)" },
  { en: "Next to", fa: "کنارِ / نزدیکِ" },
  { en: "Have a nice day", fa: "روز خوبی داشته باشید — احوال‌پرسی پایانی مؤدبانه" },
  { en: "With pleasure", fa: "با کمال میل — پاسخ مؤدبانه به درخواست" },
];

const CLIP6_DIALOGUES: Dialogue[] = [
  { en: "No, I didn't have time.", fa: "نه، وقت نداشتم.", t: 3.78 },
  { en: "Hey, are you out of your mind? What was that about?", fa: "هی، دیوونه شدی؟ این دیگه چی بود؟", t: 14.36 },
  { en: "Sorry. I'm... I'm going home.", fa: "ببخشید. من... من دارم می‌رم خونه.", t: 17.68 },
  { en: "You're going home?", fa: "داری می‌ری خونه؟", t: 20.2 },
  { en: "I'm just too much work.", fa: "کارم خیلی زیاده. / خیلی تحت فشار کارم.", t: 21.24 },
  { en: "Yeah, I'm serious. I don't have time for all of it.", fa: "آره، جدی می‌گم. برای همهٔ این‌ها وقت ندارم.", t: 22.84 },
  { en: "I totally agree. They're monsters. They give us way too much work.", fa: "کاملاً موافقم. آن‌ها هیولا هستند. خیلی بیشتر از حد معمول به ما کار می‌دهند.", t: 25.52 },
  { en: "Yeah, totally.", fa: "آره، کاملاً.", t: 29.44 },
  { en: "Yeah. No, I didn't even know we were supposed to do that.", fa: "آره. نه، من حتی نمی‌دونستم قرار بود ما اون کار رو انجام بدیم.", t: 30.48 },
];

const CLIP6_VOCAB: Vocab[] = [
  { en: "Not yet", fa: "هنوز نه" },
  { en: "I didn't have time", fa: "وقت نداشتم" },
  { en: "Are you out of your mind?", fa: "دیوونه شدی؟ / عقلت رو از دست دادی؟" },
  { en: "What was that about?", fa: "اون دیگه چی بود؟ / قضیه چی بود؟" },
  { en: "I don't have time for all of it", fa: "برای همهٔ این‌ها وقت ندارم" },
  { en: "Way too much", fa: "خیلی بیش از حد" },
];

const CLIP7_DIALOGUES: Dialogue[] = [
  { en: "Who the hell is Sasha?", fa: "ساشا دیگه کیه؟ / ساشا کیه این وسط؟", t: 1.22 },
  { en: "You heard me.", fa: "شنیدی چی گفتم. / حرفم رو شنیدی.", t: 5.44 },
  { en: "Okay. So, you're just going to ignore me?", fa: "باشه. یعنی همین‌طوری می‌خوای منو نادیده بگیری؟", t: 7.44 },
  { en: "Why are you searching through my phone?", fa: "چرا داری گوشی منو زیر و رو می‌کنی؟", t: 9.34 },
  { en: "Do not answer my question with another question.", fa: "با سؤال، جواب سؤال منو نده.", t: 10.92 },
  {
    en: "No, that's the kind of thing that makes me think I can't trust you.",
    fa: "نه، این کارا باعث می‌شه شک کنم که می‌شه بهت اعتماد کرد یا نه.",
    t: 13.26,
  },
];

const CLIP7_VOCAB: Vocab[] = [
  { en: "Who the hell...?", fa: "دیگه کیه...؟ / این ... کیه؟ — برای تعجب یا عصبانیت. مثال: Who the hell are you? «تو دیگه کی هستی؟»" },
  { en: "You heard me.", fa: "شنیدی چی گفتم. / حرفم رو شنیدی." },
  { en: "Ignore someone", fa: "کسی را نادیده گرفتن، محل نگذاشتن" },
  { en: "Search through something", fa: "داخل چیزی را گشتن، زیر و رو کردن" },
  { en: "Answer a question with a question", fa: "جواب سؤال را با سؤال دادن" },
  { en: "The kind of thing that...", fa: "از اون چیزهایی که... / همون چیزی که... — مثال: That's the kind of thing I hate. «این همون چیزیه که ازش متنفرم.»" },
  { en: "Make someone think...", fa: "باعث شدن کسی فکر کند که..." },
  { en: "Trust someone", fa: "به کسی اعتماد داشتن" },
];

const CLIP8_DIALOGUES: Dialogue[] = [
  { en: "Can I help you?", fa: "می‌تونم کمکتون کنم؟", t: 1.66 },
  { en: "Do you recognize me?", fa: "منو می‌شناسی؟", t: 5.1 },
  { en: "Uh, no.", fa: "اِم، نه.", t: 8.26 },
  { en: "Can we talk for a minute alone?", fa: "می‌تونیم یه دقیقه تنها حرف بزنیم؟", t: 10.46 },
  { en: "Do you have a moment?", fa: "یه لحظه وقت داری؟", t: 13.84 },
  { en: "Totally weird.", fa: "خیلی عجیبه.", t: 14.88 },
  { en: "Wait a minute, please.", fa: "لطفاً یه لحظه صبر کن.", t: 15.8 },
  { en: "There's something I want to tell you.", fa: "یه چیزی هست که می‌خوام بهت بگم.", t: 17.44 },
];

const CLIP8_VOCAB: Vocab[] = [
  { en: "Do you recognize me?", fa: "منو می‌شناسی؟" },
  { en: "Talk for a minute", fa: "یه لحظه صحبت کردن" },
  { en: "Alone", fa: "تنها، دونفره" },
  { en: "Weird", fa: "عجیب، غیرعادی، ناجور" },
  { en: "Wait a minute", fa: "یه لحظه صبر کن" },
  { en: "There's something I want to tell you", fa: "یه چیزی می‌خوام بهت بگم — عبارت بسیار رایج" },
];

const CLIP9_DIALOGUES: Dialogue[] = [
  { en: "There's something I want to tell you.", fa: "یه چیزی هست که می‌خوام بهت بگم.", t: 0 },
  { en: "It won't take long.", fa: "زیاد طول نمی‌کشه.", t: 3.0 },
  { en: "Mom, that woman over there, she's kind of strange.", fa: "مامان، اون زنه اونجا یه جورایی عجیبه.", t: 6.24 },
  { en: "What do you want?", fa: "چی می‌خوای؟", t: 10.74 },
  { en: "You kidnapped my child.", fa: "تو بچهٔ منو دزدیدی.", t: 12.0 },
  { en: "WHAT? YOU KIDNAPPED MY CHILD.", fa: "چی؟! تو بچهٔ منو دزدیدی!", t: 14.74 },
  { en: "What is wrong with you?", fa: "مشکلت چیه؟", t: 16.2 },
  { en: "She is my daughter.", fa: "اون دختر منه.", t: 17.2 },
  { en: "Stop it.", fa: "بس کن.", t: 18.0 },
  { en: "GET OUT OF HERE.", fa: "از اینجا برو بیرون.", t: 18.7 },
  { en: "STOP IT. GET OUT OF HERE NOW.", fa: "بس کن! همین الان از اینجا برو بیرون!", t: 19.2 },
  { en: "GO. GO.", fa: "برو! برو!", t: 19.8 },
  { en: "GET OUT OF HERE.", fa: "از اینجا برو.", t: 20.2 },
];

const CLIP9_VOCAB: Vocab[] = [
  { en: "It won't take long", fa: "طول نمی‌کشه / زیاد وقتت رو نمی‌گیرم." },
  { en: "Over there", fa: "اونجا / آن طرف." },
  { en: "Kind of", fa: "یه جورایی / تا حدی." },
  { en: "Strange", fa: "عجیب / غیرعادی." },
  { en: "What do you want?", fa: "چی می‌خوای؟ / چه کار داری؟" },
  { en: "Kidnap someone", fa: "کسی را دزدیدن / ربودن." },
  { en: "What is wrong with you?", fa: "مشکلت چیه؟ / چته؟ (برای عصبانیت یا تعجب)" },
  { en: "Stop it", fa: "بس کن / دست بردار." },
  { en: "Get out of here", fa: "از اینجا برو بیرون." },
];

const CLIP10_DIALOGUES: Dialogue[] = [
  { en: "This is the hallway.", fa: "این راهرو است.", t: 0 },
  { en: "Um, I would suggest that we sit in the living room.", fa: "اِم... پیشنهاد می‌کنم بریم توی اتاق نشیمن بشینیم.", t: 2.32 },
  { en: "Yeah.", fa: "آره.", t: 6.1 },
  { en: "May I introduce you to your sister?", fa: "اجازه می‌دی خواهرت رو بهت معرفی کنم؟", t: 7.66 },
  { en: "So, you're Angelina?", fa: "پس تو آنجلینا هستی؟", t: 12.38 },
  { en: "Yeah. Um, and you're Meech?", fa: "آره. اِم... و تو میچ هستی؟", t: 14.22 },
  { en: "Meech.", fa: "میچ.", t: 15.4 },
  { en: "Michelle?", fa: "میشل؟", t: 16.0 },
  { en: "Meech.", fa: "میچ.", t: 16.66 },
];

const CLIP10_VOCAB: Vocab[] = [
  { en: "Hallway", fa: "راهرو / دالان." },
  { en: "I would suggest...", fa: "پیشنهاد می‌کنم... — عبارتی مؤدبانه برای دادن پیشنهاد." },
  { en: "That we sit", fa: "که ما بنشینیم." },
  { en: "Living room", fa: "اتاق نشیمن / پذیرایی." },
  { en: "May I introduce you to...?", fa: "اجازه می‌دی معرفی کنم...؟ — عبارت بسیار مؤدبانه برای معرفی کسی." },
  { en: "Your sister", fa: "خواهرت." },
  { en: "So, you're...?", fa: "پس تو... هستی؟ — برای تأیید هویت یا آشنایی." },
];

const CLIP11_DIALOGUES: Dialogue[] = [
  { en: "You want something to drink?", fa: "چیزی برای نوشیدن می‌خوای؟", t: 0 },
  { en: "Yes. Uh, water, please.", fa: "بله. اِم، لطفاً آب.", t: 0.84 },
  { en: "Coming right up.", fa: "الان میارم.", t: 2.64 },
  { en: "Thanks.", fa: "ممنون.", t: 3.8 },
  {
    en: "Um, so this, um, is our living room as you can see.",
    fa: "اِم، خب، اینجا همان‌طور که می‌بینی، اتاق نشیمن ماست.",
    t: 6.76,
  },
  { en: "So, um, we have two bedrooms.", fa: "خب، ما دو تا اتاق خواب داریم.", t: 10.72 },
  {
    en: "Angie, would you like to show her your room?",
    fa: "آنجی، دوست داری اتاقت را به او نشان بدهی؟",
    t: 12.56,
  },
];

const CLIP11_VOCAB: Vocab[] = [
  { en: "Something to drink", fa: "چیزی برای نوشیدن." },
  { en: "Coming right up", fa: "الان میارم / همین الان آماده می‌کنم — عبارت رایج در رستوران، خانه یا خدمات." },
  { en: "As you can see", fa: "همان‌طور که می‌بینید." },
  { en: "Living room", fa: "اتاق نشیمن / پذیرایی." },
  { en: "Bedroom", fa: "اتاق خواب." },
  { en: "Would you like to...?", fa: "دوست داری...؟ — روشی مؤدبانه برای پیشنهاد یا درخواست." },
  { en: "Show someone something", fa: "چیزی را به کسی نشان دادن." },
];

export const LESSONS: Lesson[] = [
  {
    id: "clip01",
    videoUrl: clipVideo.url,
    badge: "Clip 01 · Drama",
    title: "Loan Sharks",
    dialogues: CLIP1_DIALOGUES,
    vocab: CLIP1_VOCAB,
  },
  {
    id: "clip02",
    videoUrl: clipVideo2.url,
    badge: "Clip 02 · Drama",
    title: "The Locket",
    dialogues: CLIP2_DIALOGUES,
    vocab: CLIP2_VOCAB,
  },
  {
    id: "clip03",
    videoUrl: clipVideo3.url,
    badge: "Clip 03 · Drama",
    title: "The Affair",
    dialogues: CLIP3_DIALOGUES,
    vocab: CLIP3_VOCAB,
  },
  {
    id: "clip04",
    videoUrl: clipVideo4.url,
    badge: "Clip 04 · Family",
    title: "Bye, Sweetie",
    dialogues: CLIP4_DIALOGUES,
    vocab: CLIP4_VOCAB,
  },
  {
    id: "clip05",
    videoUrl: clipVideo5.url,
    badge: "Clip 05 · Daily Life",
    title: "At the Supermarket",
    dialogues: CLIP5_DIALOGUES,
    vocab: CLIP5_VOCAB,
  },
  {
    id: "clip06",
    videoUrl: clipVideo6.url,
    badge: "Clip 06 · Drama",
    title: "Too Much Work",
    dialogues: CLIP6_DIALOGUES,
    vocab: CLIP6_VOCAB,
  },
  {
    id: "clip07",
    videoUrl: clipVideo7.url,
    badge: "Clip 07 · Drama",
    title: "Who Is Sasha?",
    dialogues: CLIP7_DIALOGUES,
    vocab: CLIP7_VOCAB,
  },
  {
    id: "clip08",
    videoUrl: clipVideo8.url,
    badge: "Clip 08 · Drama",
    title: "Do You Recognize Me?",
    dialogues: CLIP8_DIALOGUES,
    vocab: CLIP8_VOCAB,
  },
  {
    id: "clip09",
    videoUrl: clipVideo9.url,
    badge: "Clip 09 · Drama",
    title: "You Kidnapped My Child",
    dialogues: CLIP9_DIALOGUES,
    vocab: CLIP9_VOCAB,
  },
  {
    id: "clip10",
    videoUrl: clipVideo10.url,
    badge: "Clip 10 · Family",
    title: "Meet the Sister",
    dialogues: CLIP10_DIALOGUES,
    vocab: CLIP10_VOCAB,
  },
  {
    id: "clip11",
    videoUrl: clipVideo11.url,
    badge: "Clip 11 · Family",
    title: "The House Tour",
    dialogues: CLIP11_DIALOGUES,
    vocab: CLIP11_VOCAB,
  },
];
