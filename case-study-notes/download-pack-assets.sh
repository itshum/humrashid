#!/bin/bash
set -e
BASE="https://cdn.prod.website-files.com/6284f50b95ff173d79dff367"
DIR="/Users/hum/Developer/hum-site/assets/case-studies/pack"
cd "$DIR"

declare -a FILES=(
  "62a8ab53fb5d246286bbf40a_logo.webp|00-logo.webp"
  "62bf0a055c08498662ed23d7_PCK-TOP-4%402x.webp|01-hero-a.webp"
  "62bf0a0d59b9a296d87e9bec_PCK-TOP-3%402x.webp|01-hero-b.webp"
  "639ccbab882c7f951141c3e3_62976bdd7ec76b82fb21fcf5.png|02-press-cory-cummings-headshot.png"
  "62bedb238c2d68f66f1b1383_2-D%402x.webp|03-s01-transition-desktop.webp"
  "62bedb2dcf8b139f6cbd3abe_2-M%402x.webp|03-s01-transition-mobile.webp"
  "62bedb24af52b7b9aa13f8c7_3-D%402x.webp|04-s01-dashboard-customization-desktop.webp"
  "62bedb2c51f1c9ed24d08f32_3-M%402x.webp|04-s01-dashboard-customization-mobile.webp"
  "62bedb1d58883c5e043828b8_4-D%402x.webp|05-s01-dashboard-analytics-desktop.webp"
  "62bedb2b58883c904d3828de_4-M%402x.webp|05-s01-dashboard-analytics-mobile.webp"
  "62bedb1fcf8b1385cdbd39ac_5-D%402x.webp|06-s01-merchandising-desktop.webp"
  "62bedb2c7be421d9ded9de4b_5-M%402x.webp|06-s01-merchandising-mobile.webp"
  "62bedb24a00639902df72b58_6-D%402x.webp|07-s01-bundling-desktop.webp"
  "62bedb2c96e2aed1a20d6d1e_6-M%402x.webp|07-s01-bundling-mobile.webp"
  "62bedb24470c33fa5652ba13_7-D%402x.webp|08-s01-collection-building-desktop.webp"
  "62bedb2c730d34dc331707e0_7-M%402x.webp|08-s01-collection-building-mobile.webp"
  "62bedb22c2a90e0068d660bf_8-D%402x.webp|09-s01-dev-onboarding-desktop.webp"
  "62bedb2dc71a1617cc331e47_8-M%402x.webp|09-s01-dev-onboarding-mobile.webp"
  "62bedb1da0dd1873e8713a47_9-D%402x.webp|10-s01-git-integration-desktop.webp"
  "62bedb2c357a2077dbd37c77_9-M%402x.webp|10-s01-git-integration-mobile.webp"
  "62bedb21721cef24f726ec27_10-D%402x.webp|11-s01-deploy-logs-desktop.webp"
  "62bedb2cd4028b8133dbc2f1_10-M%402x.webp|11-s01-deploy-logs-mobile.webp"
  "62bedb1ec2a90e546fd66042_12-D%402x.webp|12-s02-customizer-sidebar-desktop.webp"
  "62bedb2cfcba336d70671bca_12-M%402x.webp|12-s02-customizer-sidebar-mobile.webp"
  "62bedb23c71a1642a7331de4_13-D%402x.webp|13-s02-realtime-editing-desktop.webp"
  "62bedb2c9cefeb5e54accf77_13-M%402x.webp|13-s02-realtime-editing-mobile.webp"
  "62bedb23c71a16bf43331de3_14-D%402x.webp|14-s02-banner-slideshow-desktop.webp"
  "62bedb2d8195b4186deb2fe7_14-M%402x.webp|14-s02-banner-slideshow-mobile.webp"
  "62bedb1daf52b798b813f893_15-D%402x.webp|15-s02-product-carousel-desktop.webp"
  "62bedb2cf718604b23db7e99_15-M%402x.webp|15-s02-product-carousel-mobile.webp"
  "62bedb1e00b8eac77cf27840_16-D%402x.webp|16-s02-video-module-desktop.webp"
  "62bedb2df813172c3a2bd1dc_16-M%402x.webp|16-s02-video-module-mobile.webp"
  "62bedb1d2b9c8018be69cb8e_17-D%402x.webp|17-s02-rich-text-desktop.webp"
  "62bedb2c9c2088455753dfe4_17-M%402x.webp|17-s02-rich-text-mobile.webp"
  "62bedb24470c332dce52ba12_18-D%402x.webp|18-s03-mobile-nav-desktop.webp"
  "62bedb2c81a2adba73ad44b3_18-M%402x.webp|18-s03-mobile-nav-mobile.webp"
  "62bedb1ea0dd18096b713a48_19-D%402x.webp|19-s03-onthego-desktop.webp"
  "62bedb2d2b9c808a1169cc38_19-M%402x.webp|19-s03-onthego-mobile.webp"
  "62bedb1e7dfee49c586bb1cb_20-D%402x.webp|20-s04-iconography-desktop.webp"
  "62bedb2b59b9a2e8907d7293_20-M%402x.webp|20-s04-iconography-mobile.webp"
  "62bedb1dd94f5fe8cabc0905_21-D%402x.png|21-s04-color-palette-desktop.png"
  "62bedb2ca0dd1815a6713a81_21-M%402x.webp|21-s04-color-palette-mobile.webp"
  "62bedb23870dba56364978b0_22-D%402x.webp|22-s04-ui-components-desktop.webp"
  "62bedb2ba006394025f72b94_22-M%402x.webp|22-s04-ui-components-mobile.webp"
  "62bedb22a00639367ff72b42_23-D%402x.webp|23-s04-usage-examples-desktop.webp"
  "62bedb2c357a20635cd37c76_23-M%402x.webp|23-s04-usage-examples-mobile.webp"
  "62cc0ecdb01eb462d2a58edd_Frame%201.webp|24-s04-framework-overview-desktop.webp"
  "62bedb2cd94f5fae37bc0a44_24-M%402x.webp|24-s04-framework-overview-mobile.webp"
)

ok=0
fail=0
for entry in "${FILES[@]}"; do
  src="${entry%%|*}"
  dest="${entry##*|}"
  if curl -sSL -f -o "$dest" "$BASE/$src"; then
    ok=$((ok+1))
  else
    echo "FAILED: $src"
    fail=$((fail+1))
  fi
done

echo "Downloaded: $ok  Failed: $fail"
ls -la "$DIR" | wc -l
