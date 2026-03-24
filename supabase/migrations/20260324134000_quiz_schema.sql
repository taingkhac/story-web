-- ==============================================================================
-- 1. CREATE TABLES
-- ==============================================================================

-- QUIZZES
CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    thumbnail_url TEXT,
    category TEXT,
    total_questions INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_published BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    share_count INT DEFAULT 0,
    seo_title TEXT,
    seo_description TEXT
);

-- QUIZ_QUESTIONS
CREATE TABLE quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_image_url TEXT,
    question_order INT NOT NULL,
    explanation TEXT
);

-- QUIZ_ANSWERS
CREATE TABLE quiz_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
    answer_text TEXT NOT NULL,
    answer_image_url TEXT,
    is_correct BOOLEAN DEFAULT FALSE,
    answer_order INT NOT NULL
);

-- QUIZ_RESULTS (Outcome tiers based on score)
CREATE TABLE quiz_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    min_score INT NOT NULL,
    max_score INT NOT NULL,
    result_title TEXT NOT NULL,
    result_description TEXT,
    result_image_url TEXT,
    share_text TEXT
);

-- QUIZ_ATTEMPTS (Tracks user completions)
CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT
);

-- ==============================================================================
-- 2. INDEXES
-- ==============================================================================

CREATE INDEX idx_quizzes_slug ON quizzes(slug);
CREATE INDEX idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);
CREATE INDEX idx_quiz_answers_question_id ON quiz_answers(question_id);
CREATE INDEX idx_quiz_results_quiz_id ON quiz_results(quiz_id);
CREATE INDEX idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);

-- ==============================================================================
-- 3. TRIGGERS
-- ==============================================================================

-- Function to increment the view_count when a quiz attempt is inserted
CREATE OR REPLACE FUNCTION increment_quiz_view_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE quizzes 
    SET view_count = view_count + 1 
    WHERE id = NEW.quiz_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to fire the function after each attempt insertion
CREATE TRIGGER on_quiz_attempt_inserted
AFTER INSERT ON quiz_attempts
FOR EACH ROW
EXECUTE FUNCTION increment_quiz_view_count();

-- Function to auto-update updated_at on quizzes
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_quiz_updated
BEFORE UPDATE ON quizzes
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- 4.1 Quizzes Policies
CREATE POLICY "Public can view published quizzes" ON quizzes 
FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Admin can manage quizzes" ON quizzes 
FOR ALL USING (auth.role() = 'authenticated'); -- Note: Adjust 'authenticated' to your specific admin role logic.

-- 4.2 Questions Policies
CREATE POLICY "Public can view questions of published quizzes" ON quiz_questions 
FOR SELECT USING (
    EXISTS (SELECT 1 FROM quizzes WHERE id = quiz_questions.quiz_id AND is_published = TRUE)
);

CREATE POLICY "Admin can manage questions" ON quiz_questions 
FOR ALL USING (auth.role() = 'authenticated');

-- 4.3 Answers Policies
CREATE POLICY "Public can view answers of published quizzes" ON quiz_answers 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM quiz_questions qq 
        JOIN quizzes q ON qq.quiz_id = q.id 
        WHERE qq.id = quiz_answers.question_id AND q.is_published = TRUE
    )
);

CREATE POLICY "Admin can manage answers" ON quiz_answers 
FOR ALL USING (auth.role() = 'authenticated');

-- 4.4 Results Policies
CREATE POLICY "Public can view quiz results" ON quiz_results 
FOR SELECT USING (
    EXISTS (SELECT 1 FROM quizzes WHERE id = quiz_results.quiz_id AND is_published = TRUE)
);

CREATE POLICY "Admin can manage quiz results" ON quiz_results 
FOR ALL USING (auth.role() = 'authenticated');

-- 4.5 Attempts Policies
CREATE POLICY "Public can insert quiz attempts" ON quiz_attempts 
FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Users can view their own attempts, admin views all" ON quiz_attempts 
FOR SELECT USING (TRUE); -- Allow viewing for stats/shares, restrict if needed.

CREATE POLICY "Admin can manage attempts" ON quiz_attempts 
FOR ALL USING (auth.role() = 'authenticated');

-- ==============================================================================
-- 5. SAMPLE DATA (Can You Survive the Roman Empire?)
-- ==============================================================================

