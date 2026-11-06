-- Ескі дүкен заттары (бас киім, көзілдірік, мойын) алынып тасталды.
-- Сатып алынғандарының бағасы тиынмен қайтарылады, киіп жүргендері шешіледі.
-- Бір рет іске қосу жеткілікті (қайта іске қоссаң — қайтаратын ештеңе қалмайды).
with old(item, price) as (
  values ('bow', 30), ('flower', 40), ('tophat', 60), ('fez', 80), ('headphones', 90), ('crown', 200),
         ('glasses', 40), ('shades', 70), ('scarf', 40), ('bell', 50), ('bowtie', 60)
),
refund as (
  select p.id, coalesce(sum(o.price), 0)::int as coins
  from profiles p join old o on o.item = any(p.owned)
  group by p.id
)
update profiles p
set coins = p.coins + r.coins,
    owned = array(select x from unnest(p.owned) x where x not in (select item from old)),
    cat = p.cat - 'head' - 'neck' - 'face'
from refund r
where r.id = p.id;

-- Ескі заттарды сатып алмаған, бірақ киіп жүрген адамдар болса (болмауы керек) — шешеміз
update profiles set cat = cat - 'head' - 'neck' - 'face' where cat ? 'head' or cat ? 'neck';
