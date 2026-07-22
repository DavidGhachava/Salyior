import { BusinessOutcomes, CarePlan, FAQSection, FinalCTA, Hero, Investment, Process, RevealObserver, SelectedWork, StudioApproach } from '../components/HomeSections'
import { ProjectApplication } from '../components/ProjectApplication'

export function HomePage() {
  return <main><RevealObserver /><Hero /><SelectedWork /><BusinessOutcomes /><StudioApproach /><Process /><Investment /><CarePlan /><FAQSection /><ProjectApplication /><FinalCTA /></main>
}
