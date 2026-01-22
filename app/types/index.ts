// Input configuration
export type InputType = 'rough_idea' | 'bullet_points' | 'full_draft' | 'article'

export type ToneOption = 'professional' | 'casual' | 'storytelling' | 'controversial'

export type NicheOption = 'tech_startup' | 'saas' | 'developer' | 'product' | 'founder' | null

// Post generation settings
export interface GenerationSettings {
  tone: ToneOption
  inputType: InputType
  niche: NicheOption
}

// Generated output structures
export interface HookAlternative {
  text: string
  style: 'question' | 'statistic' | 'story' | 'bold_statement'
}

export interface PostVariation {
  id: string
  content: string
  hookLine: string
  characterCount: number
  wordCount: number
  previewCutoff: string
}

export interface GenerationResult {
  variations: PostVariation[]
  hookAlternatives: HookAlternative[]
  improvementTips: string[]
  confidenceScore: number
}

// API state
export interface GenerationState {
  isLoading: boolean
  isRefining: boolean
  error: string | null
  result: GenerationResult | null
  activeVariationIndex: number
}

// Quick action types
export type QuickActionType = 'shorter' | 'punchier' | 'story_angle'
