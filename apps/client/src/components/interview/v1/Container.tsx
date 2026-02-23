import { useColors } from "@/components/General/(Color Manager)/useColors";
import { useEffect, useState } from "react";
import CustomEditor from "./CustomEditor";

interface fnHandler {
  containerURL: string;
  isHost: boolean;
  fileSystem?: Object;
  openFile?: string[];
  socket?: any;
}

export default function Container(prop: fnHandler) {
  const colors = useColors();
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [url, setUrl] = useState(prop.containerURL || "http://localhost:8443");
  useEffect(() => {
    if (mode === "edit") {
      setUrl(prop.containerURL || "http://localhost:8443");
    } else {
      setUrl(
        prop.containerURL + "/proxy/3000" || "http://localhost:8443/proxy/3000",
      );
    }
  }, [mode]);
  return (
    <div className="h-screen w-full p-6 flex justify-center items-center">
      <div
        className={`h-full w-full rounded-3xl ${colors.background.secondary} ${colors.border.fadedThin}`}
      >
        <button onClick={() => setMode(mode === "edit" ? "preview" : "edit")}>
          {mode}
        </button>
        {prop.isHost ? (
          <CustomEditor
            fileSystem={prop.fileSystem ?? {}}
            openFile={prop.openFile ?? []}
            socket={prop.socket ?? null}
          />
        ) : (
          <iframe className="h-full w-full" src={url}></iframe>
        )}
      </div>
    </div>
  );
}
