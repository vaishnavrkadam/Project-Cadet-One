import React, { useState } from 'react';
import { 
  Compass, 
  Target, 
  Brain, 
  Users, 
  MessageSquare, 
  HelpCircle, 
  CheckCircle2, 
  Play, 
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';

interface SSBStage {
  id: string;
  name: string;
  days: string;
  category: 'Stage I (Screening)' | 'Stage II (Testing)';
  desc: string;
  tests: { name: string; tips: string; questionsCount: number }[];
}

export const SSBPrepModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'oir' | 'ppdt' | 'psych' | 'gto' | 'interview'>('oir');
  const [oirTestStarted, setOirTestStarted] = useState(false);
  const [oirScore, setOirScore] = useState<number | null>(null);
  const [oirAnswers, setOirAnswers] = useState<Record<number, number>>({});

  const oirPracticeQuestions = [
    {
      q: 'Which number continues the series: 3, 7, 15, 31, 63, ... ?',
      options: ['125', '127', '128', '131'],
      correct: 1, // 127 (2n + 1)
      rationale: 'Pattern is each number multiplied by 2 plus 1: 63 * 2 + 1 = 127.'
    },
    {
      q: 'If SOLDIER is coded as JFSLEKT, how is OFFICER coded in that sequence?',
      options: ['PGGJDGS', 'PGHJFES', 'PGJDFGS', 'OEGIDER'],
      correct: 0,
      rationale: 'Standard alphabetical step cipher applied to military designations.'
    },
    {
      q: 'Which word does NOT belong with the others?',
      options: ['Brigadier', 'Commodore', 'Air Commodore', 'Superintendent'],
      correct: 3,
      rationale: 'Superintendent is a police rank; others are One-Star armed forces officers.'
    }
  ];

  const handleFinishOIR = () => {
    let s = 0;
    oirPracticeQuestions.forEach((q, i) => {
      if (oirAnswers[i] === q.correct) s++;
    });
    setOirScore(s);
  };

  return (
    <div className="space-y-6 max-w-[1500px] mx-auto">
      {/* Top Header */}
      <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-6 relative overflow-hidden flex flex-col justify-between shadow-xl">
        <div className="z-10">
          <div className="flex items-center gap-2 mb-2">
            <Compass className="w-4 h-4 text-[#f97316]" />
            <span className="text-xs font-mono uppercase text-[#f97316] font-bold tracking-wider">
              OFFICER SELECTION CELL
            </span>
          </div>

          <h2 className="text-2xl font-bold text-[#e6edf3] tracking-wide mb-1">
            SSB (Services Selection Board) Preparation
          </h2>
          <p className="text-xs text-[#8b949e] max-w-2xl leading-relaxed">
            Curated preparation module for NCC Special Entry Scheme (Indian Army, Navy, and Air Force). Master Stage I Screening and Stage II Psychological, GTO and Interview techniques.
          </p>
        </div>

        {/* 5-Day SSB Breakdown Badges */}
        <div className="z-10 grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6">
          <button
            onClick={() => setActiveTab('oir')}
            className={`p-3 rounded-lg border text-left transition-all ${
              activeTab === 'oir' 
                ? 'bg-[#151e26] border-[#f97316] text-[#e6edf3]' 
                : 'bg-[#090d10] border-[#192229] text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            <div className={`text-xs font-bold font-mono ${activeTab === 'oir' ? 'text-[#f97316]' : 'text-[#e6edf3]'}`}>
              Stage I: OIR
            </div>
            <div className="text-[10px] text-[#8b949e]">Officer Intelligence</div>
          </button>

          <button
            onClick={() => setActiveTab('ppdt')}
            className={`p-3 rounded-lg border text-left transition-all ${
              activeTab === 'ppdt' 
                ? 'bg-[#151e26] border-[#f97316] text-[#e6edf3]' 
                : 'bg-[#090d10] border-[#192229] text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            <div className={`text-xs font-bold font-mono ${activeTab === 'ppdt' ? 'text-[#f97316]' : 'text-[#e6edf3]'}`}>
              Stage I: PPDT
            </div>
            <div className="text-[10px] text-[#8b949e]">Picture Perception</div>
          </button>

          <button
            onClick={() => setActiveTab('psych')}
            className={`p-3 rounded-lg border text-left transition-all ${
              activeTab === 'psych' 
                ? 'bg-[#151e26] border-[#f97316] text-[#e6edf3]' 
                : 'bg-[#090d10] border-[#192229] text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            <div className={`text-xs font-bold font-mono ${activeTab === 'psych' ? 'text-[#f97316]' : 'text-[#e6edf3]'}`}>
              Stage II: Psych
            </div>
            <div className="text-[10px] text-[#8b949e]">TAT / WAT / SRT / SD</div>
          </button>

          <button
            onClick={() => setActiveTab('gto')}
            className={`p-3 rounded-lg border text-left transition-all ${
              activeTab === 'gto' 
                ? 'bg-[#151e26] border-[#f97316] text-[#e6edf3]' 
                : 'bg-[#090d10] border-[#192229] text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            <div className={`text-xs font-bold font-mono ${activeTab === 'gto' ? 'text-[#f97316]' : 'text-[#e6edf3]'}`}>
              Stage II: GTO
            </div>
            <div className="text-[10px] text-[#8b949e]">Obstacle & Ground Tasks</div>
          </button>

          <button
            onClick={() => setActiveTab('interview')}
            className={`p-3 rounded-lg border text-left transition-all ${
              activeTab === 'interview' 
                ? 'bg-[#151e26] border-[#f97316] text-[#e6edf3]' 
                : 'bg-[#090d10] border-[#192229] text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            <div className={`text-xs font-bold font-mono ${activeTab === 'interview' ? 'text-[#f97316]' : 'text-[#e6edf3]'}`}>
              Personal Interview
            </div>
            <div className="text-[10px] text-[#8b949e]">IO & Conference</div>
          </button>
        </div>
      </div>

      {/* Main Tab Details */}
      {activeTab === 'oir' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#0c1013] border border-[#192229] rounded-xl p-6 shadow-xl space-y-6">
            <div className="flex justify-between items-center border-b border-[#192229] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#e6edf3]">
                  OIR (Officer Intelligence Rating) Practice
                </h3>
                <p className="text-xs text-[#8b949e]">
                  Verbal and non-verbal reasoning test. Scored from OIR-1 (Outstanding) to OIR-5.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#10b981] bg-[#10241b] px-2.5 py-1 rounded border border-[#10b981]/30">
                BENCHMARK: OIR 1 / 2
              </span>
            </div>

            {!oirTestStarted ? (
              <div className="text-center py-8 space-y-4">
                <Brain className="w-12 h-12 text-[#f97316] mx-auto" />
                <h4 className="text-sm font-semibold text-[#e6edf3]">
                  Ready for Timed OIR Practice Drill?
                </h4>
                <p className="text-xs text-[#8b949e] max-w-md mx-auto">
                  Evaluate your speed and analytical accuracy under standardized SSB time pressure.
                </p>
                <button
                  onClick={() => { setOirTestStarted(true); setOirScore(null); setOirAnswers({}); }}
                  className="py-2.5 px-6 bg-[#f97316] hover:bg-[#ea580c] text-black font-bold text-xs font-mono rounded-lg transition-all inline-flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>START OIR DRILL</span>
                </button>
              </div>
            ) : oirScore === null ? (
              <div className="space-y-6">
                {oirPracticeQuestions.map((q, idx) => (
                  <div key={idx} className="p-4 bg-[#090d10] border border-[#192229] rounded-lg space-y-3 text-xs font-mono">
                    <div className="font-semibold text-[#e6edf3]">
                      Q{idx + 1}. {q.q}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          onClick={() => setOirAnswers(prev => ({ ...prev, [idx]: optIdx }))}
                          className={`p-2.5 rounded border text-left text-xs transition-all ${
                            oirAnswers[idx] === optIdx
                              ? 'bg-[#151e26] border-[#f97316] text-[#e6edf3]'
                              : 'bg-[#0c1013] border-[#192229] text-[#8b949e] hover:border-[#273842]'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleFinishOIR}
                  className="w-full py-2.5 bg-[#10b981] hover:bg-[#059669] text-black font-bold text-xs font-mono rounded-lg"
                >
                  Submit OIR Drill
                </button>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <CheckCircle2 className="w-12 h-12 text-[#10b981] mx-auto" />
                <h4 className="text-lg font-bold text-[#e6edf3]">
                  Score: {oirScore} / {oirPracticeQuestions.length} Correct
                </h4>
                <div className="text-xs font-mono text-[#10b981]">
                  ESTIMATED RATING: {oirScore === 3 ? 'OIR-1 (Superior)' : oirScore === 2 ? 'OIR-2 (Above Average)' : 'OIR-3 (Average)'}
                </div>
                <button
                  onClick={() => { setOirTestStarted(false); setOirScore(null); }}
                  className="py-2 px-4 bg-[#141b21] text-[#c9d1d9] border border-[#192229] rounded text-xs font-mono"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>

          {/* OIR Guidelines Card */}
          <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-5 shadow-xl space-y-4">
            <div className="text-xs font-mono font-bold uppercase text-[#8b949e]">
              OFFICIAL OIR ESSENTIALS
            </div>
            <div className="space-y-3 text-xs text-[#8b949e] leading-relaxed">
              <p>• <strong>Speed is decisive:</strong> You get approximately 30 minutes for 50 questions.</p>
              <p>• <strong>No Negative Marking:</strong> Never leave a question unanswered.</p>
              <p>• <strong>High Impact on Screening:</strong> Candidates with OIR-1/2 require fewer PPDT votes to pass Stage 1.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ppdt' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-[#e6edf3]">
              PPDT (Picture Perception & Discussion Test)
            </h3>
            <p className="text-xs text-[#8b949e] leading-relaxed">
              Shown a hazy black-and-white picture for 30 seconds. Write character details in 1 minute, construct a positive action-oriented story in 4 minutes, and narrate in group discussion.
            </p>

            <div className="border border-[#192229] rounded-lg p-4 bg-[#090d10] space-y-2 text-xs font-mono">
              <div className="font-bold text-[#f97316]">CRITICAL 3-PART STORY STRUCTURE:</div>
              <p className="text-[#c9d1d9]">1. <strong>Past:</strong> What led up to the situation.</p>
              <p className="text-[#c9d1d9]">2. <strong>Present:</strong> What the central character is doing right now (action, constructive effort).</p>
              <p className="text-[#c9d1d9]">3. <strong>Future:</strong> Positive, realistic, productive outcome achieved.</p>
            </div>
          </div>

          <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-6 shadow-xl space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase text-[#8b949e]">
              GROUP DISCUSSION (GD) PROTOCOL
            </h4>
            <div className="space-y-2.5 text-xs text-[#8b949e]">
              <div className="p-2.5 rounded bg-[#090d10] border border-[#192229]">
                <strong className="text-[#e6edf3]">Individual Narration:</strong> Speak confidently for 1 minute without looking at the assessors.
              </div>
              <div className="p-2.5 rounded bg-[#090d10] border border-[#192229]">
                <strong className="text-[#e6edf3]">Fish Market Handling:</strong> Never shout or argue. Support logical points and encourage silent group members.
              </div>
              <div className="p-2.5 rounded bg-[#090d10] border border-[#192229]">
                <strong className="text-[#e6edf3]">Group Story:</strong> Help the group arrive at a consensus narrative.
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'psych' && (
        <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-[#e6edf3]">
            Stage II: Psychological Test Battery
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 bg-[#090d10] border border-[#192229] rounded-lg space-y-2">
              <div className="text-sm font-bold text-[#f97316]">TAT</div>
              <div className="text-[10px] text-[#8b949e]">Thematic Apperception Test</div>
              <p className="text-[#c9d1d9] text-[11px]">11 pictures + 1 blank slide. 4 minutes per story expressing 15 Officer Like Qualities (OLQs).</p>
            </div>
            <div className="p-4 bg-[#090d10] border border-[#192229] rounded-lg space-y-2">
              <div className="text-sm font-bold text-[#f97316]">WAT</div>
              <div className="text-[10px] text-[#8b949e]">Word Association Test</div>
              <p className="text-[#c9d1d9] text-[11px]">60 words shown for 15 seconds each. Write spontaneous, natural, officer-like observational thoughts.</p>
            </div>
            <div className="p-4 bg-[#090d10] border border-[#192229] rounded-lg space-y-2">
              <div className="text-sm font-bold text-[#f97316]">SRT</div>
              <div className="text-[10px] text-[#8b949e]">Situation Reaction Test</div>
              <p className="text-[#c9d1d9] text-[11px]">60 real-life practical crisis situations in 30 minutes. Demonstrates courage, resourcefulness & responsibility.</p>
            </div>
            <div className="p-4 bg-[#090d10] border border-[#192229] rounded-lg space-y-2">
              <div className="text-sm font-bold text-[#f97316]">SD</div>
              <div className="text-[10px] text-[#8b949e]">Self Description Test</div>
              <p className="text-[#c9d1d9] text-[11px]">Parent's view, Teachers/Officers' view, Friends' view, and Personal Self-Analysis & Aspiration.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'gto' && (
        <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-[#e6edf3]">
            Group Testing Officer (GTO) Tasks
          </h3>
          <p className="text-xs text-[#8b949e]">
            Outdoor practical tasks evaluating teamwork, courage, problem solving, and initiative under physical challenges.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            {[
              { name: 'GD & GPE', desc: 'Group Discussion & Military Planning Exercise with models.' },
              { name: 'PGT & HGT', desc: 'Progressive & Half Group Task using cantilever principles (plank, rope, load).' },
              { name: 'Command Task & Snake Race', desc: 'Subordinate leadership testing & obstacle team bonding race.' },
            ].map((t, i) => (
              <div key={i} className="p-3 bg-[#090d10] border border-[#192229] rounded-lg">
                <div className="font-bold text-[#f97316] mb-1">{t.name}</div>
                <div className="text-[11px] text-[#8b949e]">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'interview' && (
        <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-[#e6edf3]">
            Personal Interview & Board Conference
          </h3>
          <div className="space-y-3 text-xs text-[#8b949e] leading-relaxed">
            <p className="p-3 bg-[#090d10] border border-[#192229] rounded-lg">
              <strong className="text-[#e6edf3]">PIQ Form Foundation:</strong> Know every detail written in your Personal Information Questionnaire — academics, hobbies, NCC achievements, family background.
            </p>
            <p className="p-3 bg-[#090d10] border border-[#192229] rounded-lg">
              <strong className="text-[#e6edf3]">Rapid Fire Questions:</strong> Interviewing Officers ask series of 6-8 questions consecutively. Maintain composure and answer in accurate sequence.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
