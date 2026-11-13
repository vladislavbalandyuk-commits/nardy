#!/usr/bin/env python3
# 0.64: static pages for search engines — "long nardy online", rules and the daily puzzle, in 5 languages.
# Run from the repo root: python3 tools/seo.py  → writes <lang>/…/index.html, sitemap.xml, robots.txt
import os, json, html
SITE='https://nardy-nine.vercel.app'
L={}
L['uk']=dict(name='Українська', app='uk', slugs=('', 'pravyla', 'zadacha-dnya'),
 nav=('Нарди онлайн','Правила','Задача дня'), play='Грати зараз', bot='Тренування з ботом', pz='Розв’язати задачу дня',
 t0='Довгі нарди онлайн — безкоштовно, з другом або з суперником', d0='Грайте в довгі нарди онлайн безкоштовно: з другом за посиланням, з випадковим суперником або з ботом. Рейтинг, турніри вихідного дня, задача дня. Без реєстрації й завантаження.',
 h0='Довгі нарди онлайн',
 p0=['Класичні довгі нарди просто в браузері — на телефоні й комп’ютері, без завантаження. Можна зіграти гостем одразу, а увійшовши через нік чи Telegram, зберегти монети, рейтинг і колекцію.',
     'Надішліть другу посилання — і ви за однією дошкою. Або натисніть «Грати»: знайдемо суперника вашого рівня. Хочете потренуватись — є боти від новачка до майстра, з підказкою тренера.',
     'Щотижня — турнір вихідного дня на 16 гравців, щодня — задача дня і подарунок. Сюжетна кампанія «Шлях нардиста» веде від лавки у дворі до Мармурової зали.'],
 f=[('Безкоштовно','Уся гра безкоштовна; монети заробляються в партіях і завданнях.'),('З другом','Посилання або QR-код — і партія почалась.'),('Рейтинг і ранги','Від Бронзи до Діаманта, калібрування за 10 ігор.'),('Telegram','Грайте прямо в Telegram через бота.')],
 t1='Правила довгих нард — коротко і зрозуміло', d1='Правила довгих нард: розстановка, як ходять шашки, голова, дублі, заборона шести поспіль, виведення і марс. З прикладами для новачків.',
 h1='Правила довгих нард',
 rules=['У кожного 15 шашок на «голові». Обидва рухаються в один бік, голови — навпроти.','Бити не можна. Не можна ставати на пункт суперника.','З голови — одна шашка за хід. На першому ході з дублем 6-6, 4-4 чи 3-3 — дві.','Дубль грається чотири рази. Треба зіграти обидва кубики; якщо підходить лише один — більший.','Не можна ставити 6 шашок поспіль, якщо попереду немає жодної шашки суперника.','Викидати можна, коли всі 15 у домі. Перемога, поки суперник нічого не викинув, — «марс», 2 очки.'],
 terms=[('Голова','пункт 24, з якого стартують усі ваші шашки.'),('Дім','останні шість пунктів (1–6); звідси шашки виносять з дошки.'),('Марс','перемога, коли суперник не виніс жодної шашки — 2 очки.')],
 faq=[('Чим довгі нарди відрізняються від коротких?','У довгих нардах шашки не б’ють: обидва гравці рухаються в один бік, а всі шашки стартують з голови.'),('Скільки триває партія?','Зазвичай 10–20 хвилин; бліц з 10 секундами на хід — ще швидше.')],
 t2='Задача дня з довгих нард — знайдіть найкращий хід', d2='Щодня нова позиція з довгих нард: киньте кубики і знайдіть найкращий хід. До +60 монет, серія днів і підказки — безкоштовно онлайн.',
 h2='Задача дня',
 p2=['Щодня о півночі з’являється нова позиція. Ви бачите розстановку, кидаєте кубики і шукаєте хід, який зіграв би сильний гравець.','За найкращий хід — до +60 монет, за хороший — менше. Розв’язуйте щодня, щоб тримати серію. Не вийшло — покажемо найкращий хід і пояснимо.'],
 rt='Правила', tt='Терміни', fq='Питання', hreflang='uk')
