# primoprod

<a href="https://github.com/potatoeggy/primoprod/actions?query=branch%3Amaster"><img src="https://img.shields.io/github/workflow/status/potatoeggy/primoprod/build" /></a>
<a href="https://www.codefactor.io/repository/github/potatoeggy/primoprod"><img src="https://www.codefactor.io/repository/github/potatoeggy/primoprod/badge" alt="CodeFactor" /></a>
<a href="https://github.com/potatoeggy/primoprod/releases/latest"><img src="https://img.shields.io/github/v/release/potatoeggy/primoprod?display_name=tag" /></a>
<a href="https://github.com/potatoeggy/primoprod/issues"><img src="https://img.shields.io/github/issues/potatoeggy/primoprod" /></a>
<a href="/LICENSE.md"><img src="https://img.shields.io/github/license/potatoeggy/primoprod" /></a>

A Genshin Impact-inspired wish simulator written with Vue and Typescript to push a to-do list with gacha as motivation

![](primoprod-demo.png)

## Usage

Visit https://primoprod.eggworld.tk for a live demo!

Alternatively, to use primoprod offline or with a slow internet connection or while the demo is down, download the latest desktop or Android version in the [Releases](https://github.com/potatoeggy/primoprod/releases/latest) tab.

## Disclaimer

All code is licensed under the AGPL in LICENSE.md.

This project is for practice and for fun and is **not** intended for monetary gain. Most assets are owned by MiHoYo, Co., Ltd.

Some implementation details were inspired by https://genshin.thekima.com and https://github.com/uzair-ashraf/genshin-impact-wish-simulator.

## Project setup

```
yarn install
```

For Electron (desktop) builds, **Node 14+** and **Electron 11+** is required.

For Capacitor (Android) builds, **Node 14+**, **Java 8-16**, and the **Android SDK with platform API 21-31** is required.

### Compiles and hot-reloads for development

Web:

```
yarn serve
```

Electron:

```
yarn electron:serve
```

Capacitor:

```
yarn cap:serve
```

### Compiles and minifies for production

Web (output folder `/dist`):

```
yarn build
```

Electron (output folder `/dist_electron`):

```
yarn electron:build
```

Capacitor (output folder `/android` as an Android Studio project):

```
yarn cap:build
```

To directly build the Android app from the command line afterward:

```
cd android && ./gradlew build
jarsigner -sigalg SHA1withRSA -digestalg SHA1 -keystore ~/.android/debug.keystore ./app/build/outputs/apk/release/app-release-unsigned.apk
```

The self-signed APK is available in `$REPO_ROOT/android/app/build/outputs/apk/release/app-release-unsigned.apk`.
