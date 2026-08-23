import "./globals.css";

export const metadata = {
  title: "KNN Loan Predictor — Terminal Systems",
  description:
    "K-Nearest Neighbors machine learning model for loan approval prediction. High-stakes financial modeling meets kernel-level precision.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
