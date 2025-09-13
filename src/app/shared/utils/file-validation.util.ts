export function isAllowedFile(file: File, types: string[], maxBytes: number) {
  if (!types.includes(file.type)) {
    return { ok: false, reason: 'Invalid file type.' };
  }
  if (file.size > maxBytes) {
    return { ok: false, reason: `File exceeds ${(maxBytes / (1024*1024)).toFixed(1)} MB.` };
  }
  return { ok: true };
}