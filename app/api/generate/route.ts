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

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
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

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 2500,
        response_format: { type: 'json_object' }
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
    const rawContent = data.choices?.[0]?.message?.content

    if (!rawContent) {
      return NextResponse.json({ error: 'Empty response from AI' }, { status: 500 })
    }

    // Parse and return
    if (action) {
      return NextResponse.json({ result: rawContent.trim() })
    } else {
      const parsed = JSON.parse(rawContent)
      return NextResponse.json({ result: parsed })
    }

  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 })
  }
}
