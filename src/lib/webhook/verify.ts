import crypto from 'node:crypto';

/**
 * Verify Resend webhook signature (Svix)
 * Headers: id, timestamp, signature (not svix-id, svix-timestamp, svix-signature)
 */
export function verifyWebhookSignature(
  payload: string,
  headers: {
    id: string;
    timestamp: string;
    signature: string;
  },
  secret: string,
): boolean {
  const { id, timestamp, signature } = headers;

  // Check timestamp to prevent replay attacks (5 minute tolerance)
  const timestampMs = Number(timestamp) * 1000;
  const now = Date.now();
  const tolerance = 5 * 60 * 1000; // 5 minutes

  if (Math.abs(now - timestampMs) > tolerance) {
    return false;
  }

  // Construct the signed payload
  const signedPayload = `${id}.${timestamp}.${payload}`;

  // Extract the secret (remove "whsec_" prefix if present)
  const secretBytes = secret.startsWith('whsec_')
    ? Buffer.from(secret.slice(6), 'base64')
    : Buffer.from(secret, 'base64');

  // Calculate expected signature
  const expectedSignature = crypto
    .createHmac('sha256', secretBytes)
    .update(signedPayload)
    .digest('base64');

  // The signature header may contain multiple signatures (v1,xxx v1,yyy)
  // We need to check if any of them match
  const signatures = signature.split(' ');
  for (const sig of signatures) {
    const [version, sigValue] = sig.split(',');
    if (version === 'v1' && sigValue === expectedSignature) {
      return true;
    }
  }

  return false;
}

/**
 * Extract webhook headers from request
 */
export function extractWebhookHeaders(
  headers: Headers,
): { id: string; timestamp: string; signature: string } | null {
  const id = headers.get('id') || headers.get('webhook-id');
  const timestamp =
    headers.get('timestamp') || headers.get('webhook-timestamp');
  const signature =
    headers.get('signature') || headers.get('webhook-signature');

  if (!id || !timestamp || !signature) {
    return null;
  }

  return { id, timestamp, signature };
}
