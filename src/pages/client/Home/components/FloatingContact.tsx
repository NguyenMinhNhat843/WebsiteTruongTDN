import { useState } from "react";

const PHONE_NUMBER = "0123456789"; // thay số thật vào đây
const ZALO_NUMBER = "0123456789"; // thay số Zalo vào đây
const MESSENGER_URL = "https://m.me/yourpage"; // thay page ID vào đây
const FACEBOOK_URL = "https://facebook.com/yourpage"; // thay link FB vào đây

const contacts = [
  {
    id: "phone",
    label: "Gọi ngay",
    href: `tel:${PHONE_NUMBER}`,
    bg: "#e53935",
    ring: "#ff6b6b",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.59 3.47 2 2 0 0 1 3.56 1.3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6.29 6.29l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    id: "messenger",
    label: "Messenger",
    href: MESSENGER_URL,
    bg: "linear-gradient(135deg, #833ab4, #fd1d1d, #1877f2)",
    bgSolid: "#7b2ff7",
    ring: "#a78bfa",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.921 1.32 5.536 3.407 7.29V22l3.109-1.708C9.454 20.59 10.702 20.8 12 20.8c5.523 0 10-4.144 10-9.557C22 6.145 17.523 2 12 2zm1.007 12.863l-2.545-2.714-4.967 2.714 5.462-5.796 2.607 2.714 4.905-2.714-5.462 5.796z" />
      </svg>
    ),
  },
  {
    id: "zalo",
    label: "Chat Zalo",
    href: `https://zalo.me/${ZALO_NUMBER}`,
    bg: "#0068ff",
    ring: "#60a5fa",
    isZalo: true,
  },
  {
    id: "facebook",
    label: "Facebook",
    href: FACEBOOK_URL,
    bg: "#1877f2",
    ring: "#93c5fd",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
];

const FloatingContact = () => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      style={{
        position: "fixed",
        right: "20px",
        bottom: "50%",
        transform: "translateY(50%)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        alignItems: "flex-end",
      }}
    >
      {contacts.map((item) => (
        <a
          key={item.id}
          href={item.href}
          target={item.id !== "phone" ? "_blank" : undefined}
          rel="noopener noreferrer"
          onMouseEnter={() => setHovered(item.id)}
          onMouseLeave={() => setHovered(null)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            transition: "transform 0.2s ease",
            transform:
              hovered === item.id ? "translateX(-4px)" : "translateX(0)",
          }}
        >
          {/* Tooltip label */}
          <span
            style={{
              background: "rgba(15,23,42,0.85)",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 600,
              padding: "5px 12px",
              borderRadius: "20px",
              whiteSpace: "nowrap",
              opacity: hovered === item.id ? 1 : 0,
              transform:
                hovered === item.id ? "translateX(0)" : "translateX(8px)",
              transition: "opacity 0.2s ease, transform 0.2s ease",
              pointerEvents: "none",
              letterSpacing: "0.01em",
            }}
          >
            {item.label}
          </span>

          {/* Phone: wrapper with aura rings + shake */}
          {item.id === "phone" ? (
            <div
              style={{
                position: "relative",
                width: "50px",
                height: "50px",
                flexShrink: 0,
              }}
            >
              {/* Aura ring 1 */}
              <span
                style={{
                  position: "absolute",
                  inset: "-8px",
                  borderRadius: "50%",
                  border: "2px solid rgba(229,57,53,0.55)",
                  animation: "aura1 2.4s ease-out infinite",
                }}
              />
              {/* Aura ring 2 */}
              <span
                style={{
                  position: "absolute",
                  inset: "-8px",
                  borderRadius: "50%",
                  border: "2px solid rgba(229,57,53,0.35)",
                  animation: "aura1 2.4s ease-out infinite 0.7s",
                }}
              />
              {/* Aura ring 3 */}
              <span
                style={{
                  position: "absolute",
                  inset: "-8px",
                  borderRadius: "50%",
                  border: "2px solid rgba(229,57,53,0.2)",
                  animation: "aura1 2.4s ease-out infinite 1.4s",
                }}
              />

              {/* Icon button with shake */}
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background: "#e53935",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow:
                    hovered === item.id
                      ? "0 0 0 4px rgba(255,107,107,0.35), 0 4px 16px rgba(0,0,0,0.2)"
                      : "0 2px 12px rgba(229,57,53,0.45)",
                  position: "relative",
                  overflow: "hidden",
                  animation: "shake 2.4s ease-in-out infinite",
                }}
              >
                {item.icon}
              </div>
            </div>
          ) : (
            /* Other buttons */
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: item.isZalo ? "#0068ff" : item.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  hovered === item.id
                    ? `0 0 0 4px ${item.ring}55, 0 4px 16px rgba(0,0,0,0.2)`
                    : "0 2px 10px rgba(0,0,0,0.18)",
                transition: "box-shadow 0.2s ease",
                flexShrink: 0,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {item.isZalo ? (
                <span
                  style={{
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: "17px",
                    letterSpacing: "-0.5px",
                    lineHeight: 1,
                  }}
                >
                  Zalo
                </span>
              ) : (
                item.icon
              )}
            </div>
          )}
        </a>
      ))}

      <style>{`
        @keyframes shake {
          0%,  100% { transform: rotate(0deg); }
          /* pause dài giữa các lần rung */
          5%         { transform: rotate(-18deg); }
          10%        { transform: rotate(16deg); }
          15%        { transform: rotate(-14deg); }
          20%        { transform: rotate(12deg); }
          25%        { transform: rotate(-8deg); }
          30%        { transform: rotate(5deg); }
          35%        { transform: rotate(0deg); }
        }

        @keyframes aura1 {
          0%   { transform: scale(1);   opacity: 0.8; }
          80%  { transform: scale(1.9); opacity: 0; }
          100% { transform: scale(1.9); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default FloatingContact;
