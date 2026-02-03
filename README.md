# DMARC Analyzer

A Next.js application to analyze DMARC aggregate reports (RUA) and forensic reports (RUF). Receives reports via Resend Inbound webhooks and provides a web interface for manual analysis.

## Features

- Parse DMARC aggregate reports (RUA) from XML
- Handle compressed attachments (.xml.gz, .zip)
- Webhook endpoints for Resend Inbound
- React Email template for report digests
- Web interface for paste-and-analyze

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts          # POST endpoint for frontend parsing
│   │   └── webhooks/dmarc/
│   │       ├── rua/route.ts          # Aggregate report webhook
│   │       └── ruf/route.ts          # Forensic report webhook (pass-through)
│   ├── page.tsx                      # Paste-and-analyze frontend
│   ├── layout.tsx                    # App layout
│   └── globals.css                   # Resend-style dark theme
├── components/dmarc/
│   ├── summary-card.tsx              # Stats card component
│   ├── status-badge.tsx              # Pass/fail badges
│   ├── records-table.tsx             # Records table with auth results
│   └── report-viewer.tsx             # Main report display component
├── emails/
│   └── dmarc-report.tsx              # React Email template
├── lib/
│   ├── config.ts                     # Environment config
│   ├── dmarc/
│   │   ├── parser.ts                 # XML parser & analysis
│   │   ├── attachments.ts            # .xml, .gz, .zip extraction
│   │   └── sample.ts                 # Sample XML for testing
│   ├── email/
│   │   └── send-report.ts            # Resend email sender
│   └── webhook/
│       └── verify.ts                 # Svix signature verification
├── types/
│   └── dmarc.ts                      # TypeScript types
└── .env.example                      # Environment variables template
```

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Copy the environment template and fill in your credentials:

```bash
cp .env.example .env.local
```

3. Run the development server:

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) to use the analyzer.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Your Resend API key |
| `RESEND_WEBHOOK_SECRET` | Webhook signing secret from Resend |
| `DMARC_RECIPIENT_EMAIL` | Email address to receive report digests |
| `DMARC_SENDING_DOMAIN` | Verified domain for sending emails |

## Webhook URLs

Configure these endpoints in your Resend dashboard:

- **RUA (Aggregate Reports)**: `https://your-domain.com/api/webhooks/dmarc/rua`
- **RUF (Forensic Reports)**: `https://your-domain.com/api/webhooks/dmarc/ruf`

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint:fix` | Run linter with auto-fix |
| `pnpm format` | Format code |
| `pnpm email` | Preview email templates |

## Tech Stack

- [Next.js 16](https://nextjs.org/) - React framework
- [React 19](https://react.dev/) - UI library
- [Tailwind CSS 4](https://tailwindcss.com/) - Styling
- [Resend](https://resend.com/) - Email delivery
- [React Email](https://react.email/) - Email templates
- [fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser) - XML parsing
