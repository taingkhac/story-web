'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'

interface ViewTrackerProps {
    storyId?: string
    chapterId?: string
}

export default function ViewTracker({ storyId, chapterId }: ViewTrackerProps) {
    const supabase = createClient()
    const trackedRef = useRef(false)

    useEffect(() => {
        // Only track once per mount to prevent double counting in React Strict Mode
        if (trackedRef.current) return
        
        async function trackView() {
            try {
                if (storyId) {
                    await supabase.rpc('increment_story_view', { p_story_id: storyId })
                }
                if (chapterId) {
                    await supabase.rpc('increment_chapter_view', { p_chapter_id: chapterId })
                }
            } catch (error) {
                console.error('Error tracking view:', error)
            }
        }

        trackView()
        trackedRef.current = true
    }, [storyId, chapterId, supabase])

    return null
}
