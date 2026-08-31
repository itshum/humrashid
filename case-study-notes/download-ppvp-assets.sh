#!/bin/bash
set -e
BASE="https://cdn.prod.website-files.com/6284f50b95ff173d79dff367"
DIR="/Users/hum/Developer/hum-site/assets/case-studies/ppvp"
cd "$DIR"

declare -a FILES=(
  "62a8ab53fb5d246286bbf40a_logo.webp|00-logo.webp"
  "63ac8feda2e57bae42bee075_hero.webp|01-hero-desktop.webp"
  "63a30393fa137f2c5042d0ee_hero-m.webp|01-hero-mobile.webp"
  "66fec812f30cd86789430624_Axios-Logo%201.png|02-press-axios-logo.png"
  "63ac8fed6b0b10487076b832_ppvp-1.webp|03-s01-intro.webp"
  "63ab200cd827c52e7931afbe_CS-1%403x.webp|04-s01-invite-only-1.webp"
  "63b6f42f00c4017e676aeebd_1%402x.png|05-design-ref-1.png"
  "63ab200ac73ddfec8bfeb3a5_CS-2%403x.webp|06-s01-invite-only-2.webp"
  "63ac8feed25b1c6cd1d26c17_ppvp-3.webp|07-s01-guided-onboarding-a.webp"
  "63a308c251ce5d7c5e7fc925_ppvp-3.webp|08-s01-guided-onboarding-b.webp"
  "63ab20610fc273d80c4cfdae_1%403x.webp|09-onboarding-screen-1.webp"
  "63ab2061caeb71e2635a8303_2%403x.webp|10-onboarding-screen-2.webp"
  "63ab2061ce1c7d0569dbf0d7_3%403x.webp|11-onboarding-screen-3.webp"
  "63b6f42f3ce0bd1e39c41268_2%402x.png|12-design-ref-2.png"
  "63a30d07a12984400950d72d_ppvp-4.webp|13-s01-navigating-opportunities.webp"
  "63ab207b268d187ee154b359_1%403x.webp|14-discovery-screen-1.webp"
  "63ab207bc7709425516f53d6_2%403x.webp|15-discovery-screen-2.webp"
  "63ab207b860562672245b165_3%403x.webp|16-discovery-screen-3.webp"
  "63ab207b8af6f9ca3be57920_4%403x.webp|17-discovery-screen-4.webp"
  "63b6effe4cd6e2168cb15185_CS-3.png|18-s01-deal-discovery-1.png"
  "63ac8fedeb51b082332a8d1b_ppvp-6.webp|19-s01-deal-discovery-2.webp"
  "63ab200cf3af990a706eb749_CS-5%403x.webp|20-s01-portfolio-1.webp"
  "63ab4d9e86056261a049f769_ppvp-7b.webp|21-s01-portfolio-2.webp"
  "63ab200bd827c5f20c31afb8_CS-7%403x.webp|22-s01-deal-info-1.webp"
  "63ab4d9ddd43e2498a494980_ppvp-8.webp|23-s01-deal-info-2.webp"
  "63ab200b41b0ca33f7de105c_CS-8%403x.webp|24-s01-deal-info-3.webp"
  "63ab4d9deb51b06e3a131dc6_ppvp-9.webp|25-s01-ui-extensibility-1.webp"
  "63ab200baf5e5b5cb8cefded_CS-9%403x.webp|26-s01-ui-extensibility-2.webp"
  "63b6f42f738b207597e50ea6_3%402x.png|27-design-ref-3.png"
  "63ab2312268d184cbf54fead_CS-10%403x.webp|28-s02-admin-intro.webp"
  "63ac8fed2b9e637711ba9117_ppvp-11.webp|29-s02-publishing-powerhouse-1.webp"
  "63ab200bc73ddfed3efeb3af_CS-11%403x.webp|30-s02-publishing-powerhouse-2.webp"
  "63ab4d9de7b2b866d77dbdc8_ppvp-12a.webp|31-s02-investor-profiles-1.webp"
  "63ab200be7b2b8fe5879ab51_CS-12%403x.webp|32-s02-investor-profiles-2.webp"
  "63ab4d9ceb96a7633b9ac0fa_ppvp-12b.webp|33-s02-investor-profiles-3.webp"
  "63ab200a05d2aad6a7959f19_CS-13%403x.webp|34-s02-all-access-view.webp"
  "63ab5531860562e0514aa721_Group%203132.webp|35-investor-profile-ui-1.webp"
  "63ab5531c73ddffde602c599_Group%203131.webp|36-investor-profile-ui-2.webp"
  "63ab5531acaa43659a3c7600_Group%203130.webp|37-investor-profile-ui-3.webp"
  "63ab5531785d7f1964fe133d_Group%203129.webp|38-investor-profile-ui-4.webp"
  "63ab5531fdf77fa2a4710f47_Group%203128.webp|39-investor-profile-ui-5.webp"
  "63ab208c9eac46b040dc4e6d_1%403x.webp|40-admin-panel-screen-1.webp"
  "63ab208bcaeb71a1595a8616_2%403x.webp|41-admin-panel-screen-2.webp"
  "63ab208b0fc273771a4d00a3_3%403x.webp|42-admin-panel-screen-3.webp"
  "63ac8fed306dff5e6c2aac40_ppvp-13.webp|43-s02-deal-management-1.webp"
  "63ab200cf0403bbcb48ed7fd_CS-14%403x.webp|44-s02-deal-management-2.webp"
  "63ab4d9c8605627bb549f73d_ppvp-14a.webp|45-s02-deal-management-3.webp"
  "63ab200bb59544282572ee9f_CS-15%403x.webp|46-s02-deal-management-4.webp"
  "63ab4d9edd43e291ed494989_ppvp-14b.webp|47-s02-deal-management-5.webp"
  "63ab200c505685a03aa368e8_CS-16%403x.webp|48-s02-deal-management-6.webp"
  "63b6f42f64146003dfddd124_4%402x.png|49-design-ref-4.png"
  "63ab25cc2e85b37ac6adb818_CS-17%403x.webp|50-s02-new-way-to-invest-1.webp"
  "63ac8feda2e57b72afbee06b_ppvp-16.webp|51-s02-new-way-to-invest-2.webp"
  "63ab26b5b595446c94737215_CS-18%403x.webp|52-s02-new-way-to-invest-3.webp"
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
