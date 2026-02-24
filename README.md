# Freedle - Instant Word Fun 🎮

A modern, feature-rich word guessing game inspired by Wordle. Guess the word by trying different combinations and get instant feedback on your guesses!

## 🎯 Features

## ✅ Production Upgrade Highlights

- **Structured Difficulty System**
   - Easy: 4 letters, 6 attempts, common vocabulary
   - Medium: 5 letters, 6 attempts, moderate vocabulary
   - Hard: 6/7 letters, 5 attempts, rare vocabulary
- **Pre-Game Level Selection Screen** for mode + length setup
- **Dynamic Grid + Keyboard Scaling** for 4, 5, 6, and 7+ letter words
- **Persistent Player Stats (localStorage)**
   - Games played/won, win %, current/max streak, average guesses
   - Breakdown by difficulty and word length
- **Hint System**
   - Meaning hint, category hint, reveal-letter hint (costs 1 attempt)
- **Multiplayer Stage 1 (Shareable Challenge Link)**
   - URL-encoded same-word challenge for manual result comparison
- **Multiplayer Stage 2 (Realtime Co-op Rooms)**
   - Firebase-backed live shared board solving with room join links
- **Mobile-First Layout Refactor**
   - Sticky keyboard, no horizontal scroll, improved small-screen spacing

## 🧱 Architecture (Modular Managers)

Core logic is now split into scalable managers:

- `src/lib/managers/DifficultyManager.ts`
- `src/lib/managers/WordEngine.ts`
- `src/lib/managers/GameStateManager.ts`
- `src/lib/managers/StatsManager.ts`
- `src/lib/managers/HintManager.ts`
- `src/lib/managers/MultiplayerManager.ts`

Main orchestration happens in:

- `src/hooks/useFreedleGame.ts`

UI additions:

- `src/components/LevelSelection.tsx`
- `src/components/StatsModal.tsx`
- `src/components/HintPanel.tsx`

### Core Gameplay
- **Dynamic Word Length**: Grid automatically adjusts to match the word length
- **Real-time Feedback**: Color-coded tiles show correct, misplaced, and incorrect letters
- **Smart Keyboard**: Virtual keyboard highlights letter states as you play
- **Smooth Animations**: Tile reveals, shakes, and bounces for engaging gameplay

### Difficulty Modes
- **Easy Mode**: Uses simpler words from the Random Word API (Vercel)
- **Hard Mode**: Uses challenging words from the Random Word API (Heroku)
- **Visual Indicators**: Active difficulty is highlighted in the header

### Game Features
- **Win Celebration**: Confetti animation and congratulations card when you solve the word
- **Definition Display**: Shows word definition when you lose (powered by Dictionary API)
- **Replay Functionality**: Quick replay button to start a new game
- **New Game**: Reset button to start fresh with the same difficulty

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd freedle-instant-word-fun
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal)

## 🧪 Testing New Systems

1. Start app and verify level-selection appears before game board
2. Try each difficulty and confirm allowed word lengths and attempt limits
3. Complete/lose games and open **Stats** to confirm updates persist after refresh
4. Use **Hints**:
   - Meaning and category hints
   - Reveal-letter hint should consume one attempt
5. Click **Share** to generate/copy a challenge link and open it in a new tab
6. Verify mobile layout in DevTools (iPhone + Android presets):
   - Keyboard stays visible/sticky
   - No overlap and no horizontal scrolling

## 🌐 Realtime Co-op Multiplayer (Stage 2)

Freedle now supports **live co-op solving** with Firebase Realtime Database.

### Setup

1. Create a Firebase project
2. Enable **Realtime Database** (test mode for local development)
3. Copy `.env.example` to `.env.local`
4. Fill in all `VITE_FIREBASE_*` values

```bash
cp .env.example .env.local
```

5. Restart dev server

### How Co-op Works

- Start any game, then click **Create Co-op Room**
- A room link is copied to clipboard
- Teammates join with that link (or room ID)
- All players submit guesses to the **same shared board** in real-time
- Member panel shows connected players and guesses submitted
- Room host can trigger **Start New Round** to reset the shared board for everyone

### Firebase Rules

- Rules file: `firebase.rules.json`
- Deploy with Firebase CLI:

```bash
firebase deploy --only database
```

### Notes

- Reveal-letter hint is disabled in co-op mode to keep room state consistent
- Stage 1 challenge links still work independently for async comparison mode
- Host-only new round is enforced in app logic and backed by immutable `hostId` room metadata

## 🎮 How to Play

1. **Choose Difficulty**: Click "Easy" or "Hard" to select your preferred difficulty level
2. **Make Guesses**: Type letters using your keyboard or click the virtual keyboard
3. **Submit Guess**: Press Enter or click the Enter key on the virtual keyboard
4. **Read Feedback**:
   - 🟩 Green = Correct letter in the right position
   - 🟨 Yellow = Correct letter in the wrong position
   - ⬛ Gray = Letter not in the word
5. **Win or Lose**: 
   - **Win**: Enjoy the confetti celebration and click "Replay" to play again
   - **Lose**: View the word definition and try again!

## 🛠️ Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **React Router** - Client-side routing
- **Lucide React** - Icon library

## 📁 Project Structure

```
freedle-instant-word-fun/
├── src/
│   ├── components/        # React components
│   │   ├── Grid.tsx      # Game grid display
│   │   ├── Keyboard.tsx  # Virtual keyboard
│   │   ├── Tile.tsx      # Individual tile component
│   │   ├── Header.tsx    # Header with difficulty buttons
│   │   ├── WinCard.tsx   # Win celebration card
│   │   ├── LossCard.tsx  # Loss card with definition
│   │   └── ui/           # shadcn/ui components
│   ├── hooks/
│   │   └── useFreedleGame.ts  # Main game logic hook
│   ├── lib/
│   │   ├── game.ts       # Game state and utilities
│   │   ├── wordnik.ts    # Word fetching API
│   │   ├── dictionary.ts # Definition fetching API
│   │   └── words.ts      # Word validation
│   └── pages/
│       └── Index.tsx     # Main game page
├── public/               # Static assets
└── package.json         # Dependencies and scripts
```

## 🔌 API Integrations

### Word APIs
- **Easy Mode**: `https://random-word-api.vercel.app/api?words=1`
- **Hard Mode**: `https://random-word-api.herokuapp.com/word`

### Dictionary API
- **Definition Lookup**: `https://api.dictionaryapi.dev/api/v2/entries/en/{word}`

All APIs are called client-side and require no API keys.

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## 🎨 Customization

### Changing Colors
Edit the CSS variables in `src/index.css`:
- `--tile-correct`: Green for correct letters
- `--tile-misplaced`: Yellow for misplaced letters
- `--tile-incorrect`: Gray for incorrect letters

### Adjusting Difficulty
Modify the word APIs in `src/lib/wordnik.ts` to use different endpoints or add filters.

## 🐛 Troubleshooting

### Word not loading?
- Check your internet connection
- Verify the API endpoints are accessible
- Check browser console for errors

### Styling issues?
- Ensure Tailwind CSS is properly configured
- Clear browser cache and restart dev server

## 📝 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- Inspired by Wordle
- Built with modern web technologies
- Uses free public APIs for word and definition data

---

**Enjoy playing Freedle!** 🎉