L['ru']=dict(name='Русский', app='ru', slugs=('', 'pravila', 'zadacha-dnya'),
 nav=('Нарды онлайн','Правила','Задача дня'), play='Играть сейчас', bot='Тренировка с ботом', pz='Решить задачу дня',
 t0='Длинные нарды онлайн — бесплатно, с другом или с соперником', d0='Играйте в длинные нарды онлайн бесплатно: с другом по ссылке, со случайным соперником или с ботом. Рейтинг, турниры выходного дня, задача дня. Без регистрации и скачивания.',
 h0='Длинные нарды онлайн',
 p0=['Классические длинные нарды прямо в браузере — на телефоне и компьютере, без скачивания. Можно сыграть гостем сразу, а войдя через ник или Telegram, сохранить монеты, рейтинг и коллекцию.',
     'Отправьте другу ссылку — и вы за одной доской. Или нажмите «Играть»: найдём соперника вашего уровня. Хотите потренироваться — есть боты от новичка до мастера, с подсказкой тренера.',
     'Каждую неделю — турнир выходного дня на 16 игроков, каждый день — задача дня и подарок. Сюжетная кампания «Путь нардиста» ведёт от скамейки во дворе до Мраморного зала.'],
 f=[('Бесплатно','Вся игра бесплатна; монеты зарабатываются в партиях и заданиях.'),('С другом','Ссылка или QR-код — и партия началась.'),('Рейтинг и ранги','От Бронзы до Бриллианта, калибровка за 10 игр.'),('Telegram','Играйте прямо в Telegram через бота.')],
 t1='Правила длинных нард — коротко и понятно', d1='Правила длинных нард: расстановка, как ходят шашки, голова, дубли, запрет шести подряд, вынос и марс. С примерами для новичков.',
 h1='Правила длинных нард',
 rules=['У каждого 15 шашек на «голове». Оба движутся в одну сторону, головы — напротив.','Бить нельзя. Нельзя становиться на пункт соперника.','С головы — одна шашка за ход. На первом ходу с дублем 6-6, 4-4 или 3-3 — две.','Дубль играется четыре раза. Нужно сыграть оба кубика; если подходит только один — больший.','Нельзя ставить 6 шашек подряд, если впереди нет ни одной шашки соперника.','Выбрасывать можно, когда все 15 в доме. Победа, пока соперник ничего не выбросил, — «марс», 2 очка.'],
 terms=[('Голова','пункт 24, с которого стартуют все ваши шашки.'),('Дом','последние шесть пунктов (1–6); отсюда шашки выносят с доски.'),('Марс','победа, когда соперник не вынес ни одной шашки — 2 очка.')],
 faq=[('Чем длинные нарды отличаются от коротких?','В длинных нардах шашки не бьют: оба игрока движутся в одну сторону, а все шашки стартуют с головы.'),('Сколько длится партия?','Обычно 10–20 минут; блиц с 10 секундами на ход — ещё быстрее.')],
 t2='Задача дня по длинным нардам — найдите лучший ход', d2='Каждый день новая позиция в длинных нардах: бросьте кубики и найдите лучший ход. До +60 монет, серия дней и подсказки — бесплатно онлайн.',
 h2='Задача дня',
 p2=['Каждый день в полночь появляется новая позиция. Вы видите расстановку, бросаете кубики и ищете ход, который сыграл бы сильный игрок.','За лучший ход — до +60 монет, за хороший — меньше. Решайте каждый день, чтобы держать серию. Не получилось — покажем лучший ход.'],
 rt='Правила', tt='Термины', fq='Вопросы', hreflang='ru')
