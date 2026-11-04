'use client';

import React, { useState } from 'react';
import { UploadCloud, FileSpreadsheet, X, CheckCircle2 } from 'lucide-react';
import { ContentCardItem, ContentFormat, ContentStatus } from '@/types/dashboard';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandId: string;
  onImportSuccess: (importedCards: ContentCardItem[]) => void;
}

// RFC 4180 compliant CSV line tokenizer
const splitCsvLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
};

export const CsvImportModal: React.FC<CsvImportModalProps> = ({
  isOpen,
  onClose,
  brandId,
  onImportSuccess,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedCount, setParsedCount] = useState<number | null>(null);

  if (!isOpen) return null;

  const parseCsvText = (text: string) => {
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const newCards: ContentCardItem[] = [];
    let currentWeek = 'Week 1';

    lines.forEach((line, index) => {
      // Check if line indicates Week header
      if (line.includes('WEEK 1')) currentWeek = 'Week 1';
      else if (line.includes('WEEK 2')) currentWeek = 'Week 2';
      else if (line.includes('WEEK 3')) currentWeek = 'Week 3';
      else if (line.includes('WEEK 4')) currentWeek = 'Week 4';

      const parts = splitCsvLine(line).map((p) => p.replace(/^"|"$/g, ''));
      if (parts.length >= 2) {
        const potentialFormat = parts[1];
        if (
          potentialFormat === 'Video' ||
          potentialFormat.includes('Foto') ||
          potentialFormat.includes('Grafis')
        ) {
          const title = parts[0] || `Konten ${currentWeek} - #${index + 1}`;
          const format: ContentFormat = potentialFormat.includes('Video')
            ? 'Video'
            : 'Foto + Grafis';

          newCards.push({
            id: `import-${Date.now()}-${index}`,
            brandId: brandId,
            title: title || `Rencana ${format} ${currentWeek}`,
            week: currentWeek,
            format: format,
            platform: parts[4] || 'IG Reels & TikTok',
            pillar: parts[6] || 'Edukasi & Habit',
            captionSnippet: parts[2] || 'Draft konten dari spreadsheet CSV...',
            caption: parts[2] || '',
            status: 'ide',
            dueDate: `2026-11-${(index % 28) + 1 < 10 ? '0' + ((index % 28) + 1) : (index % 28) + 1}`,
            assignee: {
              name: 'Internal Team',
              role: 'Creator',
              avatarBg: '#4338E8',
            },
          });
        }
      }
    });

    return newCards;
  };

  const handleFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        const result = parseCsvText(content);
        setParsedCount(result.length);
        if (result.length > 0) {
          onImportSuccess(result);
          setTimeout(() => {
            onClose();
          }, 1200);
        }
      }
    };
    reader.readAsText(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileSpreadsheet size={18} color="var(--primary-600)" />
            <h3>Import Kalender Konten (CSV)</h3>
          </div>
          <button type="button" className="btn-close-modal" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          Pilih atau drag file spreadsheet <strong>.csv</strong> seperti format <em>CONTENT PLAN NOV 2026 - JETFIT KARAWACI.csv</em> untuk memasukkan kartu konten ke pipeline.
        </p>

        <div
          className={`dropzone-box ${dragOver ? 'dropzone-active' : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => document.getElementById('csvFileInput')?.click()}
        >
          <input
            type="file"
            id="csvFileInput"
            accept=".csv,text/csv"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          <UploadCloud size={32} className="dropzone-icon" />
          <span className="dropzone-title">Klik atau Tarik File CSV ke Sini</span>
          <span className="dropzone-subtitle">Mendukung file .csv dari Excel atau Google Sheets</span>

          {fileName && (
            <div
              style={{
                marginTop: '10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#E6F7EE',
                color: 'var(--success)',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              <CheckCircle2 size={13} />
              <span>
                {fileName} ({parsedCount || 0} konten berhasil diparsing)
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
