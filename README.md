# Bank Statement Analyzer

## Project Overview

The Bank Statement Analyzer is a sophisticated financial tool developed to transform raw bank statement data into actionable intelligence. By parsing standard financial documents, the application provides users with a comprehensive dashboard that visualizes spending habits, cash flow trends, and financial health metrics. This project demonstrates the application of modern web development practices to solve complex data visualization and analysis challenges in the fintech domain.

## Key Features

- **Comprehensive Dashboard**: A centralized hub displaying critical financial metrics and key performance indicators at a glance.
- **Cash Flow Analysis**: Interactive visualizations tracking income versus expenses to monitor liquidity over time.
- **Expense Categorization**: Detailed breakdown of spending patterns to identify major cost centers.
- **Anomaly Detection**: Algorithmic identification of irregular transactions or potential security concerns.
- **Financial Health Assessment**: specific scoring mechanisms to evaluate overall financial stability.
- **Optimization Recommendations**: Data-driven suggestions for reducing costs and improving savings.
- **Subscription Management**: Automated detection and listing of recurring payments.
- **Document Parsing**: robust support for processing bank statements in both PDF and Excel formats.

## Tech Stack

This project utilizes a cutting-edge tech stack to ensure performance, scalability, and maintainability:

- **Framework**: Next.js 16 (App Router)
- **Core Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI, @shadcn/ui, Lucide React
- **Data Visualization**: Recharts
- **Form Management**: React Hook Form, Zod
- **File Processing**: PDF.js, SheetJS (xlsx)
- **AI & Analysis**: Vercel AI SDK

## Getting Started

Follow these steps to set up the project locally for development and testing purposes.

### Prerequisites

Ensure you have the following installed on your system:
- Node.js (LTS version recommended)
- npm, yarn, pnpm, or bun package manager

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/bank-statement-analyzer.git
    cd bank-statement-analyzer
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```

4.  **Access the application:**

    Open your browser and navigate to `http://localhost:3000`.

## Usage

1.  Navigate to the upload section on the dashboard.
2.  Select or drag and drop your bank statement file (PDF or Excel).
3.  Allow the system to parse and analyze the data.
4.  Explore the generated dashboard to review insights, charts, and recommendations.

## Project Structure

- `src/app`: Next.js App Router pages and API routes.
- `src/components`: Reusable UI components and feature-specific widgets.
- `src/services`: Core logic for file parsing and financial analysis.
- `src/lib`: Utility functions and schema definitions.
- `src/hooks`: Custom React hooks for state and logic management.

## License

This project is available for personal and educational use.
