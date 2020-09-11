# CEID Signage Frontend

- [CEID Signage Frontend](#ceid-signage-frontend)
  - [Architecture](#architecture)
  - [Card Reader and Raspberry Pi](#card-reader-and-raspberry-pi)
  - [Cloud Function](#cloud-function)
    - [Development](#development)
    - [Deployment to Firebase Cloud Functions](#deployment-to-firebase-cloud-functions)
  - [Cloud Firestore](#cloud-firestore)
  - [React Client](#react-client)
    - [Development](#development-1)
    - [Deployment to Firebase Hosting](#deployment-to-firebase-hosting)

## Architecture

![](./docs/architecture.png)

## Card Reader and Raspberry Pi

See this repo: <https://github.com/sarimabbas/ceid-signage-card-reader>

## Cloud Function

Use this `GET` endpoint: <https://us-central1-ceid-swiper.cloudfunctions.net/swipeCard>

It expects one query parameter:

- `tagId (string)`: a unique identifier for a swipe log.

### Development

```bash
firebase serve
```

### Deployment to Firebase Cloud Functions

```bash
firebase deploy
```

## Cloud Firestore

This can be inspected (along with all other Firebase functionality) in the console: <https://console.firebase.google.com/>

## React Client

### Development

```bash
yarn start
```

### Deployment to Firebase Hosting

```bash
yarn build
firebase deploy
```
