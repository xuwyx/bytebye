// ---------- i18n ----------

const translations = {
  zh: {
    dialogueLines: [
      "这是我在这里故事的完结篇",
      "会想我吗？",
      "我知道你会的",
      "那就保持联系吧！",
    ],
    byebye: "拜拜咯！",
    connectTitle: "联系方式",
    whatsapp: "WHATSAPP",
    wechat: "微信",
    instagram: "INSTAGRAM",
    anon: "匿名留言",
    wechatPopupLabel: "我的微信号",
    copy: "复制",
    copied: "已复制到剪贴板！",
    copyFail: "复制失败，请手动复制。",
    anonTitle: "匿名留言",
    anonDesc: "想说什么都可以，我不会知道是你写的（除非你自己说）。",
    anonNameLabel: "你的称呼（可选）",
    anonNamePlaceholder: "留空则显示为“匿名”",
    anonMsgLabel: "留言内容",
    anonMsgPlaceholder: "写点什么吧...",
    send: "发送",
    sending: "发送中...",
    sendOk: "已发送！谢谢你的留言～",
    sendFail: "出错了，请稍后再试。",
    yes: "好呀！",
    no: "不用了",
    langToggle: "EN",
  },
  en: {
    dialogueLines: [
      "THIS IS THE FINAL CHAPTER OF MY STORY HERE",
      "MISS ME?",
      "I KNOW YOU DO",
      "LET'S STAY IN TOUCH!",
    ],
    byebye: "BYTEBYE!",
    connectTitle: "CONNECT WITH ME",
    whatsapp: "WHATSAPP",
    wechat: "WECHAT",
    instagram: "INSTAGRAM",
    anon: "ANONYMOUS MESSAGE",
    wechatPopupLabel: "MY WECHAT ID",
    copy: "COPY",
    copied: "COPIED TO CLIPBOARD!",
    copyFail: "COULDN'T COPY — PLEASE COPY MANUALLY.",
    anonTitle: "ANONYMOUS MESSAGE",
    anonDesc: "Say anything — I won't know it's you unless you tell me.",
    anonNameLabel: "YOUR NAME (OPTIONAL)",
    anonNamePlaceholder: "Leave blank to stay anonymous",
    anonMsgLabel: "YOUR MESSAGE",
    anonMsgPlaceholder: "Write something...",
    send: "SEND",
    sending: "SENDING...",
    sendOk: "SENT! THANKS FOR THE MESSAGE.",
    sendFail: "SOMETHING WENT WRONG. TRY AGAIN LATER.",
    yes: "YES!",
    no: "NO!",
    langToggle: "中",
  },
};

let lang = "zh";
let dialogueDone = false;

const langToggleBtn = document.getElementById("langToggle");

function applyLanguage(l) {
  lang = l;
  document.documentElement.lang = l === "zh" ? "zh" : "en";

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = translations[l][el.dataset.i18n];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = translations[l][el.dataset.i18nPlaceholder];
  });

  langToggleBtn.textContent = translations[l].langToggle;

  if (dialogueDone) {
    const lines = translations[l].dialogueLines;
    dialogueText.textContent = lines[lines.length - 1];
  }
}

langToggleBtn.addEventListener("click", () => {
  applyLanguage(lang === "zh" ? "en" : "zh");
});

// ---------- 8-bit sound effects (generated, no audio files) ----------

let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function beep(freq = 600, duration = 0.05, type = "sine", volume = 0.035) {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = volume;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.stop(ctx.currentTime + duration);
  } catch (err) {
    // audio not available — fail silently
  }
}

// Unlock audio on first user interaction (autoplay policies)
["click", "touchstart", "keydown"].forEach((evt) => {
  document.addEventListener(evt, () => getAudioCtx(), { once: true });
});

// ---------- Typewriter dialogue ----------

const dialogueText = document.getElementById("dialogueText");
const contacts = document.getElementById("contacts");
const musicChoice = document.getElementById("musicChoice");
const musicYes = document.getElementById("musicYes");
const musicNo = document.getElementById("musicNo");
const bgMusic = document.getElementById("bgMusic");

function typeText(text, speed = 60) {
  return new Promise((resolve) => {
    dialogueText.textContent = "";
    let i = 0;
    const interval = setInterval(() => {
      dialogueText.textContent += text[i];
      beep(500 + Math.random() * 100, 0.03);
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runIntro() {
  await wait(500);
  const lines = translations[lang].dialogueLines;
  for (const line of lines) {
    await typeText(line);
    await wait(1400);
  }
  dialogueDone = true;
  langToggleBtn.disabled = false;
  musicChoice.classList.add("show");
  beep(700, 0.09, "sine", 0.05);
}

function foldAway() {
  langToggleBtn.style.visibility = "hidden";
  document.querySelector(".stage").classList.add("fold-away");
}

musicYes.addEventListener("click", () => {
  musicChoice.classList.remove("show");
  contacts.classList.add("show");
  beep(700, 0.09, "sine", 0.05);
  bgMusic.volume = 0.4;
  bgMusic.play().catch(() => {});
});

musicNo.addEventListener("click", async () => {
  musicChoice.classList.remove("show");
  langToggleBtn.disabled = true;
  await typeText(translations[lang].byebye);
  await wait(1200);
  foldAway();
});

document.addEventListener("DOMContentLoaded", () => {
  applyLanguage(lang);
  runIntro();
});

// ---------- WeChat popup ----------

const wechatBtn = document.getElementById("wechatBtn");
const wechatPopup = document.getElementById("wechatPopup");
const wechatClose = document.getElementById("wechatClose");
const wechatCopy = document.getElementById("wechatCopy");
const wechatId = document.getElementById("wechatId");
const wechatCopyFeedback = document.getElementById("wechatCopyFeedback");

wechatBtn.addEventListener("click", () => {
  wechatPopup.classList.add("show");
});

wechatClose.addEventListener("click", () => {
  wechatPopup.classList.remove("show");
  wechatCopyFeedback.textContent = "";
});

wechatCopy.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(wechatId.textContent);
    wechatCopyFeedback.textContent = translations[lang].copied;
  } catch (err) {
    wechatCopyFeedback.textContent = translations[lang].copyFail;
  }
});

// ---------- Anonymous message popup ----------

const anonBtn = document.getElementById("anonBtn");
const anonPopup = document.getElementById("anonPopup");
const anonClose = document.getElementById("anonClose");
const anonForm = document.getElementById("anonForm");
const anonFeedback = document.getElementById("anonFeedback");

const FORMSPREE_ENDPOINT = "https://formspree.io/f/maqrdvap";

anonBtn.addEventListener("click", () => {
  anonPopup.classList.add("show");
});

anonClose.addEventListener("click", () => {
  anonPopup.classList.remove("show");
  anonFeedback.textContent = "";
});

anonForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  anonFeedback.textContent = translations[lang].sending;

  const formData = new FormData(anonForm);
  if (!formData.get("name")) {
    formData.set("name", "Anonymous");
  }

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      anonFeedback.textContent = translations[lang].sendOk;
      beep(800, 0.08, "square", 0.06);
      anonForm.reset();
    } else {
      anonFeedback.textContent = translations[lang].sendFail;
    }
  } catch (err) {
    anonFeedback.textContent = translations[lang].sendFail;
  }
});

// Beep on every menu-item interaction + close popups when clicking outside
document.querySelectorAll("[data-sound]").forEach((el) => {
  el.addEventListener("click", () => beep(700, 0.04));
});

[wechatPopup, anonPopup].forEach((popup) => {
  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      popup.classList.remove("show");
    }
  });
});
