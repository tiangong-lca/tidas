# TIDAS

## Installation

```bash
npm ci
```

## Local Development

```bash
npm run start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
npm run build

npm run serve
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Translation

```bash
npx docusaurus write-translations --locale en
npx docusaurus write-translations --locale zh-CN
npx docusaurus write-translations --locale ja
```

## Version

```bash
npm run docusaurus docs:version 0.0.1
```

## Publish

```bash
git tag

git tag v0.0.1
git push origin v0.0.1
```
