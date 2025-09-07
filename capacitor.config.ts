import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.973c464b503841db852466e114acbb03',
  appName: 'agent-pay-hub',
  webDir: 'dist',
  server: {
    url: 'https://973c464b-5038-41db-8524-66e114acbb03.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#3b82f6',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
    StatusBar: {
      style: 'default',
      backgroundColor: '#ffffff',
    },
  },
};

export default config;