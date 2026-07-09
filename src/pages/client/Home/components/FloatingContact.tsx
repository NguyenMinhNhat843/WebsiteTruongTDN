import { useState } from "react";
import { Phone, MessageCircle, Facebook } from "lucide-react";

const PHONE_NUMBER = "0123456789"; // Thay số điện thoại của bạn
const ZALO_NUMBER = "0123456789"; // Thay số Zalo của bạn
const MESSENGER_URL = "https://m.me/yourpage"; // Thay link Messenger của bạn
const FACEBOOK_URL = "https://facebook.com/yourpage"; // Thay link Facebook của bạn

const contacts = [
  {
    id: "phone",
    label: "Gọi ngay",
    href: `tel:${PHONE_NUMBER}`,
    bg: "bg-[#e53935]",
    shadow: "shadow-[0_2px_12px_rgba(229,57,53,0.45)]",
    ringColor: "rgba(229,57,53,0.55)",
    icon: (
      <Phone
        className="w-5 h-5 text-white animate-[pulse_1s_infinite]"
        fill="currentColor"
      />
    ),
  },
  {
    id: "zalo",
    label: "Chat Zalo",
    href: `https://zalo.me/${ZALO_NUMBER}`,
    bg: "bg-[#0068ff]",
    shadow: "shadow-md",
    isZalo: true,
  },
  {
    id: "facebook",
    label: "Facebook",
    href: FACEBOOK_URL,
    bg: "bg-[#1877f2]",
    shadow: "shadow-md",
    icon: <Facebook className="w-5 h-5 text-white" fill="currentColor" />,
  },
];

const FloatingContact = () => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="fixed right-6 bottom-6 z-[9999] flex flex-col gap-3.5 items-end select-none">
      {contacts.map((item) => (
        <a
          key={item.id}
          href={item.href}
          target={item.id !== "phone" ? "_blank" : undefined}
          rel="noopener noreferrer"
          onMouseEnter={() => setHovered(item.id)}
          onMouseLeave={() => setHovered(null)}
          className="flex items-center gap-3 no-underline transition-transform duration-200 ease-out translate-x-0 hover:-translate-x-1"
        >
          {/* Tooltip Label */}
          <span
            className={`bg-slate-900/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap shadow-sm pointer-events-none transition-all duration-200 tracking-wide
              ${hovered === item.id ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"}`}
          >
            {item.label}
          </span>

          {/* Phone Button Specific Effect Container */}
          {item.id === "phone" ? (
            <div className="relative w-12 h-12 flex-shrink-0">
              {/* Animated Aura Rings */}
              <span
                className="absolute -inset-2 rounded-full border-2 animate-[aura_2.4s_ease-out_infinite]"
                style={{ borderColor: item.ringColor }}
              />
              <span
                className="absolute -inset-2 rounded-full border-2 animate-[aura_2.4s_ease-out_infinite_0.7s]"
                style={{ borderColor: item.ringColor }}
              />
              <span
                className="absolute -inset-2 rounded-full border-2 animate-[aura_2.4s_ease-out_infinite_1.4s]"
                style={{ borderColor: item.ringColor }}
              />

              {/* Core Phone Button */}
              <div
                className={`w-12 h-12 rounded-full ${item.bg} ${item.shadow} flex items-center justify-center relative overflow-hidden transition-all duration-200 animate-[shake_2.4s_ease-in-out_infinite] active:scale-95`}
              >
                {item.icon}
              </div>
            </div>
          ) : (
            /* Standard Action Buttons */
            <div
              className={`w-12 h-12 rounded-full ${item.bg} ${item.shadow} flex items-center justify-center flex-shrink-0 relative overflow-hidden transition-all duration-200 active:scale-95
                ${hovered === item.id ? "ring-4 ring-slate-300/40 shadow-lg" : ""}`}
            >
              {item.isZalo ? (
                <span className="text-white font-extrabold text-[15px] tracking-tighter leading-none">
                  Zalo
                </span>
              ) : (
                item.icon
              )}
            </div>
          )}
        </a>
      ))}

      {/* Global CSS Injection for advanced multi-stage keyframes */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          5%       { transform: rotate(-18deg); }
          10%      { transform: rotate(16deg); }
          15%      { transform: rotate(-14deg); }
          20%      { transform: rotate(12deg); }
          25%      { transform: rotate(-8deg); }
          30%      { transform: rotate(5deg); }
          35%      { transform: rotate(0deg); }
        }
        @keyframes aura {
          0%   { transform: scale(1);   opacity: 0.75; }
          80%  { transform: scale(1.8); opacity: 0; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default FloatingContact;
