import QuizEditor from './QuizEditor'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Edit Quiz | Admin | NovaLore',
}

export default function EditQuizPage({ params }: { params: { id: string } }) {
    return <QuizEditor quizId={params.id} />
}