L['en']=dict(name='English', app='en', slugs=('', 'rules', 'daily-puzzle'),
 nav=('Nardy online','Rules','Daily puzzle'), play='Play now', bot='Practice with a bot', pz='Solve today’s puzzle',
 t0='Long nardy online — free, with a friend or a random opponent', d0='Play long nardy (long backgammon) online for free: with a friend by link, a random opponent or a bot. Ratings, weekend tournaments, a daily puzzle. No sign-up or download needed.',
 h0='Long nardy online',
 p0=['Classic long nardy right in your browser — on phone or computer, nothing to install. Play as a guest straight away, or sign in with a nickname or Telegram to keep your coins, rating and collection.',
     'Send a friend a link and you are at the same board. Or press Play and we find an opponent at your level. Want to practise? Bots from beginner to master, with a coach hint.',
     'Every week there is a 16-player weekend tournament; every day a puzzle and a gift. The story campaign “The Nardy Road” takes you from a yard bench to the Marble Hall.'],
 f=[('Free','The whole game is free; coins are earned in games and quests.'),('With a friend','A link or a QR code and the game is on.'),('Ratings and ranks','From Bronze to Diamond, calibrated over 10 games.'),('Telegram','Play right inside Telegram via the bot.')],
 t1='Long nardy rules — short and clear', d1='Rules of long nardy (long backgammon): setup, how checkers move, the head, doubles, the six-in-a-row ban, bearing off and mars. With beginner examples.',
 h1='Long nardy rules',
 rules=['Each player has 15 checkers on the “head”. Both move the same way round; the heads are opposite.','No hitting. You cannot land on a point your opponent holds.','One checker leaves the head per turn. On the first roll with 6-6, 4-4 or 3-3 — two.','A double is played four times. You must use both dice; if only one fits, use the larger.','You cannot build 6 points in a row unless at least one opposing checker is ahead of them.','Bear off once all 15 are home. Winning before the opponent bears off any — “mars”, 2 points.'],
 terms=[('Head','point 24, where all your checkers start.'),('Home','the last six points (1–6); checkers are borne off from here.'),('Mars','a win when the opponent has borne off nothing — 2 points.')],
 faq=[('How is long nardy different from backgammon?','There is no hitting: both players move in the same direction and all checkers start from the head.'),('How long is a game?','Usually 10–20 minutes; blitz with 10 seconds per move is faster.')],
 t2='Long nardy daily puzzle — find the best move', d2='A new long nardy position every day: roll the dice and find the best move. Up to +60 coins, a day streak and hints — free online.',
 h2='Daily puzzle',
 p2=['A new position appears every day at midnight. You see the setup, roll the dice and look for the move a strong player would make.','The best move earns up to +60 coins, a good one a little less. Solve daily to keep your streak. Missed it? We show the best move.'],
 rt='Rules', tt='Terms', fq='Questions', hreflang='en')
