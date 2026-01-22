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
  const [copied, setCopied] = useState(false)

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
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000' }}>
      {/* Header */}
      <header style={{
        padding: '20px 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <a href="https://ltgvault.com" style={{
            textDecoration: 'none',
            color: '#C9A227',
            fontSize: '1.25rem',
            fontWeight: 700,
            letterSpacing: '-0.02em'
          }}>
            LTG Vault
          </a>
          <span style={{
            fontSize: '0.85rem',
            color: '#666'
          }}>PostUp</span>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '48px 24px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            marginBottom: '12px',
            color: '#fff'
          }}>
            PostUp
          </h1>
          <p style={{
            fontSize: '1rem',
            color: '#999',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            Turn rough ideas into polished LinkedIn posts
          </p>
        </div>

        {/* Input Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your idea, bullet points, or draft..."
            style={{
              width: '100%',
              height: '160px',
              padding: '16px',
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              resize: 'none',
              outline: 'none',
              fontFamily: 'Inter, sans-serif'
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(201, 162, 39, 0.5)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'}
          />

          {/* Options Row */}
          <div style={{
            display: 'flex',
            gap: '16px',
            marginTop: '16px',
            flexWrap: 'wrap'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.75rem',
                color: '#666',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '8px'
              }}>Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as ToneOption)}
                style={{
                  padding: '10px 16px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  outline: 'none',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                <option value="casual">Casual</option>
                <option value="professional">Professional</option>
                <option value="storytelling">Storytelling</option>
                <option value="controversial">Controversial</option>
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.75rem',
                color: '#666',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '8px'
              }}>Input Type</label>
              <select
                value={inputType}
                onChange={(e) => setInputType(e.target.value as InputType)}
                style={{
                  padding: '10px 16px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  outline: 'none',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                <option value="rough_idea">Rough Idea</option>
                <option value="bullet_points">Bullet Points</option>
                <option value="full_draft">Full Draft</option>
                <option value="article">Article</option>
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generate}
            disabled={loading || !input.trim()}
            style={{
              width: '100%',
              marginTop: '20px',
              padding: '14px 24px',
              background: loading || !input.trim() ? '#333' : '#D4AF37',
              color: loading || !input.trim() ? '#666' : '#000',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'Inter, sans-serif'
            }}
            onMouseOver={(e) => {
              if (!loading && input.trim()) {
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(201, 162, 39, 0.3)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.transform = 'none'
            }}
          >
            {loading ? 'Generating...' : 'Generate Post'}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div style={{
            padding: '16px',
            background: 'rgba(255, 95, 87, 0.1)',
            border: '1px solid rgba(255, 95, 87, 0.3)',
            borderRadius: '8px',
            color: '#ff5f57',
            fontSize: '0.9rem',
            marginBottom: '24px'
          }}>
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '16px',
            padding: '24px'
          }}>
            {/* Variation Tabs */}
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '20px'
            }}>
              {result.variations.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveVariation(i)}
                  style={{
                    padding: '8px 16px',
                    background: activeVariation === i ? 'rgba(201, 162, 39, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${activeVariation === i ? '#C9A227' : 'rgba(255, 255, 255, 0.08)'}`,
                    borderRadius: '6px',
                    color: activeVariation === i ? '#C9A227' : '#888',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  Variation {i + 1}
                </button>
              ))}
            </div>

            {/* Generated Content */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '16px'
            }}>
              <div style={{
                whiteSpace: 'pre-wrap',
                fontSize: '0.95rem',
                lineHeight: 1.7,
                color: '#e0e0e0'
              }}>
                {result.variations[activeVariation].content}
              </div>
              <div style={{
                marginTop: '16px',
                paddingTop: '12px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                fontSize: '0.8rem',
                color: '#666'
              }}>
                {result.variations[activeVariation].content.length} characters
              </div>
            </div>

            {/* Copy Button */}
            <button
              onClick={() => copyToClipboard(result.variations[activeVariation].content)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: copied ? 'rgba(40, 202, 65, 0.15)' : 'transparent',
                border: `1px solid ${copied ? '#28ca41' : 'rgba(201, 162, 39, 0.4)'}`,
                borderRadius: '6px',
                color: copied ? '#28ca41' : '#C9A227',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              {copied ? 'Copied!' : 'Copy to clipboard'}
            </button>

            {/* Hook Alternatives */}
            {result.hookAlternatives && result.hookAlternatives.length > 0 && (
              <div style={{ marginTop: '32px' }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  marginBottom: '16px',
                  color: '#fff'
                }}>Alternative Hooks</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {result.hookAlternatives.map((hook, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '6px'
                    }}>
                      <span style={{
                        fontSize: '0.7rem',
                        padding: '4px 8px',
                        background: 'rgba(201, 162, 39, 0.15)',
                        border: '1px solid rgba(201, 162, 39, 0.3)',
                        borderRadius: '4px',
                        color: '#C9A227',
                        fontWeight: 600,
                        textTransform: 'uppercase'
                      }}>{hook.style}</span>
                      <span style={{ color: '#ccc', fontSize: '0.9rem' }}>{hook.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Improvement Tips */}
            {result.improvementTips && result.improvementTips.length > 0 && (
              <div style={{ marginTop: '32px' }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  marginBottom: '16px',
                  color: '#fff'
                }}>Improvement Tips</h3>
                <ul style={{
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  {result.improvementTips.map((tip, i) => (
                    <li key={i} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      fontSize: '0.9rem',
                      color: '#999'
                    }}>
                      <span style={{ color: '#C9A227' }}>-</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        padding: '32px 24px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: '0.85rem',
          color: '#666'
        }}>
          Part of <a href="https://ltgvault.com" style={{ color: '#C9A227', textDecoration: 'none' }}>LTG Vault</a>
        </p>
      </footer>
    </div>
  )
}
