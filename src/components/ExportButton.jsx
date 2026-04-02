import { useState, useRef, useEffect } from "react";
import { useStore } from "../store/useStore";
import { Interfaces } from "doodle-icons";
import AppIcon from "./AppIcon";

const ExportButton = () => {
  const { transactions } = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    // close the menu when the user clicks outside of it
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const download = (content, name, type) => {
    // create a temporary file in the browser and trigger a download
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    // flatten the current transactions into a csv string
    const header = "Date,Description,Category,Type,Amount\n";
    const rows = transactions.map((t) => `${t.date},"${t.description || ""}",${t.category},${t.type},${t.amount}`).join("\n");
    download(header + rows, "transactions.csv", "text/csv");
    setOpen(false);
  };

  const exportJSON = () => {
    // export the current transactions exactly as stored in state
    download(JSON.stringify(transactions, null, 2), "transactions.json", "application/json");
    setOpen(false);
  };

  return (
    <div className="export-wrap" ref={ref}>
      <button className="btn btn-outline" onClick={() => setOpen(!open)}>
        <AppIcon icon={Interfaces.Download} size={15} color="currentColor" />
        Export
      </button>
      {open && (
        <div className="export-popup">
          <button className="export-opt" onClick={exportCSV}>
            <AppIcon icon={Interfaces.Doc} size={14} color="currentColor" /> CSV file
          </button>
          <button className="export-opt" onClick={exportJSON}>
            <AppIcon icon={Interfaces.Floppy} size={14} color="currentColor" /> JSON file
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportButton;
