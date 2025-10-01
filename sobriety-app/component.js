const { useState, useEffect, useRef } = React;
const { 
    Heart, Calendar, BookOpen, Settings, Share2, Plus, X, ChevronLeft, 
    Music, Volume2, VolumeX, Play, Pause, Clock, Sparkles 
} = lucideReact;

export default function SobrietyApp() {
  const [startDate, setStartDate] = useStoredState('sobriety_start_date', null);
  const [notes, setNotes] = useStoredState('sobriety_notes', []);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);
  const [currentNote, setCurrentNote] = useState({ mood: 3, text: '' });
  const [newStartDate, setNewStartDate] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [showMeditation, setShowMeditation] = useState(false);
  const [activeMeditation, setActiveMeditation] = useState(null);
  const [meditationTime, setMeditationTime] = useState(0);
  const [isMeditating, setIsMeditating] = useState(false);
  const [soundEnabled, setSoundEnabled] = useStoredState('sound_enabled', true);
  const meditationTimerRef = useRef(null);
  const audioContextRef = useRef(null);

  const motivationalQuotes = [
    "Ти сильніший, ніж твій вчорашній страх",
    "Кожен день — це перемога",
    "Ти заслуговуєш на це життя",
    "Сьогодні ти обираєш себе",
    "Твоя сила — у твоїй стійкості",
    "Один день за раз — це все, що потрібно",
    "Ти вже не той, ким був учора",
    "Кожен ранок — нова можливість",
    "Ти створюєш своє майбутнє",
    "Твоє життя варте цієї боротьби"
  ];

  const milestoneMessages = {
    1: "Перший день — найважчий. Ти зробив(ла) це! 🌟",
    7: "Тиждень чистого життя! Ти неймовірний(на)! 🌱",
    14: "Два тижні! Твоє тіло дякує тобі 💪",
    30: "30 ДНІВ! Ти зробив(ла) це. Один день за раз. 🎉",
    60: "2 місяці! Це вже не просто дні — це твоє нове життя 🌊",
    90: "3 місяці! Ти довів(ла), що можеш все 🏔️",
    180: "Півроку! Світло всередині тебе стає сильнішим ✨",
    365: "РІК! Ти народився(лася) заново. Вітаємо! 🦅"
  };

  const calculateDays = () => {
    if (!startDate) return 0;
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = Math.abs(today - start);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const days = calculateDays();
  const todayQuote = motivationalQuotes[days % motivationalQuotes.length];
  const progress = Math.min((days / 365) * 100, 100);

  useEffect(() => {
    if (days > 0 && milestoneMessages[days]) {
      setShowMilestone(true);
      setAnimate(true);
      playMilestoneSound();
      setTimeout(() => setAnimate(false), 1000);
    }
  }, [days]);

  useEffect(() => {
    if (isMeditating && activeMeditation) {
      meditationTimerRef.current = setInterval(() => {
        setMeditationTime(prev => {
          if (prev >= activeMeditation.duration * 60) {
            stopMeditation();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (meditationTimerRef.current) {
        clearInterval(meditationTimerRef.current);
      }
    }
    return () => {
      if (meditationTimerRef.current) {
        clearInterval(meditationTimerRef.current);
      }
    };
  }, [isMeditating, activeMeditation]);

  const startMeditation = (meditation) => {
    setActiveMeditation(meditation);
    setMeditationTime(0);
    setIsMeditating(true);
    playNotificationSound();
  };

  const stopMeditation = () => {
    setIsMeditating(false);
    if (meditationTime >= (activeMeditation?.duration || 0) * 60) {
      playMilestoneSound();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartJourney = () => {
    const date = newStartDate || new Date().toISOString().split('T')[0];
    setStartDate(date);
    setShowSettings(false);
  };

  const handleReset = () => {
    setStartDate(null);
    setNotes([]);
    setShowResetConfirm(false);
    setShowSettings(false);
  };

  const handleAddNote = () => {
    const newNote = {
      date: new Date().toISOString().split('T')[0],
      day: days,
      mood: currentNote.mood,
      text: currentNote.text,
      timestamp: Date.now()
    };
    setNotes([newNote, ...notes]);
    setCurrentNote({ mood: 3, text: '' });
    setShowAddNote(false);
    playNotificationSound();
  };

  const moodEmojis = ['😢', '😔', '😐', '🙂', '😊'];

  const meditations = [
    {
      id: 1,
      title: 'Ранкове пробудження',
      duration: 5,
      description: 'Почни день із спокоєм і ясністю',
      icon: '🌅'
    },
    {
      id: 2,
      title: 'Дихання спокою',
      duration: 10,
      description: 'Глибоке дихання для зняття стресу',
      icon: '🌬️'
    },
    {
      id: 3,
      title: 'Подолання тяги',
      duration: 7,
      description: 'Коли відчуваєш спокусу — зупинись',
      icon: '🛡️'
    },
    {
      id: 4,
      title: 'Вечірня гармонія',
      duration: 15,
      description: 'Заспокій розум перед сном',
      icon: '🌙'
    },
    {
      id: 5,
      title: 'Вдячність',
      duration: 8,
      description: 'Відчуй подяку за сьогодні',
      icon: '✨'
    },
    {
      id: 6,
      title: 'Сила всередині',
      duration: 12,
      description: 'Зв\'яжися з внутрішньою силою',
      icon: '💪'
    }
  ];

  const playTone = (frequency, duration) => {
    if (!soundEnabled) return;
    try {
      const audioContext = audioContextRef.current || new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const playMilestoneSound = () => {
    playTone(523.25, 0.2);
    setTimeout(() => playTone(659.25, 0.2), 200);
    setTimeout(() => playTone(783.99, 0.4), 400);
  };

  const playNotificationSound = () => {
    playTone(440, 0.15);
    setTimeout(() => playTone(554.37, 0.15), 150);
  };

  if (!startDate) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="keys/sunrise-hope?prompt=cinematic%20sunrise%20breaking%20through%20darkness%20mountain%20silhouette%20golden%20light%20hope%20rebirth" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 text-center space-y-8">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center shadow-2xl shadow-emerald-500/50 animate-pulse">
            <div className="w-28 h-28 rounded-full bg-gray-900 flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-t from-emerald-400 via-lime-300 to-white rounded-full opacity-80"></div>
            </div>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">30 ДНІВ<br/>БЕЗ АЛКОГОЛЮ</h1>
          <p className="text-xl text-gray-300 font-light max-w-sm mx-auto leading-relaxed">
            Твоя подорож до свободи починається сьогодні
          </p>
          <div className="space-y-4 pt-4">
            <input
              type="date"
              value={newStartDate}
              onChange={(e) => setNewStartDate(e.target.value)}
              className="w-full px-6 py-4 bg-gray-800/50 border-2 border-emerald-500/30 rounded-2xl text-white text-center text-lg focus:outline-none focus:border-emerald-400 transition-all"
            />
            <button
              onClick={handleStartJourney}
              className="w-full px-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl text-white font-bold text-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all hover:scale-105"
            >
              Почати подорож
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showMilestone && milestoneMessages[days]) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-gray-900 via-emerald-900 to-gray-900 flex flex-col items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img 
            src="keys/milestone-celebration?prompt=golden%20light%20rays%20celebration%20ethereal%20particles%20victory%20triumph%20glory" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className={`relative z-10 text-center space-y-8 ${animate ? 'animate-bounce' : ''}`}>
          <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-emerald-300 to-teal-400 animate-pulse">
            {days}
          </div>
          <div className="text-2xl font-light text-gray-300 uppercase tracking-wider">
            {days === 1 ? 'День' : days < 5 ? 'Дні' : 'Днів'}
          </div>
          <div className="max-w-md mx-auto text-2xl font-bold text-white leading-relaxed py-8">
            {milestoneMessages[days]}
          </div>
          <div className="flex gap-4 justify-center pt-8">
            <button
              onClick={() => setShowMilestone(false)}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl text-white font-bold shadow-lg shadow-emerald-500/30 hover:scale-105 transition-all"
            >
              Продовжити
            </button>
            <button
              className="px-8 py-4 bg-gray-800/50 border-2 border-emerald-500/30 rounded-2xl text-white font-bold hover:bg-gray-700/50 transition-all flex items-center gap-2"
            >
              <Share2 size={20} />
              Поділитися
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showSettings) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-white transition-colors">
            <ChevronLeft size={28} />
          </button>
          <h2 className="text-2xl font-bold text-white">Налаштування</h2>
          <div className="w-7"></div>
        </div>
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="bg-gray-800/50 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Дата початку</h3>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-emerald-400 transition-all"
            />
          </div>
          <div className="bg-gray-800/50 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Звукові сигнали</h3>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="w-full px-6 py-4 bg-gray-700 border border-gray-600 rounded-xl text-white font-bold hover:bg-gray-600 transition-all flex items-center justify-between"
            >
              <span>Звук {soundEnabled ? 'увімкнено' : 'вимкнено'}</span>
              {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
            </button>
          </div>
          <div className="bg-gray-800/50 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Скинути лічильник</h3>
            <p className="text-sm text-gray-400">Це видалить весь прогрес та записи</p>
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full px-6 py-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 font-bold hover:bg-red-500/30 transition-all"
              >
                Скинути прогрес
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-white font-bold text-center">Ти впевнений(а)?</p>
                <p className="text-sm text-gray-400 text-center">Це не кінець. Це досвід. Почни знову.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 px-4 py-3 bg-gray-700 rounded-xl text-white font-bold hover:bg-gray-600 transition-all"
                  >
                    Скасувати
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 px-4 py-3 bg-red-500 rounded-xl text-white font-bold hover:bg-red-600 transition-all"
                  >
                    Так, скинути
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (showNotes) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <button onClick={() => setShowNotes(false)} className="text-gray-400 hover:text-white transition-colors">
            <ChevronLeft size={28} />
          </button>
          <h2 className="text-2xl font-bold text-white">Мої записи</h2>
          <div className="w-7"></div>
        </div>
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {notes.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen size={64} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-500 text-lg">Поки немає записів</p>
            </div>
          ) : (
            notes.map((note, index) => (
              <div key={index} className="bg-gray-800/50 rounded-2xl p-6 space-y-3 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">День {note.day}</div>
                  <div className="text-sm text-gray-500">{note.date}</div>
                </div>
                <div className="text-3xl">{moodEmojis[note.mood]}</div>
                {note.text && <p className="text-white leading-relaxed">{note.text}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (showAddNote) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <button onClick={() => setShowAddNote(false)} className="text-gray-400 hover:text-white transition-colors">
            <X size={28} />
          </button>
          <h2 className="text-2xl font-bold text-white">Записати день</h2>
          <div className="w-7"></div>
        </div>
        <div className="flex-1 p-6 space-y-8 overflow-y-auto">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white text-center">Як твій настрій?</h3>
            <div className="flex justify-between px-4">
              {moodEmojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentNote({ ...currentNote, mood: index })}
                  className={`text-5xl transition-all ${currentNote.mood === index ? 'scale-125' : 'scale-100 opacity-50'}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Твої думки</h3>
            <textarea
              value={currentNote.text}
              onChange={(e) => setCurrentNote({ ...currentNote, text: e.target.value })}
              placeholder="Що відбувалось сьогодні? Які були виклики чи перемоги?"
              className="w-full h-40 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 transition-all resize-none"
            />
          </div>
          <button
            onClick={handleAddNote}
            className="w-full px-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl text-white font-bold text-xl shadow-lg shadow-emerald-500/30 hover:scale-105 transition-all"
          >
            Зберегти запис
          </button>
        </div>
      </div>
    );
  }

  if (showMeditation) {
    if (activeMeditation && isMeditating) {
      const progress = (meditationTime / (activeMeditation.duration * 60)) * 100;
      const remaining = activeMeditation.duration * 60 - meditationTime;
      
      return (
        <div className="w-full h-full bg-gradient-to-b from-indigo-950 via-purple-900 to-gray-900 flex flex-col items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img 
              src="keys/meditation-peace?prompt=serene%20meditation%20peaceful%20zen%20calm%20water%20lotus%20tranquility%20mindfulness" 
              alt="" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 text-center space-y-12 w-full max-w-sm">
            <button
              onClick={stopMeditation}
              className="absolute top-0 right-0 text-gray-400 hover:text-white transition-colors"
            >
              <X size={32} />
            </button>
            
            <div className="text-6xl animate-pulse">{activeMeditation.icon}</div>
            <h2 className="text-3xl font-bold text-white">{activeMeditation.title}</h2>
            
            <div className="relative w-64 h-64 mx-auto">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  stroke="rgba(139, 92, 246, 0.2)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  stroke="url(#meditation-gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(progress / 100) * 691} 691`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="meditation-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl font-black text-white">{formatTime(remaining)}</div>
                <div className="text-sm text-gray-400 mt-2">залишилось</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="text-lg text-gray-300 leading-relaxed">
                Дихай глибоко. Ти в безпеці. Цей момент належить тобі.
              </div>
              <button
                onClick={stopMeditation}
                className="px-8 py-3 bg-purple-500/20 border border-purple-500/50 rounded-xl text-purple-300 font-bold hover:bg-purple-500/30 transition-all"
              >
                <Pause size={20} className="inline mr-2" />
                Завершити
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-full bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <button onClick={() => { setShowMeditation(false); setActiveMeditation(null); }} className="text-gray-400 hover:text-white transition-colors">
            <ChevronLeft size={28} />
          </button>
          <h2 className="text-2xl font-bold text-white">Медитації</h2>
          <div className="w-7"></div>
        </div>
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-2xl p-6 border border-purple-500/20">
            <Sparkles className="text-purple-400 mb-3" size={32} />
            <h3 className="text-xl font-bold text-white mb-2">Сила медитації</h3>
            <p className="text-gray-300 leading-relaxed">Медитація допомагає заспокоїти розум, пережити важкі моменти та відновити внутрішню гармонію.</p>
          </div>
          
          <div className="space-y-4">
            {meditations.map((meditation) => (
              <button
                key={meditation.id}
                onClick={() => startMeditation(meditation)}
                className="w-full bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 rounded-2xl p-6 transition-all text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform">{meditation.icon}</div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-white mb-1">{meditation.title}</h4>
                    <p className="text-sm text-gray-400 mb-3">{meditation.description}</p>
                    <div className="flex items-center gap-2 text-purple-400">
                      <Clock size={16} />
                      <span className="text-sm font-medium">{meditation.duration} хвилин</span>
                    </div>
                  </div>
                  <Play size={24} className="text-purple-400 group-hover:text-purple-300 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img 
          src="keys/dawn-renewal?prompt=peaceful%20ocean%20waves%20dawn%20light%20calm%20serenity%20hope%20new%20beginning" 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative z-10 flex-1 flex flex-col">
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
                <div className="w-4 h-4 bg-gradient-to-t from-emerald-400 to-white rounded-full"></div>
              </div>
            </div>
            <button 
              onClick={() => setShowSettings(true)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Settings size={24} />
            </button>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">30 ДНІВ БЕЗ АЛКОГОЛЮ</h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 space-y-8">
          <div className="relative w-64 h-64">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="110"
                stroke="rgba(16, 185, 129, 0.1)"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="128"
                cy="128"
                r="110"
                stroke="url(#gradient)"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${(progress / 100) * 691} 691`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-400">
                {days}
              </div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mt-2">
                {days === 1 ? 'День' : days < 5 ? 'Дні' : 'Днів'}
              </div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-xl font-light text-gray-300">Ти чистий(а) вже:</p>
            <p className="text-3xl font-black text-white">{days} {days === 1 ? 'день' : days < 5 ? 'дні' : 'днів'}</p>
          </div>

          <div className="w-full bg-gray-800/30 backdrop-blur border border-emerald-500/20 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <Heart className="text-emerald-400 mt-1 flex-shrink-0" size={24} />
              <p className="text-lg text-gray-200 leading-relaxed italic">"{todayQuote}"</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddNote(true)}
            className="w-full px-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl text-white font-bold text-lg shadow-lg shadow-emerald-500/30 hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={24} />
            Записати день
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2 p-6 bg-gray-900/50 backdrop-blur border-t border-gray-800">
          <button 
            onClick={() => setShowNotes(true)}
            className="flex flex-col items-center gap-2 py-4 rounded-xl hover:bg-gray-800/50 transition-all"
          >
            <BookOpen size={24} className="text-gray-400" />
            <span className="text-xs text-gray-400 font-medium">Записи</span>
          </button>
          <button 
            onClick={() => setShowMeditation(true)}
            className="flex flex-col items-center gap-2 py-4 rounded-xl hover:bg-gray-800/50 transition-all"
          >
            <Sparkles size={24} className="text-purple-400" />
            <span className="text-xs text-purple-400 font-medium">Медитації</span>
          </button>
          <button className="flex flex-col items-center gap-2 py-4 rounded-xl hover:bg-gray-800/50 transition-all">
            <Calendar size={24} className="text-gray-400" />
            <span className="text-xs text-gray-400 font-medium">Календар</span>
          </button>
          <button className="flex flex-col items-center gap-2 py-4 rounded-xl hover:bg-gray-800/50 transition-all">
            <Share2 size={24} className="text-gray-400" />
            <span className="text-xs text-gray-400 font-medium">Поділитися</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function useStoredState(key, initialValue) {
  const storageKey = `sobriety_${key}`;
  
  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(storageKey);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [state, storageKey]);

  return [state, setState];
}
ReactDOM.render(React.createElement(SobrietyApp), document.getElementById('root'));