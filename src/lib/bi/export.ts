import { downloadBlob } from "@/lib/utils";
import { datasetToCsv } from "./csv";
import type { Dataset } from "./types";

export function exportCsv(ds: Dataset) {
  downloadBlob(new Blob([datasetToCsv(ds)], { type: "text/csv" }), `${slug(ds.name)}.csv`);
}

export function exportSvgAs(kind: "png" | "jpg", name: string, svg: SVGElement | null) {
  if (!svg) return;
  const xml = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    const w = Math.max(svg.clientWidth || 900, 640);
    const h = Math.max(svg.clientHeight || 480, 360);
    canvas.width = w * 2;
    canvas.height = h * 2;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#f4f1ea";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (b) => {
        if (b) downloadBlob(b, `${slug(name)}.${kind}`);
      },
      kind === "jpg" ? "image/jpeg" : "image/png",
      0.92,
    );
    URL.revokeObjectURL(url);
  };
  img.src = url;
}

export function exportPdf(name: string, svg: SVGElement | null) {
  if (!svg) return;
  const xml = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    const w = 900;
    const h = Math.max(400, Math.round((img.height / Math.max(1, img.width)) * w));
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#f4f1ea";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    const data = canvas.toDataURL("image/jpeg", 0.92);
    const jpeg = dataUrlToBytes(data);
    const pdf = wrapJpegPdf(jpeg, 792, Math.round((h / w) * 792), w, h);
    downloadBlob(new Blob([pdf], { type: "application/pdf" }), `${slug(name)}.pdf`);
    URL.revokeObjectURL(url);
  };
  img.src = url;
}

function slug(s: string) {
  return s.replace(/[^\w.-]+/g, "_").slice(0, 48) || "sablepane";
}

function dataUrlToBytes(data: string) {
  const b64 = data.split(",")[1] ?? "";
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function wrapJpegPdf(jpeg: Uint8Array, w: number, h: number, iw: number, ih: number) {
  const enc = (s: string) => new TextEncoder().encode(s);
  const header = "%PDF-1.4\n";
  const imgObj = `<< /Type /XObject /Subtype /Image /Width ${iw} /Height ${ih} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`;
  const pages = `<< /Type /Pages /Kids [4 0 R] /Count 1 >>`;
  const page = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${h}] /Contents 5 0 R /Resources << /XObject << /Im0 3 0 R >> >> >>`;
  const content = `q ${w} 0 0 ${h} 0 0 cm /Im0 Do Q`;
  const catalog = `<< /Type /Catalog /Pages 2 0 R >>`;

  const parts: Uint8Array[] = [];
  const offsets: number[] = [0];
  let pos = enc(header).length;
  const pushObj = (_n: number, body: Uint8Array) => {
    const open = enc(`${_n} 0 obj\n`);
    const close = enc(`\nendobj\n`);
    offsets.push(pos);
    parts.push(open, body, close);
    pos += open.length + body.length + close.length;
  };

  parts.push(enc(header));
  pushObj(1, enc(catalog));
  pushObj(2, enc(pages));
  const imgHead = enc(imgObj);
  const imgTail = enc("\nendstream");
  const imgBody = new Uint8Array(imgHead.length + jpeg.length + imgTail.length);
  imgBody.set(imgHead, 0);
  imgBody.set(jpeg, imgHead.length);
  imgBody.set(imgTail, imgHead.length + jpeg.length);
  pushObj(3, imgBody);
  pushObj(4, enc(page));
  const stream = enc(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
  pushObj(5, stream);

  const xrefPos = pos;
  let xref = `xref\n0 6\n0000000000 65535 f \n`;
  for (let i = 1; i <= 5; i++) xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  const trailer = `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;
  parts.push(enc(xref), enc(trailer));
  const total = parts.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(total);
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}
