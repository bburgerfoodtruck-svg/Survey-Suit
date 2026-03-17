
import { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import placeholderLogo from "./assets/placeholder-logo.png";
import { CONDITION_SCHEMA } from "./conditionSchema.js";

const GLOBALS_KEY = "survey_suite_globals_v1";
const HHSRS_REPORT_KEY = "hhsrs_report_1_29";

function safeText(s) {
  return (s ?? "").toString().replace(/[<>]/g, "");
}
function nowIso() {
  return new Date().toISOString();
}

function getGlobals() {
  try {
    return JSON.parse(localStorage.getItem(GLOBALS_KEY) || "{}") || {};
  } catch {
    return {};
  }
}

function setGlobals(next) {
  try {
    localStorage.setItem(GLOBALS_KEY, JSON.stringify(next));
  } catch {}
}

function fieldIsAnswered(item, value) {
  if (item.type === "checkbox") return value === true;
  if (item.type === "photos") return Array.isArray(value) ? value.length >= (item.minPhotos || 0) : false;
  if (item.type === "number") return value !== null && value !== undefined && value !== "" && !Number.isNaN(Number(value));
  if (item.type === "yesno") return value === "yes" || value === "no" || value === "na";
  if (item.type === "rag") return ["Green", "Amber", "Red"].includes(value);
  if (item.type === "date") return !!value;
  if (item.type === "select") return !!value;
  return (value ?? "").toString().trim().length > 0;
}

function isFlagged(item, value) {
  if (!value) return false;
  if (item.type === "yesno") {
    const v = String(value).toLowerCase();
    if (item.flagOn === "yes") return v === "yes";
    if (item.flagOn === "no") return v === "no";
  }
  if (item.type === "rag") return value === "Red";
  return false;
}

function isAction(item, value) {
  return isFlagged(item, value) && item.actionRequired === true;
}

function toDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export default function ConditionReportApp({ onBackHome }) {
  const globals = useMemo(() => getGlobals(), []);
  const companyNameDefault = globals.companyName || "";
  const logoDefault = globals.logoDataUrl || "";

  const job = globals.job || {};
  const defaultMeta = {
    siteName: job.siteName || "",
    propertyRef: job.propertyRef || "",
    address: job.address || "",
    postcode: job.postcode || "",
    surveyDate: job.surveyDate || "",
    surveyor: job.surveyor || "",
  };

  const [data, setData] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("condition_report_v1") || "{}");
      return saved && typeof saved === "object" ? saved : {};
    } catch {
      return {};
    }
  });

  const [companyName] = useState(companyNameDefault);
  const [logoDataUrl] = useState(logoDefault);

  // floorplan optional attachment
  const [includeFloorplan, setIncludeFloorplan] = useState(() => data.includeFloorplan === true);
  const [floorplanFiles, setFloorplanFiles] = useState(() => data.floorplanFiles || []); // data urls

  useEffect(() => {
    const next = { ...data, includeFloorplan, floorplanFiles };
    try { localStorage.setItem("condition_report_v1", JSON.stringify(next)); } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [includeFloorplan, floorplanFiles]);

  const flatItems = useMemo(() => {
    const items = [];
    CONDITION_SCHEMA.sections.forEach((s) => s.items.forEach((it) => items.push({ ...it, sectionId: s.id, sectionTitle: s.title })));
    return items;
  }, []);

  const stats = useMemo(() => {
    let total = 0;
    let answered = 0;
    let flagged = 0;
    let actions = 0;
    let incompleteRequired = 0;

    flatItems.forEach((it) => {
      total += 1;
      const v = data[it.id];
      const answeredOk = fieldIsAnswered(it, v);
      if (answeredOk) answered += 1;
      if (it.required && !answeredOk) incompleteRequired += 1;
      if (isFlagged(it, v)) flagged += 1;
      if (isAction(it, v)) actions += 1;
    });

    // Extra rule: damp/mould yes => must have photo evidence
    const dampItems = flatItems.filter((it) => it.photoRequiredIfYes);
    dampItems.forEach((it) => {
      const v = data[it.id];
      if (String(v).toLowerCase() === "yes") {
        const photoKey = `${it.id}__photos`;
        const photos = data[photoKey] || [];
        if (!Array.isArray(photos) || photos.length < 1) {
          incompleteRequired += 1;
        }
      }
    });

    return { total, answered, flagged, actions, incompleteRequired };
  }, [data, flatItems]);

  function setField(id, value) {
    setData((d) => {
      const next = { ...d, [id]: value, updatedAt: nowIso() };
      try { localStorage.setItem("condition_report_v1", JSON.stringify(next)); } catch {}
      return next;
    });
  }

  async function addPhotos(id, files) {
    const arr = Array.from(files || []);
    if (!arr.length) return;
    const urls = [];
    for (const f of arr) urls.push(await toDataUrl(f));
    setField(id, [...(data[id] || []), ...urls]);
  }

  async function setSinglePhoto(id, files) {
    const arr = Array.from(files || []);
    if (!arr.length) return;
    const urls = [];
    for (const f of arr) urls.push(await toDataUrl(f));
    setField(id, urls);
  }

  function clearPhotos(id) {
    setField(id, []);
  }

  function exportPdf() {
    // Basic PAS-styled PDF layout, descriptive & print-friendly
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 36;

    const title = "PAS 2035 Condition Report";
    let y = margin;

    // Header line
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(title, margin, y);

    // Logo on right
    const logo = logoDataUrl || placeholderLogo;
    try {
      doc.addImage(logo, "PNG", pageW - margin - 72, margin - 6, 72, 72);
    } catch {
      // ignore if incompatible
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    y += 22;
    if (companyName) doc.text(`Company: ${safeText(companyName)}`, margin, y);
    y += 14;
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y);

    // Counters (like SafetyCulture header)
    y += 18;
    doc.setFont("helvetica", "bold");
    doc.text(`Incomplete (required): ${stats.incompleteRequired}`, margin, y);
    doc.text(`Score: ${stats.answered} / ${stats.total} (${Math.round((stats.answered / Math.max(1, stats.total)) * 100)}%)`, margin + 180, y);
    doc.text(`Flagged items: ${stats.flagged}`, margin + 360, y);
    doc.text(`Actions: ${stats.actions}`, margin + 500, y);

    // Job details
    doc.setFont("helvetica", "bold");
    y += 22;
    doc.text("Project / Property details", margin, y);
    y += 10;
    doc.setDrawColor(220);
    doc.line(margin, y, pageW - margin, y);
    y += 14;
    doc.setFont("helvetica", "normal");
    const metaLines = [
      ["Project Site Name", data.siteName || defaultMeta.siteName],
      ["Property Reference Code", data.propertyRef || defaultMeta.propertyRef],
      ["Property Address", data.address || defaultMeta.address],
      ["Postcode", data.postcode || defaultMeta.postcode],
      ["Inspection Date", data.inspectionDate || defaultMeta.surveyDate],
      ["Assessor", data.assessorNameId || defaultMeta.surveyor],
    ];
    metaLines.forEach(([k, v]) => {
      doc.text(`${k}: ${safeText(v || "-")}`, margin, y);
      y += 14;
      if (y > pageH - margin - 40) {
        doc.addPage();
        y = margin;
      }
    });

    // Sections content
    for (const sec of CONDITION_SCHEMA.sections) {
      // Page break if needed
      if (y > pageH - margin - 80) {
        doc.addPage();
        y = margin;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(sec.title, margin, y);
      y += 10;
      doc.setDrawColor(230);
      doc.line(margin, y, pageW - margin, y);
      y += 14;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      for (const it of sec.items) {
        const v = data[it.id];

        // Special: damp items photo evidence
        let extra = "";
        if (it.photoRequiredIfYes && String(v).toLowerCase() === "yes") {
          const photos = data[`${it.id}__photos`] || [];
          extra = photos.length ? ` (evidence photos: ${photos.length})` : " (evidence photos: MISSING)";
        }

        const valText =
          it.type === "yesno" ? (v ? v.toUpperCase() : "-") :
          it.type === "checkbox" ? (v === true ? "YES" : "NO") :
          it.type === "photos" ? `${(v || []).length} photo(s)` :
          (v ?? "").toString().trim() || "-";

        const flagTag = isFlagged(it, v) ? " [FLAG]" : "";
        const actTag = isAction(it, v) ? " [ACTION]" : "";
        const reqTag = it.required ? " *" : "";

        const line = `${it.label}${reqTag}: ${safeText(valText)}${extra}${flagTag}${actTag}`;
        const wrapped = doc.splitTextToSize(line, pageW - margin * 2);
        doc.text(wrapped, margin, y);
        y += 12 * wrapped.length;

        // For photos items, include first small thumbs? keep simple to avoid huge PDF
        if (it.type === "photos" && Array.isArray(v) && v.length) {
          y += 6;
        }

        if (y > pageH - margin - 40) {
          doc.addPage();
          y = margin;
        }
      }

      y += 6;
    }

    // Floor plan attachment (optional)
    if (includeFloorplan && floorplanFiles.length) {
      doc.addPage();
      y = margin;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Floor plan", margin, y);
      y += 18;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Attached floor plan evidence (as provided).", margin, y);
      y += 10;

      // Add images if compatible
      const maxW = pageW - margin * 2;
      const maxH = pageH - margin * 2 - 40;
      for (const url of floorplanFiles.slice(0, 4)) {
        try {
          doc.addImage(url, "PNG", margin, y, maxW, maxH);
          break;
        } catch {
          try { doc.addImage(url, "JPEG", margin, y, maxW, maxH); break; } catch {}
        }
      }
    }

    doc.save("pas2035-condition-report.pdf");
  }

  function resetReport() {
    if (!confirm("Reset the Condition Report data (this device only)?")) return;
    setData({});
    setIncludeFloorplan(false);
    setFloorplanFiles([]);
    try { localStorage.removeItem("condition_report_v1"); } catch {}
  }

  function pushDampToHhsrs() {
    // Minimal linking: if any damp/mould YES, update hazard 1 items/justification in HHSRS report store.
    const dampYes = Object.keys(data).filter((k) => k.endsWith("_damp") && String(data[k]).toLowerCase() === "yes");
    if (!dampYes.length) {
      alert("No damp/mould marked YES in the Condition Report.");
      return;
    }
    const notes = dampYes.map((k) => `Damp/mould reported in: ${k.replace("_damp","")}`).join("; ");
    let report = [];
    try { report = JSON.parse(localStorage.getItem(HHSRS_REPORT_KEY) || "[]") || []; } catch {}
    const existingIdx = report.findIndex((r) => String(r.hazardNo) === "1");
    const patchMeta = (r) => ({
      ...(r.meta || {}),
      items: [r.meta?.items, notes].filter(Boolean).join(" | "),
      justification: [r.meta?.justification, "Linked from PAS 2035 Condition Report (evidence-based)."].filter(Boolean).join(" | "),
      updatedAt: nowIso(),
    });
    if (existingIdx >= 0) {
      report[existingIdx] = { ...report[existingIdx], meta: patchMeta(report[existingIdx]) };
    } else {
      // If hazard 1 isn't in report yet, create a placeholder entry (HHSRS app can recompute score when edited)
      report.push({
        hazardNo: "1",
        hazard: "Damp And Mould",
        profile: "All dwellings",
        likelihood: 464,
        outcomes: { classI: 0, classII: 1, classIII: 10, classIV: 89 },
        score: 0,
        band: "—",
        category: "—",
        meta: {
          clientName: job.clientName || "",
          propertyRef: job.propertyRef || "",
          address: job.address || "",
          surveyDate: job.surveyDate || "",
          surveyor: job.surveyor || "",
          items: notes,
          justification: "Linked from PAS 2035 Condition Report (evidence-based).",
        },
        updatedAt: nowIso(),
      });
    }
    try { localStorage.setItem(HHSRS_REPORT_KEY, JSON.stringify(report)); } catch {}
    alert("Linked: Damp & Mould notes pushed into HHSRS Hazard 1 (local report list). Open HHSRS to review.");
  }

  function renderInput(it) {
    const v = data[it.id];

    if (it.id === "assessorNameId" && !v && defaultMeta.surveyor) {
      // light auto-fill hint
    }

    if (it.type === "yesno") {
      return (
        <div className="row" style={{ marginTop: 6 }}>
          {["yes", "no", "na"].map((opt) => (
            <label key={opt} className="pill" style={{ cursor: "pointer" }}>
              <input
                type="radio"
                name={it.id}
                value={opt}
                checked={v === opt}
                onChange={(e) => setField(it.id, e.target.value)}
              />
              <span style={{ marginLeft: 8 }}>{opt.toUpperCase()}</span>
            </label>
          ))}
        </div>
      );
    }

    if (it.type === "rag") {
      const opts = it.options || ["Green", "Amber", "Red"];
      return (
        <div className="row" style={{ marginTop: 6 }}>
          {opts.map((opt) => (
            <button
              key={opt}
              type="button"
              className={"btn " + (v === opt ? "" : "ghost")}
              onClick={() => setField(it.id, opt)}
              title="RAG condition"
            >
              {opt}
            </button>
          ))}
        </div>
      );
    }

    if (it.type === "select") {
      const otherKey = `${it.id}__other`;
      const ov = data[otherKey] || "";
      return (
        <>
          <select value={v || ""} onChange={(e) => setField(it.id, e.target.value)}>
            <option value="">Select…</option>
            {(it.options || []).map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
            {it.allowOther ? <option value="Other">Other</option> : null}
          </select>
          {it.allowOther && v === "Other" ? (
            <input
              style={{ marginTop: 8 }}
              placeholder="Please specify"
              value={ov}
              onChange={(e) => setField(otherKey, e.target.value)}
            />
          ) : null}
        </>
      );
    }

    if (it.type === "date") {
      return <input type="date" value={v || ""} onChange={(e) => setField(it.id, e.target.value)} />;
    }

    if (it.type === "number") {
      return <input type="number" value={v ?? ""} onChange={(e) => setField(it.id, e.target.value)} />;
    }

    if (it.type === "checkbox") {
      return (
        <label className="pill" style={{ cursor: "pointer" }}>
          <input type="checkbox" checked={v === true} onChange={(e) => setField(it.id, e.target.checked)} />
          <span style={{ marginLeft: 8 }}>{it.label}</span>
        </label>
      );
    }

    if (it.type === "photos") {
      return (
        <div style={{ marginTop: 6 }}>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = e.target.files;
              addPhotos(it.id, files);
              e.target.value = "";
            }}
          />
          <div className="small" style={{ marginTop: 8 }}>
            {(v || []).length} photo(s) attached {it.minPhotos ? `(min ${it.minPhotos})` : ""}
          </div>
          {(v || []).length ? (
            <div className="row" style={{ marginTop: 8 }}>
              <button type="button" className="btn danger" onClick={() => clearPhotos(it.id)}>
                Remove photos
              </button>
            </div>
          ) : null}
        </div>
      );
    }

    // default text
    return <input value={v || ""} onChange={(e) => setField(it.id, e.target.value)} placeholder="Enter…" />;
  }

  function DampEvidence({ itemId }) {
    const dampKey = itemId;
    const v = data[dampKey];
    const photosKey = `${itemId}__photos`;
    const photos = data[photosKey] || [];

    if (String(v).toLowerCase() !== "yes") return null;
    return (
      <div className="card" style={{ marginTop: 10 }}>
        <div className="h3">Evidence photo required</div>
        <div className="small" style={{ marginTop: 6 }}>
          Damp/mould marked <b>YES</b>. Add at least 1 photo.
        </div>
        <div style={{ marginTop: 10 }}>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              setSinglePhoto(photosKey, e.target.files);
              e.target.value = "";
            }}
          />
          <div className="small" style={{ marginTop: 8 }}>
            {(photos || []).length} photo(s) attached
          </div>
          {(photos || []).length ? (
            <button type="button" className="btn danger" style={{ marginTop: 10 }} onClick={() => clearPhotos(photosKey)}>
              Remove evidence photos
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="topbar">
        <div>
          <div className="kicker">Survey suite</div>
          <div className="h1">PAS 2035 Condition Report</div>
          <div className="small" style={{ marginTop: 6 }}>
            Descriptive condition report with evidence rules. Wording aligned to PAS 2035-style templates. Link to HHSRS included.
          </div>
        </div>

        <div className="actions">
          {onBackHome ? (
            <button className="btn secondary" type="button" onClick={onBackHome}>
              ← Back
            </button>
          ) : null}
          <button className="btn ghost" type="button" onClick={resetReport}>
            Reset condition report
          </button>
        </div>
      </div>

      <div className="hr" />

      <div className="row">
        <div className="pill">
          <b>Incomplete</b>&nbsp;{stats.incompleteRequired}
        </div>
        <div className="pill">
          <b>Score</b>&nbsp;{stats.answered} / {stats.total} ({Math.round((stats.answered / Math.max(1, stats.total)) * 100)}%)
        </div>
        <div className="pill">
          <b>Flagged items</b>&nbsp;{stats.flagged}
        </div>
        <div className="pill">
          <b>Actions</b>&nbsp;{stats.actions}
        </div>
      </div>

      <div className="row" style={{ marginTop: 10 }}>
        <div className="field" style={{ gridColumn: "span 8" }}>
          <label>Project Site Name</label>
          <input value={data.siteName ?? defaultMeta.siteName} onChange={(e) => setField("siteName", e.target.value)} />
        </div>
        <div className="field" style={{ gridColumn: "span 4" }}>
          <label>Property Reference Code</label>
          <input value={data.propertyRef ?? defaultMeta.propertyRef} onChange={(e) => setField("propertyRef", e.target.value)} />
        </div>
        <div className="field" style={{ gridColumn: "span 8" }}>
          <label>Property Address</label>
          <input value={data.address ?? defaultMeta.address} onChange={(e) => setField("address", e.target.value)} />
        </div>
        <div className="field" style={{ gridColumn: "span 4" }}>
          <label>Postcode</label>
          <input value={data.postcode ?? defaultMeta.postcode} onChange={(e) => setField("postcode", e.target.value)} />
        </div>
      </div>

      <div className="hr" />

      <div className="row">
        <div className="field" style={{ gridColumn: "span 12" }}>
          <label>Include floor plan in report?</label>
          <div className="row">
            <label className="pill" style={{ cursor: "pointer" }}>
              <input type="checkbox" checked={includeFloorplan} onChange={(e) => setIncludeFloorplan(e.target.checked)} />
              <span style={{ marginLeft: 8 }}>Yes, attach floor plan</span>
            </label>
          </div>
          {includeFloorplan ? (
            <div style={{ marginTop: 10 }}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={async (e) => {
                  const arr = Array.from(e.target.files || []);
                  if (!arr.length) return;
                  const urls = [];
                  for (const f of arr) urls.push(await toDataUrl(f));
                  setFloorplanFiles(urls);
                  e.target.value = "";
                }}
              />
              <div className="small" style={{ marginTop: 8 }}>
                {floorplanFiles.length} file(s) attached (first image will be embedded)
              </div>
              {floorplanFiles.length ? (
                <button type="button" className="btn danger" style={{ marginTop: 10 }} onClick={() => setFloorplanFiles([])}>
                  Remove floor plan
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <div className="hr" />

      {CONDITION_SCHEMA.sections.map((sec) => (
        <div key={sec.id} className="card" style={{ marginTop: 12 }}>
          <div className="h2">{sec.title}</div>
          <div className="small" style={{ marginTop: 6, opacity: 0.9 }}>
            Required items marked with <b>*</b>. Red items = flagged; actions are counted in the header.
          </div>
          <div style={{ height: 10 }} />
          {sec.items.map((it) => {
            const v = data[it.id];
            const flagged = isFlagged(it, v);
            const act = isAction(it, v);
            const required = it.required === true;

            return (
              <div key={it.id} className="field" style={{ marginTop: 10, borderLeft: flagged ? "4px solid var(--bad)" : "4px solid transparent", paddingLeft: 10 }}>
                <label>
                  {it.label}
                  {required ? " *" : ""} {act ? " (Action)" : ""}
                </label>

                {it.id === "assessorNameId" && !data.assessorNameId && defaultMeta.surveyor ? (
                  <div className="mini" style={{ marginTop: 4 }}>
                    Hint: default surveyor from job = {defaultMeta.surveyor}
                  </div>
                ) : null}

                {renderInput(it)}

                <DampEvidence itemId={it.id} />

                {flagged ? (
                  <div className="mini" style={{ marginTop: 6 }}>
                    <b>Flagged</b> — review and record actions where required.
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ))}

      <div className="hr" />

      <div className="row">
        <button className="btn" type="button" onClick={exportPdf}>
          Print / Save PDF
        </button>
        <button className="btn secondary" type="button" onClick={pushDampToHhsrs}>
          Link damp/mould to HHSRS Hazard 1
        </button>
      </div>
    </div>
  );
}
