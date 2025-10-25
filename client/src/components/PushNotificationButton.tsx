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
    // Robust: wartet auf OneSignal-Init und behandelt alle Fälle
    if (!window.OneSignalDeferred) {
      window.OneSignalDeferred = [];
    }

    window.OneSignalDeferred.push(async function(OneSignal: any) {
      try {
        // Init ist bereits im index.html, aber wir stellen sicher
        console.log("[Push] OneSignal init fertig");
      } catch (e) {
        console.error("[Push] Init-Fehler:", e);
      }

      // Klick-Handler
      const btn = buttonRef.current;
      if (!btn) return;

      btn.addEventListener("click", async () => {
        try {
          const supported = await OneSignal.Notifications.isPushSupported();
          console.log("[Push] supported:", supported);
          if (!supported) {
            alert("Dein Browser unterstützt Web-Push hier nicht (z. B. iOS-Safari ohne PWA).");
            return;
          }

          const perm = await OneSignal.Notifications.getPermission();
          console.log("[Push] permission:", perm);
          if (perm === "denied") {
            alert("Benachrichtigungen sind im Browser blockiert. Erlaube sie unter Seiteninfos (🔒) → Benachrichtigungen.");
            return;
          }
          if (perm === "granted") {
            alert("Schon abonniert ✅");
            return;
          }

          // v16: Prompt explizit öffnen
          await OneSignal.Slidedown.promptPush();
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
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#2563eb";
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#3b82f6";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      🔔 Benachrichtigungen aktivieren
    </button>
  );
}

