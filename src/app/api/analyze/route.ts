import { type NextRequest, NextResponse } from 'next/server';
import { parseAndAnalyze } from '@/lib/dmarc';

export async function POST(request: NextRequest) {
  try {
    const { xml } = await request.json();

    if (!xml || typeof xml !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid XML content' },
        { status: 400 },
      );
    }

    const analysis = parseAndAnalyze(xml);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to parse DMARC report',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 400 },
    );
  }
}
