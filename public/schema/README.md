# Bundle metadata schemas

These are JSON Schema files used to validate the `metadata.json` of MONAI
bundles. They were copied verbatim from the
[MONAI-extra-test-data 0.8.1 release](https://github.com/Project-MONAI/MONAI-extra-test-data/releases/tag/0.8.1)
so that bundles can reference them through a short, permanent URL on this site
instead of a GitHub release download link.

Each file is served as a static asset at:

```
https://project-monai.github.io/schema/<filename>
```

For example, a bundle `metadata.json` can set:

```json
"schema": "https://project-monai.github.io/schema/meta_schema_20240725.json"
```

## Rules for this folder

These URLs are a permanent contract. Published bundles reference them by exact
path, so:

- **Do not rename, move, or delete** any file here once it is on the live site.
  Doing so breaks validation for every bundle that points at it.
- **Do not edit** the contents of an existing schema. The date in each filename
  identifies a fixed version. A change in requirements means a new dated file.
- **To add a schema version**, drop the new date-stamped file in this folder.
  Keep the original `meta_schema_` naming so it matches the names used by the
  MONAI framework and existing bundles.

Astro copies `public/` verbatim into the build, so these files need no further
wiring. They are not processed, do not get markdown twins, and are not listed in
the sitemap.

Related issue: https://github.com/Project-MONAI/MONAI/issues/4048
