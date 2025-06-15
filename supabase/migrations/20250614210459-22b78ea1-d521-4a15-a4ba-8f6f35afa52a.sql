
-- Create table for storing quiz sessions
CREATE TABLE public.quiz_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  title TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_public BOOLEAN DEFAULT false
);

-- Create table for storing MCQ questions
CREATE TABLE public.mcq_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_session_id UUID REFERENCES public.quiz_sessions(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of 4 options
  correct_index INTEGER NOT NULL CHECK (correct_index >= 0 AND correct_index <= 3),
  explanation TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for storing flashcards
CREATE TABLE public.flashcard_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  title TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_public BOOLEAN DEFAULT false
);

-- Create table for individual flashcards
CREATE TABLE public.flashcards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  flashcard_session_id UUID REFERENCES public.flashcard_sessions(id) ON DELETE CASCADE NOT NULL,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcq_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcard_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quiz_sessions
CREATE POLICY "Users can view their own quiz sessions and public ones" 
  ON public.quiz_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create their own quiz sessions" 
  ON public.quiz_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quiz sessions" 
  ON public.quiz_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quiz sessions" 
  ON public.quiz_sessions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for mcq_questions
CREATE POLICY "Users can view questions from accessible quiz sessions" 
  ON public.mcq_questions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.quiz_sessions 
      WHERE id = quiz_session_id 
      AND (user_id = auth.uid() OR is_public = true)
    )
  );

CREATE POLICY "Users can create questions in their own quiz sessions" 
  ON public.mcq_questions 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quiz_sessions 
      WHERE id = quiz_session_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update questions in their own quiz sessions" 
  ON public.mcq_questions 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.quiz_sessions 
      WHERE id = quiz_session_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete questions from their own quiz sessions" 
  ON public.mcq_questions 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.quiz_sessions 
      WHERE id = quiz_session_id 
      AND user_id = auth.uid()
    )
  );

-- RLS Policies for flashcard_sessions
CREATE POLICY "Users can view their own flashcard sessions and public ones" 
  ON public.flashcard_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create their own flashcard sessions" 
  ON public.flashcard_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own flashcard sessions" 
  ON public.flashcard_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own flashcard sessions" 
  ON public.flashcard_sessions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for flashcards
CREATE POLICY "Users can view flashcards from accessible sessions" 
  ON public.flashcards 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.flashcard_sessions 
      WHERE id = flashcard_session_id 
      AND (user_id = auth.uid() OR is_public = true)
    )
  );

CREATE POLICY "Users can create flashcards in their own sessions" 
  ON public.flashcards 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.flashcard_sessions 
      WHERE id = flashcard_session_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update flashcards in their own sessions" 
  ON public.flashcards 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.flashcard_sessions 
      WHERE id = flashcard_session_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete flashcards from their own sessions" 
  ON public.flashcards 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.flashcard_sessions 
      WHERE id = flashcard_session_id 
      AND user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_quiz_sessions_user_id ON public.quiz_sessions(user_id);
CREATE INDEX idx_quiz_sessions_public ON public.quiz_sessions(is_public) WHERE is_public = true;
CREATE INDEX idx_mcq_questions_session_id ON public.mcq_questions(quiz_session_id);
CREATE INDEX idx_flashcard_sessions_user_id ON public.flashcard_sessions(user_id);
CREATE INDEX idx_flashcard_sessions_public ON public.flashcard_sessions(is_public) WHERE is_public = true;
CREATE INDEX idx_flashcards_session_id ON public.flashcards(flashcard_session_id);
