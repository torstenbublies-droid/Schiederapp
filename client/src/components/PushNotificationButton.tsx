import { useEffect, useRef } from "react";

declare global {
  interface Window {
    OneSignal?: any;
    OneSignalDeferred?: Array<(oneSignal: any) => void>;
  }
}

export default function PushNotificationButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async function(OneSignal: any) {
      const btn = buttonRef.current;
      if (!btn) return;

      btn.addEventListener("click", async () => {
        try {
          const supported = await OneSignal.Notifications.isPushSupported();
          if (!supported) {
            alert("Dieser Browser unterstützt hier kein Web-Push (z. B. iOS-Safari ohne PWA).");
            return;
          }

          // v16: permission ist eine Property ("default" | "granted" | "denied")
          const perm = await OneSignal.Notifications.permission;
          console.log("[Push] permission:", perm);

          if (perm === "denied") {
            alert("Benachrichtigungen sind im Browser blockiert. Schloss-Icon → Benachrichtigungen: Zulassen.");
            return;
          }
          if (perm === "granted") {
            alert("Schon abonniert ✅");
            return;
          }

          await OneSignal.Slidedown.promptPush(); // System-Dialog anzeigen
          console.log("[Push] Prompt geöffnet");
        } catch (e) {
          console.error("[Push] Prompt-Fehler:", e);
          alert("Konnte den Prompt nicht öffnen – Details in der Konsole (F12).");
        }
      });
    });
  }, []);

  return (
    <button
      ref={buttonRef}
      id="enable-push"
      style={{
        padding: "0.6rem 1rem",
        borderRadius: "0.5rem",
        backgroundColor: "#3b82f6",
        color: "white",
        border: "none",
        cursor: "pointer",
        fontSize: "1rem",
        fontWeight: "500",
        transition: "all 0.2s",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#2563eb";
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#3b82f6";
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
      }}
    >
      🔔 Benachrichtigungen aktivieren
    </button>
  );
}

