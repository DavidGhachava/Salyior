import { Link } from '../lib/Link'
import { useParams } from '../lib/router'
import { Process, RevealObserver } from '../components/HomeSections'
import { ProjectApplication } from '../components/ProjectApplication'
import { ProjectVisual } from '../components/ProjectVisual'
import { ButtonLink, Container, Icon, SectionLabel } from '../components/Primitives'
import { projects } from '../data/site'
import { type Language, useI18n } from '../i18n/I18nProvider'

function PageHero({ label, title, copy }: { label: string; title: string; copy: string }) {
  return <section className="page-hero"><Container><SectionLabel>{label}</SectionLabel><h1>{title}</h1><p>{copy}</p></Container></section>
}

const projectEvidence: Record<string, { label: string; value: string }[]> = {
  'arqi-georgia': [
    { label: 'Experience', value: 'Multi-page property platform' },
    { label: 'Customer path', value: 'Collection → private search → enquiry' },
    { label: 'Built around', value: 'Rare, high-consideration property' },
  ],
  'arrive-city-guides': [
    { label: 'Initial reach', value: 'Ljubljana · Vienna · Zagreb' },
    { label: 'Product model', value: 'Searchable and saveable city guides' },
    { label: 'Foundation', value: 'Structured to grow into a PWA' },
  ],
  'kristina-languages': [
    { label: 'Audience', value: 'Russian-speaking local learners' },
    { label: 'Foundation', value: 'Local SEO · Installable PWA' },
    { label: 'Action paths', value: 'WhatsApp · Qualified application' },
  ],
}

export function WorkPage() {
  const { t } = useI18n()
  return <main><RevealObserver /><PageHero label={t('Selected work')} title={t('Proof should be visible.')} copy={t('A growing collection of real and exploratory work, presented honestly and explained through the decisions behind it.')} /><section className="work-index"><Container>{projects.map((project) => <article className="work-index__item reveal" key={project.slug}><Link to={`/work/${project.slug}`}><div><ProjectVisual type={project.visual} /></div><header><span>{project.number} · {t(project.type)}</span><h2>{project.title}</h2><p>{t(project.summary)}</p><i>{t('View project')} <Icon name="arrow-up-right" /></i></header></Link></article>)}</Container></section></main>
}

export function ProjectPage() {
  const { slug } = useParams()
  const { t } = useI18n()
  const project = projects.find((item) => item.slug === slug)
  if (!project) return <NotFoundPage />
  const projectIndex = projects.findIndex((item) => item.slug === project.slug)
  const nextProject = projects[(projectIndex + 1) % projects.length]
  return (
    <main>
      <section className={`project-page project-page--${project.visual}`}>
        <Container>
          <Link className="back-link" to="/work">← {t('All work')}</Link>
          <div className="project-page__heading">
            <div><SectionLabel>{t(project.type)}</SectionLabel><h1>{project.title}</h1></div>
            <div><p>{t(project.industry)}</p><p>{t(project.commercialGoal)}</p></div>
          </div>
          <div className="project-page__visual"><ProjectVisual type={project.visual} hero /></div>

          <div className="project-evidence" aria-label="Project facts">
            {projectEvidence[project.slug].map((fact, index) => <div key={fact.label}><span>0{index + 1} · {t(fact.label)}</span><strong>{t(fact.value)}</strong></div>)}
          </div>

          <section className="project-story" aria-labelledby="project-story-title">
            <header>
              <SectionLabel>{t('From friction to action')}</SectionLabel>
              <h2 id="project-story-title">{t('The thinking behind the interface.')}</h2>
              <p>{t('Every visual decision is tied to what the customer needs to understand, trust or do next.')}</p>
            </header>
            <div className="project-story__steps">
              <article><span>01 · {t('The friction')}</span><h3>{t('What stood in the way.')}</h3><p>{t(project.problem)}</p></article>
              <article><span>02 · {t('The decision')}</span><h3>{t('How the experience responds.')}</h3><p>{t(project.solution)}</p></article>
              <article><span>03 · {t('The outcome')}</span><h3>{t('What now exists.')}</h3><p>{t(project.result)}</p></article>
            </div>
          </section>

          <div className="project-delivery">
            <div><span>{t('Commercial objective')}</span><h2>{t(project.commercialGoal)}</h2></div>
            <div><span>{t('Delivered through')}</span><ul>{project.services.map((service) => <li key={service}>{t(service)}</li>)}</ul><ButtonLink href={project.url} variant="secondary" target="_blank" rel="noreferrer">{t('Experience the live website')}</ButtonLink></div>
          </div>

          <div className="next-project">
            <div><span>{t('Next project')}</span><Link to={`/work/${nextProject.slug}`}>{nextProject.title} <Icon name="arrow-up-right" /></Link></div>
            <ButtonLink href="/contact">{t('Build your advantage')}</ButtonLink>
          </div>
        </Container>
      </section>
    </main>
  )
}

