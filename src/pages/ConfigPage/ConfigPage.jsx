import React, { useContext, useState, useEffect } from "react";
import { ConfigContext } from "../../context/ConfigContext.jsx";
import { ClipboardCopy, ClipboardPaste } from "lucide-react";
import toast from "react-hot-toast";
export default function SettingsPage() {
  const context = useContext(ConfigContext);

  const [localState, setLocalState] = useState({
    musicVolume: context.musicVolume,
    reminderEnabled: context.reminderEnabled,
    reminderVolume: context.reminderVolume,
    remindAfter: context.remindAfter,
    closeAfter: context.closeAfter,
  });
  const [isExportingData, setIsExportingData] = useState(false);
  const [isImportingData, setIsImportingData] = useState(false);
  const [exportedData, setExportedData] = useState();
  const [importedData, setImportedData] = useState();
  useEffect(() => {
    context.setPreviewSettings(localState);
    return () => context.setPreviewSettings(null);
  }, [localState, context]);

  const updateLocal = (key, value) => {
    setLocalState(prev => ({ ...prev, [key]: value }));
  };

  const handleNumberInput = (e, key, min = 0, max = 100) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val)) val = min;
    if (val < min) val = min;
    if (val > max) val = max;
    updateLocal(key, val);
  };

  const handleSave = () => {
    try {
      context.setMusicVolume(localState.musicVolume);
      context.setReminderEnabled(localState.reminderEnabled);
      context.setReminderVolume(localState.reminderVolume);
      context.setRemindAfter(localState.remindAfter);
      context.setCloseAfter(localState.closeAfter);
      context.setPreviewSettings(null);
      if (importedData) {
        const parsedData = JSON.parse(importedData.trim());
        parsedData.forEach(item => {
          const key = Object.keys(item)[0];
          const value = item[key];
          localStorage.setItem(key, value);
        });
      }

      toast.success("Changes saved!, reload the page");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleCancel = () => {
    setLocalState({
      musicVolume: context.musicVolume,
      reminderEnabled: context.reminderEnabled,
      reminderVolume: context.reminderVolume,
      remindAfter: context.remindAfter,
      closeAfter: context.closeAfter,
    });
    toast.success("Changes canceled Successfully");
  };
  const exportData = () => {
    setIsExportingData(!isExportingData);
    setIsImportingData(false);
    const storageArray = Object.entries(localStorage).map(([key, value]) => ({
      [key]: value,
    }));
    setExportedData(storageArray);
  };
  const importData = () => {
    setIsExportingData(false);
    setIsImportingData(!isImportingData);
  };
  const handleCopy = async () => {
    try {
      const storageArray = Object.entries(localStorage).map(([key, value]) => ({
        [key]: value,
      }));
      const textToCopy = JSON.stringify(storageArray);
      await navigator.clipboard.writeText(textToCopy);
      toast.success("Data copy correctly");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  const handlePaste = async () => {
    try {
      const text = (await navigator.clipboard.readText()).trim();

      setImportedData(text);
      toast.success("Data pasted correctly");
    } catch (err) {
      console.error("Failed to read clipboard: ", err);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8 w-full flex justify-center">
      <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl p-8 h-fit">
        <h1 className="text-3xl font-bold mb-8 border-b border-neutral-800 pb-4">
          Account Settings
        </h1>
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 pb-2">Page Data</h2>
          <button
            onClick={() => exportData()}
            className={`px-8 py-2 rounded-lg font-bold transition-colors cursor-pointer ${
              !isExportingData
                ? "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                : "bg-orange-500 text-white border border-neutral-600"
            }`}
          >
            Export Data
          </button>{" "}
          <button
            onClick={() => importData()}
            className={`px-8 py-2 rounded-lg font-bold transition-colors pb-2 cursor-pointer ${
              !isImportingData
                ? "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                : "bg-orange-500 text-white border border-neutral-600"
            }`}
          >
            Import Data
          </button>
          {isExportingData && (
            <div className="pt-10">
              <h3 className="text-xl font-bold mb-6 ">Copy this below : </h3>

              <div className="border border-neutral-400 relative max-w-full">
                <ClipboardCopy
                  className="absolute top-2 right-2 cursor-pointer"
                  onClick={() => handleCopy()}
                />
                <p className="bg-neutral-800 p-4 pt-8 overflow-x-auto ">
                  [{JSON.stringify(exportedData)}]
                </p>
              </div>
            </div>
          )}
          {isImportingData && (
            <div className="pt-10">
              <h3 className="text-xl font-bold mb-6 ">
                Paste your text here below:{" "}
              </h3>

              <div className="border border-neutral-400 relative max-w-full">
                <ClipboardPaste
                  className="absolute top-2 right-2 cursor-pointer"
                  onClick={() => handlePaste()}
                />
                <input
                  className="bg-neutral-800 p-4 pt-8 overflow-x-auto w-full"
                  value={importedData}
                  onChange={e => setImportedData(e.target.value)}
                ></input>
              </div>
            </div>
          )}
        </div>
        <div className="mb-10">
          <label className="block text-sm font-semibold text-neutral-400 mb-4">
            Music Volume
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="100"
              value={localState.musicVolume}
              onChange={e =>
                updateLocal("musicVolume", parseInt(e.target.value, 10))
              }
              className="flex-1 h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="relative w-20">
              <input
                type="number"
                min="0"
                max="100"
                value={localState.musicVolume}
                onChange={e => handleNumberInput(e, "musicVolume")}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-center focus:outline-none focus:border-orange-500 appearance-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">
                %
              </span>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 border-b border-neutral-800 pb-2">
            Reminder
          </h2>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-neutral-400 mb-4">
              Enable Reminder
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => updateLocal("reminderEnabled", true)}
                className={`px-8 py-2 rounded-lg font-bold transition-colors cursor-pointer ${
                  localState.reminderEnabled
                    ? "bg-orange-500 text-white"
                    : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => updateLocal("reminderEnabled", false)}
                className={`px-8 py-2 rounded-lg font-bold transition-colors cursor-pointer ${
                  !localState.reminderEnabled
                    ? "bg-neutral-700 text-white border border-neutral-600"
                    : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                }`}
              >
                No
              </button>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-neutral-400 mb-4">
              Reminder Volume
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={localState.reminderVolume}
                onChange={e =>
                  updateLocal("reminderVolume", parseInt(e.target.value, 10))
                }
                disabled={!localState.reminderEnabled}
                className="flex-1 h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <div className="relative w-20">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={localState.reminderVolume}
                  onChange={e => handleNumberInput(e, "reminderVolume")}
                  disabled={!localState.reminderEnabled}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-center focus:outline-none focus:border-orange-500 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">
                  %
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-neutral-400 mb-2">
                Remind After (Minutes)
              </label>
              <input
                type="number"
                min="1"
                value={localState.remindAfter}
                onChange={e => handleNumberInput(e, "remindAfter", 1, 1440)}
                disabled={!localState.reminderEnabled}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-400 mb-2">
                Close After (Minutes)
              </label>
              <input
                type="number"
                min="1"
                value={localState.closeAfter}
                onChange={e => handleNumberInput(e, "closeAfter", 1, 1440)}
                disabled={!localState.reminderEnabled}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-neutral-800">
          <button
            onClick={handleCancel}
            className="px-6 py-2 cursor-pointer rounded-lg font-bold text-neutral-300 hover:bg-neutral-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 cursor-pointer rounded-lg font-bold bg-orange-500 text-white hover:bg-orange-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