DO $$
DECLARE
    v_quiz_id UUID := gen_random_uuid();
    v_q1_id UUID := gen_random_uuid();
    v_q2_id UUID := gen_random_uuid();
    v_q3_id UUID := gen_random_uuid();
    v_q4_id UUID := gen_random_uuid();
    v_q5_id UUID := gen_random_uuid();
    v_q6_id UUID := gen_random_uuid();
    v_q7_id UUID := gen_random_uuid();
    v_q8_id UUID := gen_random_uuid();
    v_q9_id UUID := gen_random_uuid();
    v_q10_id UUID := gen_random_uuid();
    v_q11_id UUID := gen_random_uuid();
    v_q12_id UUID := gen_random_uuid();
BEGIN

    -- 1. Insert Quiz
    INSERT INTO quizzes (id, title, slug, description, category, total_questions, is_published, seo_title, seo_description)
    VALUES (
        v_quiz_id, 
        'Can You Survive the Roman Empire?', 
        'survive-the-roman-empire', 
        'Step back in time to 1st Century BC Rome. Gladiators, politics, poison, and war await. Will you rise to emperor or die a forgotten peasant?', 
        'History', 
        12, 
        TRUE, 
        'Roman Empire Survival Quiz | Test Your History Knowledge',
        'Find out if you have what it takes to survive the brutal, political, and glorious days of the Roman Empire.'
    );

    -- 2. Insert Results (4 Tiers for a 12 point quiz)
    -- Tier 1: Died quickly (0-3 points)
    INSERT INTO quiz_results (quiz_id, min_score, max_score, result_title, result_description, share_text)
    VALUES (v_quiz_id, 0, 3, 'Ruined Plebeian 💀', 'You didn''t last a week. Whether it was bad water, a riot, or angering a patrician, Rome swallowed you whole.', 'I died instantly in the Roman Empire Survival Quiz. Can you do better?');
    
    -- Tier 2: Struggling Survivor (4-6 points)
    INSERT INTO quiz_results (quiz_id, min_score, max_score, result_title, result_description, share_text)
    VALUES (v_quiz_id, 4, 6, 'Grizzled Legionary 🛡️', 'You survived, but it cost you. You spent your life marching through muddy Gaul and eating hardtack. A hard life, but a living one.', 'I survived as a Legionary in the Roman Empire Quiz!');
    
    -- Tier 3: Respected Senator (7-10 points)
    INSERT INTO quiz_results (quiz_id, min_score, max_score, result_title, result_description, share_text)
    VALUES (v_quiz_id, 7, 10, 'Wealthy Senator 🏛️', 'You played the political game well! You afford the finest wine, wear royal purple, and have a villa in Pompeii... wait, maybe sell that villa.', 'I became a wealthy Senator in the Roman Empire Quiz!');
    
    -- Tier 4: Emperor (11-12 points)
    INSERT INTO quiz_results (quiz_id, min_score, max_score, result_title, result_description, share_text)
    VALUES (v_quiz_id, 11, 12, 'Glorious Augustus 👑', 'Veni, Vidi, Vici! You possess the cunning, ruthlessness, and luck needed to rule the greatest empire in antiquity.', 'I conquered the Roman Empire Survival Quiz and became Emperor!');


    -- 3. Insert Questions & Answers (12 Questions, 4 Options each, 1 Correct)

    -- Q1
    INSERT INTO quiz_questions (id, quiz_id, question_text, question_order, explanation) VALUES (v_q1_id, v_quiz_id, 'You are thirsty in the Roman streets. Where do you get your drinking water?', 1, 'Aqueducts fed public fountains carrying clean spring water, whereas the Tiber river was highly polluted.');
    INSERT INTO quiz_answers (question_id, answer_text, is_correct, answer_order) VALUES 
        (v_q1_id, 'Drink straight from the Tiber River', FALSE, 1),
        (v_q1_id, 'Buy it from a mysterious street merchant', FALSE, 2),
        (v_q1_id, 'Collect it from a public street fountain fuelled by aqueducts', TRUE, 3),
        (v_q1_id, 'Wait for it to rain and drink from puddles', FALSE, 4);

    -- Q2
    INSERT INTO quiz_questions (id, quiz_id, question_text, question_order, explanation) VALUES (v_q2_id, v_quiz_id, 'You are invited to a Patrician banquet. Which of these is the most acceptable dining posture?', 2, 'Romans of status reclined on their left elbow on couches while eating; sitting up was considered lower-class.');
    INSERT INTO quiz_answers (question_id, answer_text, is_correct, answer_order) VALUES 
        (v_q2_id, 'Sitting upright on a wooden chair with excellent posture', FALSE, 1),
        (v_q2_id, 'Reclining on a couch, resting on your left elbow', TRUE, 2),
        (v_q2_id, 'Standing up and mingling near the food table', FALSE, 3),
        (v_q2_id, 'Kneeling modestly at the foot of the host', FALSE, 4);

    -- Q3
    INSERT INTO quiz_questions (id, quiz_id, question_text, question_order, explanation) VALUES (v_q3_id, v_quiz_id, 'The mob is rioting over grain shortages. What is your safest course of action?', 3, 'Roman grain riots were incredibly deadly; barricading yourself in a strong stone building was the only reliable survival tactic.');
    INSERT INTO quiz_answers (question_id, answer_text, is_correct, answer_order) VALUES 
        (v_q3_id, 'Join the mob to blend in', FALSE, 1),
        (v_q3_id, 'Stand on a box and give a speech on peace', FALSE, 2),
        (v_q3_id, 'Flee to an open field outside the gates', FALSE, 3),
        (v_q3_id, 'Barricade yourself in a sturdy stone building and wait it out', TRUE, 4);

    -- Q4
    INSERT INTO quiz_questions (id, quiz_id, question_text, question_order, explanation) VALUES (v_q4_id, v_quiz_id, 'You join the Roman Legion. Which weapon is your primary tool in formation combat?', 4, 'The Gladius (short sword) was the primary close-quarters weapon used effectively behind the heavy scutum (shield) formation.');
    INSERT INTO quiz_answers (question_id, answer_text, is_correct, answer_order) VALUES 
        (v_q4_id, 'A long, heavy broadsword', FALSE, 1),
        (v_q4_id, 'A short stabbing sword called a Gladius', TRUE, 2),
        (v_q4_id, 'A massive battleaxe', FALSE, 3),
        (v_q4_id, 'A bow and arrow', FALSE, 4);

    -- Q5
    INSERT INTO quiz_questions (id, quiz_id, question_text, question_order, explanation) VALUES (v_q5_id, v_quiz_id, 'You become sick with a high fever. What is the standard Roman medical remedy you should trust?', 5, 'Roman medicine relied heavily on the theory of the four humors. "Bleeding" was standard, but changing diet/bathing (Galen''s therapies) was safer than poison or magic.');
    INSERT INTO quiz_answers (question_id, answer_text, is_correct, answer_order) VALUES 
        (v_q5_id, 'Drink watered-down wine and rest in the baths to balance your humours', TRUE, 1),
        (v_q5_id, 'Eat crushed emeralds mixed with honey', FALSE, 2),
        (v_q5_id, 'Wander barefoot through a swamp at midnight', FALSE, 3),
        (v_q5_id, 'Let a stray dog lick your forehead', FALSE, 4);

    -- Q6
    INSERT INTO quiz_questions (id, quiz_id, question_text, question_order, explanation) VALUES (v_q6_id, v_quiz_id, 'A political rival offers you a cup of fine wine. How do you ensure it is not poisoned?', 6, 'Poison was a massive political weapon. The safest way was to make the host drink from the same pitcher first.');
    INSERT INTO quiz_answers (question_id, answer_text, is_correct, answer_order) VALUES 
        (v_q6_id, 'Smell it for an almond scent', FALSE, 1),
        (v_q6_id, 'Drop a silver coin in to see if it turns black', FALSE, 2),
        (v_q6_id, 'Insist the host drinks from the exact same pitcher first', TRUE, 3),
        (v_q6_id, 'Say a quick prayer to Jupiter and down it', FALSE, 4);

    -- Q7
    INSERT INTO quiz_questions (id, quiz_id, question_text, question_order, explanation) VALUES (v_q7_id, v_quiz_id, 'You are accused of a crime you didn''t commit. Who is your best hope in a Roman court?', 7, 'Roman trials were theatrical; a famous, wealthy orator who could sway the crowds (like Cicero) was far more effective than mere evidence.');
    INSERT INTO quiz_answers (question_id, answer_text, is_correct, answer_order) VALUES 
        (v_q7_id, 'A quiet, logical lawyer with solid evidence', FALSE, 1),
        (v_q7_id, 'A loud, wealthy, famous orator who puts on a dramatic performance', TRUE, 2),
        (v_q7_id, 'The Emperor himself via a direct letter', FALSE, 3),
        (v_q7_id, 'No one, represent yourself using common sense', FALSE, 4);

    -- Q8
    INSERT INTO quiz_questions (id, quiz_id, question_text, question_order, explanation) VALUES (v_q8_id, v_quiz_id, 'If you want to use the public latrines (toilets), what do you use to wipe?', 8, 'Romans used a xylospongium—a sea sponge on a stick—shared communally in the latrines and rinsed in a gutter of running water.');
    INSERT INTO quiz_answers (question_id, answer_text, is_correct, answer_order) VALUES 
        (v_q8_id, 'The edges of your toga', FALSE, 1),
        (v_q8_id, 'Imported Egyptian papyrus', FALSE, 2),
        (v_q8_id, 'A communal sea sponge on a stick soaked in vinegar water', TRUE, 3),
        (v_q8_id, 'Nothing, Rome was completely unhygienic', FALSE, 4);

    -- Q9
    INSERT INTO quiz_questions (id, quiz_id, question_text, question_order, explanation) VALUES (v_q9_id, v_quiz_id, 'You are placed in the Colosseum as a gladiator. The crowd gives you the "thumbs up". What does this mean?', 9, 'Historically, an upturned thumb (pollice verso) meant "sword drawn"—kill him. A closed fist or thumb hidden meant mercy.');
    INSERT INTO quiz_answers (question_id, answer_text, is_correct, answer_order) VALUES 
        (v_q9_id, 'They want you to let your opponent live', FALSE, 1),
        (v_q9_id, 'They want you to kill your opponent', TRUE, 2),
        (v_q9_id, 'They are cheering for your excellent form', FALSE, 3),
        (v_q9_id, 'It signals the Emperor is arriving', FALSE, 4);

    -- Q10
    INSERT INTO quiz_questions (id, quiz_id, question_text, question_order, explanation) VALUES (v_q10_id, v_quiz_id, 'Julius Caesar is crossing the Rubicon river with his army. What should you do?', 10, 'Caesar crossing the Rubicon meant civil war. Leaving Rome and staying out of the direct political crossfire was the safest play for citizens.');
    INSERT INTO quiz_answers (question_id, answer_text, is_correct, answer_order) VALUES 
        (v_q10_id, 'Run out to the river to ask him for an autograph', FALSE, 1),
        (v_q10_id, 'Publicly insult him in the Senate', FALSE, 2),
        (v_q10_id, 'Flee to your country estate and stay quiet while the generals fight', TRUE, 3),
        (v_q10_id, 'Join Pompey''s army immediately for glory', FALSE, 4);

    -- Q11
    INSERT INTO quiz_questions (id, quiz_id, question_text, question_order, explanation) VALUES (v_q11_id, v_quiz_id, 'It is August 24, 79 AD, and you live in Pompeii. The mountain is rumbling. What is your move?', 11, 'Vesuvius erupted with devastating speed. The only people who survived were those who abandoned their possessions and fled immediately.');
    INSERT INTO quiz_answers (question_id, answer_text, is_correct, answer_order) VALUES 
        (v_q11_id, 'Go outside and watch the pretty ash fall', FALSE, 1),
        (v_q11_id, 'Run to the temple of Vulcan and pray', FALSE, 2),
        (v_q11_id, 'Hide in your basement with your valuables', FALSE, 3),
        (v_q11_id, 'Flee the city immediately towards the sea and keep running', TRUE, 4);

    -- Q12
    INSERT INTO quiz_questions (id, quiz_id, question_text, question_order, explanation) VALUES (v_q12_id, v_quiz_id, 'You have angered the Emperor Caligula. What is your best strategy to survive?', 12, 'Caligula was deeply unpredictable and despotic. Direct confrontation or fleeing would result in execution. Flattery was the only tenuous tool.');
    INSERT INTO quiz_answers (question_id, answer_text, is_correct, answer_order) VALUES 
        (v_q12_id, 'Challenge him to a fair duel', FALSE, 1),
        (v_q12_id, 'Laugh loudly and pretend it was all a brilliant joke of his', TRUE, 2),
        (v_q12_id, 'Attempt to assassinate him yourself', FALSE, 3),
        (v_q12_id, 'Run away to Britannia', FALSE, 4);

END $$;