export function ServicesPage() {
  const { t } = useI18n()
  const services = [
    ['01', 'Conversion direction', 'Clarify the audience, offer, content hierarchy and most valuable next action before deciding how the site should look.'],
    ['02', 'Web design', 'Create a custom responsive interface with an editorial visual system suited to the business and its customers.'],
    ['03', 'Frontend development', 'Build a fast, accessible and maintainable website that behaves properly across devices and input methods.'],
    ['04', 'Technical SEO', 'Establish semantic structure, metadata, crawlability, performance and measurement without making ranking guarantees.'],
    ['05', 'Business integrations', 'Connect practical systems such as analytics, forms, booking, filtering, payments or content management where needed.'],
    ['06', 'Advanced website capabilities', 'Larger builds can include an installable app experience, offline access and opt-in notifications when repeat customer use makes them commercially useful.'],
  ]
  return <main><RevealObserver /><PageHero label={t('Capabilities')} title={t('The complete path from discovery to action.')} copy={t('SALYIOR combines commercial direction, interface design and technical execution in one focused engagement.')} /><section className="services-page"><Container><div className="services-page__list">{services.map(([number, title, copy]) => <article className="reveal" key={number}><span>{number}</span><h2>{t(title)}</h2><p>{t(copy)}</p></article>)}</div><div className="services-cta reveal"><h2>{t('The scope should fit the objective.')}</h2><p>{t('Projects begin at $500. You’ll receive a recommendation based on what the business actually needs—not a longer feature list.')}</p><ButtonLink href="/contact">{t('Start a conversation')}</ButtonLink></div></Container></section></main>
}

export function ProcessPage() {
  const { t } = useI18n()
  return <main><RevealObserver /><PageHero label={t('How projects move')} title={t('Clarity at every approval point.')} copy={t('The process is designed to keep decisions visible, feedback useful and progress easy to understand.')} /><Process /><section className="simple-cta"><Container><h2>{t('Ready to define the first step?')}</h2><ButtonLink href="/contact">{t('Tell us about the project')}</ButtonLink></Container></section></main>
}

export function ContactPage() {
  return <main className="contact-page"><RevealObserver /><ProjectApplication compact /></main>
}

type LegalType = 'privacy' | 'terms' | 'cookies'
type LegalSection = { title: string; body: string }

