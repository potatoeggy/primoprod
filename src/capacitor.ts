import { StatusBar } from "@capacitor/status-bar";

StatusBar.setOverlaysWebView({ overlay: true });
setInterval(() => StatusBar.hide(), 1000);
