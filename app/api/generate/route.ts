import { NextRequest, NextResponse } from 'next/server'
import { buildSystemPrompt, buildGenerationPrompt, buildRefinementPrompt, QUICK_ACTION_PROMPTS } from '@/app/lib/prompts'
import { ToneOption, InputType, NicheOption, QuickActionType } from '@/app/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, tone, inputType, niche, action, currentPost } = body

    if (!content && !currentPost) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Anthropic API key not configured' }, { status: 500 })
    }

    // Build prompts
    const systemPrompt = buildSystemPrompt(
      (tone as ToneOption) || 'casual',
      (inputType as InputType) || 'rough_idea',
      niche as NicheOption
    )

    let userPrompt: string
    if (action && currentPost) {
      userPrompt = buildRefinementPrompt(currentPost, action as QuickActionType)
    } else {
      userPrompt = buildGenerationPrompt(content)
    }

    // Call Anthropic Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 2500,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userPrompt }
        ]
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData?.error?.message || 'API request failed' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const rawContent = data.content?.[0]?.text

    if (!rawContent) {
      return NextResponse.json({ error: 'Empty response from AI' }, { status: 500 })
    }

    // Parse and return
    if (action) {
      return NextResponse.json({ result: rawContent.trim() })
    } else {
      // Extract JSON from response (Claude may include extra text)
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        return NextResponse.json({ error: 'Failed to parse response' }, { status: 500 })
      }
      const parsed = JSON.parse(jsonMatch[0])
      return NextResponse.json({ result: parsed })
    }

  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 })
  }
}
