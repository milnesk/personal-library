# Phase 2: ISBN Barcode Scanning

## Recommendation

Use a **web-based barcode scanner** inside the existing Add Book dialog. No app store, no Xcode, no Capacitor required — it works directly in mobile Safari on your iPhone using the camera via `getUserMedia`.

### Why web (not native Capacitor)

| Approach | Setup | Works on your iPhone? | Trade-offs |
|---|---|---|---|
| **Web scanner (recommended)** | Add one library, ship instantly via Lovable | Yes, in Safari | Requires HTTPS (already true on `km-library.lovable.app`) and camera permission prompt |
| Native app via Capacitor | Export to GitHub, install Xcode, run `npx cap` commands, manage builds | Yes, but only after sideloading or App Store submission | Heavy setup for a single feature |
| Browser `BarcodeDetector` API | Zero deps | iOS Safari support is unreliable | Not portable enough to rely on |

The web approach gets you scanning today with one tap from your existing UI.

## Library choice

**`@zxing/browser`** (ZXing port). It's the most reliable open-source option for EAN-13 (the format used for book ISBNs), works well on iOS Safari, and is actively maintained. Alternatives considered: `html5-qrcode` (more QR-focused), `quagga2` (older, heavier).

## UX flow

1. In the **Add Book** dialog, next to the ISBN field's existing "Lookup" button, add a **"Scan"** button (camera icon), shown only on touch devices / small screens.
2. Tapping Scan opens a full-screen overlay with the live camera feed and a framing guide.
3. On a successful EAN-13 read, the scanner closes, the ISBN field auto-populates, and the existing **Open Library lookup runs automatically** to fill title/author/cover/description.
4. Buttons in the overlay: Cancel, and a torch toggle if the device supports it.
5. Errors handled: permission denied, no camera, unsupported browser — each shows a clear toast and falls back to manual entry.

## Technical plan

- Add dependency: `@zxing/browser` (+ `@zxing/library` peer).
- New component: `src/components/BarcodeScannerDialog.tsx`
  - Uses `BrowserMultiFormatReader` restricted to `EAN_13` for speed/accuracy.
  - Renders a `<video>` with `playsInline` and `muted` (required by iOS Safari to autoplay).
  - Calls `decodeFromVideoDevice` with `facingMode: 'environment'` to prefer the rear camera.
  - On result, validates it's a 13-digit ISBN starting with `978`/`979`, then calls back with the value.
  - Cleans up the stream on unmount / close.
- Edit `src/components/BookFormDialog.tsx`:
  - Add a Scan button beside the existing ISBN input.
  - On scan success: `setIsbn(value)` then call the existing `handleLookup()` automatically.
- No backend, schema, or `openLibrary.ts` changes — the existing lookup pipeline is reused.

## Requirements & caveats

- The site must be served over HTTPS — already the case for both the Lovable preview and `km-library.lovable.app`.
- iOS will prompt for camera permission once per origin; the user must grant it.
- Works in mobile Safari, Chrome on iOS/Android, and desktop browsers with a webcam (handy for testing in the preview).

## Out of scope for this phase

- Native iOS app via Capacitor (can be a future phase if you want App Store distribution or offline scanning).
- Scanning multiple books in a row / batch mode.
- Reading ISBNs from photos in the camera roll.
