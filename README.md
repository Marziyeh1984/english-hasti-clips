# English Hasti Clips

<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>English Hasti — یادگیری انگلیسی با فیلم و سریال</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;700&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #0b1a11;
    --bg2:      #101e15;
    --card:     #131f16;
    --border:   #1d3326;
    --gold:     #c9a94f;
    --gold-hover: #d9be73;
    --text:     #eee8db;
    --muted:    #7a9e89;
    --green-chip: #1a3323;
    --radius:   14px;
    --font:     'Vazirmatn', 'Tahoma', sans-serif;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: var(--font);
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* ── PAGES ── */
  .page { display: none; }
  .page.active { display: block; }

  /* ── NAV ── */
  nav {
    position: sticky; top: 0; z-index: 200;
    background: rgba(11,26,17,0.95);
    backdrop-filter: blur(12px);
    border-bottom: 0.5px solid var(--border);
    padding: 14px 20px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .logo { font-size: 15px; font-weight: 700; color: var(--text); }
  .logo span { color: var(--gold); }
  .btn-gold {
    background: var(--gold); color: #0b1a11;
    border: none; border-radius: 50px;
    padding: 9px 20px; font-size: 13px; font-weight: 700;
    cursor: pointer; font-family: var(--font);
    transition: background 0.18s;
  }
  .btn-gold:hover { background: var(--gold-hover); }

  /* ── HERO ── */
  .hero {
    padding: 48px 24px 36px;
    text-align: center;
  }
  .eyebrow {
    display: inline-block;
    background: var(--green-chip); color: var(--gold);
    font-size: 12px; font-weight: 500;
    border-radius: 50px; padding: 6px 16px;
    margin-bottom: 22px; letter-spacing: 0.03em;
  }
  .hero h1 {
    font-size: 30px; font-weight: 700;
    line-height: 1.5; color: var(--text);
    margin-bottom: 16px;
  }
  .hero h1 .gold { color: var(--gold); }
  .hero-sub {
    font-size: 14px; color: var(--muted);
    line-height: 1.9; max-width: 320px;
    margin: 0 auto 32px;
  }
  .hero-actions {
    display: flex; flex-direction: column; gap: 12px;
    margin-bottom: 36px;
  }
  .btn-primary {
    background: var(--gold); color: #0b1a11;
    border: none; border-radius: 50px;
    padding: 16px 28px; font-size: 15px; font-weight: 700;
    cursor: pointer; font-family: var(--font);
    display: flex; align-items: center; justify-content: center; gap: 10px;
    width: 100%; transition: background 0.18s;
  }
  .btn-primary:hover { background: var(--gold-hover); }
  .btn-outline {
    background: transparent; color: var(--text);
    border: 0.5px solid var(--border); border-radius: 50px;
    padding: 14px 28px; font-size: 14px; font-weight: 500;
    cursor: pointer; font-family: var(--font); width: 100%;
    transition: background 0.18s;
  }
  .btn-outline:hover { background: var(--green-chip); }

  /* ── STATS ── */
  .stats-row {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 1px; background: var(--border);
    border-radius: var(--radius); overflow: hidden;
    margin-bottom: 40px;
  }
  .stat {
    background: var(--bg2); padding: 18px 8px; text-align: center;
  }
  .stat-n { font-size: 22px; font-weight: 700; color: var(--gold); display: block; }
  .stat-l { font-size: 11px; color: var(--muted); margin-top: 3px; display: block; line-height: 1.4; }

  /* ── SECTION HEADER ── */
  .sec-head { padding: 0 24px; margin-bottom: 20px; }
  .sec-tag {
    display: inline-block;
    background: var(--green-chip); color: var(--muted);
    font-size: 11px; border-radius: 50px;
    padding: 4px 12px; margin-bottom: 10px;
  }
  .sec-head h2 { font-size: 22px; font-weight: 700; color: var(--text); line-height: 1.4; margin-bottom: 8px; }
  .sec-head p  { font-size: 13px; color: var(--muted); line-height: 1.75; }

  /* ── CLIP CARD ── */
  .clip-card {
    margin: 0 24px 22px;
    background: var(--card);
    border-radius: 16px; overflow: hidden;
    border: 0.5px solid var(--border);
  }
  .clip-thumb {
    position: relative; width: 100%; padding-top: 56.25%;
    background: #07120c; cursor: pointer;
  }
  .thumb-content {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    flex-direction: column; gap: 8px;
  }
  .thumb-scene { font-size: 60px; opacity: 0.10; }
  .thumb-genre-bg {
    font-size: 13px; color: var(--border);
    position: absolute; bottom: 12px; right: 14px;
  }
  .play-circle {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .play-btn {
    width: 54px; height: 54px; border-radius: 50%;
    background: rgba(201,169,79,0.88);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; color: #0b1a11;
    transition: transform 0.2s, background 0.2s;
  }
  .clip-thumb:hover .play-btn { transform: scale(1.1); background: var(--gold); }

  .clip-body { padding: 18px 18px 20px; }
  .clip-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .genre-pill {
    background: var(--green-chip); color: var(--muted);
    font-size: 11px; border-radius: 50px; padding: 4px 10px;
  }
  .clip-title { font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 16px; }
  .dialogues { display: flex; flex-direction: column; gap: 12px; }
  .d-pair {
    border-right: 2px solid var(--border);
    padding-right: 14px;
  }
  .d-en { font-size: 14px; color: var(--text); font-style: italic; margin-bottom: 4px; }
  .d-fa { font-size: 13px; color: var(--muted); }

  .vocab-box {
    margin-top: 16px; background: var(--bg);
    border-radius: 10px; padding: 14px 16px;
    border: 0.5px solid var(--border);
  }
  .vocab-label {
    font-size: 11px; color: var(--gold); font-weight: 600;
    margin-bottom: 10px; letter-spacing: 0.03em;
  }
  .vocab-list { display: flex; flex-direction: column; gap: 8px; }
  .vocab-item {
    display: flex; justify-content: space-between;
    align-items: baseline; font-size: 12px; gap: 8px;
  }
  .v-en { color: var(--text); font-weight: 500; white-space: nowrap; }
  .v-fa { color: var(--muted); text-align: right; }

  /* ── INVITE STRIP ── */
  .invite {
    margin: 4px 24px 36px;
    background: var(--green-chip);
    border-radius: 16px; padding: 26px 22px;
    text-align: center; border: 0.5px solid var(--border);
  }
  .invite h3 { font-size: 19px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
  .invite p  { font-size: 13px; color: var(--muted); line-height: 1.8; margin-bottom: 20px; }

  /* ── PLAN ── */
  .plan-wrap { padding: 0 24px 36px; }
  .plan-card {
    background: var(--card); border-radius: 16px;
    padding: 22px 20px; border: 0.5px solid var(--border);
  }
  .features { display: flex; flex-direction: column; gap: 12px; margin-bottom: 22px; }
  .feat {
    display: flex; align-items: center; justify-content: flex-end;
    gap: 12px; font-size: 14px; color: var(--text);
  }
  .check {
    width: 24px; height: 24px; border-radius: 50%;
    background: var(--green-chip); color: var(--gold);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; flex-shrink: 0;
  }

  /* ── HOW IT WORKS ── */
  .how-wrap { padding: 0 24px 36px; }
  .steps { display: flex; flex-direction: column; gap: 12px; }
  .step {
    display: flex; align-items: center; gap: 14px;
    background: var(--card); border-radius: var(--radius);
    padding: 16px; border: 0.5px solid var(--border);
  }
  .step-ico {
    width: 46px; height: 46px; border-radius: 12px;
    background: var(--green-chip);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; flex-shrink: 0;
  }
  .step-text { flex: 1; text-align: right; }
  .step-t { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 3px; }
  .step-d { font-size: 12px; color: var(--muted); line-height: 1.6; }

  /* ── DIVIDER ── */
  hr { border: none; border-top: 0.5px solid var(--border); margin: 4px 24px 36px; }

  /* ── FOOTER ── */
  .footer { padding: 0 24px 40px; text-align: center; }
  .footer .lbl { font-size: 12px; color: var(--muted); margin-bottom: 8px; }
  .footer .email { font-size: 15px; font-weight: 500; color: var(--text); }

  /* ────────────────────── SIGNUP PAGE ────────────────────── */
  .signup-wrap { padding: 0 24px 48px; }
  .back-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 16px 0; font-size: 13px; color: var(--muted);
    cursor: pointer; background: none; border: none;
    font-family: var(--font); transition: color 0.15s;
  }
  .back-btn:hover { color: var(--text); }
  .signup-hd { margin-bottom: 28px; padding-bottom: 22px; border-bottom: 0.5px solid var(--border); }
  .signup-hd h2 { font-size: 22px; font-weight: 700; color: var(--text); margin-bottom: 6px; }
  .signup-hd p  { font-size: 13px; color: var(--muted); line-height: 1.75; }

  .info-chips { display: flex; flex-direction: column; gap: 8px; margin-bottom: 28px; }
  .ichip {
    display: flex; align-items: center; justify-content: flex-end;
    gap: 12px; background: var(--card);
    border-radius: var(--radius); padding: 13px 14px;
    border: 0.5px solid var(--border);
  }
  .ichip-text { text-align: right; }
  .ichip-title { font-size: 13px; font-weight: 500; color: var(--text); }
  .ichip-val   { font-size: 12px; color: var(--muted); }
  .ichip-ico {
    width: 38px; height: 38px; border-radius: 10px;
    background: var(--green-chip);
    display: flex; align-items: center; justify-content: center;
    font-size: 17px; flex-shrink: 0;
  }

  .fgroup { margin-bottom: 14px; }
  .fgroup label { display: block; font-size: 12px; color: var(--muted); margin-bottom: 6px; }
  .fgroup input {
    width: 100%;
    background: var(--card); border: 0.5px solid var(--border);
    border-radius: 12px; padding: 13px 14px;
    font-size: 14px; color: var(--text);
    font-family: var(--font); outline: none;
    text-align: right; direction: rtl;
    transition: border-color 0.15s;
  }
  .fgroup input::placeholder { color: #2a4535; }
  .fgroup input:focus { border-color: var(--gold); }
  .fgroup .ltr-input { direction: ltr; text-align: left; }

  .price-box {
    background: var(--bg); border-radius: 14px;
    padding: 18px; border: 1px solid var(--gold);
    margin-bottom: 20px; text-align: center;
  }
  .price-lbl  { font-size: 12px; color: var(--muted); margin-bottom: 5px; }
  .price-amt  { font-size: 26px; font-weight: 700; color: var(--gold); }
  .price-note { font-size: 11px; color: var(--muted); margin-top: 6px; line-height: 1.6; }

  .pay-steps {
    background: var(--card); border-radius: var(--radius);
    padding: 16px; border: 0.5px solid var(--border); margin-bottom: 18px;
  }
  .pay-steps-title { font-size: 13px; font-weight: 700; color: var(--gold); margin-bottom: 14px; }
  .pstep {
    display: flex; align-items: flex-start;
    justify-content: flex-end; gap: 10px;
    margin-bottom: 10px; font-size: 13px; color: var(--text);
    text-align: right; line-height: 1.6;
  }
  .pstep:last-child { margin-bottom: 0; }
  .pnum {
    width: 24px; height: 24px; border-radius: 50%;
    background: var(--green-chip);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: var(--gold); flex-shrink: 0;
    margin-top: 1px;
  }

  .card-display {
    background: var(--bg); border-radius: 12px;
    padding: 14px 16px; border: 0.5px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px; gap: 8px;
  }
  .card-info { text-align: right; }
  .card-lbl { font-size: 11px; color: var(--muted); margin-bottom: 3px; }
  .card-num { font-size: 15px; font-weight: 700; color: var(--text); letter-spacing: 0.1em; font-family: monospace; }
  .copy-btn {
    background: var(--green-chip); color: var(--gold);
    border: none; border-radius: 8px; padding: 7px 12px;
    font-size: 12px; cursor: pointer; font-family: var(--font);
    white-space: nowrap; transition: background 0.15s;
  }
  .copy-btn:hover { background: #243d2c; }

  .err { color: #e57373; font-size: 12px; margin-top: 10px; display: none; text-align: center; }

  /* ────────────────────── THANK YOU PAGE ────────────────────── */
  .ty-wrap { padding: 52px 24px 48px; text-align: center; }
  .ty-ico {
    width: 76px; height: 76px; border-radius: 50%;
    background: var(--green-chip);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 26px; font-size: 34px;
  }
  .ty-wrap h2 { font-size: 24px; font-weight: 700; color: var(--text); margin-bottom: 10px; }
  .ty-wrap > p { font-size: 14px; color: var(--muted); line-height: 1.85; margin-bottom: 36px; }

  .next-steps { display: flex; flex-direction: column; gap: 12px; margin-bottom: 34px; text-align: right; }
  .nstep {
    display: flex; align-items: center; justify-content: flex-end;
    gap: 14px; background: var(--card);
    border-radius: var(--radius); padding: 15px 16px;
    border: 0.5px solid var(--border);
  }
  .nstep-text { flex: 1; text-align: right; }
  .nstep-title { font-size: 14px; font-weight: 500; color: var(--text); margin-bottom: 3px; }
  .nstep-desc  { font-size: 12px; color: var(--muted); line-height: 1.55; }
  .nstep-ico {
    width: 42px; height: 42px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center; font-size: 19px; flex-shrink: 0;
  }
  .ico-gold  { background: var(--green-chip); }
  .ico-tg    { background: #0a2740; }

  .btn-tg {
    display: flex; align-items: center; justify-content: center; gap: 10px;
    background: #229ED9; color: #fff;
    border: none; border-radius: 50px;
    padding: 16px 28px; font-size: 15px; font-weight: 700;
    cursor: pointer; font-family: var(--font); width: 100%;
    margin-bottom: 12px; transition: background 0.18s;
  }
  .btn-tg:hover { background: #1c8ec3; }

  /* ────────────────── RESPONSIVE ────────────────── */
  @media (min-width: 480px) {
    .hero h1 { font-size: 34px; }
    .hero-sub { max-width: 380px; }
  }






English Hasti

عضویت





  


    

🎬 یادگیری از فیلم‌های واقعی


    


      یادگیری زبان انگلیسی

      با کلیپ‌های فیلم

      و سریال
    


    


      هر روز یک کلیپ کوتاه از فیلم‌های واقعی —

 با دیالوگ انگلیسی، ترجمه دقیق فارسی،
      و توضیح اصطلاحات کاربردی

 — مستقیم در ایمیل شما.
    


    


      
        ←   دریافت اشتراک ماهانه
      
      
        مشاهده نمونه  کلیپ ها
    


    


      


        ۳۰
        کلیپ در ماه
      


      


        100%
        ترجمه فارسی
      


      


        روزانه
        ارسال ایمیل
      


    



  


    


      

نمونه درس‌ها


      

دو کلیپ از کتابخانه‌ی ما


      

هر درس شامل دیالوگ انگلیسی، ترجمه دقیق فارسی و توضیح اصطلاحات کاربردی است.


    



    
    


      


        


          

🎬


        


        

▶


      


      


        


          

Clip 01 · Drama


        


        

Loan Sharks


        


          


            

I got mixed up with loan sharks, man.
داداش، گرفتار رباخوارها شدم.

They won't back off.
ول‌کن ماجرا نیستن.

I'm trying to build an empire, okay?
دارم سعی می‌کنم یه کسب‌وکار بزرگ راه بندازم، باشه؟

So you owe them $10,000.
پس ۱۰ هزار دلار بهشون بدهکاری؟

Couldn't get the money anywhere else.
از هیچ جای دیگه‌ای نتونستم پول جور کنم.

I didn't know any black folks invest in their house music,
هیچ آدم سیاه‌پوستی رو نمی‌شناختم که حاضر باشه روی  خانه موسیقی  سرمایه‌گذاری کنه،

so until I pay them back, they're gonna keep coming in.
برای همین تا وقتی پولشون رو پس ندم، مدام سر و کله‌شون پیدا می‌شه.

What a money!
چه پولی؟! / این همه پول از کجا بیارم؟! (بسته به لحن و صحنه)

No, I just...
نه، من فقط... / نه، منظورم اینه که...
          


        


        


          

💡 اصطلاحات این درس


          


            


              Loan shark
              رباخوار / قرض‌دهنده غیرقانونی
            


            


              Back off
              دست برنداشتن، کوتاه آمدن
            


            


              Lay low
              در اختفا ماندن، خود را

            
         

برای دریافت کلیپ‌های روزانه عضو شوید

روزانه  یک درس جدید مستقیم به ایمیل شما.
بدون نیاز به ورود به سایت.


    ←   عضویت ماهانه
      

پلن اشتراک


      

اشتراک ماهانه آموزش زبان


      

۳۰ کلیپ آموزشی در ماه + ترجمه + توضیح اصطلاحات، روزانه به ایمیل شما.


    


    


      


        

روزانه ۱ کلیپ یا درس کوتاه

✓


        

ترجمه فارسی و انگلیسی

✓


        

توضیح اصطلاحات کاربردی

✓


        

ارسال ایمیل روزانه آموزشی

✓


        

بدون نیاز به ورود به سایت

✓


      


      ←   شروع اشتراک — ۱۰۰٬۰۰۰ تومان
    



  


    


      

چطور کار می‌کنه


      

هر روز یک درس در ایمیل شما


    


    


      


        

📝


        


          

ثبت‌نام و پرداخت


          

اطلاعات رو وارد کنید و مبلغ رو کارت‌به‌کارت بزنید


        


      


      


        

✅


        


          

فعال‌سازی ظرف ۲۴ ساعت


          

بعد از تأیید پرداخت، اشتراک شما فعال می‌شه


        


      


      


        

📧


        


          

دریافت روزانه ایمیل


          

روزانه ، یک کلیپ با ترجمه و اصطلاحات


        


      


    



  



  


    

ایمیل پشتیبانی


    

hello@englishhasti.com</div>
  







    →   بازگشت

    


      

ثبت اشتراک


      

اطلاعات خود را وارد کنید تا اشتراک فعال شود.


    



    


      


        


          

روش پرداخت


          

کارت‌به‌کارت · 


        


        

💳


      


      


        


          

زمان فعال‌سازی


          

کمتر از ۲۴ ساعت


        


        

⏱️


      


      


        


          

پشتیبانی


          

Lak20ml@gmail.com</div>
        
        

✉️


      
    

    


      نام و نام خانوادگی *
      
    


    


      ایمیل *
      @lak20ml@gmail.com" />
    
    


      شماره موبایل *
      
    


    


      آیدی تلگرام (اختیاری)
      @lak_202" />
    

    


      

مبلغ اشتراک یک ماهه


      

۱۰۰٬۰۰۰ تومان


      

پس از واریز، رسید را در تلگرام برای ادمین ارسال کنید


    



    


      

مراحل پرداخت


      


        فرم بالا را کامل پر کنید
        

۱


      


      


        مبلغ ۱۰۰٬۰۰۰ تومان را به شماره کارت زیر واریز کنید
        

۲


      


      


        رسید پرداخت را به ادمین تلگرام بفرستید تا اشتراک فعال شود
        

۳


      


    



    


      کپی
      


        

شماره کارت


        

6104 3378 XXXX XXXX


      


    



    

لطفاً نام، ایمیل و شماره موبایل را وارد کنید.



    
      ←   ثبت اطلاعات و ادامه
    

  





    

✅


    

ثبت‌نام شما انجام شد!


    


      اطلاعات شما دریافت شد.

      برای فعال‌سازی اشتراک، مبلغ را واریز کنید

      و رسید را به ادمین تلگرام ارسال کنید.
    



    


      


        


          

پرداخت کارت‌به‌کارت


          

مبلغ ۱۰۰٬۰۰۰ تومان را به شماره کارت ثبت‌شده واریز کنید


        


        

💳


      


      


        


          

ارسال رسید به تلگرام


          

رسید پرداخت را به ادمین بفرستید تا اشتراک فعال شود


        


        

✈️


      


      


        


          

فعال‌سازی ظرف ۲۴ ساعت


          

ایمیل اول شما تا فردا صبح ارسال می‌شود


        


        

📧


      


    



    
      ✈️   ارسال رسید در تلگرام
    

    
      بازگشت به صفحه اصلی
    



@EnglishHastiAdmin'; // ← یوزرنیم تلگرام ادمین

  document.getElementById('card-num').textContent = CARD_DISPLAY;

  function showPage(name) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + name).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function copyCard() {
    const btn = event.target;
    const text = CARD_NUMBER;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = '✓ کپی شد';
        setTimeout(() => btn.textContent = 'کپی', 2200);
      });
    } else {
      btn.textContent = '✓ کپی شد';
      setTimeout(() => btn.textContent = 'کپی', 2200);
    }
  }

  function submitForm() {
    const name  = document.getElementById('f-name').value.trim();
    const email = document.getElementById('f-email').value.trim();
    const phone = document.getElementById('f-phone').value.trim();
    const err   = document.getElementById('form-err');

    if (!name || !email || !phone) {
      err.style.display = 'block';
      return;
    }
    err.style.display = 'none';
    // اینجا می‌توانید اطلاعات را به سرور ارسال کنید
    showPage('thankyou');
  }

  function openTelegram() {
    window.open('https://t.me/' + TG_USERNAME.replace('@', ''), '_blank');
  }
</script>
</body>
</html>

از عکس ها برای UI 

استفاده کن نوار ابزار شبیه عکس باشه 

کاناله تلگزام و اینستا گرام برای دنبال کردن بذار 

https://t.me/+Tc1IflAPFPk3NTc8

https://www.instagram.com/englishhasti_?igsh=bjJyamF4cWgzb2Fi&utm_source=qr

از عکس دختر برای هوم استفاده کن

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://reel-english-flow.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b91b92b5-0246-438e-a76c-1770c906cd5f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
