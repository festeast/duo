-- Аксессуарлар (сырға, көзілдірік, ұрт бояуы) дүкеннен алынды.
-- Сатып алынғандардың бағасы тиынмен қайтарылады, киіп жүргендері шешіледі.
-- Бір рет іске қосу жеткілікті (қайта іске қоссаң — қайтаратын ештеңе қалмайды).
with old(item, price) as (
  values ('ear-ring', 40), ('ear-pearl', 60), ('ear-star', 80), ('ear-ribbon', 50), ('ear-cuff', 90),
         ('monocle', 120), ('heart-glasses', 100), ('star-glasses', 150), ('eyepatch', 70),
         ('blush', 30), ('plaster', 30), ('star-paint', 50), ('heart-paint', 50)
),
refund as (
  select p.id, sum(o.price)::int as coins
  from profiles p join old o on o.item = any(p.owned)
  group by p.id
)
update profiles p
set coins = p.coins + r.coins,
    owned = array(select x from unnest(p.owned) x where x not in (select item from old))
from refund r
where r.id = p.id;

update profiles set cat = cat - 'ear' - 'face' - 'cheek' - 'head' - 'neck'
where cat ?| array['ear', 'face', 'cheek', 'head', 'neck'];
