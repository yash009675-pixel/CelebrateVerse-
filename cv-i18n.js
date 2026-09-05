/* CelebrateVerse — real UI language switcher (EN / HI / GU) */
(function(){
  const dict={
    hi:{
      "Home":"होम","Celebrations":"सेलिब्रेशन","How It Works":"यह कैसे काम करता है","Pricing":"पैकेज","Login":"लॉगिन","Create Account":"अकाउंट बनाएँ","Create Surprise":"सरप्राइज़ बनाएँ","Create Your Celebration":"अपना सेलिब्रेशन बनाएँ","Install App":"ऐप इंस्टॉल करें","Personalized Celebration Websites":"पर्सनलाइज़्ड सेलिब्रेशन वेबसाइट्स","Turn Your Special Moments Into Digital Memories.":"अपने खास पलों को डिजिटल यादों में बदलें।","Explore Celebrations":"सेलिब्रेशन एक्सप्लोर करें","Today's Celebration":"आज का सेलिब्रेशन","Upcoming Celebrations":"आने वाले सेलिब्रेशन","Popular Categories":"लोकप्रिय कैटेगरी","Why CelebrateVerse?":"CelebrateVerse क्यों?","Discover":"खोजें","Create":"बनाएँ","Personalize":"पर्सनलाइज़ करें","Share":"शेयर करें","Remember":"याद रखें","Festivals":"त्योहार","Personal Occasions":"व्यक्तिगत अवसर","Languages":"भाषाएँ","English":"अंग्रेज़ी","हिन्दी":"हिन्दी","ગુજરાતી":"गुजराती","Birthdays":"जन्मदिन","Anniversaries":"सालगिरह","Achievements":"उपलब्धियाँ","Wishes":"शुभकामनाएँ","Greeting Cards":"ग्रीटिंग कार्ड्स","Wedding":"शादी","Engagement":"सगाई","Graduation":"ग्रेजुएशन","Promotion":"पदोन्नति","New Home":"नया घर","New Job":"नई नौकरी","Achievement":"उपलब्धि","Diwali":"दिवाली","Holi":"होली","Navratri":"नवरात्रि","Eid":"ईद","Christmas":"क्रिसमस","New Year":"नया साल","Continue":"जारी रखें","Back":"वापस","Occasion":"अवसर","Person":"व्यक्ति","Theme":"थीम","Details":"जानकारी","Package":"पैकेज","What are you celebrating? 🎉":"आप क्या सेलिब्रेट कर रहे हैं? 🎉","Who is this celebration for? ❤️":"यह सेलिब्रेशन किसके लिए है? ❤️","Choose your website style 🎨":"अपनी वेबसाइट की स्टाइल चुनें 🎨","Choose your plan 💎":"अपना प्लान चुनें 💎","Celebrating Person's Name *":"जिस व्यक्ति का सेलिब्रेशन है उसका नाम *","Your Name *":"आपका नाम *","Special Date *":"खास तारीख *","Email Address *":"ईमेल एड्रेस *","Special Message 💌":"खास संदेश 💌","Upload Photos 📸":"फोटो अपलोड करें 📸","Free":"फ्री","Basic":"बेसिक","Premium":"प्रीमियम","Ultimate":"अल्टीमेट"
    },
    gu:{
      "Home":"હોમ","Celebrations":"સેલિબ્રેશન્સ","How It Works":"આ કેવી રીતે કામ કરે છે","Pricing":"પેકેજ","Login":"લૉગિન","Create Account":"અકાઉન્ટ બનાવો","Create Surprise":"સરપ્રાઇઝ બનાવો","Create Your Celebration":"તમારું સેલિબ્રેશન બનાવો","Install App":"એપ ઇન્સ્ટોલ કરો","Personalized Celebration Websites":"પર્સનલાઇઝ્ડ સેલિબ્રેશન વેબસાઇટ્સ","Turn Your Special Moments Into Digital Memories.":"તમારી ખાસ પળોને ડિજિટલ યાદોમાં બદલો.","Explore Celebrations":"સેલિબ્રેશન્સ એક્સપ્લોર કરો","Today's Celebration":"આજનું સેલિબ્રેશન","Upcoming Celebrations":"આવનારા સેલિબ્રેશન્સ","Popular Categories":"લોકપ્રિય કેટેગરીઝ","Why CelebrateVerse?":"CelebrateVerse શા માટે?","Discover":"શોધો","Create":"બનાવો","Personalize":"પર્સનલાઇઝ કરો","Share":"શેર કરો","Remember":"યાદ રાખો","Festivals":"તહેવારો","Personal Occasions":"વ્યક્તિગત પ્રસંગો","Languages":"ભાષાઓ","English":"અંગ્રેજી","હिन्दी":"હિન્દી","ગુજરાતી":"ગુજરાતી","Birthdays":"જન્મદિવસ","Anniversaries":"વર્ષગાંઠ","Achievements":"સિદ્ધિઓ","Wishes":"શુભેચ્છાઓ","Greeting Cards":"ગ્રીટિંગ કાર્ડ્સ","Wedding":"લગ્ન","Engagement":"સગાઈ","Graduation":"ગ્રેજ્યુએશન","Promotion":"બઢતી","New Home":"નવું ઘર","New Job":"નવી નોકરી","Achievement":"સિદ્ધિ","Diwali":"દિવાળી","Holi":"હોળી","Navratri":"નવરાત્રી","Eid":"ઈદ","Christmas":"ક્રિસમસ","New Year":"નવું વર્ષ","Continue":"આગળ વધો","Back":"પાછા","Occasion":"પ્રસંગ","Person":"વ્યક્તિ","Theme":"થીમ","Details":"વિગતો","Package":"પેકેજ","What are you celebrating? 🎉":"તમે શું ઉજવી રહ્યા છો? 🎉","Who is this celebration for? ❤️":"આ સેલિબ્રેશન કોના માટે છે? ❤️","Choose your website style 🎨":"તમારી વેબસાઇટની સ્ટાઇલ પસંદ કરો 🎨","Choose your plan 💎":"તમારો પ્લાન પસંદ કરો 💎","Celebrating Person's Name *":"જે વ્યક્તિનું સેલિબ્રેશન છે તેનું નામ *","Your Name *":"તમારું નામ *","Special Date *":"ખાસ તારીખ *","Email Address *":"ઈમેલ એડ્રેસ *","Special Message 💌":"ખાસ સંદેશ 💌","Upload Photos 📸":"ફોટા અપલોડ કરો 📸","Free":"ફ્રી","Basic":"બેસિક","Premium":"પ્રીમિયમ","Ultimate":"અલ્ટિમેટ"
    }
  };
  const original=new Map();
  function walk(root){
    const nodes=[];
    const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    let n; while(n=w.nextNode()) nodes.push(n);
    nodes.forEach(n=>{if(!original.has(n)) original.set(n,n.nodeValue);});
  }
  function apply(lang){
    const L=dict[lang];
    if(!L) return;
    walk(document.body);
    original.forEach((value,node)=>{
      const key=value.trim();
      if(!key || node.parentElement?.closest("script,style")) return;
      if(lang==="en"){node.nodeValue=value;return;}
      if(L[key]) node.nodeValue=value.replace(key,L[key]);
    });
    document.documentElement.lang=lang==="hi"?"hi":lang==="gu"?"gu":"en";
    document.querySelectorAll(".cv-language-card").forEach(b=>b.classList.toggle("active",b.dataset.lang===lang));
    localStorage.setItem("cv-language",lang);
  }
  window.CelebrateVerseI18n={apply};
  document.addEventListener("DOMContentLoaded",()=>{
    document.querySelectorAll(".cv-language-card").forEach(b=>b.addEventListener("click",()=>apply(b.dataset.lang)));
    apply(localStorage.getItem("cv-language")||"en");
  });
})();