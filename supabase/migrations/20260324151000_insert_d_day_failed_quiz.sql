-- SQL script to insert the "What If D-Day Failed?" Quiz
-- Run this in your Supabase SQL Editor

DO $$
DECLARE
    v_story_id UUID := 'ce7edcf0-06c8-4e39-b2ee-da97fc1e425c';
    v_quiz_id UUID;
    v_q1_id UUID;
    v_q2_id UUID;
    v_q3_id UUID;
    v_q4_id UUID;
    v_q5_id UUID;
    v_q6_id UUID;
    v_q7_id UUID;
    v_q8_id UUID;
BEGIN
    -- 1. Insert the Quiz
    INSERT INTO quizzes (
        title, 
        slug, 
        description, 
        category, 
        total_questions, 
        is_published, 
        related_story_id,
        thumbnail_url,
        seo_title,
        seo_description
    ) VALUES (
        'Can You Survive the Failed D-Day Timeline?',
        'can-you-survive-the-failed-d-day-timeline',
        'Explore the dark alternate history where the Normandy invasion was a disaster. Test your knowledge on the weapons, the politics, and the ultimate nuclear conclusion of the Longest Day gone wrong.',
        'history',
        8,
        true,
        v_story_id,
        'https://mshimyujjjgdlzgypvkl.supabase.co/storage/v1/object/public/story-covers/usbnae2xo6_1774323183903.png',
        'D-Day Failed Alternate History Quiz | NovaLore',
        'What if D-Day failed? Take our quiz to see if you can navigate the fallout of history''s greatest military disaster.'
    ) RETURNING id INTO v_quiz_id;

    -- 2. Insert Questions and Answers
    -- Q1
    INSERT INTO quiz_questions (quiz_id, question_text, question_order, explanation)
    VALUES (v_quiz_id, 'Where was the bloodiest of the five landing zones on D-Day, where the first wave was nearly annihilated?', 1, 'Omaha Beach was the most lethal landing zone. Of the 2,400 Americans who died on D-Day, most fell on this single stretch of sand.')
    RETURNING id INTO v_q1_id;
    INSERT INTO quiz_answers (question_id, answer_text, is_correct, answer_order) VALUES
    (v_q1_id, 'Gold Beach', false, 1),
    (v_q1_id, 'Utah Beach', false, 2),
    (v_q1_id, 'Omaha Beach', true, 3),
    (v_q1_id, 'Juno Beach', false, 4);

    -- Q2
    INSERT INTO quiz_questions (quiz_id, question_text, question_order, explanation)
    VALUES (v_quiz_id, 'In this alternate timeline, why were Rommel’s Panzer divisions finally unleashed on the morning of June 7?', 2, 'Hitler was a late sleeper, and no one dared wake him on D-Day morning. In this timeline, his delay in releasing the Panzers was critical.')
    RETURNING id INTO v_q2_id;
    INSERT INTO quiz_answers (question_id, answer_text, is_correct, answer_order) VALUES
    (v_q2_id, 'They were waiting for more fuel', false, 1),
    (v_q2_id, 'Hitler finally woke up from a late sleep', true, 2),
    (v_q2_id, 'The weather cleared up', false, 3),
    (v_q2_id, 'Rommel disobeyed orders', false, 4);

    -- Q3
    INSERT INTO quiz_questions (quiz_id, question_text, question_order, explanation)
    VALUES (v_quiz_id, 'What weapon did German engineers develop into a long-range ballistic missile capable of hitting targets across all of Britain by late 1945?', 3, 'Extra time allowed German engineers to evolve the V-2 into the V-3, a more accurate and long-range ballistic missile.')
    RETURNING id INTO v_q3_id;
    INSERT INTO quiz_answers (question_id, answer_text, is_correct, answer_order) VALUES
    (v_q3_id, 'The V-1 Flying Bomb', false, 1),
    (v_q3_id, 'The V-2 into V-3', true, 2),
    (v_q3_id, 'The Me 262 Jet', false, 3),
    (v_q3_id, 'The Tiger II Tank', false, 4);

    -- Q4
    INSERT INTO quiz_questions (quiz_id, question_text, question_order, explanation)
    VALUES (v_quiz_id, 'According to the story, how many additional people might have died in the Holocaust if the war continued until 1946/47?', 4, 'The story estimates the total death toll could have reached 9 to 11 million because the death camps would have operated for two extra years.')
    RETURNING id INTO v_q4_id;
    INSERT INTO quiz_answers (question_id, answer_text, is_correct, answer_order) VALUES
    (v_q4_id, '2 million', false, 1),
    (v_q4_id, '5 million', false, 2),
    (v_q4_id, '9 to 11 million', true, 3),
    (v_q4_id, '20 million', false, 4);

    -- Q5
    INSERT INTO quiz_questions (quiz_id, question_text, question_order, explanation)
    VALUES (v_quiz_id, 'Which US President inherited the failing war effort after Franklin Roosevelt’s health declined in early 1945?', 5, 'Harry Truman took over after Roosevelt''s death, inheriting the Manhattan Project and the burden of the failing European front.')
    RETURNING id INTO v_q5_id;
    INSERT INTO quiz_answers (question_id, answer_text, is_correct, answer_order) VALUES
    (v_q5_id, 'Dwight D. Eisenhower', false, 1),
    (v_q5_id, 'Harry Truman', true, 2),
    (v_q5_id, 'Douglas MacArthur', false, 3),
    (v_q5_id, 'George Patton', false, 4);

    -- Q6
    INSERT INTO quiz_questions (quiz_id, question_text, question_order, explanation)
    VALUES (v_quiz_id, 'Which German city was the FIRST target of an American atomic strike in August 1946?', 6, 'Hamburg was chosen for strategic reasons as the first nuclear target, resulting in 140,000 deaths.')
    RETURNING id INTO v_q6_id;
    INSERT INTO quiz_answers (question_id, answer_text, is_correct, answer_order) VALUES
    (v_q6_id, 'Berlin', false, 1),
    (v_q6_id, 'Munich', false, 2),
    (v_q6_id, 'Hamburg', true, 3),
    (v_q6_id, 'Frankfurt', false, 4);

    -- Q7
    INSERT INTO quiz_questions (quiz_id, question_text, question_order, explanation)
    VALUES (v_quiz_id, 'What event finally led to the German unconditional surrender on September 12, 1946?', 7, 'After the second bomb hit Munich, Wehrmacht generals arrested Hitler in a coup and surrendered.')
    RETURNING id INTO v_q7_id;
    INSERT INTO quiz_answers (question_id, answer_text, is_correct, answer_order) VALUES
    (v_q7_id, 'A Soviet invasion of Berlin', false, 1),
    (v_q7_id, 'A second atomic bomb on Munich & a military coup', true, 2),
    (v_q7_id, 'Hitler''s suicide', false, 3),
    (v_q7_id, 'A mass uprising in Paris', false, 4);

    -- Q8
    INSERT INTO quiz_questions (quiz_id, question_text, question_order, explanation)
    VALUES (v_quiz_id, 'How does the "Cold War" in this alternate world differ from our own?', 8, 'The failure of D-Day and the use of nuclear weapons left the USSR bitter and suspicious, making the Cold War even more dangerous.')
    RETURNING id INTO v_q8_id;
    INSERT INTO quiz_answers (question_id, answer_text, is_correct, answer_order) VALUES
    (v_q8_id, 'It never happens because Germany wins', false, 1),
    (v_q8_id, 'It is a permanent state of near-war', true, 2),
    (v_q8_id, 'Russia and America become best friends', false, 3),
    (v_q8_id, 'Europe becomes the global superpower', false, 4);

    -- 3. Insert Results
    INSERT INTO quiz_results (quiz_id, min_score, max_score, result_title, result_description, share_text) VALUES
    (v_quiz_id, 0, 3, 'Frontline Casualty', 'You wouldn''t have survived the chaos of the English Channel. The history of the "Greatest Disaster" is lost on you.', 'I just scored as a Frontline Casualty on the D-Day Failed Quiz! Can you survive?'),
    (v_quiz_id, 4, 6, 'Resistance Fighter', 'You know enough to survive the occupation, but the high-level politics and secret weapons are still a mystery.', 'I scored as a Resistance Fighter on the D-Day Failed Quiz! Take the challenge.'),
    (v_quiz_id, 7, 8, 'Strategic Mastermind', 'You have a deep understanding of the thin margins of history. You recognize the rescue mission that D-Day truly was.', 'I scored as a Strategic Mastermind on the D-Day Failed Quiz! You can''t beat me.');

END $$;
