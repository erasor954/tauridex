import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { Table } from "lucide-react";

export function PopoutButton() {
  const openPopOut = async () => {
    const webview = new WebviewWindow("typechart", {
      url: "/typechart",
      title: "Type Chart",
      width: 720,
      height: 720,
      center: true,
      resizable: true,
    });

    webview.once("tauri://created", () => {
      console.log("Pop-out window created successfully!");
    });

    webview.once("tauri://error", (e) => {
      console.error(
        "Failed to create pop-out window. Did you update capabilities?",
        e,
      );
    });
  };

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={openPopOut}
        className="p-3 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-cyan-400 transition-colors"
      >
        <Table />
      </button>
      <span className="absolute mt-1 left-1/2 -translate-x-1/2 top-full mb-2 hidden group-hover:block w-max px-2 py-1 bg-slate-900 text-white text-xs rounded border border-slate-700 shadow-xl pointer-events-none">
        Popout Type Chart
      </span>
    </div>
  );
}
