#!/bin/bash
set -e
BASE="https://cdn.prod.website-files.com/6284f50b95ff173d79dff367"
DIR="/Users/hum/Developer/hum-site/assets/case-studies/inveterate"
cd "$DIR"

declare -a FILES=(
  "62c80fdd3e872ae2af43f95e_Featured-D%402x%201.webp|01-hero-desktop.webp"
  "62beddf4904433260fceb157_Featured-M%402x.webp|01-hero-mobile.webp"
  "62bedaee9044336393ce9d4b_2-D%402x.webp|02-s01-design-system-components-desktop.webp"
  "62bedb06e454d7032a2faa37_2-M%402x.webp|02-s01-design-system-components-mobile.webp"
  "62bedaf081a2ad0981ad42e6_3-D%402x.webp|03-s01-ui-kit-library-desktop.webp"
  "62bedb088f3058b1fc1857e9_3-M%402x.webp|03-s01-ui-kit-library-mobile.webp"
  "62bedaf05c08492050eb8926_4-D%402x.webp|04-s01-platform-interface-elements-desktop.webp"
  "62bedb06cf8b13e550bd3960_4-M%402x.webp|04-s01-platform-interface-elements-mobile.webp"
  "62bedaee2b9c80e2b469cad9_5-D%402x.png|05-s02-brand-identity-desktop.png"
  "62bedb0600b8ea3eb0f277ec_5-M%402x.webp|05-s02-brand-identity-mobile.webp"
  "62bedaf3fcba33f9c2671a8b_6-D%402x.webp|06-s02-brand-design-desktop.webp"
  "62bedb05782adec5c4b9f2c2_6-M%402x.webp|06-s02-brand-design-mobile.webp"
  "62bedaef8f3058b7331857bb_7-D%402x.webp|07-s02-brand-personality-desktop.webp"
  "62bedb06e1bec5104760945f_7-M%402x.webp|07-s02-brand-personality-mobile.webp"
  "62bedaef4fcba33f9c2671a8b_8-D%402x.webp|08-s02-design-system-docs-desktop.webp"
  "62bedb09ea6eea7a3b5d139d_8-M%402x.webp|08-s02-design-system-docs-mobile.webp"
  "62bedaf43a756e64c76aa829_9-D%402x.webp|09-s02-brand-assets-desktop.webp"
  "62bedb068f3058651e1857e4_9-M%402x.webp|09-s02-brand-assets-mobile.webp"
  "62bedaeedf4e93fce17e34d0_10-D%402x.png|10-s03-identity-application-desktop.png"
  "62bedb07601a6054d32ca346_10-M%402x.png|10-s03-identity-application-mobile.png"
  "62bedaed470c33457252b91c_11-D%402x.png|11-s03-marketing-collateral-desktop.png"
  "62bedb04c0def4949f5308ad_11-M%402x.png|11-s03-marketing-collateral-mobile.png"
  "62bedaefc0613a90ef49e2bc_12-D%402x.webp|12-s03-ooh-campaign-desktop.webp"
  "62bedb05c0def4b9945308b1_12-M%402x.webp|12-s03-ooh-campaign-mobile.webp"
  "62bedaee8195b4b756eb2ef1_13-D%402x.webp|13-s04-data-dashboard-desktop.webp"
  "62bedb04c71a168404331d88_13-M%402x.webp|13-s04-data-dashboard-mobile.webp"
  "62bedaefea6eea14be5d1336_14-D%402x.webp|14-s04-analytics-metrics-desktop.webp"
  "62bedb06c71a160b9d331d92_14-M%402x.webp|14-s04-analytics-metrics-mobile.webp"
  "62bedaefaf52b752cd13f6ca_15-D%402x.webp|15-s04-dashboard-drilldown-desktop.webp"
  "62bedb06cf8b139766bd395f_15-M%402x.webp|15-s04-dashboard-drilldown-mobile.webp"
  "62bedaf0afae8c7a8f16c22c_17-D%402x.webp|16-membership-builder-interface-desktop.webp"
  "62bedb07357a20a027d37be6_17-M%402x.webp|16-membership-builder-interface-mobile.webp"
  "62bedaf1a0dd182eb3713814_18-D%402x.webp|17-membership-builder-customization-desktop.webp"
  "62bedb06af52b72f2113f7cf_18-M%402x.webp|17-membership-builder-customization-mobile.webp"
  "62bedaf36f50dda8e0c1d241_19-D%402x.webp|18-membership-benefits-feature-desktop.webp"
  "62bedb05efdd65623f5197fc_19-M%402x.webp|18-membership-benefits-feature-mobile.webp"
  "62cc2b39707bc547b942d43b_Group%202495.webp|19-tiered-benefits-structure.webp"
  "62cc2ba4b01eb4be27a7183b_Frame%201.webp|20-feature-comparison-framework.webp"
  "62bedaee00b8eaae18f276ef_21-D%402x.webp|21-program-data-analytics-desktop.webp"
  "62bedb088195b406cdeb2f47_21-M%402x.webp|21-program-data-analytics-mobile.webp"
  "62bedaefc2a90e1bbcd65f30_22-D%402x.webp|22-third-party-integrations-desktop.webp"
  "62bedb06af52b7a50813f7d0_22-M%402x.webp|22-third-party-integrations-mobile.webp"
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
