const config = {
  appId: "ai.nexthire.app",
  appName: "NextHire AI",
  webDir: "out",
  server: {
    // When deploying to production, point server.url to your live deployment domain
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://nexthire-ai.vercel.app",
    cleartext: true,
    androidScheme: "https",
  },
  android: {
    allowMixedContent: true,
    backgroundColor: "#0f172a",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0f172a",
      showSpinner: false,
    },
  },
};

export default config;
