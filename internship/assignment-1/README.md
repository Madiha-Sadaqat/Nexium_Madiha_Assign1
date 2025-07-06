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
git clone <your-repo-url>
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

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to connect your GitHub repository

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will automatically detect Next.js and deploy

### Option 3: Deploy with GitHub Integration

1. Connect your GitHub account to Vercel
2. Select your repository
3. Vercel will automatically deploy on every push to main branch

## Live Demo

🔗 **Deployed on Vercel**: [Your Vercel URL will appear here after deployment]

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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
