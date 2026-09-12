import { useState, useRef, useEffect } from "react";
import { IClose } from "./icons";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const QUICK_REPLIES = [
  "شرایط گارانتی",
  "نحوه ارسال",
  "مهلت مرجوعی",
  "مشاوره خرید",
  "پشتیبانی فنی",
];

const BOT_RESPONSES: Record<string, string> = {
  "شرایط گارانتی": "تمامی لپ‌تاپ‌های افرالینک دارای ۲ سال گارانتی رسمی هستند. علاوه بر این، پوشش ۲ ساله افرالینک نیز شامل بدنه، لولا و باتری می‌شود. برای اطلاعات بیشتر با شماره ۰۲۱-۹۱۰۰۴۸۲۰ تماس بگیرید.",
  "نحوه ارسال": "ارسال به سراسر ایران انجام می‌شود. سفارش‌های بالای ۱۵۰ میلیون ریال، ارسال رایگان ۴۸ ساعته دارند. سایر سفارش‌ها با تیپاکس یا پست ویژه (۲ تا ۴ روز کاری) ارسال می‌شوند.",
  "مهلت مرجوعی": "۷ روز مهلت مرجوعی بدون قیدوشرط با برچسب مرجوعی رایگان. مبلغ حداکثر ۳ روز کاری پس از رسیدن دستگاه به آزمایشگاه برگشت می‌خورد.",
  "مشاوره خرید": "کارشناسان ما آماده مشاوره رایگان هستند. می‌توانید با شماره ۰۲۱-۹۱۰۰۴۸۲۰ تماس بگیرید یا در ساعات اداری (۹ تا ۲۱) چت آنلاین داشته باشید.",
  "پشتیبانی فنی": "پشتیبانی فنی ۷ روز هفته از ساعت ۹ تا ۲۱ فعال است. شماره تماس: ۰۲۱-۹۱۰۰۴۸۲۰ | واتساپ: ۰۹۱۲۱۲۳۴۵۶۷",
  "قیمت": "قیمت‌ها به ریال و شامل ۱۰٪ مالیات بر ارزش افزوده هستند. برای استعلام قیمت دقیق، لطفاً مدل مورد نظر خود را بفرمایید.",
  "مقایسه": "برای مقایسه محصولات، حداقل ۲ محصول را انتخاب کرده و روی دکمه 'مقایسه' کلیک کنید. صفحه مقایسه پیشرفته با نمودارها و جدول مشخصات باز می‌شود.",
  "پرداخت": "پرداخت از طریق درگاه زرین‌پال (کارت‌های شتاب)، کیف پول و پرداخت در محل (فقط تهران و کرج) امکان‌پذیر است.",
};

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "سلام! 👋 به افرالینک خوش آمدید. چطور می‌توانم کمکتان کنم؟",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // بررسی پاسخ‌های از پیش تعریف شده
    for (const [key, response] of Object.entries(BOT_RESPONSES)) {
      if (lowerMessage.includes(key.toLowerCase()) || 
          key.toLowerCase().includes(lowerMessage)) {
        return response;
      }
    }

    // پاسخ‌های کلی
    if (lowerMessage.includes("سلام") || lowerMessage.includes("درود")) {
      return "سلام! خوش آمدید. چطور می‌توانم کمکتان کنم؟";
    }
    if (lowerMessage.includes("ممنون") || lowerMessage.includes("مرسی")) {
      return "خواهش می‌کنم! اگر سوال دیگری دارید، در خدمتم. 😊";
    }
    if (lowerMessage.includes("لپ‌تاپ") || lowerMessage.includes("خرید")) {
      return "ما ۱۲ مدل لپ‌تاپ تخصصی از برندهای معتبر داریم. برای مشاوره تخصصی، لطفاً با شماره ۰۲۱-۹۱۰۰۴۸۲۰ تماس بگیرید.";
    }
    if (lowerMessage.includes("قیمت") || lowerMessage.includes("هزینه")) {
      return "قیمت‌ها در صفحه هر محصول درج شده‌اند. برای تخفیف ویژه، کد CORE10 را هنگام خرید وارد کنید.";
    }
    if (lowerMessage.includes("ارسال") || lowerMessage.includes("تحویل")) {
      return BOT_RESPONSES["نحوه ارسال"];
    }
    if (lowerMessage.includes("گارانتی") || lowerMessage.includes("ضمانت")) {
      return BOT_RESPONSES["شرایط گارانتی"];
    }
    if (lowerMessage.includes("مرجوع") || lowerMessage.includes("بازگشت")) {
      return BOT_RESPONSES["مهلت مرجوعی"];
    }
    if (lowerMessage.includes("تماس") || lowerMessage.includes("شماره")) {
      return "شماره تماس پشتیبانی: ۰۲۱-۹۱۰۰۴۸۲۰\nواتساپ: ۰۹۱۲۱۲۳۴۵۶۷\nساعات کاری: ۹ تا ۲۱ (۷ روز هفته)";
    }

    // پاسخ پیش‌فرض
    return "متشکرم از پیام شما. برای پاسخ دقیق‌تر، لطفاً با شماره ۰۲۱-۹۱۰۰۴۸۲۰ تماس بگیرید یا در واتساپ پیام دهید. کارشناسان ما در اسرع وقت پاسخگو خواهند بود.";
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // شبیه‌سازی تایپ کردن بات
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: getBotResponse(text),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
  };

  return (
    <>
      {/* دکمه چت */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-sea text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl"
        aria-label="چت آنلاین"
      >
        {isOpen ? (
          <IClose size={24} />
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* پنجره چت */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-50 flex h-[500px] w-[380px] flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-2xl">
          {/* هدر */}
          <div className="bg-sea p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold">پشتیبانی افرالینک</h3>
                <p className="text-xs opacity-90">آنلاین | پاسخ در کمتر از ۱ دقیقه</p>
              </div>
            </div>
          </div>

          {/* پیام‌ها */}
          <div className="flex-1 overflow-y-auto bg-foam p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      msg.sender === "user"
                        ? "bg-sea text-white"
                        : "bg-white border border-line text-ink"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p className={`mt-1 text-[10px] ${msg.sender === "user" ? "text-white/70" : "text-mist"}`}>
                      {msg.timestamp.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-white border border-line px-4 py-2">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-mist" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-mist" style={{ animationDelay: "150ms" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-mist" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* پاسخ‌های سریع */}
          {messages.length <= 2 && (
            <div className="border-t border-line bg-white p-3">
              <p className="mb-2 text-xs font-bold text-mist">پاسخ‌های سریع:</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleQuickReply(reply)}
                    className="rounded-full border border-sea bg-sea/10 px-3 py-1 text-xs text-sea transition-colors hover:bg-sea hover:text-white"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* فرم ارسال پیام */}
          <form onSubmit={handleSubmit} className="border-t border-line bg-white p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="پیام خود را بنویسید..."
                className="flex-1 rounded-full border border-line px-4 py-2 text-sm outline-none transition-colors focus:border-sea"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-sea text-white transition-all hover:bg-seadeep disabled:opacity-50"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
