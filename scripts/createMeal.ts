/* eslint-disable no-console */
import { promises as fs } from 'fs';
import path from 'path';

const API_URL = 'https://api.refinai.app/meals';
const TOKEN = 'eyJraWQiOiJJUVVadjF4VjRxZ0dxcHBaa0lsNnNvMCtcL3EyQjc2QllKZlZVeldZZGlyWT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhMzRjMGEwYS03MDUxLTcwNjgtMzBlMy05NDFiNjEzODZmMDMiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuc2EtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3NhLWVhc3QtMV9OUnd0azNYYVoiLCJjbGllbnRfaWQiOiI3aDdhMnZlNDdqbmMwcWU3YjJmbGZyYzNhbiIsIm9yaWdpbl9qdGkiOiI4NTk1MWMyYi0xNmM1LTQyNTgtOWVmOC1jYjBjYzUyMDliYjgiLCJpbnRlcm5hbElkIjoiMnpMR2wxbEZxeXF3OHJJTHJUWFNFS0xXWU9iIiwiZXZlbnRfaWQiOiIwOWMzMGY5Yi0zYWFhLTRjNDYtOGRhMi1lNzYyMDljYTJmMGMiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzU1NjE5MzYxLCJleHAiOjE3NTU2NjI1NjEsImlhdCI6MTc1NTYxOTM2MSwianRpIjoiOThkOTY2YWEtMTVmOS00ODIyLWE2OTktNDNiZTQyYWE0ZjIzIiwidXNlcm5hbWUiOiJhMzRjMGEwYS03MDUxLTcwNjgtMzBlMy05NDFiNjEzODZmMDMifQ.aWSJp3cqbmTvxJNWOU-lhYww5crkMpkYSqFbdAJJ_80McbNY3aGGKpoMPHRTxtrvhw4_60goLXV1fyltAxkejwTwTj_6RNV2iYJV5IA-RHMEXVoDdQ_O-4qUpWX_iJ5w9pvjxs8TPuLac57wO_fOxCvABZ27O8-7-lD4GTqBzZE9i3jsdlE57totPMssSeLTTxCX6KqEmE13ZS3YuZAyEosC73Zf4eflYXMN4vijHiamRPub3B_zT8eMTB-aQJwONqZQ3mahDqYYnfsqms8hYItpSGHPdz7_OLrfUPo6amrxdMy9H2pVxbtIYy0HWLOb4f7jZz7kR__mwEO7EN_80A';

interface IPresignResponse {
  uploadSignature: string;
}

interface IPresignDecoded {
  url: string;
  fields: Record<string, string>;
}

async function readImageFile(filePath: string): Promise<{
  data: Buffer;
  size: number;
  type: string;
}> {
  console.log(`🔍 Reading file from disk: ${filePath}`);
  const data = await fs.readFile(filePath);
  return {
    data,
    size: data.length,
    type: 'image/jpeg',
  };
}

async function createMeal(
  fileType: string,
  fileSize: number,
): Promise<IPresignDecoded> {
  console.log(`🚀 Requesting presigned POST for ${fileSize} bytes of type ${fileType}`);
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ file: { type: fileType, size: fileSize } }),
  });

  if (!res.ok) {
    throw new Error(`Failed to get presigned POST: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as IPresignResponse;
  const decoded = JSON.parse(
    Buffer.from(json.uploadSignature, 'base64').toString('utf-8'),
  ) as IPresignDecoded;

  console.log('✅ Received presigned POST data');
  return decoded;
}

function buildFormData(
  fields: Record<string, string>,
  fileData: Buffer,
  filename: string,
  fileType: string,
): FormData {
  console.log(`📦 Building FormData with ${Object.keys(fields).length} fields and file ${filename}`);
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    form.append(key, value);
  }
  const blob = new Blob([fileData], { type: fileType });
  form.append('file', blob, filename);
  return form;
}

async function uploadToS3(url: string, form: FormData): Promise<void> {
  console.log(`📤 Uploading to S3 at ${url}`);
  const res = await fetch(url, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`S3 upload failed: ${res.status} ${res.statusText} — ${text}`);
  }

  console.log('🎉 Upload completed successfully');
}

async function uploadMealImage(filePath: string): Promise<void> {
  try {
    const { data, size, type } = await readImageFile(filePath);
    const { url, fields } = await createMeal(type, size);
    const form = buildFormData(fields, data, path.basename(filePath), type);
    await uploadToS3(url, form);
  } catch (err) {
    console.error('❌ Error during uploadMealImage:', err);
    throw err;
  }
}

uploadMealImage(
  path.resolve(__dirname, 'assets', 'cover.jpg'),
).catch(() => process.exit(1));
