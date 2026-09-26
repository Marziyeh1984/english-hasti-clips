# AI Transcript Generation Prompt

Copy this prompt and use it with your AI tool (ChatGPT, Claude, etc.) along with your video file to generate transcripts in the correct format for your English Hasti website.

---

## Prompt for AI:

```
I need you to create a timestamped transcript for an English learning video. The video contains English dialogue with Persian translations and vocabulary.

Please follow these exact requirements:

### Format Requirements:
Each line must follow this exact pattern:
`time | English dialogue -> Persian translation`

Where:
- `time` = time in seconds (decimal format like 0.0, 5.5, 10.0)
- `|` = vertical bar separator
- `->` = arrow separator between English and Persian
- English dialogue = the English text spoken in the video
- Persian translation = the Persian/Farsi translation

### Example Format:
```
0.0 | Something happened out on Poor Farm Road today. Something pretty bad. A girl got herself killed. -> امروز توی جاده‌ی «پور فارم» یه اتفاقی افتاده. یه اتفاق خیلی بد. یه دختر جونش رو از دست داده.
5.5 | I know. I saw her. -> می‌دونم. من دیدمش.
7.0 | What? -> چی؟
8.5 | We had her in ER. Beyond saving. I mean, it was awful. -> ما توی اورژانس آوردیمش. دیگه کاری از دستمون برنمی‌اومد. یعنی واقعاً وحشتناک بود.
```

### Guidelines:
1. **Accurate Timing**: Watch the video carefully and note the exact time when each line is spoken
2. **Complete Translation**: Translate the full English dialogue to Persian/Farsi
3. **Natural Persian**: Use natural, conversational Persian (not literal word-for-word translation)
4. **Context Preservation**: Maintain the meaning, tone, and context of the conversation
5. **One Line Per Speaker Turn**: Each speaker turn should be on its own line
6. **Time Format**: Use decimal seconds (e.g., 0.0, 5.5, 10.25) for the most accurate timing
7. **No Empty Lines**: Don't include empty lines between dialogue entries
8. **No Additional Text**: Only include the dialogue lines in the specified format

### Vocabulary Section:
After the dialogue, also provide a vocabulary list in this format:
```
English phrase -> Persian meaning/explanation
```

Include important words, phrases, idioms, or expressions from the dialogue that would be useful for learners.

### Output Format:
Please provide:
1. First the complete timestamped dialogue (using the format above)
2. Then a separator line: `---`
3. Then the vocabulary list

### Example Complete Output:
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

Please analyze the video and provide the transcript in this exact format.
```

---

## Usage Instructions:

1. **Upload your video** to the AI tool
2. **Copy the prompt above** and paste it
3. **Submit the request** to the AI
4. **Copy the generated transcript** from the AI response
5. **Go to your English Hasti admin panel**
6. **Click "📋 پیست متن کامل"** button
7. **Paste the transcript** in the text area
8. **Click "بررسی و استخراج"** to parse it
9. **Review the preview** and click "اعمال" to import

## Tips for Best Results:

- **Short videos work best**: Break longer videos into shorter segments (2-3 minutes each)
- **Natural timing**: Don't force exact timing - approximate times are fine (round to nearest 0.5 seconds)
- **Clear speakers**: Try to have clear speaker turns for easier timestamping
- **Practical vocabulary**: Focus on words and phrases that are actually useful for English learners
- **Consistent format**: Always use the same format to make parsing reliable

## Troubleshooting:

If the parser doesn't recognize your lines:
- Check that you're using `|` (vertical bar) not `l` (letter L)
- Check that you're using `->` (two characters, hyphen + greater than) not a single arrow
- Make sure there are no extra spaces around the separators
- Ensure the time is in decimal format (0.0, 5.5) not minutes:seconds

---

This prompt will generate transcripts in the exact format needed for your "Paste Complete Transcript" feature.
