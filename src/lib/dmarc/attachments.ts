import JSZip from 'jszip';
import pako from 'pako';

/**
 * Extract XML content from various attachment formats
 * Supports: .xml, .xml.gz, .gz, .zip
 */
export async function extractXMLFromAttachment(
  content: string | Buffer,
  filename: string,
): Promise<string> {
  const lowerFilename = filename.toLowerCase();

  // Convert base64 string to Buffer if needed
  const buffer =
    typeof content === 'string' ? Buffer.from(content, 'base64') : content;

  // Handle gzip compressed files (.xml.gz or .gz)
  if (lowerFilename.endsWith('.gz')) {
    return decompressGzip(buffer);
  }

  // Handle zip files
  if (lowerFilename.endsWith('.zip')) {
    return extractFromZip(buffer);
  }

  // Handle plain XML files
  if (lowerFilename.endsWith('.xml')) {
    return typeof content === 'string'
      ? Buffer.from(content, 'base64').toString('utf-8')
      : content.toString('utf-8');
  }

  // Try to detect format from content
  return detectAndExtract(buffer);
}

/**
 * Decompress gzip content
 */
function decompressGzip(buffer: Buffer): string {
  const decompressed = pako.inflate(buffer);
  return new TextDecoder('utf-8').decode(decompressed);
}

/**
 * Extract XML from a zip archive
 * Looks for the first .xml file in the archive
 */
async function extractFromZip(buffer: Buffer): Promise<string> {
  const zip = await JSZip.loadAsync(buffer);

  // Find the first XML file in the zip
  for (const [filename, file] of Object.entries(zip.files)) {
    if (filename.toLowerCase().endsWith('.xml') && !file.dir) {
      return await file.async('string');
    }
  }

  // If no .xml file found, try to find a .gz file and decompress it
  for (const [filename, file] of Object.entries(zip.files)) {
    if (filename.toLowerCase().endsWith('.gz') && !file.dir) {
      const gzContent = await file.async('uint8array');
      return decompressGzip(Buffer.from(gzContent));
    }
  }

  throw new Error('No XML file found in zip archive');
}

/**
 * Detect content format and extract accordingly
 */
async function detectAndExtract(buffer: Buffer): Promise<string> {
  // Check for gzip magic bytes (1f 8b)
  if (buffer[0] === 0x1f && buffer[1] === 0x8b) {
    return decompressGzip(buffer);
  }

  // Check for zip magic bytes (50 4b 03 04)
  if (
    buffer[0] === 0x50 &&
    buffer[1] === 0x4b &&
    buffer[2] === 0x03 &&
    buffer[3] === 0x04
  ) {
    return extractFromZip(buffer);
  }

  // Check if it starts with XML declaration or root element
  const start = buffer.slice(0, 100).toString('utf-8').trim();
  if (start.startsWith('<?xml') || start.startsWith('<feedback')) {
    return buffer.toString('utf-8');
  }

  throw new Error('Unknown attachment format');
}

/**
 * Process multiple attachments and return all extracted XML content
 */
export async function processAttachments(
  attachments: Array<{ filename: string; content: string }>,
): Promise<string[]> {
  const xmlContents: string[] = [];

  for (const attachment of attachments) {
    // Only process files that look like DMARC reports
    const filename = attachment.filename.toLowerCase();
    if (
      filename.endsWith('.xml') ||
      filename.endsWith('.xml.gz') ||
      filename.endsWith('.gz') ||
      filename.endsWith('.zip')
    ) {
      const xml = await extractXMLFromAttachment(
        attachment.content,
        attachment.filename,
      );
      xmlContents.push(xml);
    }
  }

  return xmlContents;
}
