-- Add cross-linking between quizzes and stories
ALTER TABLE quizzes ADD COLUMN related_story_id UUID REFERENCES stories(id) ON DELETE SET NULL;
ALTER TABLE stories ADD COLUMN related_quiz_id UUID REFERENCES quizzes(id) ON DELETE SET NULL;
