import { useState } from "react";
import { IClose, IUser, IPhone, ICheck } from "./icons";

interface AuthModalProps {
  onClose: () => void;
  initialMode?: "login" | "register";
}

export default function AuthModal({ onClose, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [step, setStep] = useState<"credentials" | "sms">(mode === "login" ? "credentials" : "credentials");
  
  // فرم ورود
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
    smsCode: "",
  });
  
  // فرم ثبت‌نام
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [smsSent, setSmsSent] = useState(false);
  const [smsCode, setSmsCode] = useState("");

  // اعتبارسنجی فرم ورود
  const validateLogin = () => {
    const e: Record<string, string> = {};
    if (!loginData.username.trim()) e.username = "نام کاربری/ایمیل/موبایل الزامی است";
    if (!loginData.password) e.password = "رمز عبور الزامی است";
    if (step === "sms" && !smsCode.trim()) e.smsCode = "کد تأیید الزامی است";
    if (step === "sms" && smsCode.length !== 5) e.smsCode = "کد تأیید باید ۵ رقم باشد";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // اعتبارسنجی فرم ثبت‌نام
  const validateRegister = () => {
    const e: Record<string, string> = {};
    if (!registerData.firstName.trim()) e.firstName = "نام الزامی است";
    if (!registerData.lastName.trim()) e.lastName = "نام خانوادگی الزامی است";
    if (!registerData.email.trim()) e.email = "ایمیل الزامی است";
    else if (!/^\S+@\S+\.\S+$/.test(registerData.email)) e.email = "ایمیل نامعتبر است";
    if (!registerData.phone.trim()) e.phone = "شماره موبایل الزامی است";
    else if (!/^09\d{9}$/.test(registerData.phone)) e.phone = "شماره موبایل نامعتبر است";
    if (!registerData.address.trim()) e.address = "آدرس الزامی است";
    if (!registerData.city.trim()) e.city = "شهر الزامی است";
    if (!registerData.postalCode.trim()) e.postalCode = "کد پستی الزامی است";
    if (!registerData.password) e.password = "رمز عبور الزامی است";
    else if (registerData.password.length < 6) e.password = "رمز عبور باید حداقل ۶ کاراکتر باشد";
    if (registerData.password !== registerData.confirmPassword) e.confirmPassword = "تکرار رمز عبور مطابقت ندارد";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ارسال کد تأیید پیامکی
  const sendSmsCode = () => {
    if (!loginData.username.trim()) {
      setErrors({ username: "ابتدا نام کاربری/ایمیل/موبایل را وارد کنید" });
      return;
    }
    setSmsSent(true);
    setStep("sms");
  };

  // ثبت‌نام
  const handleRegister = () => {
    if (validateRegister()) {
      alert("ثبت‌نام با موفقیت انجام شد!");
      onClose();
    }
  };

  // ورود نهایی
  const handleLogin = () => {
    if (validateLogin()) {
      alert("ورود با موفقیت انجام شد!");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-[90%] max-w-[500px] rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* دکمه بستن */}
        <button onClick={onClose} className="absolute left-4 top-4 text-mist hover:text-ink">
          <IClose size={24} />
        </button>

        {/* عنوان */}
        <div className="mb-6 text-center">
          <h2 className="font-display text-2xl font-bold text-ink">
            {mode === "login" ? "ورود به حساب کاربری" : "ثبت‌نام"}
          </h2>
          <p className="mt-2 text-sm text-mist">
            {mode === "login" 
              ? "برای ادامه، اطلاعات حساب خود را وارد کنید" 
              : "اطلاعات خود را برای ایجاد حساب کاربری وارد کنید"}
          </p>
        </div>

        {/* فرم ورود */}
        {mode === "login" && step === "credentials" && (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-bold text-ink">نام کاربری / ایمیل / موبایل</label>
              <input
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                className="w-full rounded-lg border border-line px-4 py-3 text-sm outline-none transition-colors focus:border-sea"
                placeholder="نام کاربری، ایمیل یا شماره موبایل"
              />
              {errors.username && <p className="mt-1 text-xs text-coral">{errors.username}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-ink">رمز عبور</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full rounded-lg border border-line px-4 py-3 text-sm outline-none transition-colors focus:border-sea"
                placeholder="رمز عبور خود را وارد کنید"
              />
              {errors.password && <p className="mt-1 text-xs text-coral">{errors.password}</p>}
            </div>
            <button
              onClick={sendSmsCode}
              className="w-full rounded-lg bg-sea py-3 text-sm font-bold text-white transition-colors hover:bg-seadeep"
            >
              ادامه و دریافت کد تأیید
            </button>
            <p className="text-center text-sm text-mist">
              حساب کاربری ندارید؟{" "}
              <button onClick={() => setMode("register")} className="font-bold text-sea hover:underline">
                ثبت‌نام کنید
              </button>
            </p>
          </div>
        )}

        {/* فرم تأیید پیامکی */}
        {mode === "login" && step === "sms" && (
          <div className="space-y-4">
            <div className="rounded-lg bg-skywash p-4 text-center">
              <IPhone size={32} className="mx-auto mb-2 text-sea" />
              <p className="text-sm text-ink">
                کد تأیید ۵ رقمی به شماره{" "}
                <span className="font-bold" dir="ltr">{loginData.username}</span> ارسال شد
              </p>
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-ink">کد تأیید پیامکی</label>
              <input
                type="text"
                value={smsCode}
                onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
                className="w-full rounded-lg border border-line px-4 py-3 text-center text-lg font-bold tracking-widest outline-none transition-colors focus:border-sea"
                placeholder="• • • • •"
                maxLength={5}
              />
              {errors.smsCode && <p className="mt-1 text-xs text-coral">{errors.smsCode}</p>}
            </div>
            <button
              onClick={handleLogin}
              className="w-full rounded-lg bg-sea py-3 text-sm font-bold text-white transition-colors hover:bg-seadeep"
            >
              ورود به حساب
            </button>
            <button
              onClick={() => setStep("credentials")}
              className="w-full text-center text-sm text-mist hover:text-ink"
            >
              بازگشت
            </button>
          </div>
        )}

        {/* فرم ثبت‌نام */}
        {mode === "register" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-sm font-bold text-ink">نام</label>
                <input
                  type="text"
                  value={registerData.firstName}
                  onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                  className="w-full rounded-lg border border-line px-4 py-3 text-sm outline-none transition-colors focus:border-sea"
                  placeholder="نام"
                />
                {errors.firstName && <p className="mt-1 text-xs text-coral">{errors.firstName}</p>}
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-ink">نام خانوادگی</label>
                <input
                  type="text"
                  value={registerData.lastName}
                  onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                  className="w-full rounded-lg border border-line px-4 py-3 text-sm outline-none transition-colors focus:border-sea"
                  placeholder="نام خانوادگی"
                />
                {errors.lastName && <p className="mt-1 text-xs text-coral">{errors.lastName}</p>}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-ink">ایمیل</label>
              <input
                type="email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                className="w-full rounded-lg border border-line px-4 py-3 text-sm outline-none transition-colors focus:border-sea"
                placeholder="example@email.com"
                dir="ltr"
              />
              {errors.email && <p className="mt-1 text-xs text-coral">{errors.email}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-ink">شماره موبایل</label>
              <input
                type="tel"
                value={registerData.phone}
                onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                className="w-full rounded-lg border border-line px-4 py-3 text-sm outline-none transition-colors focus:border-sea"
                placeholder="09123456789"
                dir="ltr"
              />
              {errors.phone && <p className="mt-1 text-xs text-coral">{errors.phone}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-ink">شهر</label>
              <input
                type="text"
                value={registerData.city}
                onChange={(e) => setRegisterData({ ...registerData, city: e.target.value })}
                className="w-full rounded-lg border border-line px-4 py-3 text-sm outline-none transition-colors focus:border-sea"
                placeholder="تهران"
              />
              {errors.city && <p className="mt-1 text-xs text-coral">{errors.city}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-ink">آدرس کامل</label>
              <textarea
                value={registerData.address}
                onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })}
                className="w-full rounded-lg border border-line px-4 py-3 text-sm outline-none transition-colors focus:border-sea"
                placeholder="خیابان، کوچه، پلاک، واحد"
                rows={2}
              />
              {errors.address && <p className="mt-1 text-xs text-coral">{errors.address}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-ink">کد پستی</label>
              <input
                type="text"
                value={registerData.postalCode}
                onChange={(e) => setRegisterData({ ...registerData, postalCode: e.target.value })}
                className="w-full rounded-lg border border-line px-4 py-3 text-sm outline-none transition-colors focus:border-sea"
                placeholder="1234567890"
                dir="ltr"
              />
              {errors.postalCode && <p className="mt-1 text-xs text-coral">{errors.postalCode}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-sm font-bold text-ink">رمز عبور</label>
                <input
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  className="w-full rounded-lg border border-line px-4 py-3 text-sm outline-none transition-colors focus:border-sea"
                  placeholder="حداقل ۶ کاراکتر"
                />
                {errors.password && <p className="mt-1 text-xs text-coral">{errors.password}</p>}
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-ink">تکرار رمز عبور</label>
                <input
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  className="w-full rounded-lg border border-line px-4 py-3 text-sm outline-none transition-colors focus:border-sea"
                  placeholder="تکرار رمز عبور"
                />
                {errors.confirmPassword && <p className="mt-1 text-xs text-coral">{errors.confirmPassword}</p>}
              </div>
            </div>
            <button
              onClick={handleRegister}
              className="w-full rounded-lg bg-sea py-3 text-sm font-bold text-white transition-colors hover:bg-seadeep"
            >
              ثبت‌نام
            </button>
            <p className="text-center text-sm text-mist">
              حساب کاربری دارید؟{" "}
              <button onClick={() => setMode("login")} className="font-bold text-sea hover:underline">
                وارد شوید
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
