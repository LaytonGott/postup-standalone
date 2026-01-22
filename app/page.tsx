'use client'

import { useState } from 'react'

type ToneOption = 'professional' | 'casual' | 'storytelling' | 'controversial'
type InputType = 'rough_idea' | 'bullet_points' | 'full_draft' | 'article'

interface Variation {
  hookLine: string
  content: string
}

interface GenerationResult {
  variations: Variation[]
  hookAlternatives: { text: string; style: string }[]
  improvementTips: string[]
  confidenceScore: number
}

export default function Home() {
  const [input, setInput] = useState('')
  const [tone, setTone] = useState<ToneOption>('casual')
  const [inputType, setInputType] = useState<InputType>('rough_idea')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GenerationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeVariation, setActiveVariation] = useState(0)

  const generate = async () => {
    if (!input.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: input, tone, inputType })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate')
      }

      setResult(data.result)
      setActiveVariation(0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">PostUp</h1>
      <p className="text-gray-400 mb-8">Generate viral LinkedIn posts</p>

      <div className="mb-6">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your idea, bullet points, or draft..."
          className="w-full h-40 p-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as ToneOption)}
            className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
          >
            <option value="casual">Casual</option>
            <option value="professional">Professional</option>
            <option value="storytelling">Storytelling</option>
            <option value="controversial">Controversial</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Input Type</label>
          <select
            value={inputType}
            onChange={(e) => setInputType(e.target.value as InputType)}
            className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
          >
            <option value="rough_idea">Rough Idea</option>
            <option value="bullet_points">Bullet Points</option>
            <option value="full_draft">Full Draft</option>
            <option value="article">Article</option>
          </select>
        </div>
      </div>

      <button
        onClick={generate}
        disabled={loading || !input.trim()}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
      >
        {loading ? 'Generating...' : 'Generate Post'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-8">
          <div className="flex gap-2 mb-4">
            {result.variations.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveVariation(i)}
                className={`px-4 py-2 rounded ${
                  activeVariation === i
                    ? 'bg-blue-600'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                Variation {i + 1}
              </button>
            ))}
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium">Generated Post</h3>
              <button
                onClick={() => copyToClipboard(result.variations[activeVariation].content)}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
              >
                Copy
              </button>
            </div>
            <div className="whitespace-pre-wrap text-gray-200">
              {result.variations[activeVariation].content}
            </div>
            <div className="mt-4 text-sm text-gray-500">
              {result.variations[activeVariation].content.length} characters
            </div>
          </div>

          {result.hookAlternatives && result.hookAlternatives.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Alternative Hooks</h3>
              <div className="space-y-2">
                {result.hookAlternatives.map((hook, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-800 rounded">
                    <span className="text-xs px-2 py-1 bg-gray-700 rounded">{hook.style}</span>
                    <span className="text-gray-300">{hook.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.improvementTips && result.improvementTips.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Improvement Tips</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-400">
                {result.improvementTips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </main>
  )
}
