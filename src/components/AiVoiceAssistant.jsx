import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Square, 
  X, 
  HelpCircle, 
  MessageSquare, 
  Leaf, 
  Globe, 
  CheckCircle2, 
  Sliders
} from 'lucide-react';

const VOICE_LANGUAGES = [
  { code: 'en', label: 'English', greeting: "Namaste! I'm Tara, your organic agricultural companion. Ask me anything about crop prices, category insights, or farm-gate logistics.", voiceLang: 'en-IN' },
  { code: 'hi', label: 'हिन्दी', greeting: "नमस्ते किसान भाई-बहनों! मैं तारा हूँ, आपकी अपनी डिजिटल कृषि सहेली। सीधे खेत से ताज़ा फ़सल और सही मंडी भाव जानने के लिए मुझसे पूछिए।", voiceLang: 'hi-IN' },
  { code: 'hinglish', label: 'Hinglish', greeting: "Namaste dosto! Main Tara hoon, aapki smart agri voice assistant. Yahan bina kisi middleman ke direct farm-gate se trade karein. Aaj ke mandi rates janne ke liye poochiye!", voiceLang: 'hi-IN' },
  { code: 'mr', label: 'मराठी', greeting: "नमस्कार शेतकरी मित्रांनो! मी तारा, तुमची हक्काची शेती सखी. थेट शेतातून ताजी पिके आणि आजचे अचूक बाजारभाव जाणून घेण्यासाठी मला विचारा!", voiceLang: 'mr-IN' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ', greeting: "ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! ਮੈਂ ਤਾਰਾ ਹਾਂ, ਤੁਹਾਡੀ ਆਪਣੀ ਖੇਤੀ ਸਹਾਇਕ। ਬਿਨਾਂ ਕਿਸੇ ਵਿਚੋਲੇ ਦੇ ਸਿੱਧੇ ਖੇਤਾਂ ਤੋਂ ਤਾਜ਼ੀ ਫ਼ਸਲ ਅਤੇ ਸਹੀ ਮੰਡੀ ਭਾਅ ਜਾਣਨ ਲਈ ਪੁੱਛੋ ਜੀ!", voiceLang: 'pa-IN' },
  { code: 'ta', label: 'தமிழ் (வானிஸ்ரீ)', greeting: "வணக்கம்ங்க! நான் உங்கள் வானிஸ்ரீ! அக்ரிடைரக்ட்-ல உங்களை வரவேற்கிறதுல ரொம்ப சந்தோஷம்! இங்க இடைத்தரகர்கள் இல்லாம நம்ம விவசாயிகள் நேரடியா நியாயமான விலையை வாங்குறாங்க. இன்னைக்கு தக்காளி, சேலம் மஞ்சள், ஏலக்காய் விலை எப்படி இருக்கு? இல்ல நேரடியா விவசாயிகள்கிட்ட ஆர்டர் போடணுமா? எதைப்பத்தியும் என்கிட்ட ஜாலியா கேளுங்க, நான் உடனே சொல்றேன்!", voiceLang: 'ta-IN' },
  { code: 'te', label: 'తెలుగు', greeting: "నమస్కారం రైతు మిత్రులారా! నేను తారా, మీ డిజిటల్ వ్యవసాయ సలహాదారును. దళారులు లేకుండా నేరుగా పొలం నుంచే తాజా పంటల ధరలు తెలుసుకోండి!", voiceLang: 'te-IN' },
  { code: 'kn', label: 'ಕನ್ನಡ', greeting: "ನಮಸ್ಕಾರ ರೈತ ಬಾಂಧವರೇ! ನಾನು ತಾರಾ, ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಕೃಷಿ ಮಾರ್ಗದರ್ಶಿ. ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲದೆ ನೇರವಾಗಿ ಹೊಲದಿಂದಲೇ ನ್ಯಾಯಯುತ ಮಾರುಕಟ್ಟೆ ದರಗಳನ್ನು ತಿಳಿಯಲು ಕೇಳಿ!", voiceLang: 'kn-IN' },
  { code: 'bn', label: 'বাংলা', greeting: "নমস্কার কৃষক ভাই ও বোনেরা! আমি তারা, আপনার ডিজিটাল কৃষি সহযোগী। দালাল ছাড়া সরাসরি খামার থেকে ন্যায্য বাজার দর জানতে জিজ্ঞাসা করুন!", voiceLang: 'bn-IN' },
  { code: 'gu', label: 'ગુજરાતી', greeting: "નમસ્તે ખેડૂત મિત્રો! હું તારા છું, તમારી ડિજિટલ ખેતી સહાયક. વચેટીયા વગર સીધા ખેતરેથી તાજા પાક અને સાચા મંડી ભાવ જાણવા પૂછો!", voiceLang: 'gu-IN' }
];

const PREDEFINED_PROMPTS = {
  hi: [
    { title: "🌾 गेहूँ व बासमती भाव", q: "बासमती धान और गेहूँ का आज का मंडी भाव क्या है?" },
    { title: "🌿 सलेम हल्दी व मसाले", q: "सलेम हल्दी और इलायची के ताज़ा रेट्स क्या हैं?" },
    { title: "🫘 दालों की मांग", q: "चना और तुअर दाल की बाज़ार मांग कैसी है?" },
    { title: "📊 मंडी भाव विश्लेषण", q: "मंडी भाव विश्लेषण और उचित दरें कैसे तय होती हैं?" },
    { title: "🎧 डिजिटल मंडी टूर", q: "मुझे इस डिजिटल मंडी का एक ऑडियो टूर दें" }
  ],
  en: [
    { title: "🌾 Grain & Rice Prices", q: "How are Basmati and Wheat prices trending?" },
    { title: "🌿 Spices & Plantation", q: "What are the latest rates for Turmeric and Cardamom?" },
    { title: "🫘 High-Demand Pulses", q: "Which pulses have the highest market demand?" },
    { title: "📊 Mandi Fair Rates", q: "How are Basmati and Wheat mandi benchmark prices calculated?" },
    { title: "🎧 Guided Audio Tour", q: "Give me an audio tour of AgriDirect" }
  ],
  ta: [
    { title: "🌾 பாசுமதி & கோதுமை விலை", q: "பாசுமதி நெல் மற்றும் கோதுமையோட இன்றைய உழவர் சந்தை விலை என்னங்க?" },
    { title: "🌿 சேலம் மஞ்சள் & ஏலக்காய்", q: "சேலம் மஞ்சள் மற்றும் ஏலக்காயோட நேரடி பண்ணை விலை சொல்லுங்க வானிஸ்ரீ!" },
    { title: "🫘 தக்காளி & காய்கறி நிலவரம்", q: "இன்னைக்கு தக்காளி மற்றும் வெங்காய விலை நிலவரம் எப்படி இருக்கு வானிஸ்ரீ?" },
    { title: "📊 மண்டி நியாய விலை", q: "மண்டி வழிகாட்டி விலை எப்படி நிர்ணயிக்கப்படுகிறது வானிஸ்ரீ?" },
    { title: "🎧 சந்தை ஆடியோ டூர்", q: "அக்ரிடைரக்ட் செயலியோட ஒரு ஜாலியான ஆடியோ வழிகாட்டல் கொடுங்க!" }
  ],
  hinglish: [
    { title: "🌾 Basmati & Wheat Rates", q: "Basmati rice aur gehu ka aaj ka mandi bhav kya chal raha hai?" },
    { title: "🌿 Spices & Haldi Rates", q: "Salem turmeric aur elaichi ke market rates kya hain?" },
    { title: "🫘 Chana & Dal Demand", q: "Chana aur toor dal ki mandi demand kaisi hai?" },
    { title: "📊 Mandi Pricing Guide", q: "Mandi benchmark rates kaise calculate hote hain?" },
    { title: "🎧 Mandi Audio Tour", q: "Mujhe AgriDirect ka ek quick audio tour do" }
  ],
  mr: [
    { title: "🌾 बासमती व गहू दर", q: "बासमती तांदूळ आणि गव्हाचे आजचे बाजारभाव काय आहेत?" },
    { title: "🌿 हळद आणि मसाले", q: "सलेम हळद आणि वेलचीचे दर काय चालू आहेत?" },
    { title: "🫘 डाळींची मागणी", q: "चना आणि तूर डाळीची बाजारातील मागणी कशी आहे?" },
    { title: "📊 बाजारभाव माहिती", q: "बाजारभाव दर कसे ठरवले जातात?" },
    { title: "🎧 ऑडिओ सफर", q: "मला या डिजिटल कृषी मंचाची ऑडिओ सफर द्या" }
  ],
  pa: [
    { title: "🌾 ਬਾਸਮਤੀ ਤੇ ਕਣਕ ਭਾਅ", q: "ਬਾਸਮਤੀ ਚੌਲ ਅਤੇ ਕਣਕ ਦੇ ਮੰਡੀ ਭਾਅ ਕੀ ਹਨ?" },
    { title: "🌿 ਹਲਦੀ ਤੇ ਮਸਾਲੇ", q: "ਹਲਦੀ ਅਤੇ ਇਲਾਇਚੀ ਦੇ ਰੇਟ ਕੀ ਚੱਲ ਰਹੇ ਹਨ?" },
    { title: "🫘 ਦਾਲਾਂ ਦੀ ਮੰਗ", q: "ਛੋਲੇ ਅਤੇ ਤੂਰ ਦਾਲ ਦੀ ਮੰਡੀ ਵਿੱਚ ਮੰਗ ਕਿਹੋ ਜਿਹੀ ਹੈ?" },
    { title: "📊 ਮੰਡੀ ਭਾਅ ਜਾਣਕਾਰੀ", q: "ਮੰਡੀ ਦੇ ਸਹੀ ਭਾਅ ਕਿਵੇਂ ਤੈਅ ਕੀਤੇ ਜਾਂਦੇ ਹਨ?" },
    { title: "🎧 ਆਡੀਓ ਟੂਰ", q: "ਮੈਨੂੰ ਇਸ ਖੇਤੀ ਮੰਡੀ ਦਾ ਇੱਕ ਆਡੀਓ ਟੂਰ ਦਿਓ" }
  ],
  te: [
    { title: "🌾 బాస్మతి & గోధుమ ధరలు", q: "బాస్మతి వరి మరియు గోధుమల ప్రస్తుత మార్కెట్ ధరలు ఏమిటి?" },
    { title: "🌿 పసుపు & ఏలకులు", q: "సేలం పసుపు మరియు ఏలకుల తాజా రేట్లు ఏమిటి?" },
    { title: "🫘 పప్పుల డిమాండ్", q: "శనగలు మరియు కందిపప్పు మార్కెట్ డిమాండ్ ఎలా ఉంది?" },
    { title: "📊 మార్కెట్ ధరల గైడ్", q: "మార్కెట్ గైడ్‌లైన్ ధరలు ఎలా నిర్ణయించబడతాయి?" },
    { title: "🎧 ఆడియో టూర్", q: "ఈ వ్యవసాయ మార్కెట్ గురించి ఆడియో గైడ్ ఇవ్వండి" }
  ],
  kn: [
    { title: "🌾 ಭತ್ತ & ಗೋಧಿ ಬೆಲೆ", q: "ಬಾಸ್ಮತಿ ಭತ್ತ ಮತ್ತು ಗೋಧಿಯ ಇಂದಿನ ಮಾರುಕಟ್ಟೆ ದರವೇನು?" },
    { title: "🌿 ಅರಿಶಿನ & ಏಲಕ್ಕಿ", q: "ಅರಿಶಿನ ಮತ್ತು ಏಲಕ್ಕಿಯ ಇಂದಿನ ಮಾರುಕಟ್ಟೆ ದರವೇನು?" },
    { title: "🫘 ಬೇಳೆಕಾಳುಗಳ ಬೇಡಿಕೆ", q: "ಕಡಲೆ ಮತ್ತು ತೊಗರಿ ಬೇಳೆಯ ಬೇಡಿಕೆ ಹೇಗಿದೆ?" },
    { title: "📊 ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಮಾಹಿತಿ", q: "ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಹೇಗೆ ನಿರ್ಧರಿಸಲಾಗುತ್ತದೆ?" },
    { title: "🎧 ಆಡಿಯೋ ಟೂರ್", q: "ನನಗೆ ಈ ಕೃಷಿ ಮಾರುಕಟ್ಟೆಯ ಆಡಿಯೋ ಮಾಹಿತಿ ನೀಡಿ" }
  ],
  bn: [
    { title: "🌾 ধান ও গমের দর", q: "বাসমতী ধান এবং গমের বর্তমান বাজার দর কী?" },
    { title: "🌿 হলুদ ও মশলার দাম", q: "সালেম হলুদ এবং এলাচের তাজা রেট কী?" },
    { title: "🫘 ডালের চাহিদা", q: "ছোলা এবং অড়হর ডালের বাজার চাহিদা কেমন?" },
    { title: "📊 বাজার দর নির্দেশিকা", q: "মন্ডির সঠিক দর কীভাবে নির্ধারিত হয়?" },
    { title: "🎧 অডিও নির্দেশিকা", q: "আমাকে একটি অডিও গাইড দিন" }
  ],
  gu: [
    { title: "🌾 ઘઉં & ચોખાના ભાવ", q: "બાસમતી ડાંગર અને ઘઉંના આજના મંડી ભાવ શું છે?" },
    { title: "🌿 હળદર અને જીરું", q: "હળદર અને જીરુંના તાજા બજાર ભાવ શું છે?" },
    { title: "🫘 કઠોળની માંગ", q: "ચણા અને તુવેર દાળની બજાર માંગ કેવી છે?" },
    { title: "📊 મંડી ભાવ માહિતી", q: "મંડીના યોગ્ય ભાવ કેવી રીતે નક્કી થાય છે?" },
    { title: "🎧 ઑડિયો પરિચય", q: "મને આ ડિજિટલ મંડીનો ઑડિયો પરિચય આપો" }
  ]
};

export default function AiVoiceAssistant({ user, t, currentLang = 'en', onLangChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedVoiceLang, setSelectedVoiceLang] = useState(currentLang || 'en');
  const [voiceVolume, setVoiceVolume] = useState(1.0);
  const [voiceRate, setVoiceRate] = useState(0.92); // Mild gentle speed
  const [voicePitch, setVoicePitch] = useState(1.08); // Mild soothing pitch
  const [spokenText, setSpokenText] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [transcriptHistory, setTranscriptHistory] = useState([]);

  const recognitionRef = useRef(null);
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);

  // Sync with prop when parent language changes
  useEffect(() => {
    if (currentLang && currentLang !== selectedVoiceLang) {
      setSelectedVoiceLang(currentLang);
    }
  }, [currentLang]);

  // Set initial greeting in selected language
  useEffect(() => {
    const langObj = VOICE_LANGUAGES.find(l => l.code === selectedVoiceLang) || VOICE_LANGUAGES[0];
    setTranscriptHistory([
      { sender: "tara", text: langObj.greeting }
    ]);
  }, [selectedVoiceLang]);

  // Pick best mild female voice for active language
  const getMildVoiceForLang = (langCode) => {
    if (!synthRef.current) return null;
    const voices = synthRef.current.getVoices();
    if (!voices || voices.length === 0) return null;

    const langObj = VOICE_LANGUAGES.find(l => l.code === langCode) || VOICE_LANGUAGES[0];
    const prefix = langObj.voiceLang.split('-')[0]; // e.g., 'hi', 'ta', 'te', 'mr', 'en'

    // Specific search for Vanishree / Tamil female natural voices
    if (langCode === 'ta') {
      const vaniVoice = voices.find(v => 
        v.lang.toLowerCase().startsWith('ta') &&
        (v.name.toLowerCase().includes('vani') || v.name.toLowerCase().includes('vanishree') ||
         v.name.toLowerCase().includes('pallavi') || v.name.toLowerCase().includes('valluvar') ||
         v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('natural') || 
         v.name.toLowerCase().includes('google'))
      );
      if (vaniVoice) return vaniVoice;
      const anyTa = voices.find(v => v.lang.toLowerCase().startsWith('ta'));
      if (anyTa) return anyTa;
    }

    // 1. Try exact or prefix match with female indicator
    const femaleRegionalMatch = voices.find(v => 
      (v.lang.toLowerCase().startsWith(prefix) || v.lang.toLowerCase().startsWith(langObj.voiceLang.toLowerCase())) &&
      (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('lekha') || 
       v.name.toLowerCase().includes('kalpana') || v.name.toLowerCase().includes('swara') || 
       v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('google'))
    );
    if (femaleRegionalMatch) return femaleRegionalMatch;

    // 2. Try any voice for that language
    const anyRegionalMatch = voices.find(v => v.lang.toLowerCase().startsWith(prefix));
    if (anyRegionalMatch) return anyRegionalMatch;

    // 3. Fallback: mild Indian English female or gentle English voice
    const enMatch = voices.find(v => 
      (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || 
       v.name.toLowerCase().includes('jenny') || v.name.toLowerCase().includes('samantha')) &&
      v.lang.startsWith('en')
    );
    return enMatch || voices[0];
  };

  const speakText = (text) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = getMildVoiceForLang(selectedVoiceLang);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    const langObj = VOICE_LANGUAGES.find(l => l.code === selectedVoiceLang) || VOICE_LANGUAGES[0];
    utterance.lang = langObj.voiceLang;
    
    // Friendly, modern casual tuning for Vanishree Tamil
    if (selectedVoiceLang === 'ta') {
      utterance.pitch = 1.12; // warm upbeat friendly casual pitch
      utterance.rate = 0.96; // comfortable conversational tempo
    } else {
      utterance.pitch = voicePitch;
      utterance.rate = voiceRate;
    }
    utterance.volume = voiceVolume;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpokenText(text);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Listen for global custom event (e.g. from crop card speaker button)
  useEffect(() => {
    const handleGlobalSpeak = (e) => {
      if (e.detail && e.detail.text) {
        speakText(e.detail.text);
        setTranscriptHistory(prev => [...prev, { sender: "tara", text: e.detail.text }]);
        setIsOpen(true);
      }
    };

    window.addEventListener('agri-voice-speak', handleGlobalSpeak);
    return () => window.removeEventListener('agri-voice-speak', handleGlobalSpeak);
  }, [selectedVoiceLang, voicePitch, voiceRate, voiceVolume]);

  // Preload voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        // Voices refreshed
      };
    }
  }, []);

  // Web Speech API - Microphone Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognizer = new SpeechRecognition();
      recognizer.continuous = false;
      recognizer.interimResults = false;

      const langObj = VOICE_LANGUAGES.find(l => l.code === selectedVoiceLang) || VOICE_LANGUAGES[0];
      recognizer.lang = langObj.voiceLang;

      recognizer.onstart = () => setIsListening(true);
      recognizer.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        handleUserQuestion(transcript);
      };
      recognizer.onerror = () => setIsListening(false);
      recognizer.onend = () => setIsListening(false);

      recognitionRef.current = recognizer;
    }
  }, [selectedVoiceLang]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. You can type in the box below!");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      stopSpeaking();
      try {
        recognitionRef.current.start();
      } catch (err) {
        recognitionRef.current.stop();
      }
    }
  };

  const handleLanguageSwitch = (langCode) => {
    setSelectedVoiceLang(langCode);
    stopSpeaking();
    if (onLangChange) {
      onLangChange(langCode);
    }
    const targetLangObj = VOICE_LANGUAGES.find(l => l.code === langCode) || VOICE_LANGUAGES[0];
    speakText(targetLangObj.greeting);
  };

  // Multilingual Knowledge Responses with Authentic Regional Slang
  const handleUserQuestion = (query) => {
    if (!query || !query.trim()) return;
    const cleanQuery = query.trim().toLowerCase();

    setTranscriptHistory(prev => [...prev, { sender: "user", text: query }]);
    setUserQuery("");

    let reply = "";
    const isHindi = selectedVoiceLang === 'hi';
    const isHinglish = selectedVoiceLang === 'hinglish';
    const isMarathi = selectedVoiceLang === 'mr';
    const isTamil = selectedVoiceLang === 'ta';
    const isTelugu = selectedVoiceLang === 'te';
    const isPunjabi = selectedVoiceLang === 'pa';
    const isKannada = selectedVoiceLang === 'kn';
    const isBengali = selectedVoiceLang === 'bn';
    const isGujarati = selectedVoiceLang === 'gu';

    if (cleanQuery.includes("tour") || cleanQuery.includes("guide") || cleanQuery.includes("டூர்") || cleanQuery.includes("டூர்") || cleanQuery.includes("டிராவல்") || cleanQuery.includes("வழிகாட்டி")) {
      if (isTamil) {
        reply = "வணக்கம்ங்க! நான் உங்கள் வானிஸ்ரீ! அக்ரிடைரக்ட்-ல உங்களை வரவேற்கிறதுல எனக்கு ரொம்ப சந்தோஷம்! இங்க இடைத்தரகர்கள் எவருமே இல்லாம, நம்ம விவசாயிகள் நேரடியா நியாயமான விலையை வாங்குறாங்க. நீங்க 28 வகையான பயிர்களையும் பார்க்கலாம், AI நியாய விலையை சரிபார்க்கலாம், அப்புறம் நேரடியா ஆர்டரும் போடலாம்! எதைப்பத்தி பேசணும்னாலும் என்கிட்ட ஜாலியா சொல்லுங்க!";
      } else if (isHindi) {
        reply = "नमस्ते! एग्रीडायरेक्ट में आपका स्वागत है। यहाँ किसान भाई अपनी फसल का पूरा दाम पाते हैं बिना किसी बिचौलिये के। आप सभी फसलें देख सकते हैं, एआई का सही मंडी भाव जाँच सकते हैं, और सीधे व्यापार कर सकते हैं।";
      } else if (isHinglish) {
        reply = "Welcome to AgriDirect! Yahan farmers ko unki produce ka full fair value milta hai bina kisi middleman ke. Aap sabhi 28 crops browse kar sakte hain, direct mandi orders place kar sakte hain aur transparent cold-chain logistics track kar sakte hain.";
      } else if (isMarathi) {
        reply = "नमस्कार! एग्रीडायरेक्टवर तुमचे स्वागत आहे. येथे शेतकरी बांधवांना दलालांशिवाय थेट रास्त भाव मिळतो. तुम्ही सर्व प्रकारची पिके तपासू शकता, एआई बाजारभाव पाहू शकता आणि थेट खरेदी-विक्री करू शकता.";
      } else if (isTelugu) {
        reply = "నమస్కారం! అగ్రిడైరెక్ట్‌కు స్వాగతం. ఇక్కడ దళారులు లేకుండా రైతులకు నేరుగా పూర్తి గిట్టుబాటు ధర లభిస్తుంది. మీరు అన్ని పంటల ధరలను పరిశీలించవచ్చు మరియు నేరుగా వ్యాపారం చేయవచ్చు.";
      } else if (isPunjabi) {
        reply = "ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ ਜੀ! ਐਗਰੀਡਾਇਰੈਕਟ 'ਤੇ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ। ਇੱਥੇ ਕਿਸਾਨ ਵੀਰਾਂ ਨੂੰ ਆਪਣੀ ਫ਼ਸਲ ਦਾ ਪੂਰਾ ਮੁੱਲ ਮਿਲਦਾ ਹੈ ਬਿਨਾਂ ਕਿਸੇ ਵਿਚੋਲੇ ਦੇ। ਤੁਸੀਂ ਸਾਰੀਆਂ ਫ਼ਸਲਾਂ ਦੇ ਮੰਡੀ ਰੇਟ ਦੇਖ ਸਕਦੇ ਹੋ।";
      } else {
        reply = "Welcome to AgriDirect! Our biophilic platform connects farmers directly with institutional buyers at transparent AI-computed mandi rates with zero middleman exploitation.";
      }
    } else if (cleanQuery.includes("tomato") || cleanQuery.includes("onion") || cleanQuery.includes("தக்காளி") || cleanQuery.includes("வெங்காயம்") || cleanQuery.includes("காய்கறி")) {
      if (isTamil) {
        reply = "தக்காளி மற்றும் வெங்காய விலை பத்தி கேட்டீங்களா! திண்டுக்கல் நாட்டுத் தக்காளி ஒரு கிலோ ₹24.50-க்கு நேரடியா போகுதுங்க. நாசிக் சிவப்பு வெங்காயம் கிலோ ₹25-க்கு போகுது. உழவர் சந்தையில தக்காளிக்கு இப்போ நல்ல கிராக்கி இருக்குங்க, நேரடியா ஆர்டர் போடுங்க!";
      } else {
        reply = "Farm-fresh Dindigul Tomatoes are trading at ₹24.50/kg, and Nashik Red Onions are steady at ₹25/kg with high wholesale kitchen procurement demand.";
      }
    } else if (cleanQuery.includes("basmati") || cleanQuery.includes("rice") || cleanQuery.includes("wheat") || cleanQuery.includes("நெல்") || cleanQuery.includes("கோதுமை") || cleanQuery.includes("धान") || cleanQuery.includes("गेहूँ")) {
      if (isTamil) {
        reply = "சூப்பர் கேள்விங்க! பாசுமதி 1121 நெல் இன்னைக்கு கர்னால் சந்தையில ஒரு கிலோ ₹44-க்கு நல்லா போயிட்டு இருக்குங்க. அதுவே சர்பதி கோதுமை ₹27.50-க்கு மாவு ஆலைகள் நேரடியா வாங்குறாங்க. தரம் நல்லா இருந்தா இன்னும் நல்ல லாபம் பார்க்கலாம்ங்க!";
      } else if (isHindi) {
        reply = "करनाल का 1121 बासमती धान आज ₹44 प्रति किलो पर मजबूत बना हुआ है। वहीं शरबती गेहूँ ₹27.50 प्रति किलो पर ट्रेड हो रहा है। ग्रेड A क्वालिटी के लिए सीधे बड़े खरीदारों की भारी मांग है।";
      } else if (isHinglish) {
        reply = "Karnal ka 1121 Basmati paddy aaj ₹44/kg par strong chal raha hai. Sharbati wheat ₹27.50/kg par direct flour mills purchase kar rahi hain. Grade A harvest par premium margin mil raha hai.";
      } else if (isMarathi) {
        reply = "कर्नालचा 1121 बासमती धान सध्या ₹44 प्रति किलोवर चालू आहे. तर उच्च प्रतीचा शरबती गहू ₹27.50 प्रति किलोवर खरेदीदारांकडून थेट उचलला जात आहे.";
      } else if (isTelugu) {
        reply = "బాస్మతి వరి ప్రస్తుతం కిలో ₹44 వద్ద స్థిరంగా ఉంది. నాణ్యమైన శర్బతి గోధుమలు కిలో ₹27.50 వద్ద వ్యాపారం జరుగుతోంది.";
      } else if (isPunjabi) {
        reply = "1121 ਬਾਸਮਤੀ ਝੋਨਾ ਅੱਜ ₹44 ਪ੍ਰਤੀ ਕਿਲੋ 'ਤੇ ਮਜ਼ਬੂਤ ਹੈ ਅਤੇ ਸ਼ਰਬਤੀ ਕਣਕ ₹27.50 ਪ੍ਰਤੀ ਕਿਲੋ 'ਤੇ ਸਿੱਧੀ ਖ਼ਰੀਦੀ ਜਾ ਰਹੀ ਹੈ।";
      } else {
        reply = "Basmati 1121 Paddy is trading strong at ₹44/kg driven by export demand. Sharbati Wheat is holding firm between ₹26 to ₹28/kg.";
      }
    } else if (cleanQuery.includes("turmeric") || cleanQuery.includes("spice") || cleanQuery.includes("cardamom") || cleanQuery.includes("மஞ்சள்") || cleanQuery.includes("ஏலக்காய்") || cleanQuery.includes("மசாலா")) {
      if (isTamil) {
        reply = "ஆஹா! நம்ம ஊரு சேலம் மஞ்சள் பத்தி கேக்குறீங்களா! 5.2% குர்குமின் இருக்கிற சேலம் மஞ்சள் கிலோ ₹145-க்கு சூப்பரா விக்குதுங்க! அதுமட்டுமில்லாம, ஆலப்புழா பச்சை ஏலக்காய் கிலோ ₹1,480-க்கு நேரடி வாங்குபவர்கள் போட்டி போட்டு வாங்குறாங்க!";
      } else if (isHindi) {
        reply = "जैविक मसालों में रिकॉर्ड तेज़ी है! सलेम हल्दी (5.2% करक्यूमिन) ₹145 प्रति किलो, वायनाड काली मिर्च ₹680 प्रति किलो और इडुक्की की हरी इलायची ₹1,480 प्रति किलो पर बिक रही है।";
      } else if (isHinglish) {
        reply = "Organic spices ki demand zabardast hai! Salem turmeric ₹145/kg, Wayanad black pepper ₹680/kg aur Alleppey green cardamom ₹1,480/kg par instant buyer demand mein hai.";
      } else if (isMarathi) {
        reply = "सेंद्रिय मसाल्यांना उत्तम मागणी आहे! सलेम हळद ₹145 प्रति किलो, काळी मिरी ₹680 आणि हिरवी वेलची ₹1,480 प्रति किलोने विकली जात आहे.";
      } else if (isTelugu) {
        reply = "సేలం పసుపు కిలో ₹145, నల్ల మిరియాలు కిలో ₹680 మరియు గ్రీన్ ఏలకులు కిలో ₹1,480 వద్ద అధిక లాభాలతో అమ్ముడవుతున్నాయి.";
      } else {
        reply = "Organic spices command premium margins: Salem Turmeric (5.2% curcumin) is at ₹145/kg, Wayanad Black Pepper at ₹680/kg, and Alleppey Green Cardamom at ₹1,480/kg.";
      }
    } else if (cleanQuery.includes("price") || cleanQuery.includes("ai") || cleanQuery.includes("விலை") || cleanQuery.includes("கணிப்பு") || cleanQuery.includes("भाव") || cleanQuery.includes("ధర")) {
      if (isTamil) {
        reply = "ரொம்ப நல்ல கேள்விங்க! நம்ம அக்ரிடைரக்ட் AI இன்ஜின் தமிழ்நாட்டு உழவர் சந்தை மற்றும் இந்திய மண்டிகளின் தினசரி வரத்து, பயிரின் ஈரப்பதம், மற்றும் தரத்தை கணக்கு போட்டு துல்லியமான நியாய விலையை கணிக்குது. இதனால விவசாயிகளுக்கும் வாங்குபவர்களுக்கும் சரியான லாபம் கிடைக்கும்!";
      } else if (isHindi) {
        reply = "हमारा एग्रीप्राइस-नेट एआई इंजन देश भर की एपीएमसी मंडियों, फसल की नमी, ग्रेडिंग और आवक का हिसाब लगाकर न्यायसंगत मंडी भाव तय करता है, ताकि किसान को कभी घाटा न हो।";
      } else if (isHinglish) {
        reply = "Humara AgriPriceNet AI engine pure desh ki APMC mandis ka arrival data, crop moisture aur historical seasonal index calculate karke fair benchmark banata hai taaki growers ko distress selling na karni pade.";
      } else if (isMarathi) {
        reply = "आमचे AI इंजिन देशातील सर्व प्रमुख कृषी उत्पन्न बाजार समित्यांच्या आकडेवारीचे विश्लेषण करून शेतकर्‍यांना योग्य आणि रास्त हमीभाव ठरवून देते.";
      } else if (isTelugu) {
        reply = "మా AI సాంకేతికత మార్కెట్ ట్రెండ్స్ మరియు పంట నాణ్యతను విశ్లేషించి రైతులకు న్యాయమైన ధరను సూచిస్తుంది.";
      } else {
        reply = "Our AgriPriceNet-v2.4 decision-support model computes fair mandi benchmarks using historical APMC liquidity, quality grading, and seasonal demand curves.";
      }
    } else {
      if (isTamil) {
        reply = `வானிஸ்ரீ இங்க இருக்கேனுங்க! "${query}" பத்தி கேட்டதுக்கு ரொம்ப நன்றி! அக்ரிடைரக்ட்-ல எல்லா பயிர்களுக்கும் நேரடி விலை விவரங்கள் இருக்குங்க. கீழ இருக்கிற பயிர்கள்ல ஸ்பீக்கர் பட்டனை தட்டுங்க, நானே விவரங்களை வாசித்துக் காட்டுறேன்!`;
      } else if (isHindi) {
        reply = `आपके सवाल "${query}" के लिए धन्यवाद। एग्रीडायरेक्ट पर आप सभी फसलों की सीधी खरीद-बिक्री कर सकते हैं। नीचे दी गई फसलों पर क्लिक करके ताज़ा भाव देखें।`;
      } else if (isHinglish) {
        reply = `Aapke question "${query}" ke liye shukriya! AgriDirect par sabhi crops certified hain. Kisi bhi crop card par speaker icon click karke direct details sun sakte hain.`;
      } else {
        reply = `Thank you for asking about "${query}". On AgriDirect, all crops are graded transparently. You can filter by category, explore fair prices, or place direct farm-gate orders.`;
      }
    }

    setTranscriptHistory(prev => [...prev, { sender: "tara", text: reply }]);
    speakText(reply);
  };

  const activePrompts = PREDEFINED_PROMPTS[selectedVoiceLang] || PREDEFINED_PROMPTS.hi;

  return (
    <>
      {/* Floating Biophilic Trigger Button */}
      <button 
        className={`voice-assistant-fab ${isSpeaking ? 'speaking' : ''}`}
        onClick={() => setIsOpen(true)}
        title="Open Tara AI Voice Assistant (Multilingual & Mild Voice)"
        id="btn-tara-voice-fab"
      >
        <div className="voice-avatar-badge">
          <Leaf size={18} color="#ffffff" />
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Tara AI Guide</span>
            {isSpeaking && (
              <div className="soundwave-container" style={{ color: '#ffffff' }}>
                <div className="soundwave-bar"></div>
                <div className="soundwave-bar"></div>
                <div className="soundwave-bar"></div>
                <div className="soundwave-bar"></div>
              </div>
            )}
          </div>
          <div style={{ fontSize: '0.675rem', opacity: 0.9 }}>
            {isSpeaking ? "Speaking in Mild Voice..." : `${VOICE_LANGUAGES.find(l => l.code === selectedVoiceLang)?.label || 'हिन्दी'} • Multi-Voice`}
          </div>
        </div>
      </button>

      {/* Expanded Voice Assistant Dialog */}
      {isOpen && (
        <div className="modal-backdrop" onClick={() => setIsOpen(false)}>
          <div 
            className="modal-container" 
            style={{ maxWidth: '620px', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '650px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Biophilic Gradient */}
            <div style={{
              padding: '16px 20px',
              background: 'linear-gradient(135deg, var(--agri-green), var(--agri-green-dark))',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.22)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Leaf size={24} color="#ffffff" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ color: '#ffffff', margin: 0, fontSize: '1.25rem', fontFamily: 'var(--font-display)' }}>
                      {selectedVoiceLang === 'ta' ? 'வானிஸ்ரீ — விவசாய ஒலி வழிகாட்டி' : 'Tara — Agricultural Audio Guide'}
                    </h3>
                    <span style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.25)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.675rem',
                      fontWeight: 700
                    }}>
                      {selectedVoiceLang === 'ta' ? 'நட்பான தமிழ் குரல்' : 'Mild Voice'}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.9 }}>
                    {selectedVoiceLang === 'ta' 
                      ? 'அக்ரிடைரக்ட் நேரடி உழவர் சந்தை ஒலி வழிகாட்டல் & விவசாய தோழி' 
                      : 'Direct Mandi Intelligence & Agricultural Voice Navigation'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isSpeaking && (
                  <button 
                    className="btn btn-sm"
                    onClick={stopSpeaking}
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', border: 'none', padding: '4px 10px' }}
                    title={selectedVoiceLang === 'ta' ? "குரலை நிறுத்து" : "Stop Voice"}
                  >
                    <Square size={13} /> {selectedVoiceLang === 'ta' ? 'நிறுத்து' : 'Stop'}
                  </button>
                )}
                <button 
                  onClick={() => setIsOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '4px' }}
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Language Selector Chips Bar */}
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              borderBottom: '1px solid var(--border-light)',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              overflowX: 'auto',
              scrollbarWidth: 'none'
            }}>
              <Globe size={14} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: '4px', flexShrink: 0 }}>
                VOICE:
              </span>
              {VOICE_LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSwitch(lang.code)}
                  className={`voice-lang-chip ${selectedVoiceLang === lang.code ? 'active' : ''}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Speaking Status Banner */}
            <div style={{
              backgroundColor: isSpeaking ? 'var(--agri-green-subtle)' : 'var(--bg-subtle)',
              borderBottom: '1px solid var(--border-light)',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.8rem',
              color: 'var(--text-primary)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isSpeaking ? (
                  <>
                    <div className="soundwave-container" style={{ color: 'var(--agri-green)' }}>
                      <div className="soundwave-bar"></div>
                      <div className="soundwave-bar"></div>
                      <div className="soundwave-bar"></div>
                      <div className="soundwave-bar"></div>
                      <div className="soundwave-bar"></div>
                    </div>
                    <span style={{ fontWeight: 600, color: 'var(--agri-green)' }}>
                      Tara is speaking ({VOICE_LANGUAGES.find(l => l.code === selectedVoiceLang)?.label})...
                    </span>
                  </>
                ) : isListening ? (
                  <span style={{ color: 'var(--harvest-amber)', fontWeight: 600 }}>
                    🎙️ Listening to you in {VOICE_LANGUAGES.find(l => l.code === selectedVoiceLang)?.label}... Speak now!
                  </span>
                ) : (
                  <span>🟢 Ready to assist you. Tap any topic or speak below.</span>
                )}
              </div>

              <button 
                onClick={() => {
                  const curr = VOICE_LANGUAGES.find(l => l.code === selectedVoiceLang) || VOICE_LANGUAGES[0];
                  speakText(curr.greeting);
                }}
                className="btn btn-sm btn-outline"
                style={{ fontSize: '0.725rem', padding: '3px 8px', height: '26px' }}
                title="Hear sample mild voice"
              >
                <Volume2 size={12} /> Test Mild Voice
              </button>
            </div>

            {/* Conversation Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {transcriptHistory.map((item, index) => (
                <div 
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: item.sender === 'user' ? 'flex-end' : 'flex-start',
                    gap: '8px'
                  }}
                >
                  {item.sender === 'tara' && (
                    <div style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--agri-green-subtle)',
                      border: '1px solid var(--agri-green-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Leaf size={15} color="var(--agri-green)" />
                    </div>
                  )}

                  <div style={{
                    maxWidth: '84%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    lineHeight: '1.45',
                    backgroundColor: item.sender === 'user' ? 'var(--agri-green)' : 'var(--bg-card)',
                    color: item.sender === 'user' ? '#ffffff' : 'var(--text-primary)',
                    border: item.sender === 'user' ? 'none' : '1px solid var(--border-light)',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    {item.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Predefined Voice Prompts in Selected Language */}
            <div style={{
              padding: '8px 16px',
              borderTop: '1px solid var(--border-light)',
              backgroundColor: 'var(--bg-surface)'
            }}>
              <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '5px' }}>
                QUICK TOPICS ({VOICE_LANGUAGES.find(l => l.code === selectedVoiceLang)?.label}):
              </div>
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
                {activePrompts.map((pq, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleUserQuestion(pq.q)}
                    className="btn btn-sm btn-outline"
                    style={{ whiteSpace: 'nowrap', fontSize: '0.75rem', padding: '5px 10px', borderRadius: 'var(--radius-sm)' }}
                  >
                    {pq.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Input & Mic Bar */}
            <div style={{
              padding: '12px 16px',
              borderTop: '1px solid var(--border-light)',
              backgroundColor: 'var(--bg-card)',
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}>
              <button 
                onClick={toggleListening}
                className={`btn btn-sm ${isListening ? 'btn-green' : 'btn-outline'}`}
                style={{ 
                  borderRadius: 'var(--radius-sm)', 
                  width: '40px', 
                  height: '40px', 
                  padding: 0,
                  backgroundColor: isListening ? 'var(--harvest-amber)' : 'var(--bg-subtle)'
                }}
                title={isListening ? "Listening... Click to stop" : `Speak to Tara in ${VOICE_LANGUAGES.find(l => l.code === selectedVoiceLang)?.label}`}
              >
                {isListening ? <MicOff size={18} color="#ffffff" /> : <Mic size={18} color="var(--agri-green)" />}
              </button>

              <input 
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && userQuery.trim()) {
                    handleUserQuestion(userQuery);
                  }
                }}
                placeholder={selectedVoiceLang === 'hi' ? "तारा से फ़सल, भाव या खेती के बारे में कुछ भी पूछें..." : "Ask Tara anything about crops, rates, or farming..."}
                className="form-input"
                style={{ flex: 1, borderRadius: 'var(--radius-sm)', paddingLeft: '16px' }}
              />

              <button 
                onClick={() => {
                  if (userQuery.trim()) {
                    handleUserQuestion(userQuery);
                  }
                }}
                className="btn btn-sm btn-primary"
                style={{ borderRadius: 'var(--radius-sm)', padding: '0 16px', height: '38px' }}
              >
                Ask
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