const legalContent: Record<Language, Record<LegalType, LegalSection[]>> = {
  en: {
    privacy: [
      { title: 'Information we collect', body: 'When you submit a project inquiry, SALYIOR receives the information you provide, including your name, email address, business details, website, budget range, project requirements and selected functionality. Basic technical information may also be processed to deliver the website, protect the form from abuse and diagnose errors.' },
      { title: 'How we use information', body: 'Inquiry information is used to review your request, reply to you, prepare a proposal, take steps toward a possible agreement and maintain necessary business records. SALYIOR does not sell personal information or add inquiry details to unrelated marketing lists.' },
      { title: 'Services involved', body: 'The website is hosted through Netlify. Project inquiries may be processed through Netlify Functions, Resend and Gmail so they can be delivered and answered. These providers may process limited information under their own security and privacy terms, including across international infrastructure.' },
      { title: 'Retention', body: 'Inquiry information is retained only for as long as reasonably needed to respond, evaluate a potential project and maintain appropriate business records. Information connected to an active or completed project may be kept longer where required for contractual, tax, security or legal purposes.' },
      { title: 'Your choices and rights', body: 'Depending on the law that applies to you, you may request access to, correction of or deletion of your personal information, or object to certain processing. Requests can be sent to the contact address below. SALYIOR may need to verify the requester before acting.' },
      { title: 'Children', body: 'This website and its project inquiry form are intended for businesses and adults and are not directed to children.' },
      { title: 'Contact', body: 'Privacy questions and requests can be sent to salyiorbusiness@gmail.com.' },
    ],
    terms: [
      { title: 'Website information', body: 'This website provides general information about SALYIOR and its services. Content may be updated, corrected or removed without notice. A project begins only after both parties agree to a written proposal or agreement.' },
      { title: 'Project scope and payment', body: 'Deliverables, revision rounds, responsibilities, timing, payment stages and third-party costs are defined in the applicable project proposal or agreement. Displayed starting prices are illustrative and are not fixed quotations for every project.' },
      { title: 'Client responsibilities', body: 'Clients are responsible for supplying accurate information, timely feedback and any content, images, trademarks or other materials required for the project. Clients must have the right to use the materials they provide.' },
      { title: 'Intellectual property', body: 'Ownership and licensing terms for paid project deliverables are defined in the applicable agreement. Third-party software, fonts, services and media remain subject to their own licences and terms.' },
      { title: 'External services', body: 'Websites may link to or integrate with third-party platforms. SALYIOR does not control the availability, security, pricing or policies of those independent services.' },
      { title: 'Availability and liability', body: 'SALYIOR aims to keep this website accurate and available but does not guarantee uninterrupted or error-free operation. To the extent permitted by applicable law, SALYIOR is not responsible for losses caused solely by reliance on general website information or independent third-party services.' },
      { title: 'Contact', body: 'Questions about these terms can be sent to salyiorbusiness@gmail.com. Project-specific agreements take priority over these general website terms where they differ.' },
    ],
    cookies: [
      { title: 'No advertising or analytics cookies', body: 'SALYIOR does not currently use advertising cookies, behavioural tracking pixels or non-essential analytics cookies on this website. Because those technologies are not active, the website does not show a cookie-consent banner.' },
      { title: 'Language preference', body: 'When you manually choose a language, the selection is saved in your browser’s local storage so the website can remember it on your next visit. This is a functional preference, is not used to track you across websites and can be removed by clearing this site’s browser data.' },
      { title: 'Technical delivery', body: 'The hosting platform may process routine technical requests and security logs required to deliver and protect the website. SALYIOR does not use that information for advertising profiles.' },
      { title: 'Future changes', body: 'If optional analytics, advertising or other non-essential tracking is introduced later, this notice will be updated and an appropriate consent control will be added before those technologies are activated where required.' },
      { title: 'Contact', body: 'Questions about website storage or tracking can be sent to salyiorbusiness@gmail.com.' },
    ],
  },
  ka: {
    privacy: [
      { title: 'რა ინფორმაციას ვაგროვებთ', body: 'პროექტის მოთხოვნის გაგზავნისას SALYIOR იღებს თქვენს მიერ მითითებულ ინფორმაციას: სახელს, ელფოსტას, ბიზნესის დეტალებს, ვებსაიტს, ბიუჯეტის დიაპაზონს, პროექტის მოთხოვნებსა და არჩეულ ფუნქციონალს. ვებსაიტის მიწოდების, ფორმის ბოროტად გამოყენებისგან დაცვისა და შეცდომების აღმოჩენის მიზნით შესაძლოა დამუშავდეს საბაზისო ტექნიკური ინფორმაციაც.' },
      { title: 'როგორ ვიყენებთ ინფორმაციას', body: 'მოთხოვნის ინფორმაცია გამოიყენება თქვენი პროექტის განსახილველად, პასუხისთვის, შეთავაზების მოსამზადებლად, შესაძლო შეთანხმებისკენ ნაბიჯების გადასადგმელად და აუცილებელი ბიზნეს ჩანაწერების შესანახად. SALYIOR არ ყიდის პერსონალურ ინფორმაციას და მოთხოვნის დეტალებს არ ამატებს დაუკავშირებელ სარეკლამო სიებში.' },
      { title: 'ჩართული სერვისები', body: 'ვებსაიტი განთავსებულია Netlify-ზე. პროექტის მოთხოვნები შესაძლოა დამუშავდეს Netlify Functions-ის, Resend-ისა და Gmail-ის მეშვეობით, რათა წერილი მიღებული და დამუშავებული იყოს. ეს სერვისები შეზღუდულ ინფორმაციას საკუთარი უსაფრთხოებისა და კონფიდენციალურობის პირობებით ამუშავებენ, მათ შორის საერთაშორისო ინფრასტრუქტურაში.' },
      { title: 'შენახვის ვადა', body: 'მოთხოვნის ინფორმაცია ინახება მხოლოდ იმდენ ხანს, რამდენიც გონივრულად საჭიროა პასუხისთვის, შესაძლო პროექტის შესაფასებლად და შესაბამისი ბიზნეს ჩანაწერებისთვის. აქტიურ ან დასრულებულ პროექტთან დაკავშირებული ინფორმაცია შეიძლება უფრო დიდხანს ინახებოდეს სახელშეკრულებო, საგადასახადო, უსაფრთხოების ან სამართლებრივი მოთხოვნების გამო.' },
      { title: 'თქვენი არჩევანი და უფლებები', body: 'თქვენზე მოქმედი კანონმდებლობის მიხედვით, შეგიძლიათ მოითხოვოთ თქვენს პერსონალურ ინფორმაციაზე წვდომა, მისი შესწორება ან წაშლა, ან გააპროტესტოთ გარკვეული დამუშავება. მოთხოვნა გამოგზავნეთ ქვემოთ მითითებულ მისამართზე. მოქმედებამდე შესაძლოა საჭირო გახდეს განმცხადებლის ვინაობის დადასტურება.' },
      { title: 'ბავშვები', body: 'ეს ვებსაიტი და პროექტის მოთხოვნის ფორმა განკუთვნილია ბიზნესებისა და სრულწლოვნებისთვის და არ არის მიმართული ბავშვებზე.' },
      { title: 'კონტაქტი', body: 'კონფიდენციალურობასთან დაკავშირებული კითხვები და მოთხოვნები გამოგზავნეთ მისამართზე salyiorbusiness@gmail.com.' },
    ],
    terms: [
      { title: 'ინფორმაცია ვებსაიტზე', body: 'ეს ვებსაიტი შეიცავს ზოგად ინფორმაციას SALYIOR-ისა და მისი სერვისების შესახებ. კონტენტი შეიძლება შეიცვალოს, გასწორდეს ან წაიშალოს წინასწარი შეტყობინების გარეშე. პროექტი იწყება მხოლოდ წერილობითი შეთავაზების ან შეთანხმების ორივე მხარის მიერ დადასტურების შემდეგ.' },
      { title: 'პროექტის მოცულობა და გადახდა', body: 'შედეგები, ცვლილებების ეტაპები, პასუხისმგებლობები, ვადები, გადახდის ეტაპები და მესამე მხარის ხარჯები განისაზღვრება შესაბამის შეთავაზებაში ან შეთანხმებაში. მითითებული საწყისი ფასები საორიენტაციოა და ყველა პროექტისთვის ფიქსირებულ შეთავაზებას არ წარმოადგენს.' },
      { title: 'კლიენტის პასუხისმგებლობა', body: 'კლიენტი პასუხისმგებელია ზუსტი ინფორმაციის, დროული უკუკავშირისა და პროექტისთვის საჭირო კონტენტის, ფოტოების, სავაჭრო ნიშნებისა თუ სხვა მასალების მიწოდებაზე. კლიენტს უნდა ჰქონდეს მის მიერ მოწოდებული მასალების გამოყენების უფლება.' },
      { title: 'ინტელექტუალური საკუთრება', body: 'გადახდილი პროექტის შედეგების საკუთრებისა და ლიცენზირების პირობები განისაზღვრება შესაბამის შეთანხმებაში. მესამე მხარის პროგრამები, შრიფტები, სერვისები და მედია ექვემდებარება საკუთარ ლიცენზიებსა და პირობებს.' },
      { title: 'გარე სერვისები', body: 'ვებსაიტი შესაძლოა უკავშირდებოდეს ან იყენებდეს მესამე მხარის პლატფორმებს. SALYIOR არ აკონტროლებს ამ დამოუკიდებელი სერვისების ხელმისაწვდომობას, უსაფრთხოებას, ფასებს ან პოლიტიკას.' },
      { title: 'ხელმისაწვდომობა და პასუხისმგებლობა', body: 'SALYIOR ცდილობს ვებსაიტის სიზუსტისა და ხელმისაწვდომობის უზრუნველყოფას, თუმცა უწყვეტ ან უშეცდომო მუშაობას არ იძლევა გარანტიად. მოქმედი კანონით დასაშვებ ფარგლებში SALYIOR არ აგებს პასუხს ზარალზე, რომელიც მხოლოდ ზოგად ვებინფორმაციაზე ან დამოუკიდებელ მესამე მხარის სერვისზე დაყრდნობით წარმოიშვა.' },
      { title: 'კონტაქტი', body: 'ამ პირობებთან დაკავშირებული კითხვები გამოგზავნეთ მისამართზე salyiorbusiness@gmail.com. განსხვავების შემთხვევაში პროექტის კონკრეტულ შეთანხმებას უპირატესობა აქვს ამ ზოგად პირობებთან შედარებით.' },
    ],
    cookies: [
      { title: 'სარეკლამო და ანალიტიკური ქუქიების გარეშე', body: 'SALYIOR ამჟამად არ იყენებს სარეკლამო ქუქიებს, ქცევით თვალთვალის პიქსელებს ან არასავალდებულო ანალიტიკურ ქუქიებს. რადგან ეს ტექნოლოგიები აქტიური არ არის, ვებსაიტი ქუქიებზე თანხმობის ბანერს არ აჩვენებს.' },
      { title: 'ენის არჩევანი', body: 'ენის ხელით არჩევისას პარამეტრი ინახება თქვენი ბრაუზერის ლოკალურ საცავში, რათა ვებსაიტმა ის შემდეგ ვიზიტზეც დაიმახსოვროს. ეს ფუნქციური პარამეტრი სხვა ვებსაიტებზე თქვენს თვალთვალს არ ემსახურება და მისი წაშლა ამ საიტის ბრაუზერის მონაცემების გასუფთავებით შეგიძლიათ.' },
      { title: 'ტექნიკური მიწოდება', body: 'ჰოსტინგის პლატფორმამ ვებსაიტის მიწოდებისა და დაცვისთვის შესაძლოა დაამუშაოს ჩვეულებრივი ტექნიკური მოთხოვნები და უსაფრთხოების ჩანაწერები. SALYIOR ამ ინფორმაციას სარეკლამო პროფილებისთვის არ იყენებს.' },
      { title: 'მომავალი ცვლილებები', body: 'თუ მომავალში დაემატება არასავალდებულო ანალიტიკა, რეკლამა ან სხვა თვალთვალი, შეტყობინება განახლდება და საჭიროების შემთხვევაში შესაბამისი თანხმობის კონტროლი ამ ტექნოლოგიების გააქტიურებამდე გამოჩნდება.' },
      { title: 'კონტაქტი', body: 'ვებსაიტის საცავსა და თვალთვალთან დაკავშირებული კითხვები გამოგზავნეთ მისამართზე salyiorbusiness@gmail.com.' },
    ],
  },
  ru: {
    privacy: [
      { title: 'Какие данные мы собираем', body: 'При отправке заявки SALYIOR получает предоставленные вами данные: имя, электронную почту, сведения о бизнесе, адрес сайта, диапазон бюджета, требования проекта и выбранные функции. Для доставки сайта, защиты формы от злоупотреблений и диагностики ошибок также может обрабатываться базовая техническая информация.' },
      { title: 'Как используются данные', body: 'Данные заявки используются для её рассмотрения, ответа, подготовки предложения, действий перед возможным договором и ведения необходимых деловых записей. SALYIOR не продаёт персональные данные и не добавляет сведения из заявки в несвязанные рекламные рассылки.' },
      { title: 'Задействованные сервисы', body: 'Сайт размещён на Netlify. Заявки могут обрабатываться через Netlify Functions, Resend и Gmail для доставки и ответа. Эти поставщики могут обрабатывать ограниченные данные в соответствии со своими условиями безопасности и конфиденциальности, включая международную инфраструктуру.' },
      { title: 'Срок хранения', body: 'Данные заявки хранятся только столько, сколько разумно необходимо для ответа, оценки возможного проекта и ведения соответствующих деловых записей. Информация об активном или завершённом проекте может храниться дольше в силу договорных, налоговых, защитных или правовых требований.' },
      { title: 'Ваш выбор и права', body: 'В зависимости от применимого законодательства вы можете запросить доступ, исправление или удаление персональных данных либо возразить против определённой обработки. Запрос можно направить по адресу ниже. Перед выполнением запроса SALYIOR может попросить подтвердить личность заявителя.' },
      { title: 'Дети', body: 'Этот сайт и форма заявки предназначены для бизнеса и совершеннолетних и не ориентированы на детей.' },
      { title: 'Контакты', body: 'Вопросы и запросы о конфиденциальности можно направить на salyiorbusiness@gmail.com.' },
    ],
    terms: [
      { title: 'Информация на сайте', body: 'Сайт содержит общую информацию о SALYIOR и услугах студии. Материалы могут обновляться, исправляться или удаляться без предварительного уведомления. Проект начинается только после письменного согласования предложения или договора обеими сторонами.' },
      { title: 'Объём проекта и оплата', body: 'Результаты, раунды правок, обязанности, сроки, этапы оплаты и расходы на сторонние сервисы определяются в соответствующем предложении или договоре. Указанные стартовые цены являются ориентировочными и не считаются фиксированной стоимостью каждого проекта.' },
      { title: 'Обязанности клиента', body: 'Клиент отвечает за предоставление точной информации, своевременной обратной связи и необходимых материалов: текстов, изображений, товарных знаков и другого контента. Клиент должен иметь право использовать переданные материалы.' },
      { title: 'Интеллектуальная собственность', body: 'Условия владения и лицензирования оплаченных результатов проекта определяются соответствующим договором. Сторонние программы, шрифты, сервисы и медиа регулируются собственными лицензиями и условиями.' },
      { title: 'Внешние сервисы', body: 'Сайт может ссылаться на сторонние платформы или интегрироваться с ними. SALYIOR не контролирует доступность, безопасность, цены или политику этих независимых сервисов.' },
      { title: 'Доступность и ответственность', body: 'SALYIOR стремится поддерживать точность и доступность сайта, но не гарантирует непрерывную или безошибочную работу. В пределах применимого закона SALYIOR не отвечает за убытки, возникшие исключительно из-за доверия к общей информации на сайте или независимым сторонним сервисам.' },
      { title: 'Контакты', body: 'Вопросы об этих условиях можно направить на salyiorbusiness@gmail.com. При расхождении условия конкретного проекта имеют приоритет над этими общими условиями сайта.' },
    ],
    cookies: [
      { title: 'Без рекламных и аналитических cookie', body: 'SALYIOR сейчас не использует рекламные cookie, пиксели поведенческого отслеживания или необязательные аналитические cookie. Поскольку эти технологии не активны, сайт не показывает баннер согласия.' },
      { title: 'Языковое предпочтение', body: 'Когда вы вручную выбираете язык, настройка сохраняется в локальном хранилище браузера, чтобы сайт мог запомнить её при следующем посещении. Эта функциональная настройка не отслеживает вас на других сайтах и удаляется при очистке данных этого сайта в браузере.' },
      { title: 'Техническая доставка', body: 'Хостинг-платформа может обрабатывать обычные технические запросы и журналы безопасности, необходимые для доставки и защиты сайта. SALYIOR не использует эти данные для рекламного профилирования.' },
      { title: 'Будущие изменения', body: 'Если позже появятся необязательная аналитика, реклама или иное отслеживание, уведомление будет обновлено, а при необходимости до активации таких технологий появится соответствующий механизм согласия.' },
      { title: 'Контакты', body: 'Вопросы о хранении данных в браузере или отслеживании можно направить на salyiorbusiness@gmail.com.' },
    ],
  },
}

