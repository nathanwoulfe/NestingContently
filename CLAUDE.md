# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Nesting Contently is an Umbraco CMS package that adds a visibility toggle to Block List and Block Grid editors. It lets editors hide/show individual blocks in the backoffice (dimming hidden ones) and automatically strips hidden blocks from rendered output via property value converters. The toggle reads/writes an `umbracoNaviHide` true/false property on the block's content or settings element type.

Version 17+ targets Umbraco's Bellissima (new) backoffice and requires Umbraco 17.5+. The toggle is implemented as a native `blockAction` extension. The package ships as a NuGet package (`NestingContently.Umbraco`).

## Build Commands

### Full solution build (builds both C# and client-side)
```
dotnet build NestingContently.slnx
```

### Client-side only (from repo root via root package.json)
```
npm run install-client
npm run build-client
npm run watch-client    # vite build --watch (dev loop)
npm run test-client     # vitest run
```

### Pack NuGet package locally
```
powershell -File localbuild.ps1
# or: dotnet pack -c Debug -o __out --no-restore
```

### Run the test site
```
dotnet run --project examples/NestingContently.TestSite/NestingContently.TestSite.csproj
```

## Architecture

### Solution structure
- **`src/NestingContently.Umbraco/`** - The package project (Razor SDK, ships as NuGet)
- **`examples/NestingContently.TestSite/`** - An Umbraco site that references the package for local testing
- **`devops/`** - CI/CD pipeline definitions (Azure Pipelines)

### C# layer (`src/NestingContently.Umbraco/`)
- **`Editor/NestingContentlyBlockListPropertyValueConverter.cs`** - Overrides the base Block List converter to filter out hidden blocks (where `umbracoNaviHide` is true) before rendering.
- **`Editor/NestingContentlyBlockGridPropertyValueConverter.cs`** - Same for Block Grid, but recursively walks nested areas to remove hidden blocks at any depth.
- **`Constants.cs`** - Package name and App_Plugins path constants.

### Client-side layer (`src/NestingContently.Umbraco/Client/`)
TypeScript built with Vite, output to `wwwroot/nesting-contently.js`. All `@umbraco-cms/*` imports are externalized (provided by the backoffice at runtime).

- **`src/index.ts`** - Aggregates and exports extension manifests.
- **`src/toggle/manifests.ts`** - Registers a single `blockAction` extension (alias `NestingContently.BlockAction.ToggleVisibility`) for `block-list` and `block-grid` editors.
- **`src/toggle/toggle-visibility.action.ts`** - The action class (`NestingContentlyToggleAction`). Consumes `UMB_BLOCK_ENTRY_CONTEXT` and `UMB_BLOCK_MANAGER_CONTEXT` to read/write the `umbracoNaviHide` value. Observes the property to dim hidden blocks (opacity 0.6). Prefers settings over content when both declare the property.
- **`src/toggle/toggle-visibility.value.ts`** - Pure helpers for interpreting/flipping the visibility value. Handles legacy formats (`"1"`, `1`, `"true"`) alongside boolean `true`.
- **`src/toggle/block-host.ts`** - DOM traversal helpers that walk up across shadow boundaries to find the block entry element and its inner content container for dimming.
- **`public/umbraco-package.json`** - Package manifest that registers the bundle entry point.

### Build integration
The `.csproj` has a `BuildClient` MSBuild target that runs `npm install` and `npm run build` before the dotnet build (conditionally: skips in Debug if output already exists). The Vite output lands in `wwwroot/` which is served as static web assets under `App_Plugins/NestingContently/`.

### Versioning
Uses Nerdbank.GitVersioning (`version.json`). Current major version: 17. Versioning is commit-height based; `publicReleaseRefSpec` includes `main` and `release-*` tags.

## Key Conventions

- The magic property alias is **`umbracoNaviHide`** - this is hardcoded and matches Umbraco's built-in `IsVisible()` extension method.
- Target framework: `net10.0` (.NET 10), SDK version `10.0.100` (with `rollForward: latestFeature`).
- Nullable reference types are enabled with `WarningsAsErrors` for nullable warnings.
- Central Package Management (`Directory.Packages.props`) — all package versions are defined centrally; `.csproj` files do not specify versions. Shared tooling (NBGV, StyleCop, Umbraco.GitVersioning.Extensions) are `GlobalPackageReference` entries.
- NuGet feed includes Umbraco prereleases from MyGet with package source mapping (see `NuGet.config`).
- CI runs on Azure Pipelines (`devops/azure-pipelines.yml`), building on ubuntu-latest with Node 22.x.
