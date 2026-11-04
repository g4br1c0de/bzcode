import { DIFFS_TAG_NAME } from "@pierre/diffs"

/**
 * TypeScript declaration for the <diffs-container> custom element.
 * This tells TypeScript that <diffs-container> is a valid JSX element in SolidJS.
 * Required for using the @pierre/diffs web component in .tsx files.
 *
 * This file is a git symlink to ../../ui/src/custom-elements.d.ts upstream. Checkouts
 * with core.symlinks=false (default on Windows) materialize the symlink as a plain
 * text file containing the target path, which breaks type-checking with TS1128. Keep
 * this real declaration in sync with the ui package's file; identical `declare module`
 * augmentations merge safely.
 */

declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      [DIFFS_TAG_NAME]: HTMLAttributes<HTMLElement>
    }
  }
}

export {}
