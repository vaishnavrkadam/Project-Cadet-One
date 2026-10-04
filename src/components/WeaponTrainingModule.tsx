import React, { useState } from 'react';
import { 
  Crosshair, 
  ShieldCheck, 
  CheckCircle, 
  Clock, 
  Lock, 
  RotateCcw, 
  ChevronRight,
  Maximize2
} from 'lucide-react';

interface PartHighlight {
  id: number;
  name: string;
  x: string; // % from left
  y: string; // % from top
  desc: string;
}

export const WeaponTrainingModule: React.FC = () => {
  const [selectedWeapon, setSelectedWeapon] = useState<'insas' | 'slr'>('insas');
  const [activeStep, setActiveStep] = useState<number>(3); // 1 to 5
  const [selectedPart, setSelectedPart] = useState<PartHighlight | null>(null);

  // INSAS 5.56mm Parts Coordinates mapped accurately on Rifle 1.png
  const insasParts: PartHighlight[] = [
    { id: 1, name: 'Flash Suppressor', x: '9%', y: '40%', desc: 'Birdcage type flash suppressor, accommodates blank firing attachment & rifle grenades.' },
    { id: 2, name: 'Front Sight Block', x: '17%', y: '32%', desc: 'Protected post foresight with click adjustable elevation and drift adjustment.' },
    { id: 3, name: 'Handguard', x: '35%', y: '38%', desc: 'Ventilated protective handguard allowing heat dissipation during continuous fire.' },
    { id: 4, name: '30-Round Magazine', x: '49%', y: '58%', desc: 'Translucent high-strength composite magazine enabling immediate visual ammo check.' },
    { id: 5, name: 'Receiver & Cocking Handle', x: '58%', y: '40%', desc: 'Milled steel receiver housing gas-operated rotating bolt assembly.' },
    { id: 6, name: 'Pistol Grip & Trigger', x: '65%', y: '52%', desc: 'Ergonomic pistol grip housing trigger guard and fire selector (Safe / Single / Burst).' },
    { id: 7, name: 'Rear Sight Aperture', x: '67%', y: '32%', desc: 'Aperture sight with 200m and 400m battle zero range settings.' },
    { id: 8, name: 'Buttstock', x: '83%', y: '44%', desc: 'Ergonomic fixed buttstock made of durable polymer/treated wood with rubber recoil pad.' },
  ];

  // 7.62mm SLR Parts Coordinates mapped accurately on 7.62mm SLR.png
  const slrParts: PartHighlight[] = [
    { id: 1, name: 'Flash Eliminator & Foresight', x: '10%', y: '41%', desc: 'Prong-type flash eliminator and protected foresight block.' },
    { id: 2, name: 'Gas Regulator & Handguard', x: '28%', y: '41%', desc: 'Adjustable gas block with numbered settings (1-7) and wooden handguard.' },
    { id: 3, name: '20-Round Box Magazine', x: '42%', y: '58%', desc: 'Steel curved detachable box magazine holding 20 rounds of 7.62×51mm.' },
    { id: 4, name: 'Body (Receiver) & Cocking Handle', x: '49%', y: '40%', desc: 'Milled steel receiver housing tilting breech-block mechanism.' },
    { id: 5, name: 'Pistol Grip & Trigger Assembly', x: '55%', y: '51%', desc: 'Ergonomic grip housing change lever (Safe / Repetition).' },
    { id: 6, name: 'Backsight (Aperture)', x: '57%', y: '34%', desc: 'Folding aperture sight calibrated from 200 to 600 yards.' },
    { id: 7, name: 'Butt (Stock)', x: '78%', y: '46%', desc: 'Hardwood butt available in short, normal, and long sizes with brass trap.' },
  ];

  const currentParts = selectedWeapon === 'insas' ? insasParts : slrParts;

  const weaponDetails = {
    insas: {
      name: 'INSAS 5.56mm Rifle',
      system: 'Indian Small Arms System',
      image: '/Rifle 1.png', // Clean transparent rifle cut-out image provided in References
      type: '5.56mm Assault Rifle',
      calibre: '5.56 × 45 mm',
      role: 'Infantry / General Purpose',
      status: 'Safe (Training Mode)',
      length: '997 mm',
      weightEmpty: '3.6 kg',
      magCapacity: '30 rounds',
      rangeEffective: '400 m',
      objective: 'Learn weapon parts, safe handling, loading, aiming and basic firing procedures.',
    },
    slr: {
      name: '7.62mm 1A1 SLR',
      system: 'Self Loading Rifle (Ishapore)',
      image: '/7.62mm SLR.png',
      type: '7.62mm Semi-Automatic Rifle',
      calibre: '7.62 × 51 mm NATO',
      role: 'Standard Service Rifle / Marksmanship',
      status: 'Safe (Drill Mode)',
      length: '1130 mm',
      weightEmpty: '4.4 kg',
      magCapacity: '20 rounds',
      rangeEffective: '300 m (Battlesight)',
      objective: 'Master SLR stripping, assembly, sight picture alignment, and grouping & zeroing drills.',
    }
  };

  const currentSpec = weaponDetails[selectedWeapon];

  const handlingSteps = [
    { step: 1, title: 'Check Weapon (Clear)', status: 'Completed' },
    { step: 2, title: 'Load Magazine', status: 'Completed' },
    { step: 3, title: 'Insert Magazine', status: 'Current' },
    { step: 4, title: 'Chamber Round', status: 'Pending' },
    { step: 5, title: 'Ready to Fire', status: 'Pending' },
  ];

  const handleNextStep = () => {
    setActiveStep(prev => (prev < 5 ? prev + 1 : 1));
  };

  return (
    <div className="space-y-6 max-w-[1500px] mx-auto">
      {/* Weapon Selector Tabs */}
      <div className="flex items-center justify-between border-b border-[#192229] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setSelectedWeapon('insas'); setSelectedPart(null); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
              selectedWeapon === 'insas'
                ? 'bg-[#141b21] text-[#f97316] border border-[#f97316]/40 shadow-sm'
                : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#0c1116]'
            }`}
          >
            INSAS 5.56mm RIFLE
          </button>
          <button
            onClick={() => { setSelectedWeapon('slr'); setSelectedPart(null); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
              selectedWeapon === 'slr'
                ? 'bg-[#141b21] text-[#f97316] border border-[#f97316]/40 shadow-sm'
                : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#0c1116]'
            }`}
          >
            7.62mm 1A1 SLR (ISHAPORE)
          </button>
        </div>

        <div className="text-xs text-[#8b949e] font-mono flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#10b981]" />
          <span>OFFICIAL WEAPON TRAINING CURRICULUM</span>
        </div>
      </div>

      {/* Main Grid: Interactive Weapon Diagram & Specs Card */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left & Center: Interactive Weapon Diagram */}
        <div className="xl:col-span-2 bg-[#0c1013] border border-[#192229] rounded-xl p-6 relative flex flex-col justify-between overflow-hidden shadow-2xl min-h-[480px]">
          {/* Subtle Grid overlay */}
          <div 
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
              backgroundSize: '36px 36px'
            }}
          />

          {/* Top Bar inside diagram */}
          <div className="flex items-center justify-between z-10">
            <div>
              <div className="text-base font-bold tracking-wider text-[#e6edf3] uppercase">
                {currentSpec.name}
              </div>
              <div className="text-xs text-[#8b949e] font-mono tracking-wide">
                {currentSpec.system}
              </div>
            </div>
            <div className="p-1.5 bg-[#141b21] border border-[#1c272f] rounded text-[#8b949e]">
              <Maximize2 className="w-4 h-4" />
            </div>
          </div>

          {/* Interactive Image Display Area */}
          <div className="relative my-8 flex items-center justify-center min-h-[280px] z-10 px-4">
            {/* The Actual Clean Weapon Image */}
            <img 
              src={currentSpec.image}
              alt={currentSpec.name}
              className="max-h-[260px] w-auto max-w-full object-contain transition-all duration-300 drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)] filter contrast-105"
            />

            {/* Interactive Part Pinpoints */}
            {currentParts.map((part) => {
              const isSelected = selectedPart?.id === part.id;
              return (
                <div
                  key={part.id}
                  style={{ left: part.x, top: part.y }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                  onClick={() => setSelectedPart(part)}
                >
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-mono font-medium transition-all duration-200 backdrop-blur-md ${
                    isSelected
                      ? 'bg-[#f97316] text-[#06090c] border-[#f97316] font-bold shadow-lg scale-110 ring-2 ring-[#f97316]/50'
                      : 'bg-[#0c1013]/90 text-[#e6edf3] border-[#273842] hover:border-[#f97316] hover:bg-[#162129]'
                  }`}>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isSelected ? 'bg-black text-white' : 'bg-[#273842] text-[#c9d1d9]'
                    }`}>
                      {part.id}
                    </span>
                    <span className="hidden sm:inline whitespace-nowrap">{part.name}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Part Detail Banner if active */}
          {selectedPart ? (
            <div className="z-10 p-3.5 bg-[#121920] border border-[#f97316]/50 rounded-lg flex items-center justify-between text-xs animate-fadeIn">
              <div>
                <span className="font-bold text-[#f97316] font-mono mr-2">PART {selectedPart.id}: {selectedPart.name}</span>
                <span className="text-[#c9d1d9]">{selectedPart.desc}</span>
              </div>
              <button 
                onClick={() => setSelectedPart(null)}
                className="text-[#8b949e] hover:text-[#e6edf3] ml-4 text-[11px] underline"
              >
                Clear
              </button>
            </div>
          ) : (
            <div className="z-10 text-[11px] text-[#484f58] font-mono text-center">
              Click any numbered part pin to inspect technical nomenclature and training guidelines.
            </div>
          )}
        </div>

        {/* Right: Technical Specifications Card */}
        <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-6 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center gap-2 mb-4 border-l-2 border-[#f97316] pl-2.5">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#f97316]">
                WEAPON TRAINING
              </span>
            </div>

            <h3 className="text-xl font-bold text-[#e6edf3] leading-snug">
              {currentSpec.name}
            </h3>
            <p className="text-xs text-[#8b949e] font-mono mb-6">
              {currentSpec.system}
            </p>

            {/* Quick Param Table */}
            <div className="space-y-2.5 text-xs font-mono border-b border-[#192229] pb-5 mb-5">
              <div className="flex justify-between items-center">
                <span className="text-[#8b949e]">TYPE</span>
                <span className="text-[#e6edf3]">{currentSpec.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8b949e]">CALIBRE</span>
                <span className="text-[#e6edf3]">{currentSpec.calibre}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8b949e]">ROLE</span>
                <span className="text-[#e6edf3]">{currentSpec.role}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8b949e]">STATUS</span>
                <span className="text-[#10b981] flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                  {currentSpec.status}
                </span>
              </div>
            </div>

            {/* Basic Specifications */}
            <div className="mb-6">
              <div className="text-[11px] font-mono uppercase text-[#8b949e] font-semibold tracking-wider mb-2.5">
                BASIC SPECIFICATIONS
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[#8b949e]">LENGTH</span>
                  <span className="text-[#e6edf3]">{currentSpec.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8b949e]">WEIGHT (EMPTY)</span>
                  <span className="text-[#e6edf3]">{currentSpec.weightEmpty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8b949e]">MAGAZINE CAPACITY</span>
                  <span className="text-[#e6edf3]">{currentSpec.magCapacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8b949e]">RANGE (EFFECTIVE)</span>
                  <span className="text-[#e6edf3]">{currentSpec.rangeEffective}</span>
                </div>
              </div>
            </div>

            {/* Training Objective */}
            <div className="mb-6">
              <div className="text-[11px] font-mono uppercase text-[#8b949e] font-semibold tracking-wider mb-1.5 flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-[#f97316]" />
                TRAINING OBJECTIVE
              </div>
              <p className="text-xs text-[#8b949e] leading-relaxed">
                {currentSpec.objective}
              </p>
            </div>
          </div>

          {/* Safety First Box */}
          <div className="border border-[#f97316]/30 bg-[#14100d] rounded-lg p-3.5">
            <div className="text-xs font-bold text-[#f97316] font-mono flex items-center gap-1.5 mb-2.5">
              <ShieldCheck className="w-4 h-4" />
              SAFETY FIRST
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] text-[#c9d1d9] font-mono">
              <div className="bg-[#090d10] p-2 rounded border border-[#192229]">
                Keep muzzle pointed safe
              </div>
              <div className="bg-[#090d10] p-2 rounded border border-[#192229]">
                Keep finger off trigger
              </div>
              <div className="bg-[#090d10] p-2 rounded border border-[#192229]">
                Clear chamber inspect
              </div>
              <div className="bg-[#090d10] p-2 rounded border border-[#192229]">
                Only authorized drill ammo
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom 4 Dashboard Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Widget 1: Training Progress */}
        <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-5 shadow-lg">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8b949e] mb-3 flex items-center justify-between">
            <span>TRAINING PROGRESS</span>
            <RotateCcw className="w-3.5 h-3.5 text-[#484f58]" />
          </div>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-extrabold text-[#e6edf3]">68%</span>
            <span className="text-xs text-[#8b949e]">Overall Completion</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-[#192229] rounded-full overflow-hidden mb-4">
            <div className="h-full bg-[#f97316] rounded-full" style={{ width: '68%' }} />
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center">
              <span className="text-[#8b949e] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]" /> Weapon Familiarisation
              </span>
              <span className="text-[#e6edf3]">100%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#8b949e] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]" /> Parts & Functions
              </span>
              <span className="text-[#e6edf3]">80%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#8b949e] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]" /> Safety Procedures
              </span>
              <span className="text-[#e6edf3]">60%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#8b949e] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]" /> Live Fire Practice
              </span>
              <span className="text-[#e6edf3]">45%</span>
            </div>
          </div>
        </div>

        {/* Widget 2: Module Status */}
        <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-5 shadow-lg">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8b949e] mb-4">
            MODULE STATUS
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="flex justify-between items-center pb-2 border-b border-[#192229]/60">
              <span className="text-[#c9d1d9]">Weapon Identification</span>
              <span className="text-[#10b981] flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" /> Completed
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[#192229]/60">
              <span className="text-[#c9d1d9]">Parts & Functions</span>
              <span className="text-[#10b981] flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" /> Completed
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[#192229]/60">
              <span className="text-[#c9d1d9]">Safety & Handling</span>
              <span className="text-[#f97316] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> In Progress
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[#192229]/60">
              <span className="text-[#8b949e]">Loading & Unloading</span>
              <span className="text-[#484f58] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Locked
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#8b949e]">Live Fire Drill</span>
              <span className="text-[#484f58] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Locked
              </span>
            </div>
          </div>
        </div>

        {/* Widget 3: Handling Sequence */}
        <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-[#8b949e] mb-4">
            <span>HANDLING SEQUENCE</span>
            <button
              onClick={handleNextStep}
              className="text-[#f97316] hover:underline text-[11px] font-normal"
            >
              Advance Drill →
            </button>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            {handlingSteps.map((s) => {
              const isCurrent = activeStep === s.step;
              const isDone = activeStep > s.step;
              return (
                <div 
                  key={s.step}
                  className={`flex justify-between items-center p-1.5 rounded transition-colors ${
                    isCurrent ? 'bg-[#1b1712] border border-[#f97316]/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCurrent 
                        ? 'bg-[#f97316] text-[#06090c]' 
                        : isDone 
                        ? 'bg-[#10b981] text-black' 
                        : 'bg-[#192229] text-[#8b949e]'
                    }`}>
                      {s.step}
                    </span>
                    <span className={isCurrent ? 'text-[#f97316] font-semibold' : isDone ? 'text-[#c9d1d9]' : 'text-[#8b949e]'}>
                      {s.title}
                    </span>
                  </div>
                  <span className={`text-[10px] font-semibold uppercase ${
                    isCurrent ? 'text-[#f97316]' : isDone ? 'text-[#10b981]' : 'text-[#484f58]'
                  }`}>
                    {isCurrent ? 'CURRENT' : isDone ? 'COMPLETED' : 'PENDING'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Widget 4: Session Accuracy & Continue Action */}
        <div className="bg-[#0c1013] border border-[#192229] rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8b949e] mb-3">
              SESSION / ACCURACY
            </div>

            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-[10px] text-[#484f58] font-mono">LAST SESSION</div>
                <div className="text-xs text-[#c9d1d9] font-mono">12 Apr 2025 | 14:32</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-[#484f58] font-mono">ACCURACY</div>
                <div className="text-xl font-bold text-[#e6edf3] font-mono">87%</div>
              </div>
            </div>

            {/* Mini Histogram Bars */}
            <div className="flex items-end gap-1 h-10 mb-4 px-1 py-1 bg-[#090d10] rounded border border-[#192229]">
              {[40, 65, 80, 50, 90, 75, 85, 95, 70, 85, 90, 100].map((val, idx) => (
                <div
                  key={idx}
                  className={`flex-1 rounded-t-xs transition-all ${
                    idx === 11 ? 'bg-[#f97316]' : 'bg-[#273842]'
                  }`}
                  style={{ height: `${val}%` }}
                />
              ))}
            </div>

            <div className="space-y-1 text-xs font-mono border-t border-[#192229] pt-3 text-[#8b949e]">
              <div className="flex justify-between">
                <span>HITS</span>
                <span className="text-[#e6edf3]">26 / 30</span>
              </div>
              <div className="flex justify-between">
                <span>MISSES</span>
                <span className="text-[#e6edf3]">4</span>
              </div>
              <div className="flex justify-between">
                <span>AVG. TIME</span>
                <span className="text-[#e6edf3]">42.6s</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleNextStep}
            className="w-full mt-4 py-2.5 px-3 bg-[#141b21] hover:bg-[#1a232b] text-[#f97316] hover:text-[#fb923c] border border-[#f97316]/50 rounded-lg text-xs font-bold font-mono tracking-wider transition-all flex items-center justify-center gap-2 group shadow-md"
          >
            <span>CONTINUE TRAINING</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
