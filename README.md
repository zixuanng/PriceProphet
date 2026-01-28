# PriceProphet 🔮

**PriceProphet** is an AI-powered pricing intelligence system designed to predict fair, reasonable, and defensible prices before payments are made. Powered by Google's **Gemini 3 Flash** model, it provides users with real-time decision support for shared expenses, freelance services, rent, and more.

## 🚀 Key Features

- **Context-Aware Pricing Intelligence**: Uses Gemini AI to analyze transaction context (Category, Participants, Description) to generate a tailored Fair Price Range.
- **"What-If" Simulator**: Interactive slider to simulate different price points and instantly see the impact on fairness and savings.
- **Personalized Historical Learning**: Learns from your past transactions (stored locally) to refine future predictions based on your specific spending habits.
- **Transparent Reasoning**: Provides a "Glass Box" approach with Confidence Scores, detailed reasoning, and specific Key Factors (e.g., Inflation, Peer Averages).
- **Visual Analytics**: Interactive charts and data visualizations to track spending trends and prediction history.
- **Privacy-First**: Transaction history is stored securely in your browser's local storage (`localStorage`).

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **AI Engine**: Google Gemini API (`gemini-3-flash-preview`) via `@google/genai` SDK
- **Visualization**: Recharts
- **Icons**: Lucide React

## 📦 Getting Started

### Prerequisites

You need a Google Gemini API Key to run the AI predictions.
Get one here: [Google AI Studio](https://aistudio.google.com/)

### Installation

1. Clone the repository.
2. Install dependencies (if using a local Node environment):
   ```bash
   npm install
   ```
3. Set up your environment variables. Create a `.env` file in the root:
   ```env
   API_KEY=your_google_gemini_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## 💡 How It Works

1. **Input Details**: Enter a description (e.g., "Logo Design"), category, and participants.
2. **Get Analysis**: The AI analyzes market data and your local history to predict a fair price range.
3. **Simulate**: Use the slider to test "What if I pay more?" or "What if I negotiate lower?"
4. **Decide**: Use the generated insights and confidence score to make an informed financial decision.

## 🔒 Privacy Note

This application stores your transaction history in `localStorage` on your device. Your personal financial history is sent to the AI model *only* during the active prediction request for context and is not permanently stored on any external server by PriceProphet.

## 📄 License

MIT
