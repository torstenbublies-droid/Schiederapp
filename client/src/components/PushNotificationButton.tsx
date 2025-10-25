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
    // Im <head> muss stehen:
    // <script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer></script>

    window.OneSignalDeferred = window.OneSignalDeferred || [];
    OneSignalDeferred.push(async function(OneSignal: any) {
      try {
        await OneSignal.init({
          appId: "5a9ded2d-f692-4e8c-9b3b-4233fe2b1ecc" // exakt aus Settings → Keys & IDs
          // safariWebId: "HIER-DEINE-SAFARI-WEB-ID" // optional, nur wenn konfiguriert
        });
        console.log("[Push] OneSignal bereit");
      } catch (e) {
        console.error("[Push] Init-Fehler:", e);
        alert("OneSignal Init fehlgeschlagen – prüfe App ID und Site URL.");
        return;
      }

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

          const perm = await OneSignal.Notifications.permission; // "default" | "granted" | "denied"
          console.log("[Push] permission:", perm);

          if (perm === "denied") {
            alert("Benachrichtigungen sind im Browser blockiert. Klicke auf das Schloss-Icon → Benachrichtigungen: Zulassen.");
            return;
          }
          if (perm === "granted") {
            alert("Du bist bereits abonniert ✅");
            return;
          }

          await OneSignal.Slidedown.promptPush(); // öffnet den System-Dialog
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

