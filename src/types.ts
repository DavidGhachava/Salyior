export type ProjectType = 'Client project' | 'Independent build'

export type ProjectVisual = 'arqi' | 'arrive' | 'kristina'

export type Project = {
  slug: string
  number: string
  title: string
  type: ProjectType
  industry: string
  summary: string
  commercialGoal: string
  problem: string
  solution: string
  result: string
  services: string[]
  visual: ProjectVisual
  image: string
  imageAlt: string
  imageWidth: number
  imageHeight: number
  url: string
  featured: boolean
}

export type Outcome = {
  number: string
  title: string
  description: string
  visual: 'booking' | 'search' | 'trust' | 'contact'
}

export type Principle = {
  number: string
  title: string
  description: string
}

export type ProcessStage = {
  number: string
  title: string
  description: string
}

export type FAQ = {
  question: string
  answer: string
}
