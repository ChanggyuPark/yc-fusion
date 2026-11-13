# YC Fusion — Sixshop landing

Target: https://www.ycgroup.co.kr/fusion

- Sixshop Page ID: `page2767366`
- Route lock: exact `/fusion` (trailing slash tolerated) + Page ID in DOM
- Existing Sixshop header/footer are preserved
- Landing body and embedded image assets: `assets/fusion-part-00.txt` through `assets/fusion-part-13.txt`
- Styles are scoped under `#yc-fusion-app`
- Five UTM values are propagated to Monday WorkForms
- External HTTP(S) links open in a new tab; in-page anchors remain same-tab for navigation

## GitHub Pages (required)
Settings → Pages → Build and deployment → Deploy from a branch → `main` → `/(root)` → Save.

## Sixshop HEAD code
Paste into the site's custom head only once after GitHub Pages is available:

```html
<link rel="stylesheet" href="https://changgyupark.github.io/yc-fusion/yc-fusion.css?v=20261113-01">
<script defer src="https://changgyupark.github.io/yc-fusion/yc-fusion.js?v=20261113-01"></script>
```

## Validation checklist
1. Visit /fusion and confirm content, image assets and hero logo load.
2. Visit another page and confirm no Fusion landing content or altered site layout.
3. Use Sixshop internal navigation to leave /fusion and confirm landing cleanup.
4. Test both direct Monday application buttons, new-tab external links and UTM persistence.
5. Verify PC and mobile rendering, particularly PRESS DIE figure and caption.

Note: GitHub repository upload is complete; live GitHub Pages configuration and Sixshop HEAD insertion must be verified separately.
