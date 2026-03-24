import QuizEditor from '../[id]/QuizEditor'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Create New Quiz | Admin | NovaLore',
}

export default function NewQuizPage() {
    return <QuizEditor quizId="new" />
}
