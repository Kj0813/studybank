import type { Note } from '../types';

export function openPDFView(note: Note) {
  const win = window.open('', '_blank');
  if (!win) return;

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${escapeHtml(note.title)} — StudyBank</title>
<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap" rel="stylesheet">
<style>
@page { margin: 2cm; }
* { margin:0; padding:0; box-sizing:border-box; }
body {
  font-family: 'Source Serif 4', Georgia, serif;
  color: #1c1917;
  line-height: 1.7;
  padding: 40px;
  max-width: 700px;
  margin: 0 auto;
}
.header {
  border-bottom: 2px solid #1a3a3a;
  padding-bottom: 20px;
  margin-bottom: 30px;
}
.logo {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #78716c;
  margin-bottom: 16px;
}
h1 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #1c1917;
  line-height: 1.3;
  margin-bottom: 12px;
}
.meta {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  font-size: 0.85rem;
  color: #78716c;
  font-family: system-ui, sans-serif;
}
.meta span { display: flex; align-items: center; gap: 6px; }
.course-badge {
  display: inline-block;
  background: #e8f0f0;
  color: #1a3a3a;
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: system-ui, sans-serif;
  margin-bottom: 20px;
}
.tags {
  margin-bottom: 24px;
}
.tag {
  display: inline-block;
  background: #f7f5f2;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 0.78rem;
  color: #78716c;
  margin-right: 6px;
  font-family: system-ui, sans-serif;
}
.content {
  white-space: pre-wrap;
  font-size: 0.95rem;
}
.footer {
  margin-top: 60px;
  padding-top: 20px;
  border-top: 1px solid #e7e5e4;
  font-size: 0.75rem;
  color: #a8a29e;
  font-family: system-ui, sans-serif;
}
.print-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background: #1a3a3a;
  color: white;
  border: none;
  border-radius: 4px;
  font-family: system-ui, sans-serif;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.85rem;
}
.print-btn:hover { background: #0f2626; }
@media print {
  .print-btn { display: none; }
  body { padding: 0; }
}
</style>
</head>
<body>
<button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
<div class="header">
  <div class="logo">StudyBank</div>
  <h1>${escapeHtml(note.title)}</h1>
  <div class="meta">
    <span>Course: ${escapeHtml(note.course)}</span>
    <span>By: ${escapeHtml(note.authorName)}</span>
    <span>${new Date(note.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
  </div>
</div>
<div class="course-badge">${escapeHtml(note.course)}</div>
${note.tags.length > 0 ? `<div class="tags">${note.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>` : ''}
<div class="content">${escapeHtml(note.content)}</div>
<div class="footer">Generated from StudyBank — studybank.app</div>
<script>setTimeout(() => window.print(), 500);</script>
</body>
</html>`;

  win.document.write(html);
  win.document.close();
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
