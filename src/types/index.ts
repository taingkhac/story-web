export interface Category {
    id: string
    name: string
    slug: string
}

export interface Story {
    id: string
    created_at: string
    title: string
    slug: string
    summary: string | null
    cover_image_url: string | null
    is_published: boolean
    category_id: string | null
    related_quiz_id: string | null
    categories?: Category
}

export interface Chapter {
    id: string
    created_at: string
    story_id: string
    chapter_number: number
    title: string
    content: string
}

export interface BlogPost {
    id: string
    created_at: string
    title: string
    slug: string
    content: string
    excerpt: string | null
    cover_image_url: string | null
    is_published: boolean
    author_name: string
}

export interface Quiz {
    id: string
    title: string
    slug: string
    description: string | null
    thumbnail_url: string | null
    category: string | null
    total_questions: number
    created_at: string
    updated_at: string
    is_published: boolean
    view_count: number
    share_count: number
    seo_title: string | null
    seo_description: string | null
    related_story_id: string | null
}

export interface QuizQuestion {
    id: string
    quiz_id: string
    question_text: string
    question_image_url: string | null
    question_order: number
    explanation: string | null
}

export interface QuizAnswer {
    id: string
    question_id: string
    answer_text: string
    answer_image_url: string | null
    is_correct: boolean
    answer_order: number
}

export interface QuizResult {
    id: string
    quiz_id: string
    min_score: number
    max_score: number
    result_title: string
    result_description: string | null
    result_image_url: string | null
    share_text: string | null
}

export interface QuizAttempt {
    id: string
    quiz_id: string
    score: number
    total_questions: number
    completed_at: string
    ip_address: string | null
    user_agent: string | null
}
