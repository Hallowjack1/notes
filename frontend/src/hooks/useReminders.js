import { useEffect, useRef, useState } from "react";

function useReminders(notes) {
  const notifiedIds = useRef(new Set());
  const [firedIds, setFiredIds] = useState(new Set());

  useEffect(() => {
    if (!("Notification" in window)) return;

    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    const check = () => {
      if (Notification.permission !== "granted") return;

      const now = new Date();
      let changed = false;

      notes.forEach((note) => {
        if (!note.reminder_at) return;
        if (notifiedIds.current.has(note.id)) return;

        const reminderTime = new Date(note.reminder_at);
        const diff = reminderTime - now;

        if (diff <= 0 && diff >= -60000) {
          new Notification(`Reminder: ${note.title}`, {
            body: note.body.slice(0, 100),
            icon: "/vite.svg",
          });
          notifiedIds.current.add(note.id);
          changed = true;
        }
      });

      if (changed) {
        setFiredIds(new Set(notifiedIds.current));
      }
    };

    check();
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, [notes]);

  return firedIds;
}

export default useReminders;