import React from "react";
import "./HistoryTimeLine.css";

function defaultFormatValue(v) {
  if (v === null || v === undefined || v === "") return "None";
  const maybeDate = new Date(v);
  if (!Number.isNaN(maybeDate.getTime()) && /T|:/.test(String(v))) {
    return maybeDate.toLocaleString();
  }
  return String(v);
}

export default function HistoryTimeLine({
  items = [],
  formatValue = defaultFormatValue,
}) {
  if (!Array.isArray(items) || items.length === 0) {
    return <p className="ht-empty">No changes recorded yet.</p>;
  }

  return (
    <div className="ht-timeline">
      {items.map((it) => {
        const key =
          it.id ?? `${it.field}-${it.timestamp}-${it.user_id || ""}`;

        return (
          <div className="ht-item" key={key}>
            <div className="ht-marker" />

            <div className="ht-content">
              <div className="ht-header">
                <strong className="ht-field">{it.field}</strong>
              </div>

              <div className="ht-row">
                <div className="ht-label">Old</div>
                <div className="ht-val">{formatValue(it.old_value)}</div>
              </div>

              <div className="ht-row">
                <div className="ht-label">New</div>
                <div className="ht-val">{formatValue(it.new_value)}</div>
              </div>

              <div className="ht-row ht-timestamp">
                <span className="ht-label">Changed at</span>
                <span className="ht-ts">
                  {new Date(it.timestamp).toLocaleString()}
                </span>
              </div>

              {it.description && (
                <div className="ht-row">
                  <div className="ht-label">Note</div>
                  <div className="ht-val">{it.description}</div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
