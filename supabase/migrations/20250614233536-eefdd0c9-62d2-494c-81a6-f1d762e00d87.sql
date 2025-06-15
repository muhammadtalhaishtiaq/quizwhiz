
-- Update RLS policies to allow unauthenticated users to create public sessions

-- Drop existing policies for quiz_sessions
DROP POLICY IF EXISTS "Users can view their own quiz sessions and public ones" ON public.quiz_sessions;
DROP POLICY IF EXISTS "Users can create their own quiz sessions" ON public.quiz_sessions;
DROP POLICY IF EXISTS "Users can update their own quiz sessions" ON public.quiz_sessions;
DROP POLICY IF EXISTS "Users can delete their own quiz sessions" ON public.quiz_sessions;

-- Create new policies that allow unauthenticated access for public sessions
CREATE POLICY "Anyone can view public quiz sessions" 
  ON public.quiz_sessions 
  FOR SELECT 
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Anyone can create public quiz sessions" 
  ON public.quiz_sessions 
  FOR INSERT 
  WITH CHECK (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can update their own quiz sessions or public ones" 
  ON public.quiz_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can delete their own quiz sessions or public ones" 
  ON public.quiz_sessions 
  FOR DELETE 
  USING (auth.uid() = user_id OR is_public = true);

-- Update policies for mcq_questions to allow access to public quiz sessions
DROP POLICY IF EXISTS "Users can view questions from accessible quiz sessions" ON public.mcq_questions;
DROP POLICY IF EXISTS "Users can create questions in their own quiz sessions" ON public.mcq_questions;
DROP POLICY IF EXISTS "Users can update questions in their own quiz sessions" ON public.mcq_questions;
DROP POLICY IF EXISTS "Users can delete questions from their own quiz sessions" ON public.mcq_questions;

CREATE POLICY "Anyone can view questions from public quiz sessions" 
  ON public.mcq_questions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.quiz_sessions 
      WHERE id = quiz_session_id 
      AND (is_public = true OR user_id = auth.uid())
    )
  );

CREATE POLICY "Anyone can create questions in public quiz sessions" 
  ON public.mcq_questions 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quiz_sessions 
      WHERE id = quiz_session_id 
      AND (is_public = true OR user_id = auth.uid())
    )
  );

CREATE POLICY "Anyone can update questions in public quiz sessions" 
  ON public.mcq_questions 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.quiz_sessions 
      WHERE id = quiz_session_id 
      AND (is_public = true OR user_id = auth.uid())
    )
  );

CREATE POLICY "Anyone can delete questions from public quiz sessions" 
  ON public.mcq_questions 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.quiz_sessions 
      WHERE id = quiz_session_id 
      AND (is_public = true OR user_id = auth.uid())
    )
  );

-- Update policies for flashcard_sessions
DROP POLICY IF EXISTS "Users can view their own flashcard sessions and public ones" ON public.flashcard_sessions;
DROP POLICY IF EXISTS "Users can create their own flashcard sessions" ON public.flashcard_sessions;
DROP POLICY IF EXISTS "Users can update their own flashcard sessions" ON public.flashcard_sessions;
DROP POLICY IF EXISTS "Users can delete their own flashcard sessions" ON public.flashcard_sessions;

CREATE POLICY "Anyone can view public flashcard sessions" 
  ON public.flashcard_sessions 
  FOR SELECT 
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Anyone can create public flashcard sessions" 
  ON public.flashcard_sessions 
  FOR INSERT 
  WITH CHECK (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can update their own flashcard sessions or public ones" 
  ON public.flashcard_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can delete their own flashcard sessions or public ones" 
  ON public.flashcard_sessions 
  FOR DELETE 
  USING (auth.uid() = user_id OR is_public = true);

-- Update policies for flashcards
DROP POLICY IF EXISTS "Users can view flashcards from accessible sessions" ON public.flashcards;
DROP POLICY IF EXISTS "Users can create flashcards in their own sessions" ON public.flashcards;
DROP POLICY IF EXISTS "Users can update flashcards in their own sessions" ON public.flashcards;
DROP POLICY IF EXISTS "Users can delete flashcards from their own sessions" ON public.flashcards;

CREATE POLICY "Anyone can view flashcards from public sessions" 
  ON public.flashcards 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.flashcard_sessions 
      WHERE id = flashcard_session_id 
      AND (is_public = true OR user_id = auth.uid())
    )
  );

CREATE POLICY "Anyone can create flashcards in public sessions" 
  ON public.flashcards 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.flashcard_sessions 
      WHERE id = flashcard_session_id 
      AND (is_public = true OR user_id = auth.uid())
    )
  );

CREATE POLICY "Anyone can update flashcards in public sessions" 
  ON public.flashcards 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.flashcard_sessions 
      WHERE id = flashcard_session_id 
      AND (is_public = true OR user_id = auth.uid())
    )
  );

CREATE POLICY "Anyone can delete flashcards from public sessions" 
  ON public.flashcards 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.flashcard_sessions 
      WHERE id = flashcard_session_id 
      AND (is_public = true OR user_id = auth.uid())
    )
  );
