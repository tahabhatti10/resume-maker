import { useEffect, useRef, useState } from "react";
import { useBuilder } from "../../state/BuilderContext";
import { getTemplate } from "../../lib/templates";
import { hasAnyContent } from "../../lib/templateUtils";
import { FileText } from "lucide-react";

const BASE_WIDTH = 820;

export function LivePreview() {
  const { resume, theme } = useBuilder();
  const { Component } = getTemplate(theme.templateId);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [innerHeight, setInnerHeight] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const avail = el.clientWidth - 32;
      setScale(Math.min(1, avail / BASE_WIDTH));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (sheetRef.current) {
      setInnerHeight(sheetRef.current.offsetHeight * scale);
    }
  }, [scale, resume, theme]);

  if (!hasAnyContent(resume)) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
        <FileText className="h-10 w-10" />
        <p className="text-sm">Your resume preview will appear here.</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full overflow-auto p-4">
      <div
        style={{ height: innerHeight, width: BASE_WIDTH * scale }}
        className="mx-auto"
      >
        <div
          ref={sheetRef}
          style={{
            width: BASE_WIDTH,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
            borderRadius: 12,
            overflow: "hidden",
            background: "#fff",
          }}
        >
          <Component data={resume} theme={theme} />
        </div>
      </div>
    </div>
  );
}
