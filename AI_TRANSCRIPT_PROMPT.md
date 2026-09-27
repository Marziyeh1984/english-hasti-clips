# AI Transcript Generation Prompt

Copy this prompt and use it with your AI tool (ChatGPT, Claude, etc.) along with your video file to generate transcripts in the correct format for your English Hasti website.

---

## PROMPT - Copy and Paste This Exactly:

```
I need you to create a timestamped transcript for an English learning video. The video contains English dialogue with Persian translations.

IMPORTANT: I will paste your output directly into a system that automatically parses it. You MUST follow the EXACT format below or it will not work.

CRITICAL FORMAT RULES:
1. Each line MUST be: TIME | ENGLISH -> PERSIAN
2. TIME = decimal seconds (e.g., 0.0, 5.5, 10.25)
3. | = vertical bar character (Shift + Backslash on most keyboards)
4. -> = hyphen followed by greater-than sign (literally type hyphen then greater-than, do NOT use arrow symbol)
5. No extra text, no line numbers, no explanations
6. No empty lines between dialogue entries
7. Only the dialogue lines in the exact format shown below

EXAMPLE OF CORRECT FORMAT:
0.0 | Something happened out on Poor Farm Road today. Something pretty bad. A girl got herself killed. -> امروز توی جاده‌ی «پور فارم» یه اتفاقی افتاده. یه اتفاق خیلی بد. یه دختر جونش رو از دست داده.
5.5 | I know. I saw her. -> می‌دونم. من دیدمش.
7.0 | What? -> چی؟
8.5 | We had her in ER. Beyond saving. I mean, it was awful. -> ما توی اورژانس آوردیمش. دیگه کاری از دستمون برنمی‌اومد. یعنی واقعاً وحشتناک بود.

YOUR TASK:
1. Watch the video and identify when each line is spoken
2. Note the exact time in decimal seconds for each line
3. Translate each English line to natural Persian/Farsi
4. Format each line exactly as: TIME | ENGLISH -> PERSIAN
5. Output ONLY the dialogue lines, nothing else

TIMING GUIDELINES:
- Use decimal seconds (0.0, 5.5, 10.25) - NOT minutes:seconds
- Note the time when the speaker STARTS saying the line
- Round to nearest 0.1 or 0.5 seconds for accuracy
- Be consistent with your timing format

TRANSLATION GUIDELINES:
- Use natural, conversational Persian
- Maintain the meaning and tone
- Don't use literal word-for-word translation
- Keep the Persian text on the same line as English

OUTPUT REQUIREMENTS:
- Output ONLY the dialogue lines
- Each line on its own line
- No introductory text
- No concluding text
- No line numbers
- No empty lines
- No markdown headers (no ##)
- No bullet points (no - or *)
- No numbered lists
- Start immediately with the first dialogue line
- Each line must START with the time (e.g., 0.0)

After you provide the dialogue, if you notice any important vocabulary words or phrases, list them separately after a separator line "---" in this format:
English phrase -> Persian meaning

IMPORTANT: The vocabulary section is OPTIONAL. Only include it if there are important vocabulary items. The dialogue section is REQUIRED.

Please analyze the video and provide the transcript. Start immediately with the first dialogue line in the format: TIME | ENGLISH -> PERSIAN
```

---

## How to Use This Prompt:

### Step 1: Upload Video to AI
- Go to ChatGPT, Claude, or your preferred AI tool
- Upload your video file
- Copy the entire prompt above (from "I need you to create..." to "...TIME | ENGLISH -> PERSIAN")

### Step 2: Get AI Output
- Paste the prompt
- Submit to the AI
- The AI will generate the transcript in the exact format

### Step 3: Copy and Paste
- Copy the AI's output (the dialogue lines)
- Go to your English Hasti admin panel
- Click "📋 پیست متن کامل" button
- Paste the transcript in the text area
- Click "بررسی و استخراج"
- Review the preview
- Click "اعمال" to import

---

## Expected AI Output Example:

The AI should output something like this (copy this format exactly):

```
0.0 | Something happened out on Poor Farm Road today. Something pretty bad. A girl got herself killed. -> امروز توی جاده‌ی «پور فارم» یه اتفاقی افتاده. یه اتفاق خیلی بد. یه دختر جونش رو از دست داده.
5.5 | I know. I saw her. -> می‌دونم. من دیدمش.
7.0 | What? -> چی؟
8.5 | We had her in ER. Beyond saving. I mean, it was awful. -> ما توی اورژانس آوردیمش. دیگه کاری از دستمون برنمی‌اومد. یعنی واقعاً وحشتناک بود.
---
get oneself killed -> باعث مرگ خود شدن / جونش رو از دست دادن
out on -> توی / در حوالی
ER (Emergency Room) -> اورژانس
beyond saving -> دیگه قابل نجات نبود / کاری از دست کسی برنمی‌اومد
awful -> وحشتناک / واقعاً افتضاح بود
```

IMPORTANT: The first line must start with "0.0 |" - NOT "## 0.0 |" or any other prefix.

---

## Troubleshooting:

### If the parser shows "هیچ خطی شناسایی نشد":
- Check that the AI used `|` (vertical bar) not `l` (letter L)
- Check that the AI used `->` (hyphen + greater-than) not an arrow symbol
- Make sure there are no extra spaces around the separators
- Ensure the time is in decimal format (0.0, 5.5) not minutes:seconds

### If the AI adds extra text:
- Tell the AI: "Output ONLY the dialogue lines, no other text"
- The prompt already instructs this, but some AI tools add explanations
- You can manually remove any extra text before pasting

### If timing is wrong:
- Ask the AI to "Use more precise timing"
- You can manually adjust the times in the parsed preview before applying

---

## Quick Reference:

✅ CORRECT: `0.0 | Hello -> سلام`
❌ WRONG: `0.0 Hello -> سلام` (missing |)
❌ WRONG: `0.0 | Hello → سلام` (using arrow symbol instead of ->)
❌ WRONG: `00:05 | Hello -> سلام` (using minutes:seconds instead of decimal)

---

This prompt is designed to work perfectly with your "Paste Complete Transcript" feature. The system will automatically detect the pattern and import the dialogues correctly.
