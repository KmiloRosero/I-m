const DRIVE_FILE_PATTERN = /^https:\/\/drive\.google\.com\/file\/d\/([\w-]+)/

export function getDriveDownloadUrl(fileUrl: string): string | null {
  const fileId = DRIVE_FILE_PATTERN.exec(fileUrl)?.[1]
  return fileId ? `https://drive.google.com/uc?export=download&id=${fileId}` : null
}
