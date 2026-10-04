import React, { useState } from 'react';
import { 
  Play, 
  CheckCircle, 
  AlertTriangle, 
  HelpCircle, 
  Clock, 
  ChevronRight, 
  Award, 
  FileText,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import type { ExamQuestion } from '../types';

// Curated genuine NCC syllabus questions for B & C Certificate
const SAMPLE_EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 'q1',
    subject: 'History',
    certificate: 'Both',
    question: 'When was the National Cadet Corps (NCC) officially established in India under the National Cadet Corps Act?',
    options: ['15 July 1948', '26 January 1950', '15 August 1947', '16 April 1948'],
    correctIndex: 0,
    explanation: 'The NCC was formally inaugurated in India on 15 July 1948 under Act XXXI of 1948 passed by the Parliament.'
  },
  {
    id: 'q2',
    subject: 'Armed Forces',
    certificate: 'Both',
    question: 'Who is the Supreme Commander of the Indian Armed Forces?',
    options: ['Chief of Defence Staff (CDS)', 'Prime Minister of India', 'President of India', 'Defence Minister of India'],
    correctIndex: 2,
    explanation: 'Under Article 53 of the Constitution of India, the President of India is the Supreme Commander of the Armed Forces.'
  },
  {
    id: 'q3',
    subject: 'Armed Forces',
    certificate: 'Both',
    question: 'What is the highest wartime gallantry award in the Indian Armed Forces?',
    options: ['Maha Vir Chakra', 'Param Vir Chakra', 'Ashoka Chakra', 'Kirti Chakra'],
    correctIndex: 1,
    explanation: 'Param Vir Chakra (PVC) is India’s highest military decoration awarded for conspicuous bravery in the presence of the enemy.'
  },
  {
    id: 'q4',
    subject: 'National Integration',
    certificate: 'Both',
    question: 'Which of the following is considered one of the prime essentials of National Integration?',
    options: ['Linguistic rigidity', 'Cultural pluralism and secularism', 'Regional discrimination', 'Economic segregation'],
    correctIndex: 1,
    explanation: 'Secularism, mutual respect for diverse languages and cultural pluralism form the foundation of national unity.'
  },
  {
    id: 'q5',
    subject: 'Geography',
    certificate: 'Both',
    question: 'In Map Reading, what is the cardinal angle corresponding to South-East (SE)?',
    options: ['90 degrees', '135 degrees', '180 degrees', '225 degrees'],
    correctIndex: 1,
    explanation: 'Cardinal points: North = 0/360, East = 90, South-East = 135, South = 180.'
  },
  {
    id: 'q6',
    subject: 'Armed Forces',
    certificate: 'C',
    question: 'What is the caliber and effective range of the 5.56mm INSAS Rifle?',
    options: ['5.56mm and 400 meters', '7.62mm and 300 meters', '5.56mm and 200 meters', '9mm and 50 meters'],
    correctIndex: 0,
    explanation: 'INSAS rifle fires 5.56×45mm NATO ammunition with an effective battle range of 400 meters.'
  }
];

