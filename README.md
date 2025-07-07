# Quote Generator Web App

A Next.js web application that generates motivational quotes based on user-selected topics. Built with ShadCN UI components and deployed on Vercel.

## Features

- ✅ **ShadCN UI Form**: Clean, modern form interface using ShadCN UI components
- ✅ **Topic-based Quote Generation**: Enter a topic to get relevant motivational quotes
- ✅ **Local Quote Database**: 3 quotes displayed from a local JSON array
- ✅ **Responsive Design**: Works on desktop and mobile devices
- ✅ **Modern UI**: Beautiful, accessible interface with Tailwind CSS

## Available Topics

- **Success**: Quotes about achieving success and overcoming challenges
- **Motivation**: Inspirational quotes to keep you going
- **Life**: Wisdom about life and personal growth

## Tech Stack

- **Framework**: Next.js 15.3.4
- **UI Components**: ShadCN UI
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone Nexium_Madiha_Assign1
cd assignment-1
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## How to Use

1. Enter a topic in the input field (e.g., "success", "motivation", "life")
2. Click "Generate" or press Enter
3. View up to 3 relevant quotes displayed in beautiful cards
4. Try different topics to discover new inspiration

## Project Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Main page with quote generator
│   └── globals.css     # Global styles
├── components/
│   ├── ui/             # ShadCN UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   └── QuoteForm.tsx   # Alternative quote form component
└── data/
    └── quote.ts        # Local quote database
```

## Deployment on Vercel
## Live Demo

🔗 **Deployed on Vercel**: https://nexium-madiha-assign1.vercel.app
## Development

### Adding New Quotes

Edit `src/data/quote.ts` to add new quotes:

```typescript
export const quotes = [
  { topic: "your-topic", quote: "Your inspirational quote here." },
  // Add more quotes...
];
```

### Customizing Styles

The app uses Tailwind CSS for styling. Modify `src/app/globals.css` for custom styles.

## Requirements Checklist

- ✅ ShadCN UI form to enter a topic
- ✅ Displays 3 quotes from local JSON/array  
- ✅ Deployed to Vercel
- ✅ Code in assignment-1/
