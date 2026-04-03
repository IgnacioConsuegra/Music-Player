import React, { createContext, useState, useEffect } from "react";

export const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const getInitialState = (key, defaultValue) => {
    const saved = localStorage.getItem("appConfig");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed[key] !== undefined ? parsed[key] : defaultValue;
      } catch {
        return defaultValue;
      }
    }
    return defaultValue;
  };

  const [musicVolume, setMusicVolume] = useState(() =>
    getInitialState("musicVolume", 50),
  );
  const [reminderEnabled, setReminderEnabled] = useState(() =>
    getInitialState("reminderEnabled", true),
  );
  const [reminderVolume, setReminderVolume] = useState(() =>
    getInitialState("reminderVolume", 50),
  );
  const [remindAfter, setRemindAfter] = useState(() =>
    getInitialState("remindAfter", 30),
  );
  const [closeAfter, setCloseAfter] = useState(() =>
    getInitialState("closeAfter", 10),
  );
  const [previewSettings, setPreviewSettings] = useState(null);

  useEffect(() => {
    const config = {
      musicVolume,
      reminderEnabled,
      reminderVolume,
      remindAfter,
      closeAfter,
    };
    localStorage.setItem("appConfig", JSON.stringify(config));
  }, [musicVolume, reminderEnabled, reminderVolume, remindAfter, closeAfter]);

  return (
    <ConfigContext.Provider
      value={{
        musicVolume,
        setMusicVolume,
        reminderEnabled,
        setReminderEnabled,
        reminderVolume,
        setReminderVolume,
        remindAfter,
        setRemindAfter,
        closeAfter,
        setCloseAfter,
        previewSettings,
        setPreviewSettings,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};
export default ConfigProvider;
