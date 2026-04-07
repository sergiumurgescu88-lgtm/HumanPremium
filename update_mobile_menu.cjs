const fs = require('fs');

const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');

// 1. Add state
const stateIdx = lines.findIndex(line => line.includes('const [activeModal, setActiveModal]'));
lines.splice(stateIdx + 1, 0, '  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);');

// 2. Add Menu icon import
const lucideImportIdx = lines.findIndex(line => line.includes('} from \'lucide-react\';'));
lines[lucideImportIdx - 1] = lines[lucideImportIdx - 1] + ',';
lines.splice(lucideImportIdx, 0, '  Menu');

// 3. Update header
const headerStartIdx = lines.findIndex(line => line.includes('<header className="bg-white border-b border-slate-200 sticky top-0 z-50">'));
const headerEndIdx = lines.findIndex(line => line.includes('</header>'));

const newHeader = `      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="bg-indigo-600 p-2 rounded-xl">
              <HeartHandshake className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Da<span className="text-indigo-600">România</span></span>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button onClick={() => scrollTo(missionRef)} className="hover:text-indigo-600 transition-colors">Misiune</button>
            <button onClick={() => scrollTo(principlesRef)} className="hover:text-indigo-600 transition-colors">Principii</button>
            <button onClick={() => scrollTo(methodologyRef)} className="hover:text-indigo-600 transition-colors">Metodologie</button>
            <button onClick={() => scrollTo(pivotRef)} className="hover:text-indigo-600 transition-colors">Găsește-ți Meseria</button>
            <button onClick={() => scrollTo(pricingRef)} className="hover:text-indigo-600 transition-colors">Prețuri</button>
            <button 
              onClick={() => setActiveModal('join')}
              className="bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition-all shadow-sm"
            >
              Alătură-te Rețelei
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
            >
              <div className="px-4 py-6 flex flex-col gap-4">
                <button onClick={() => { scrollTo(missionRef); setIsMobileMenuOpen(false); }} className="text-left text-lg font-medium text-slate-600 hover:text-indigo-600 py-2">Misiune</button>
                <button onClick={() => { scrollTo(principlesRef); setIsMobileMenuOpen(false); }} className="text-left text-lg font-medium text-slate-600 hover:text-indigo-600 py-2">Principii</button>
                <button onClick={() => { scrollTo(methodologyRef); setIsMobileMenuOpen(false); }} className="text-left text-lg font-medium text-slate-600 hover:text-indigo-600 py-2">Metodologie</button>
                <button onClick={() => { scrollTo(pivotRef); setIsMobileMenuOpen(false); }} className="text-left text-lg font-medium text-slate-600 hover:text-indigo-600 py-2">Găsește-ți Meseria</button>
                <button onClick={() => { scrollTo(pricingRef); setIsMobileMenuOpen(false); }} className="text-left text-lg font-medium text-slate-600 hover:text-indigo-600 py-2">Prețuri</button>
                <button 
                  onClick={() => { setActiveModal('join'); setIsMobileMenuOpen(false); }}
                  className="bg-slate-900 text-white px-5 py-3 rounded-xl hover:bg-slate-800 transition-all shadow-sm mt-2 font-bold"
                >
                  Alătură-te Rețelei
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>`;

lines.splice(headerStartIdx, headerEndIdx - headerStartIdx + 1, newHeader);

fs.writeFileSync('src/App.tsx', lines.join('\n'));
console.log("Successfully updated mobile menu.");