L['ka']=dict(name='ქართული', app='en', slugs=('', 'rules', 'puzzle'),
 nav=('ნარდი ონლაინ','წესები','დღის ამოცანა'), play='ითამაშე ახლა', bot='ვარჯიში ბოტთან', pz='ამოხსენი დღის ამოცანა',
 t0='გრძელი ნარდი ონლაინ — უფასოდ, მეგობართან ან მოწინააღმდეგესთან', d0='ითამაშე გრძელი ნარდი ონლაინ უფასოდ: მეგობართან ბმულით, შემთხვევით მოწინააღმდეგესთან ან ბოტთან. რეიტინგი, შაბათ-კვირის ტურნირები, დღის ამოცანა. რეგისტრაციისა და ჩამოტვირთვის გარეშე.',
 h0='გრძელი ნარდი ონლაინ',
 p0=['კლასიკური გრძელი ნარდი პირდაპირ ბრაუზერში — ტელეფონზე და კომპიუტერზე, ჩამოტვირთვის გარეშე. შეგიძლია მაშინვე სტუმრად ითამაშო, ან შეხვიდე ნიკით ან Telegram-ით და შეინახო მონეტები, რეიტინგი და კოლექცია.',
     'გაუგზავნე მეგობარს ბმული — და ერთ დაფასთან ხართ. ან დააჭირე „თამაში“: ვიპოვით შენი დონის მოწინააღმდეგეს. ვარჯიშისთვის არის ბოტები დამწყებიდან ოსტატამდე, მწვრთნელის მინიშნებით.',
     'ყოველ კვირას — შაბათ-კვირის ტურნირი 16 მოთამაშისთვის, ყოველდღე — დღის ამოცანა და საჩუქარი.'],
 f=[('უფასოდ','მთელი თამაში უფასოა; მონეტებს თამაშებში და დავალებებში იღებ.'),('მეგობართან','ბმული ან QR-კოდი — და პარტია დაიწყო.'),('რეიტინგი და რანგები','ბრინჯაოდან ბრილიანტამდე.'),('Telegram','ითამაშე პირდაპირ Telegram-ში ბოტის მეშვეობით.')],
 t1='გრძელი ნარდის წესები — მოკლედ და გასაგებად', d1='გრძელი ნარდის წესები: განლაგება, როგორ მოძრაობენ ქვები, „თავი“, დუბლები, ექვსი ზედიზედ აკრძალვა, გატანა და მარსი.',
 h1='გრძელი ნარდის წესები',
 rules=['თითოეულს აქვს 15 ქვა „თავზე“. ორივე ერთი მიმართულებით მოძრაობს, თავები ერთმანეთის პირისპირაა.','ცემა არ შეიძლება. მოწინააღმდეგის პუნქტზე დადგომა არ შეიძლება.','თავიდან — ერთი ქვა ერთ სვლაზე. პირველ სვლაზე 6-6, 4-4 ან 3-3 დუბლით — ორი.','დუბლი ოთხჯერ თამაშდება. ორივე კამათელი უნდა ითამაშო; თუ მხოლოდ ერთი ჯდება — უფრო დიდი.','არ შეიძლება 6 ქვის ზედიზედ დაყენება, თუ მათ წინ მოწინააღმდეგის არც ერთი ქვა არ არის.','გატანა შეიძლება, როცა 15-ივე სახლშია. მოგება, სანამ მოწინააღმდეგეს არაფერი გაუტანია — „მარსი“, 2 ქულა.'],
 terms=[('თავი','24-ე პუნქტი, საიდანაც ყველა შენი ქვა იწყებს.'),('სახლი','ბოლო ექვსი პუნქტი (1–6); აქედან გააქვთ ქვები დაფიდან.'),('მარსი','მოგება, როცა მოწინააღმდეგეს არც ერთი ქვა არ გაუტანია — 2 ქულა.')],
 faq=[('რით განსხვავდება გრძელი ნარდი მოკლისგან?','გრძელ ნარდში ქვებს არ სცემენ: ორივე მოთამაშე ერთი მიმართულებით მოძრაობს და ყველა ქვა თავიდან იწყებს.'),('რამდენ ხანს გრძელდება პარტია?','ჩვეულებრივ 10–20 წუთი.')],
 t2='გრძელი ნარდის დღის ამოცანა — იპოვე საუკეთესო სვლა', d2='ყოველდღე ახალი პოზიცია გრძელ ნარდში: გააგორე კამათლები და იპოვე საუკეთესო სვლა. +60 მონეტამდე — უფასოდ ონლაინ.',
 h2='დღის ამოცანა',
 p2=['ყოველ შუაღამეს ჩნდება ახალი პოზიცია. ხედავ განლაგებას, აგორებ კამათლებს და ეძებ სვლას, რომელსაც ძლიერი მოთამაშე ითამაშებდა.','საუკეთესო სვლისთვის — +60 მონეტამდე. ამოხსენი ყოველდღე, რომ სერია შეინარჩუნო.'],
 rt='წესები', tt='ტერმინები', fq='კითხვები', hreflang='ka')
