import { InputType, ToneOption, NicheOption } from '../types'

// LinkedIn character limits
export const LINKEDIN_CHAR_LIMIT = 3000
export const LINKEDIN_PREVIEW_CUTOFF = 210

// Input type options for dropdown
export const INPUT_TYPE_OPTIONS: { value: InputType; label: string; description: string }[] = [
  { value: 'rough_idea', label: 'Rough Idea', description: 'A quick thought or concept' },
  { value: 'bullet_points', label: 'Bullet Points', description: 'Key points to weave together' },
  { value: 'full_draft', label: 'Full Draft', description: 'A complete draft to refine' },
  { value: 'article', label: 'Article/Thread', description: 'Long content to condense' },
]

// Tone options for dropdown
export const TONE_OPTIONS: { value: ToneOption; label: string; description: string }[] = [
  { value: 'professional', label: 'Professional', description: 'Authority without arrogance' },
  { value: 'casual', label: 'Casual', description: 'Conversational and relatable' },
  { value: 'storytelling', label: 'Storytelling', description: 'Narrative with emotional pull' },
  { value: 'controversial', label: 'Controversial', description: 'Bold and contrarian takes' },
]

// Niche options for dropdown (tech/startup focused)
export const NICHE_OPTIONS: { value: NicheOption; label: string; description: string }[] = [
  { value: null, label: 'General', description: 'No specific audience' },
  { value: 'tech_startup', label: 'Tech/Startup', description: 'Building and scaling companies' },
  { value: 'saas', label: 'SaaS', description: 'Software as a service focus' },
  { value: 'developer', label: 'Developer', description: 'Engineering and coding' },
  { value: 'product', label: 'Product', description: 'Product management and design' },
  { value: 'founder', label: 'Founder', description: 'Entrepreneurship journey' },
]

// Quick action button configs
export const QUICK_ACTIONS = [
  { id: 'shorter' as const, label: 'Shorter', icon: '↓' },
  { id: 'punchier' as const, label: 'Punchier', icon: '⚡' },
  { id: 'story_angle' as const, label: 'Add Story', icon: '📖' },
]

// Default settings
export const DEFAULT_SETTINGS = {
  tone: 'casual' as ToneOption,
  inputType: 'rough_idea' as InputType,
  niche: null as NicheOption,
}
