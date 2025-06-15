
import { supabase } from "@/integrations/supabase/client";

export interface MCQData {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface FlashcardData {
  front: string;
  back: string;
}

export const saveQuizSession = async (
  title: string,
  category: string,
  mcqs: MCQData[],
  isPublic: boolean = true // Default to public for unauthenticated users
) => {
  try {
    // Get current user if authenticated, otherwise use null
    const { data: { user } } = await supabase.auth.getUser();
    
    // For unauthenticated users, make sessions public by default
    const sessionIsPublic = user ? isPublic : true;
    
    // Create quiz session
    const { data: session, error: sessionError } = await supabase
      .from('quiz_sessions')
      .insert({
        title,
        category,
        user_id: user?.id || null,
        is_public: sessionIsPublic
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Session error:', sessionError);
      throw sessionError;
    }

    // Save MCQ questions  -- ensure correct_index is never null
    const questions = mcqs.map((mcq, index) => ({
      quiz_session_id: session.id,
      question: mcq.question,
      options: mcq.options,
      correct_index:
        typeof mcq.correctIndex === "number" && mcq.correctIndex >= 0 && mcq.correctIndex <= 3
          ? mcq.correctIndex
          : 0, // fallback to 0 if missing/invalid
      explanation: mcq.explanation,
      order_index: index
    }));

    const { error: questionsError } = await supabase
      .from('mcq_questions')
      .insert(questions);

    if (questionsError) {
      console.error('Questions error:', questionsError);
      throw questionsError;
    }

    return session.id;
  } catch (error) {
    console.error('Error saving quiz session:', error);
    throw error;
  }
};

export const saveFlashcardSession = async (
  title: string,
  category: string,
  flashcards: FlashcardData[],
  isPublic: boolean = true // Default to public for unauthenticated users
) => {
  try {
    // Get current user if authenticated, otherwise use null
    const { data: { user } } = await supabase.auth.getUser();
    
    // For unauthenticated users, make sessions public by default
    const sessionIsPublic = user ? isPublic : true;
    
    // Create flashcard session
    const { data: session, error: sessionError } = await supabase
      .from('flashcard_sessions')
      .insert({
        title,
        category,
        user_id: user?.id || null,
        is_public: sessionIsPublic
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Session error:', sessionError);
      throw sessionError;
    }

    // Save flashcards
    const cards = flashcards.map((card, index) => ({
      flashcard_session_id: session.id,
      front: card.front,
      back: card.back,
      order_index: index
    }));

    const { error: cardsError } = await supabase
      .from('flashcards')
      .insert(cards);

    if (cardsError) {
      console.error('Cards error:', cardsError);
      throw cardsError;
    }

    return session.id;
  } catch (error) {
    console.error('Error saving flashcard session:', error);
    throw error;
  }
};

export const getQuizSession = async (sessionId: string) => {
  try {
    const { data: session, error: sessionError } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError) throw sessionError;

    const { data: questions, error: questionsError } = await supabase
      .from('mcq_questions')
      .select('*')
      .eq('quiz_session_id', sessionId)
      .order('order_index');

    if (questionsError) throw questionsError;

    return {
      session,
      questions: questions.map(q => ({
        question: q.question,
        options: q.options as string[],
        correctIndex: q.correct_index,
        explanation: q.explanation
      }))
    };
  } catch (error) {
    console.error('Error getting quiz session:', error);
    throw error;
  }
};

export const getFlashcardSession = async (sessionId: string) => {
  try {
    const { data: session, error: sessionError } = await supabase
      .from('flashcard_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError) throw sessionError;

    const { data: flashcards, error: cardsError } = await supabase
      .from('flashcards')
      .select('*')
      .eq('flashcard_session_id', sessionId)
      .order('order_index');

    if (cardsError) throw cardsError;

    return {
      session,
      flashcards: flashcards.map(card => ({
        front: card.front,
        back: card.back
      }))
    };
  } catch (error) {
    console.error('Error getting flashcard session:', error);
    throw error;
  }
};