L['hy']=dict(name='Հայերեն', app='en', slugs=('', 'rules', 'puzzle'),
 nav=('Նարդի առցանց','Կանոններ','Օրվա խնդիր'), play='Խաղալ հիմա', bot='Մարզում բոտի հետ', pz='Լուծել օրվա խնդիրը',
 t0='Երկար նարդի առցանց — անվճար, ընկերոջ կամ մրցակցի հետ', d0='Խաղացեք երկար նարդի առցանց անվճար՝ ընկերոջ հետ հղումով, պատահական մրցակցի կամ բոտի հետ։ Վարկանիշ, հանգստյան օրերի մրցաշարեր, օրվա խնդիր։ Առանց գրանցման և ներբեռնման։',
 h0='Երկար նարդի առցանց',
 p0=['Դասական երկար նարդի անմիջապես բրաուզերում՝ հեռախոսում և համակարգչում, առանց ներբեռնման։ Կարող եք անմիջապես խաղալ որպես հյուր, կամ մուտք գործել մականունով կամ Telegram-ով և պահպանել մետաղադրամները, վարկանիշը և հավաքածուն։',
     'Ուղարկեք ընկերոջը հղում, և դուք նույն տախտակի մոտ եք։ Կամ սեղմեք «Խաղալ»՝ կգտնենք ձեր մակարդակի մրցակից։ Մարզվելու համար կան բոտեր՝ սկսնակից մինչև վարպետ, մարզչի հուշումով։',
     'Ամեն շաբաթ՝ հանգստյան օրերի մրցաշար 16 խաղացողի համար, ամեն օր՝ օրվա խնդիր և նվեր։'],
 f=[('Անվճար','Ամբողջ խաղն անվճար է․ մետաղադրամները վաստակվում են խաղերում և առաջադրանքներում։'),('Ընկերոջ հետ','Հղում կամ QR-կոդ, և պարտիան սկսված է։'),('Վարկանիշ և աստիճաններ','Բրոնզից մինչև Ադամանդ։'),('Telegram','Խաղացեք անմիջապես Telegram-ում բոտի միջոցով։')],
 t1='Երկար նարդու կանոնները՝ կարճ և հասկանալի', d1='Երկար նարդու կանոնները՝ դասավորություն, ինչպես են շարժվում քարերը, «գլուխը», դուբլները, վեց անընդմեջ արգելքը, դուրս բերելը և մարսը։',
 h1='Երկար նարդու կանոնները',
 rules=['Յուրաքանչյուրն ունի 15 քար «գլխի» վրա։ Երկուսն էլ շարժվում են նույն ուղղությամբ, գլուխները դեմ առ դեմ են։','Խփել չի կարելի։ Չի կարելի կանգնել մրցակցի կետի վրա։','Գլխից՝ մեկ քար մեկ քայլում։ Առաջին քայլում 6-6, 4-4 կամ 3-3 դուբլով՝ երկու։','Դուբլը խաղացվում է չորս անգամ։ Պետք է խաղալ երկու զառերն էլ․ եթե միայն մեկն է հարմար՝ ավելի մեծը։','Չի կարելի 6 քար անընդմեջ դնել, եթե դրանց առջևում մրցակցի ոչ մի քար չկա։','Դուրս բերել կարելի է, երբ բոլոր 15-ը տանն են։ Հաղթանակը, երբ մրցակիցը ոչինչ դուրս չի բերել՝ «մարս», 2 միավոր։'],
 terms=[('Գլուխ','24-րդ կետը, որտեղից սկսում են ձեր բոլոր քարերը։'),('Տուն','վերջին վեց կետերը (1–6)․ այստեղից քարերը դուրս են բերվում տախտակից։'),('Մարս','հաղթանակ, երբ մրցակիցը ոչ մի քար դուրս չի բերել՝ 2 միավոր։')],
 faq=[('Ինչով է երկար նարդին տարբերվում կարճից։','Երկար նարդիում քարերը չեն խփվում․ երկու խաղացողն էլ շարժվում են նույն ուղղությամբ, և բոլոր քարերը սկսում են գլխից։'),('Որքա՞ն է տևում պարտիան։','Սովորաբար 10–20 րոպե։')],
 t2='Երկար նարդու օրվա խնդիր՝ գտեք լավագույն քայլը', d2='Ամեն օր նոր դիրք երկար նարդիում․ գցեք զառերը և գտեք լավագույն քայլը։ Մինչև +60 մետաղադրամ՝ անվճար առցանց։',
 h2='Օրվա խնդիր',
 p2=['Ամեն կեսգիշերին հայտնվում է նոր դիրք։ Տեսնում եք դասավորությունը, գցում զառերը և փնտրում այն քայլը, որը կխաղար ուժեղ խաղացողը։','Լավագույն քայլի համար՝ մինչև +60 մետաղադրամ։ Լուծեք ամեն օր՝ շարքը պահպանելու համար։'],
 rt='Կանոններ', tt='Տերմիններ', fq='Հարցեր', hreflang='hy')