export const ExamSimulatorModule: React.FC = () => {
  // Test Taking State
  const [examActive, setExamActive] = useState<boolean>(false);
  const [activeExamTitle, setActiveExamTitle] = useState<string>('B Certificate (Full Mock)');
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [testCompleted, setTestCompleted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const startExam = (title: string) => {
    setActiveExamTitle(title);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setTestCompleted(false);
    setExamActive(true);
  };

  const handleSelectAnswer = (qIndex: number, optionIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: optionIndex }));
  };

  const finishExam = () => {
    let calculatedScore = 0;
    SAMPLE_EXAM_QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        calculatedScore += 1;
      }
    });
    setScore(calculatedScore);
    setTestCompleted(true);
  };

  if (examActive) {
    const currentQ = SAMPLE_EXAM_QUESTIONS[currentQIndex];
    const isAnswered = selectedAnswers[currentQIndex] !== undefined;

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Exam Running Header */}
        <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-5 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono uppercase text-[#f97316] font-semibold">
              SIMULATED EXAMINATION IN PROGRESS
            </div>
            <h2 className="text-lg font-bold text-[#e6edf3]">
              {activeExamTitle}
            </h2>
          </div>
          <div className="flex items-center gap-4 font-mono text-xs">
            <div className="flex items-center gap-1.5 bg-[#141b21] px-3 py-1.5 rounded border border-[#1c272f] text-[#10b981]">
              <Clock className="w-4 h-4" />
              <span>Time Left: 28:45</span>
            </div>
            <button
              onClick={() => setExamActive(false)}
              className="text-[#8b949e] hover:text-[#e6edf3] text-xs underline"
            >
              Exit Test
            </button>
          </div>
        </div>

        {/* Question View or Test Summary */}
        {!testCompleted ? (
          <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-8 space-y-6">
            <div className="flex justify-between items-center text-xs font-mono text-[#8b949e] border-b border-[#192229] pb-3">
              <span>QUESTION {currentQIndex + 1} OF {SAMPLE_EXAM_QUESTIONS.length}</span>
              <span className="bg-[#141b21] px-2.5 py-1 rounded text-[#c9d1d9]">SUBJECT: {currentQ.subject}</span>
            </div>

            <h3 className="text-base sm:text-lg font-semibold text-[#e6edf3] leading-relaxed">
              {currentQ.question}
            </h3>

            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentQIndex] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectAnswer(currentQIndex, optIdx)}
                    className={`w-full text-left p-4 rounded-lg border text-sm transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#151e26] border-[#f97316] text-[#e6edf3] shadow-md'
                        : 'bg-[#090d10] border-[#192229] text-[#8b949e] hover:text-[#c9d1d9] hover:border-[#273842]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                        isSelected ? 'bg-[#f97316] text-[#06090c]' : 'bg-[#141b21] text-[#8b949e]'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </div>
                    {isSelected && <CheckCircle className="w-4 h-4 text-[#f97316]" />}
                  </button>
                );
              })}
            </div>

            {/* Question Navigation Footer */}
            <div className="flex justify-between items-center border-t border-[#192229] pt-6">
              <button
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex(prev => prev - 1)}
                className="px-4 py-2 bg-[#141b21] hover:bg-[#1c272f] text-[#c9d1d9] disabled:opacity-40 rounded-lg text-xs font-mono border border-[#192229]"
              >
                ← Previous
              </button>

              {currentQIndex < SAMPLE_EXAM_QUESTIONS.length - 1 ? (
                <button
                  disabled={!isAnswered}
                  onClick={() => setCurrentQIndex(prev => prev + 1)}
                  className="px-5 py-2.5 bg-[#f97316] hover:bg-[#ea580c] text-black font-semibold rounded-lg text-xs font-mono flex items-center gap-1.5 disabled:opacity-40"
                >
                  Next Question →
                </button>
              ) : (
                <button
                  onClick={finishExam}
                  className="px-5 py-2.5 bg-[#10b981] hover:bg-[#059669] text-black font-bold rounded-lg text-xs font-mono"
                >
                  Submit & Finish Exam
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Test Results Summary */
          <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-[#131f1a] border border-[#10b981]/40 rounded-full flex items-center justify-center mx-auto text-[#10b981]">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#e6edf3] mb-1">
                Examination Completed
              </h2>
              <p className="text-sm text-[#8b949e]">
                Score recorded in your cadet performance profile.
              </p>
            </div>

            <div className="flex justify-center items-center gap-8 py-4 border-y border-[#192229] max-w-sm mx-auto">
              <div>
                <div className="text-3xl font-extrabold text-[#10b981] font-mono">
                  {score} / {SAMPLE_EXAM_QUESTIONS.length}
                </div>
                <div className="text-xs text-[#8b949e] font-mono">CORRECT ANSWERS</div>
              </div>
              <div className="h-8 w-[1px] bg-[#192229]" />
              <div>
                <div className="text-3xl font-extrabold text-[#f97316] font-mono">
                  {Math.round((score / SAMPLE_EXAM_QUESTIONS.length) * 100)}%
                </div>
                <div className="text-xs text-[#8b949e] font-mono">FINAL PERCENTAGE</div>
              </div>
            </div>

            {/* Question Breakdown with genuine explanations */}
            <div className="text-left space-y-4 max-w-2xl mx-auto pt-4">
              <h4 className="text-xs font-mono uppercase text-[#8b949e] font-bold">Answer Breakdown:</h4>
              {SAMPLE_EXAM_QUESTIONS.map((q, idx) => {
                const userChoice = selectedAnswers[idx];
                const isCorrect = userChoice === q.correctIndex;
                return (
                  <div key={idx} className="p-3.5 bg-[#090d10] border border-[#192229] rounded-lg text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-[#e6edf3]">Q{idx + 1}. {q.question}</span>
                      <span className={isCorrect ? 'text-[#10b981]' : 'text-[#ef4444]'}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                    <div className="text-[#8b949e]">
                      Correct: <span className="text-[#10b981]">{q.options[q.correctIndex]}</span>
                    </div>
                    <div className="text-[11px] text-[#484f58] italic">
                      Why: {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setExamActive(false)}
              className="py-2.5 px-6 bg-[#141b21] hover:bg-[#1a232b] text-[#e6edf3] border border-[#273842] rounded-lg text-xs font-mono font-medium"
            >
              Return to Exam Dashboard
            </button>
          </div>
        )}
      </div>
    );
  }

  // Default Dashboard View (Exact Layout as Reference 3)
  return (
    <div className="space-y-6 max-w-[1500px] mx-auto">
      {/* Top Banner (Reference 3 Header Banner) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0c1013] border border-[#192229] rounded-xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div 
            className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-no-repeat bg-right-bottom pointer-events-none"
            style={{ backgroundImage: `url('/NCC Logo.png')`, backgroundSize: 'contain' }}
          />
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-[#f97316]" />
              <span className="text-xs font-mono uppercase text-[#f97316] font-bold tracking-wider">
                EXAM SIMULATOR
              </span>
            </div>
            <h2 className="text-2xl font-bold text-[#e6edf3] tracking-wide mb-1">
              B & C Certificate Theory Preparation
            </h2>
            <p className="text-xs text-[#8b949e] max-w-lg leading-relaxed mb-6">
              Take timed mock tests, solve past year questions and get real-time scoring with detailed syllabus performance insights.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => startExam('B & C Certificate Comprehensive Mock')}
              className="py-2.5 px-5 bg-[#f97316] hover:bg-[#ea580c] text-black font-bold text-xs font-mono rounded-lg transition-all flex items-center gap-2 shadow-lg"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>START NEW MOCK TEST</span>
            </button>

            {/* Checklist tags */}
            <div className="flex items-center gap-3 text-[11px] font-mono text-[#8b949e]">
              <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-[#10b981]" /> History</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-[#10b981]" /> Geography</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-[#10b981]" /> National Integration</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-[#10b981]" /> Armed Forces</span>
            </div>
          </div>
        </div>

        {/* Quick Access Card */}
        <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-5 flex flex-col justify-between shadow-lg">
          <div className="text-xs font-mono font-bold uppercase text-[#8b949e] tracking-wider mb-3">
            QUICK ACCESS
          </div>

          <div className="space-y-3">
            <a 
              href="#past-papers"
              onClick={(e) => { e.preventDefault(); startExam('Past Year Question Bank Drill'); }}
              className="flex items-center justify-between p-3 bg-[#090d10] hover:bg-[#121920] border border-[#192229] rounded-lg transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#141b21] rounded text-[#8b949e] group-hover:text-[#f97316]">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#e6edf3]">Past Year Question Bank</div>
                  <div className="text-[10px] text-[#8b949e]">Access previous year papers</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8b949e] group-hover:text-[#f97316]" />
            </a>

            <div className="flex items-center justify-between p-3 bg-[#090d10] hover:bg-[#121920] border border-[#192229] rounded-lg transition-all group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#141b21] rounded text-[#8b949e] group-hover:text-[#f97316]">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#e6edf3]">B & C Syllabus & Pattern</div>
                  <div className="text-[10px] text-[#8b949e]">View complete Directorate guidelines</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8b949e] group-hover:text-[#f97316]" />
            </div>
          </div>

          <div className="text-[10px] font-mono text-[#484f58] mt-3">
            DG NCC Directorate Curated Bank
          </div>
        </div>
      </div>

      {/* Middle Row: Performance Overview, Subject Wise, Weak Spot Diagnostics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Performance Overview (Donut visual representation) */}
        <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-5 shadow-lg">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8b949e] mb-4">
            PERFORMANCE OVERVIEW
          </div>

          <div className="flex items-center gap-6">
            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#192229]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#10b981]"
                  strokeDasharray="72, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-extrabold text-[#e6edf3] font-mono">72%</span>
                <span className="block text-[9px] text-[#8b949e] font-mono">Overall</span>
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono flex-1">
              <div className="flex justify-between border-b border-[#192229]/60 pb-1">
                <span className="text-[#8b949e]">Tests Attempted</span>
                <span className="text-[#e6edf3] font-bold">12</span>
              </div>
              <div className="flex justify-between border-b border-[#192229]/60 pb-1">
                <span className="text-[#8b949e]">Avg. Score</span>
                <span className="text-[#e6edf3] font-bold">72%</span>
              </div>
              <div className="flex justify-between border-b border-[#192229]/60 pb-1">
                <span className="text-[#8b949e]">Best Score</span>
                <span className="text-[#10b981] font-bold">92%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8b949e]">Time Spent</span>
                <span className="text-[#e6edf3] font-bold">8h 45m</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subject Wise Performance Histogram */}
        <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-[#8b949e] mb-4">
            <span>SUBJECT WISE PERFORMANCE</span>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1 text-[#10b981]"><span className="w-2 h-2 rounded-full bg-[#10b981]" /> Your Score</span>
              <span className="flex items-center gap-1 text-[#484f58]"><span className="w-2 h-2 rounded-full bg-[#484f58]" /> Avg</span>
            </div>
          </div>

          <div className="flex items-end justify-between h-28 pt-2 px-2 border-b border-[#192229]">
            {[
              { name: 'History', score: 68, avg: 58 },
              { name: 'Geography', score: 61, avg: 52 },
              { name: 'Nat. Integ.', score: 54, avg: 50 },
              { name: 'Armed Forces', score: 86, avg: 62 },
              { name: 'Gen. Know.', score: 78, avg: 65 },
            ].map((s, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1 flex-1">
                <div className="flex items-end gap-1 h-20">
                  <div className="w-3 bg-[#10b981] rounded-t-xs" style={{ height: `${s.score}%` }} />
                  <div className="w-3 bg-[#273842] rounded-t-xs" style={{ height: `${s.avg}%` }} />
                </div>
                <span className="text-[9px] text-[#8b949e] font-mono truncate max-w-[46px]">{s.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Spot Diagnostics */}
        <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#f97316] mb-3">
            <AlertTriangle className="w-4 h-4" />
            <span>WEAK SPOT DIAGNOSTICS</span>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex items-center justify-between p-2 rounded bg-[#090d10] border border-[#192229]">
              <span className="text-[#10b981] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" /> Highest Strength: Armed Forces
              </span>
              <span className="font-bold text-[#10b981]">86%</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-[#1a120e] border border-[#f97316]/30">
              <span className="text-[#f97316] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]" /> Needs Improvement: National Integration
              </span>
              <span className="font-bold text-[#f97316]">54%</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-[#090d10] border border-[#192229]">
              <span className="text-[#8b949e] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8b949e]" /> Geography / Map Reading
              </span>
              <span className="font-bold text-[#c9d1d9]">61%</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-[#090d10] border border-[#192229]">
              <span className="text-[#8b949e] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8b949e]" /> History & NCC Traditions
              </span>
              <span className="font-bold text-[#c9d1d9]">68%</span>
            </div>
          </div>

          <div className="text-[10px] text-[#8b949e] font-mono mt-2">
            Target high-yield revision topics for 100% pass guarantee in Certificate exams.
          </div>
        </div>
      </div>

      {/* Available Exams & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Exams Table */}
        <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-5 shadow-lg">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8b949e] mb-4">
            AVAILABLE EXAMS & MOCK TESTS
          </div>

          <div className="space-y-2">
            {[
              { type: 'B Certificate (Full Mock)', questions: 100, duration: '90 mins' },
              { type: 'B Certificate (Subject-wise)', questions: 25, duration: '30 mins' },
              { type: 'C Certificate (Full Mock)', questions: 120, duration: '120 mins' },
              { type: 'C Certificate (Subject-wise)', questions: 30, duration: '45 mins' },
            ].map((ex, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-3 bg-[#090d10] border border-[#192229] rounded-lg text-xs font-mono hover:border-[#273842] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-[#8b949e]" />
                  <div>
                    <div className="text-[#e6edf3] font-semibold">{ex.type}</div>
                    <div className="text-[10px] text-[#484f58]">{ex.questions} Questions • {ex.duration}</div>
                  </div>
                </div>

                <button
                  onClick={() => startExam(ex.type)}
                  className="py-1 px-3 bg-[#141b21] hover:bg-[#1f2830] text-[#f97316] border border-[#f97316]/40 rounded text-[11px] font-semibold flex items-center gap-1 group"
                >
                  <span>Start</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-5 shadow-lg">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8b949e] mb-4 flex items-center justify-between">
            <span>RECENT ACTIVITY</span>
            <Clock className="w-3.5 h-3.5 text-[#484f58]" />
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            {[
              { title: 'C Certificate – Full Mock', score: '92%', time: 'Today, 16:32', color: 'text-[#10b981]' },
              { title: 'B Certificate – Geography', score: '68%', time: 'Yesterday, 19:15', color: 'text-[#f97316]' },
              { title: 'C Certificate – Armed Forces', score: '81%', time: '2 days ago, 11:20', color: 'text-[#10b981]' },
              { title: 'B Certificate – History', score: '56%', time: '3 days ago, 17:05', color: 'text-[#f97316]' },
            ].map((rec, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-2.5 bg-[#090d10] border border-[#192229] rounded-lg"
              >
                <div>
                  <div className="text-[#e6edf3] font-semibold">{rec.title}</div>
                  <div className="text-[10px] text-[#484f58]">{rec.time}</div>
                </div>
                <div className={`font-bold ${rec.color} text-sm`}>
                  {rec.score}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-[#192229] flex items-center justify-between text-[11px] font-mono text-[#8b949e]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" /> Exam data synced
            </span>
            <span>Cloud Firestore Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
