import type { Dialogue, Vocab } from "@/components/LessonClip";
import clipVideo from "@/assets/clip01.mp4.asset.json";
import clipVideo2 from "@/assets/clip02.mp4.asset.json";
import clipVideo3 from "@/assets/clip03.mp4.asset.json";
import clipVideo4 from "@/assets/clip04.mp4.asset.json";
import clipVideo5 from "@/assets/clip05.mp4.asset.json";
import clipVideo6 from "@/assets/clip06.mp4.asset.json";

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
];
