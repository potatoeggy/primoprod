# primoprod

<p align="center">
    <a href="https://github.com/potatoeggy/primoprod/actions?query=branch%3Amaster"><img src="https://img.shields.io/github/workflow/status/potatoeggy/primoprod/build" /></a>
    <a href="https://github.com/potatoeggy/primoprod/releases/latest"><img src="https://img.shields.io/github/v/release/potatoeggy/primoprod?display_name=tag" /></a>
    <a href="https://github.com/potatoeggy/primoprod/issues"><img src="https://img.shields.io/github/issues/potatoeggy/primoprod" /></a>
    <a href="/LICENSE.md"><img src="https://img.shields.io/github/license/potatoeggy/primoprod" /></a>
    <img src="https://img.shields.io/github/forks/potatoeggy/primoprod" />
    <img src="https://img.shields.io/github/stars/potatoeggy/primoprod" />
</p>

A Genshin Impact-inspired wish simulator written with Vue and Typescript to push a to-do list with gacha as motivation

![](primoprod-demo.png)

## Usage

Visit https://primoprod.eggworld.tk for a live demo!

Alternatively, to use primoprod offline or with a slow internet connection or while the demo is down, download the latest desktop version in the [Releases](https://github.com/potatoeggy/primoprod/releases/latest) tab.

## Disclaimer

All code is licensed under the AGPL in LICENSE.md.

This project is for practice and for fun and is **not** intended for monetary gain. Most assets are owned by MiHoYo, Co., Ltd.

Some implementation details were inspired by https://genshin.thekima.com and https://github.com/uzair-ashraf/genshin-impact-wish-simulator.

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

Electron:

```
yarn electron:serve
```

NOTE: If building for Electron, Electron 11+ is required for video playback to work properly.

### Compiles and minifies for production

```
yarn build
```

Electron:

```
yarn electron:build
```
