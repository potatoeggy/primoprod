# primoprod

A Genshin Impact-inspired wish simulator written with Vue and Typescript to push a to-do list with gacha as motivation

![](primoprod-demo.png)

All code is licensed under the AGPL in LICENSE.md.

Most assets are owned by MiHoYo, Co., Ltd.

## Usage

Visit https://primoprod.eggworld.tk for a live demo!

Alternatively, to use primoprod offline or with a slow internet connection, download the latest desktop or Android version in the [Releases](https://github.com/potatoeggy/primoprod/releases/latest) tab.

## Project setup

```
yarn install
```

For Electron (desktop) builds, **Electron 11+** is required.

For Capacitor (Android) builds, **Node 12+**, **Java 8-16**, and the **Android SDK with platform API 21-31** is required.

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
