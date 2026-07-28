"use client";

import React from "react";
import { Check, Leaf, Star, ChevronRight, Award } from "lucide-react";

interface RichTextProps {
  text: string;
  className?: string;
}

export default function RichText({ text, className = "" }: RichTextProps) {
  if (!text) return null;

  // Helper to parse inline styles: **bold**, *italic*, [badge: text]
  const renderInline = (str: string, keyPrefix: string): React.ReactNode[] => {
    // We split by tokens for [badge: ...], **bold**, and *italic*
    const regex = /(\[badge:\s*[^\]]+\]|\*\*[^*]+\*\*|\*[^*]+\*)/g;
    const parts = str.split(regex);

    return parts.map((part, idx) => {
      const key = `${keyPrefix}-${idx}`;
      if (part.startsWith("[badge:") && part.endsWith("]")) {
        const badgeText = part.slice(7, -1).trim();
        return (
          <span
            key={key}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              backgroundColor: "#FFF9E6",
              color: "#B8860B",
              border: "1px solid #D4AF37",
              padding: "3px 10px",
              borderRadius: "20px",
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              margin: "0 4px",
              boxShadow: "0 2px 6px rgba(212, 175, 55, 0.15)",
            }}
          >
            <Leaf size={13} color="#D4AF37" />
            {badgeText}
          </span>
        );
      } else if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
        const boldText = part.slice(2, -2);
        return (
          <strong
            key={key}
            style={{
              color: "#1F1F1F",
              fontWeight: 800,
              backgroundColor: "rgba(212, 175, 55, 0.12)",
              padding: "1px 5px",
              borderRadius: "3px",
              borderBottom: "1.5px solid #D4AF37",
            }}
          >
            {boldText}
          </strong>
        );
      } else if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
        const italicText = part.slice(1, -1);
        return (
          <em
            key={key}
            style={{
              color: "#B8860B",
              fontStyle: "italic",
              fontWeight: 600,
            }}
          >
            {italicText}
          </em>
        );
      }
      return <React.Fragment key={key}>{part}</React.Fragment>;
    });
  };

  const lines = text.split("\n");

  return (
    <div className={className} style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%" }}>
      {lines.map((rawLine, index) => {
        const line = rawLine.trim();
        if (!line) return null;

        // Check for Blockquote / Highlight Box (> or [!TIP] or [!NOTE])
        if (line.startsWith(">") || line.startsWith("[!TIP]") || line.startsWith("[!NOTE]") || line.startsWith("[!IMPORTANT]")) {
          let content = line;
          if (line.startsWith(">")) content = line.slice(1).trim();
          else if (line.startsWith("[!")) content = line.replace(/\[![A-Z]+\]\s*/, "").trim();

          return (
            <div
              key={index}
              style={{
                backgroundColor: "#FFF9E6",
                borderLeft: "4px solid #D4AF37",
                padding: "1rem 1.25rem",
                borderRadius: "0 8px 8px 0",
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                margin: "0.5rem 0",
                boxShadow: "0 4px 12px rgba(212, 175, 55, 0.08)",
                border: "1px solid rgba(212, 175, 55, 0.25)",
              }}
            >
              <Award size={20} color="#D4AF37" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div style={{ color: "#4A443E", fontSize: "0.95rem", lineHeight: 1.6, fontWeight: 500 }}>
                {renderInline(content, `quote-${index}`)}
              </div>
            </div>
          );
        }

        // Check for Bullet points (•, -, or *)
        if (line.startsWith("•") || line.startsWith("- ") || line.startsWith("* ")) {
          const content = line.replace(/^[•\-*]\s*/, "").trim();
          return (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                padding: "0.4rem 0.6rem",
                backgroundColor: "rgba(255, 249, 230, 0.4)",
                borderRadius: "6px",
                border: "1px solid transparent",
                transition: "all 0.2s ease",
              }}
            >
              <div
                style={{
                  backgroundColor: "#000",
                  color: "#D4AF37",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: "2px",
                  border: "1px solid #D4AF37",
                }}
              >
                <Check size={12} strokeWidth={3} />
              </div>
              <div style={{ color: "#3D3833", fontSize: "0.95rem", lineHeight: 1.6, flexGrow: 1 }}>
                {renderInline(content, `bullet-${index}`)}
              </div>
            </div>
          );
        }

        // Check for Numbered lists (1., 2., 3., etc.)
        const numMatch = line.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          const num = numMatch[1];
          const content = numMatch[2];
          return (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                padding: "0.4rem 0",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "24px",
                  height: "24px",
                  backgroundColor: "#D4AF37",
                  color: "#000",
                  fontWeight: 800,
                  fontSize: "0.8rem",
                  borderRadius: "50%",
                  flexShrink: 0,
                  marginTop: "1px",
                  boxShadow: "0 2px 5px rgba(212, 175, 55, 0.3)",
                }}
              >
                {num}
              </span>
              <div style={{ color: "#3D3833", fontSize: "0.95rem", lineHeight: 1.6 }}>
                {renderInline(content, `num-${index}`)}
              </div>
            </div>
          );
        }

        // Regular paragraph
        return (
          <p key={index} style={{ margin: 0, color: "#5C564E", fontSize: "1rem", lineHeight: 1.7 }}>
            {renderInline(line, `p-${index}`)}
          </p>
        );
      })}
    </div>
  );
}