def url(lg,i):
    sl=L[lg]['slugs'][i]; return f'/{lg}/'+(sl+'/' if sl else '')
CSS="""*{box-sizing:border-box}body{margin:0;background:#0d0e11;color:#eae7f2;font:17px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
a{color:#b9a8ff}.w{max-width:760px;margin:0 auto;padding:20px 18px 60px}header{display:flex;flex-wrap:wrap;gap:10px 18px;align-items:center;margin-bottom:28px}
.brand{font-weight:700;font-size:20px;color:#fff;text-decoration:none;margin-right:auto}nav{display:flex;flex-wrap:wrap;gap:6px 16px}nav a{color:#c9c3d8;text-decoration:none;font-size:15px}nav a.on{color:#fff;text-decoration:underline;text-underline-offset:5px}
h1{font-size:34px;line-height:1.2;margin:8px 0 16px}h2{font-size:22px;margin:34px 0 10px}.cta{display:flex;flex-wrap:wrap;gap:10px;margin:22px 0}
.btn{display:inline-block;padding:13px 22px;border-radius:14px;background:#f2ece2;color:#14121a;font-weight:700;text-decoration:none}.btn.s{background:#232230;color:#eae7f2;border:1px solid #34324a}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px}.card{background:#17171f;border:1px solid #272636;border-radius:14px;padding:14px}.card b{display:block;color:#fff;margin-bottom:4px}
ol li{margin:8px 0}dt{font-weight:700;color:#fff;margin-top:10px}dd{margin:2px 0 0}.langs{margin-top:40px;font-size:14px;color:#8d88a0}.langs a{margin-right:12px}
img.shot{width:100%;border-radius:16px;border:1px solid #272636;margin:10px 0}"""
def page(lg,i):
    c=L[lg]; e=html.escape; title=[c['t0'],c['t1'],c['t2']][i]; desc=[c['d0'],c['d1'],c['d2']][i]; h1=[c['h0'],c['h1'],c['h2']][i]
    q='?lang='+c['app'] if lg in ('uk','ru','en') else ''
    play=f'/{q}'; bot=f'/?go=bot'+('&lang='+c['app'] if q else ''); pz=f'/?go=pz'+('&lang='+c['app'] if q else '')
    alt=''.join(f'<link rel="alternate" hreflang="{L[o]["hreflang"]}" href="{SITE}{url(o,i)}">' for o in L)+f'<link rel="alternate" hreflang="x-default" href="{SITE}{url("en",i)}">'
    nav=''.join(f'<a href="{url(lg,j)}"{" class=on" if j==i else ""}>{e(c["nav"][j])}</a>' for j in range(3))
    body=f'<h1>{e(h1)}</h1>'
    ld={"@context":"https://schema.org"}
    if i==0:
        body+=''.join(f'<p>{e(x)}</p>' for x in c['p0'][:1])+f'<div class="cta"><a class="btn" href="{play}">{e(c["play"])}</a><a class="btn s" href="{bot}">{e(c["bot"])}</a></div>'
        body+=f'<img class="shot" src="/shots/game.webp" alt="{e(h1)}" width="540" height="1170" loading="lazy" style="max-width:300px;display:block">'
        body+=''.join(f'<p>{e(x)}</p>' for x in c['p0'][1:])+'<div class="grid">'+''.join(f'<div class="card"><b>{e(a)}</b>{e(b)}</div>' for a,b in c['f'])+'</div>'
        ld.update({"@type":"VideoGame","name":h1,"url":SITE+url(lg,0),"description":desc,"inLanguage":lg,"genre":"Board game","gamePlatform":"Web browser","applicationCategory":"Game","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}})
    elif i==1:
        body+=f'<h2>{e(c["rt"])}</h2><ol>'+''.join(f'<li>{e(x)}</li>' for x in c['rules'])+'</ol>'
        body+=f'<h2>{e(c["tt"])}</h2><dl>'+''.join(f'<dt>{e(a)}</dt><dd>{e(b)}</dd>' for a,b in c['terms'])+'</dl>'
        body+=f'<h2>{e(c["fq"])}</h2><dl>'+''.join(f'<dt>{e(a)}</dt><dd>{e(b)}</dd>' for a,b in c['faq'])+'</dl>'
        body+=f'<div class="cta"><a class="btn" href="{bot}">{e(c["bot"])}</a><a class="btn s" href="{play}">{e(c["play"])}</a></div>'
        ld.update({"@type":"FAQPage","mainEntity":[{"@type":"Question","name":a,"acceptedAnswer":{"@type":"Answer","text":b}} for a,b in c['faq']]})
    else:
        body+=''.join(f'<p>{e(x)}</p>' for x in c['p2'])+f'<div class="cta"><a class="btn" href="{pz}">{e(c["pz"])}</a><a class="btn s" href="{url(lg,1)}">{e(c["nav"][1])}</a></div>'
        ld.update({"@type":"WebPage","name":title,"description":desc,"inLanguage":lg})
    langs='<div class="langs">'+''.join(f'<a href="{url(o,i)}" hreflang="{o}">{e(L[o]["name"])}</a>' for o in L)+'</div>'
    return f'''<!DOCTYPE html><html lang="{lg}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(title)}</title><meta name="description" content="{e(desc)}"><link rel="canonical" href="{SITE}{url(lg,i)}">{alt}
<meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(desc)}"><meta property="og:image" content="{SITE}/og.png"><meta property="og:url" content="{SITE}{url(lg,i)}">
<meta name="theme-color" content="#0d0e11"><link rel="icon" href="/favicon.svg"><style>{CSS}</style>
<script type="application/ld+json">{json.dumps(ld,ensure_ascii=False)}</script></head>
<body><div class="w"><header><a class="brand" href="{play}">нарди · nardy</a><nav>{nav}</nav></header>{body}{langs}</div></body></html>'''
urls=['/']
for lg in L:
    for i in range(3):
        u=url(lg,i); d='.'+u; os.makedirs(d,exist_ok=True); open(d+'index.html','w').write(page(lg,i)); urls.append(u)
open('sitemap.xml','w').write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+''.join(f'<url><loc>{SITE}{u}</loc></url>\n' for u in urls)+'</urlset>\n')
open('robots.txt','w').write(f'User-agent: *\nAllow: /\nDisallow: /beta/\nSitemap: {SITE}/sitemap.xml\n')
print(len(urls),'urls')
