import { StatusBar } from "@capacitor/status-bar";

StatusBar.setOverlaysWebView({ overlay: true }).catch(() => null);
setInterval(() => {
  StatusBar.hide().catch(() => null);
}, 1000);