export function LegalPage({ type }: { type: LegalType }) {
  const { language, t } = useI18n()
  const title = type === 'privacy' ? 'Privacy notice' : type === 'terms' ? 'Terms of service' : 'Cookie notice'
  return <main><section className="legal-page"><Container><SectionLabel>{t('Legal')}</SectionLabel><h1>{t(title)}</h1><p className="legal-updated">{t('Last updated · July 2026')}</p><LegalContent sections={legalContent[language][type]} /></Container></section></main>
}

function LegalContent({ sections }: { sections: LegalSection[] }) {
  return <div className="legal-content">{sections.map((section) => <section key={section.title}><h2>{section.title}</h2><p>{linkEmail(section.body)}</p></section>)}</div>
}

function linkEmail(text: string) {
  const [before, after] = text.split('salyiorbusiness@gmail.com')
  if (after === undefined) return text
  return <>{before}<a href="mailto:salyiorbusiness@gmail.com">salyiorbusiness@gmail.com</a>{after}</>
}

export function NotFoundPage() {
  const { t } = useI18n()
  return <main className="not-found"><Container><span>404</span><h1>{t('This page took a wrong turn.')}</h1><p>{t('The route doesn’t exist, but the next useful step does.')}</p><ButtonLink href="/">{t('Return home')}</ButtonLink></Container></main>
}
