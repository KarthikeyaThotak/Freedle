// Word lists organized by length (4-8 letters)
export const WORDS_BY_LENGTH: Record<number, string[]> = {
  4: [
    'ABLE', 'BACK', 'BALL', 'BEAR', 'BIRD', 'BLUE', 'BOAT', 'BOOK', 'BURN', 'BUSY',
    'CAFE', 'CAKE', 'CALL', 'CALM', 'CAMP', 'CARD', 'CARE', 'CASE', 'CAST', 'CAVE',
    'CITY', 'CLUB', 'COAT', 'CODE', 'COLD', 'COME', 'COOL', 'COPY', 'CORE', 'COST',
    'DARK', 'DATA', 'DATE', 'DEAL', 'DEEP', 'DESK', 'DIAL', 'DIET', 'DISC', 'DOOR',
    'DRAW', 'DROP', 'DRUM', 'DUCK', 'DUNE', 'DUST', 'DUTY', 'EACH', 'EARN', 'EASE',
    'EASY', 'EDGE', 'EDIT', 'ELSE', 'EVEN', 'EVER', 'EXIT', 'FACE', 'FACT', 'FAIR',
    'FALL', 'FAME', 'FARM', 'FAST', 'FATE', 'FEAR', 'FEEL', 'FELT', 'FILE', 'FILL',
    'FILM', 'FIND', 'FINE', 'FIRE', 'FIRM', 'FISH', 'FLAG', 'FLAT', 'FLOW', 'FOLK',
    'FOOD', 'FOOT', 'FORM', 'FORT', 'FOUL', 'FREE', 'FROM', 'FUEL', 'FULL', 'FUND',
    'GAIN', 'GAME', 'GATE', 'GAVE', 'GEAR', 'GIFT', 'GIRL', 'GIVE', 'GLAD', 'GLOW',
    'GOAL', 'GOLD', 'GOLF', 'GONE', 'GOOD', 'GRAB', 'GRAY', 'GREW', 'GRIP', 'GROW',
    'HAIR', 'HALF', 'HALL', 'HAND', 'HANG', 'HARD', 'HARM', 'HAVE', 'HEAD', 'HEAL',
    'HEAR', 'HEAT', 'HELD', 'HELP', 'HERE', 'HERO', 'HIGH', 'HILL', 'HINT', 'HIRE',
    'HOLD', 'HOLE', 'HOME', 'HOOK', 'HOPE', 'HOST', 'HOUR', 'HUGE', 'HUNG', 'HUNT',
    'HURT', 'IDEA', 'INCH', 'INTO', 'IRON', 'ITEM', 'JACK', 'JAIL', 'JAZZ', 'JEAN',
    'JOKE', 'JUMP', 'JUNE', 'JURY', 'JUST', 'KEEN', 'KEEP', 'KEPT', 'KICK', 'KIND',
    'KING', 'KNEE', 'KNEW', 'KNOW', 'LACK', 'LADY', 'LAID', 'LAKE', 'LAMP', 'LAND',
    'LANE', 'LAST', 'LATE', 'LEAD', 'LEAF', 'LEAN', 'LEFT', 'LEND', 'LESS', 'LIFE',
    'LIFT', 'LIKE', 'LINE', 'LINK', 'LIST', 'LIVE', 'LOAD', 'LOAN', 'LOCK', 'LOGO',
    'LONG', 'LOOK', 'LORD', 'LOSE', 'LOSS', 'LOST', 'LOUD', 'LOVE', 'LUCK', 'MADE',
    'MAIL', 'MAIN', 'MAKE', 'MALE', 'MANY', 'MARK', 'MASS', 'MATE', 'MEAL', 'MEAN',
    'MEAT', 'MEET', 'MENU', 'MERE', 'MILD', 'MILK', 'MILL', 'MIND', 'MINE', 'MISS',
    'MODE', 'MOOD', 'MOON', 'MORE', 'MOST', 'MOVE', 'MUCH', 'MUST', 'NAME', 'NAVY',
    'NEAR', 'NECK', 'NEED', 'NEWS', 'NEXT', 'NICE', 'NINE', 'NODE', 'NONE', 'NOON',
    'NOSE', 'NOTE', 'NOUN', 'OKAY', 'ONCE', 'ONLY', 'ONTO', 'OPEN', 'ORAL', 'OVER',
    'PACE', 'PACK', 'PAGE', 'PAID', 'PAIN', 'PAIR', 'PALE', 'PALM', 'PARK', 'PART',
    'PASS', 'PAST', 'PATH', 'PEAK', 'PICK', 'PILE', 'PINK', 'PIPE', 'PLAN', 'PLAY',
    'PLOT', 'PLUG', 'PLUS', 'POEM', 'POET', 'POLL', 'POND', 'POOL', 'POOR', 'POPE',
    'PORT', 'POST', 'POUR', 'PRAY', 'PULL', 'PUMP', 'PURE', 'PUSH', 'QUIT', 'RACE',
    'RAIL', 'RAIN', 'RANK', 'RARE', 'RATE', 'READ', 'REAL', 'REAR', 'RENT', 'REST',
    'RICE', 'RICH', 'RIDE', 'RING', 'RISE', 'RISK', 'ROAD', 'ROCK', 'ROLE', 'ROLL',
    'ROOF', 'ROOM', 'ROOT', 'ROPE', 'ROSE', 'RULE', 'RUSH', 'SAFE', 'SAID', 'SAIL',
    'SAKE', 'SALE', 'SALT', 'SAME', 'SAND', 'SANG', 'SAVE', 'SEAT', 'SEED', 'SEEK',
    'SEEM', 'SEEN', 'SELF', 'SELL', 'SEND', 'SENT', 'SHIP', 'SHOP', 'SHOT', 'SHOW',
    'SHUT', 'SICK', 'SIDE', 'SIGN', 'SILK', 'SING', 'SINK', 'SITE', 'SIZE', 'SKIN',
    'SLIP', 'SLOW', 'SNAP', 'SNOW', 'SOFT', 'SOIL', 'SOLD', 'SOLE', 'SOME', 'SONG',
    'SOON', 'SORT', 'SOUL', 'SPIN', 'SPOT', 'STAR', 'STAY', 'STEM', 'STEP', 'STOP',
    'SUCH', 'SUIT', 'SURE', 'SWIM', 'TAIL', 'TAKE', 'TALE', 'TALK', 'TALL', 'TANK',
    'TAPE', 'TASK', 'TEAM', 'TEAR', 'TECH', 'TEEN', 'TELL', 'TEND', 'TENT', 'TERM',
    'TEST', 'TEXT', 'THAN', 'THAT', 'THEM', 'THEN', 'THEY', 'THIN', 'THIS', 'THUS',
    'TIDE', 'TIED', 'TILL', 'TIME', 'TINY', 'TIRE', 'TOLD', 'TONE', 'TOOK', 'TOOL',
    'TOPS', 'TORN', 'TOUR', 'TOWN', 'TRAP', 'TREE', 'TRIM', 'TRIP', 'TRUE', 'TUBE',
    'TUNE', 'TURN', 'TWIN', 'TYPE', 'UNIT', 'UPON', 'USED', 'USER', 'VARY', 'VAST',
    'VERB', 'VERY', 'VIEW', 'VOID', 'VOTE', 'WAGE', 'WAIT', 'WAKE', 'WALK', 'WALL',
    'WANT', 'WARM', 'WARN', 'WASH', 'WAVE', 'WEAK', 'WEAR', 'WEEK', 'WELL', 'WENT',
    'WERE', 'WEST', 'WHAT', 'WHEN', 'WHOM', 'WIDE', 'WIFE', 'WILD', 'WILL', 'WIND',
    'WINE', 'WING', 'WIRE', 'WISE', 'WISH', 'WITH', 'WOLF', 'WOOD', 'WOOL', 'WORD',
    'WORE', 'WORK', 'WRAP', 'YARD', 'YEAH', 'YEAR', 'YOUR', 'ZERO', 'ZONE', 'ZOOM',
  ],
  5: [
    'APPLE', 'BEACH', 'BRAIN', 'BREAD', 'BRUSH', 'CHAIR', 'CHARM', 'CHASE', 'CHILD', 'CLEAN',
    'CLOUD', 'CRANE', 'DANCE', 'DREAM', 'EARTH', 'FLAME', 'FLASH', 'FROST', 'GHOST', 'GIANT',
    'GRAPE', 'GRASS', 'GREEN', 'HEART', 'HORSE', 'HOUSE', 'JUICE', 'LIGHT', 'LUCKY', 'MAGIC',
    'METAL', 'MUSIC', 'NIGHT', 'OCEAN', 'PAINT', 'PEACE', 'PEARL', 'PHONE', 'PIZZA', 'PLANE',
    'PLANT', 'POWER', 'PRIDE', 'QUEEN', 'QUIET', 'RIVER', 'ROYAL', 'SCALE', 'SHADE', 'SHARK',
    'SHINE', 'SIGHT', 'SKILL', 'SLEEP', 'SMILE', 'SMOKE', 'SNAKE', 'SPACE', 'SPARK', 'SPEED',
    'SPELL', 'SPICE', 'SPINE', 'SPORT', 'STAGE', 'STAIR', 'STAMP', 'STAND', 'START', 'STEAM',
    'STEEL', 'STICK', 'STONE', 'STORE', 'STORM', 'STORY', 'STRAW', 'STYLE', 'SUGAR', 'SWEET',
    'SWING', 'TABLE', 'TASTE', 'TEACH', 'THANK', 'THICK', 'THING', 'THINK', 'TIGER', 'TOAST',
    'TODAY', 'TOOTH', 'TOWER', 'TRACK', 'TRADE', 'TRAIN', 'TRASH', 'TREAT', 'TREND', 'TRIAL',
    'TRIBE', 'TRICK', 'TRUCK', 'TRULY', 'TRUST', 'TRUTH', 'TWIST', 'UNDER', 'UNITY', 'VALUE',
    'VIDEO', 'VITAL', 'VOICE', 'WATCH', 'WATER', 'WHEAT', 'WHEEL', 'WHITE', 'WHOLE', 'WOMAN',
    'WORLD', 'WORRY', 'WORTH', 'WRITE', 'YOUNG', 'YOUTH', 'ZEBRA', 'ZESTY', 'ABOUT', 'ABOVE',
    'ADMIT', 'AFTER', 'AGAIN', 'AGREE', 'AHEAD', 'ALLOW', 'ALONE', 'ALONG', 'ANGRY', 'APART',
    'ARISE', 'AVOID', 'AWAIT', 'BASIC', 'BEGAN', 'BEGIN', 'BEING', 'BELOW', 'BLACK', 'BLAME',
    'BLIND', 'BLOCK', 'BLOOD', 'BOARD', 'BOUND', 'BREAK', 'BRIEF', 'BRING', 'BROAD', 'BROKE',
    'BROWN', 'BUILD', 'BUILT', 'BUNCH', 'BUYER', 'CARRY', 'CATCH', 'CAUSE', 'CHAIN', 'CHEAP',
    'CHECK', 'CHEST', 'CHIEF', 'CHINA', 'CHOSE', 'CIVIL', 'CLAIM', 'CLASS', 'CLEAR', 'CLIMB',
    'CLOCK', 'CLOSE', 'COACH', 'COAST', 'COULD', 'COUNT', 'COURT', 'COVER', 'CRAZY', 'CREAM',
    'CRIME', 'CROSS', 'CROWD', 'CROWN', 'CYCLE', 'DAILY', 'DEATH', 'DEPTH', 'DOING', 'DOUBT',
  ],
  6: [
    'ACTION', 'ANIMAL', 'ARTIST', 'BANANA', 'BEAUTY', 'BELONG', 'BORDER', 'BOTTLE', 'BRIDGE', 'BUBBLE',
    'BUDGET', 'BUTTER', 'CAMERA', 'CANDLE', 'CARBON', 'CARPET', 'CASTLE', 'CHANCE', 'CHANGE', 'CHARGE',
    'CHEESE', 'CHERRY', 'CHOICE', 'CHURCH', 'CIRCLE', 'CLEVER', 'CLIENT', 'COFFEE', 'COLOUR', 'COMMON',
    'COOKIE', 'CORNER', 'COTTON', 'COUNTY', 'COUPLE', 'COURSE', 'COUSIN', 'CREATE', 'CREDIT', 'CRISIS',
    'CUSTOM', 'DAMAGE', 'DANGER', 'DEALER', 'DEBATE', 'DECADE', 'DEFEAT', 'DEFEND', 'DEGREE', 'DEMAND',
    'DESERT', 'DESIGN', 'DESIRE', 'DETAIL', 'DEVICE', 'DINNER', 'DIRECT', 'DOCTOR', 'DOLLAR', 'DOMAIN',
    'DOUBLE', 'DRAGON', 'DRAWER', 'DRIVER', 'DURING', 'EASILY', 'EDITOR', 'EFFECT', 'EFFORT', 'EITHER',
    'EMPIRE', 'ENABLE', 'ENDING', 'ENERGY', 'ENGINE', 'ENOUGH', 'ENSURE', 'ENTIRE', 'ESCAPE', 'ESTATE',
    'EXCEPT', 'EXCUSE', 'EXPAND', 'EXPECT', 'EXPERT', 'EXPORT', 'EXTEND', 'FABRIC', 'FACTOR', 'FAILED',
    'FAIRLY', 'FALLEN', 'FAMILY', 'FAMOUS', 'FARMER', 'FATHER', 'FELLOW', 'FIGURE', 'FILTER', 'FINALE',
    'FINGER', 'FINISH', 'FLOWER', 'FLYING', 'FOLLOW', 'FOREST', 'FORGET', 'FORMAT', 'FORMER', 'FREEZE',
    'FRIEND', 'FROZEN', 'FUTURE', 'GALAXY', 'GARDEN', 'GATHER', 'GENTLY', 'GLOBAL', 'GOLDEN', 'GROUND',
    'GROWTH', 'GUITAR', 'HANDLE', 'HAPPEN', 'HARDLY', 'HEALTH', 'HEAVEN', 'HEIGHT', 'HIDDEN', 'HONEST',
    'HORROR', 'HUNGER', 'HUNTER', 'IGNORE', 'IMPACT', 'IMPORT', 'INCOME', 'INDEED', 'INFANT', 'INFORM',
    'INJURY', 'INSECT', 'INSIDE', 'INSIST', 'INTEND', 'ISLAND', 'JACKET', 'JERSEY', 'JIGSAW', 'JUNGLE',
    'JUNIOR', 'KEEPER', 'KERNEL', 'KNIGHT', 'LAUNCH', 'LAWYER', 'LEADER', 'LEAGUE', 'LEAVES', 'LEGACY',
    'LENGTH', 'LESSON', 'LETTER', 'LIGHTS', 'LINEAR', 'LIQUID', 'LISTEN', 'LITTLE', 'LIVING', 'LOCATE',
    'LONGER', 'LOVELY', 'LUXURY', 'MAGNET', 'MAINLY', 'MAKING', 'MANAGE', 'MANNER', 'MARGIN', 'MARINE',
    'MARKET', 'MASTER', 'MATTER', 'MEDIUM', 'MEMBER', 'MEMORY', 'MENTAL', 'METHOD', 'MIDDLE', 'MIGHT',
    'MINUTE', 'MIRROR', 'MOBILE', 'MODERN', 'MODIFY', 'MOMENT', 'MONKEY', 'MONTHS', 'MOTHER', 'MOTION',
  ],
  7: [
    'ABILITY', 'ACCOUNT', 'ACHIEVE', 'ACQUIRE', 'ADDRESS', 'ADVANCE', 'AGAINST', 'AIRPORT', 'ANCIENT', 'ANOTHER',
    'ANXIETY', 'ANYBODY', 'APPLIED', 'ARTICLE', 'ATTEMPT', 'ATTRACT', 'BALANCE', 'BATTERY', 'BECAUSE', 'BEDROOM',
    'BELIEVE', 'BENEATH', 'BENEFIT', 'BESIDES', 'BETWEEN', 'BILLION', 'BLANKET', 'BLOSSOM', 'BRACKET', 'BREAKER',
    'BROTHER', 'BROUGHT', 'BUILDER', 'CABINET', 'CALIBER', 'CALLING', 'CAMPING', 'CAPABLE', 'CAPITAL', 'CAPTAIN',
    'CAPTURE', 'CAREFUL', 'CARRIER', 'CATALOG', 'CEILING', 'CENTRAL', 'CENTURY', 'CERTAIN', 'CHAMBER', 'CHANNEL',
    'CHAPTER', 'CHARTER', 'CHICKEN', 'CIRCUIT', 'CLASSIC', 'CLIMATE', 'CLOSURE', 'CLUSTER', 'COASTAL', 'COLLECT',
    'COLLEGE', 'COMBINE', 'COMMAND', 'COMMENT', 'COMPACT', 'COMPANY', 'COMPARE', 'COMPETE', 'COMPLEX', 'CONCEPT',
    'CONCERN', 'CONFIRM', 'CONNECT', 'CONSENT', 'CONTACT', 'CONTAIN', 'CONTENT', 'CONTEXT', 'CONTROL', 'CONVERT',
    'COOKING', 'CORRECT', 'COSTUME', 'COUNCIL', 'COUNTER', 'COUNTRY', 'COURAGE', 'COVERED', 'CREATED', 'CREATOR',
    'CRICKET', 'CRIMINAL', 'CRUCIAL', 'CRYSTAL', 'CULTURE', 'CURIOUS', 'CURRENT', 'CURTAIN', 'CUSTOMS', 'DANCING',
    'DEALING', 'DECLARE', 'DEFAULT', 'DEFENSE', 'DEFICIT', 'DELIVER', 'DESKTOP', 'DESPITE', 'DESTROY', 'DETAILS',
    'DEVELOP', 'DEVOTED', 'DIAMOND', 'DIGITAL', 'DIPLOMA', 'DISABLE', 'DISCUSS', 'DISEASE', 'DISPLAY', 'DISPUTE',
    'DISTANT', 'DIVIDED', 'DOLLARS', 'DOLPHIN', 'DOUGHNUT', 'DRAWING', 'DRESSED', 'DRIFTER', 'DRIVING', 'DYNAMIC',
    'EARLIER', 'EASTERN', 'ECONOMY', 'EDITION', 'ELDERLY', 'ELEMENT', 'EMBRACE', 'EMPEROR', 'ENDLESS', 'ENFORCE',
    'ENGAGED', 'ENHANCE', 'ENJOYED', 'EPISODE', 'EQUALLY', 'ESSENCE', 'ETERNAL', 'EVENING', 'EVIDENT', 'EXACTLY',
    'EXAMINE', 'EXAMPLE', 'EXCITED', 'EXECUTE', 'EXHIBIT', 'EXPENSE', 'EXPLAIN', 'EXPLORE', 'EXPRESS', 'EXTENDS',
    'EXTREME', 'FACTORY', 'FACULTY', 'FAILING', 'FAILURE', 'FASHION', 'FASTEST', 'FEATURE', 'FEDERAL', 'FEELING',
    'FICTION', 'FIFTEEN', 'FIGHTER', 'FINALLY', 'FINDING', 'FISHING', 'FITNESS', 'FLOWING', 'FOCUSED', 'FOREVER',
    'FORMULA', 'FORTUNE', 'FORWARD', 'FOUNDER', 'FREEDOM', 'FREIGHT', 'FRIENDS', 'FURTHER', 'GALLERY', 'GATEWAY',
    'GENERAL', 'GETTING', 'GLITTER', 'GOODBYE', 'GRANITE', 'GRAPHIC', 'GRAVITY', 'GREATER', 'GREATLY', 'GROWING',
  ],
  8: [
    'ABSOLUTE', 'ABSTRACT', 'ACCIDENT', 'ACCURACY', 'ACCURATE', 'ACHIEVED', 'ACTIVISM', 'ACTUALLY', 'ADVANCED', 'ADVOCATE',
    'AFFECTED', 'AFFIRMED', 'AIRPLANE', 'ALLIANCE', 'ALPHABET', 'ALTHOUGH', 'ANALYSIS', 'ANNOUNCE', 'APPARENT', 'APPENDIX',
    'APPETITE', 'APPROACH', 'APPROVAL', 'ARGUMENT', 'ARTISTIC', 'ASSEMBLE', 'ASSEMBLY', 'ATHLETIC', 'ATTACHED', 'ATTORNEY',
    'AUDIENCE', 'BACHELOR', 'BACKDROP', 'BACKWARD', 'BALANCED', 'BANKNOTE', 'BASELINE', 'BATHROOM', 'BECOMING', 'BEHAVIOR',
    'BELIEVED', 'BENCHMARK', 'BENEFITY', 'BIRTHDAY', 'BLEEDING', 'BLESSING', 'BLOCKADE', 'BOARDING', 'BOOKMARK', 'BOUNDARY',
    'BRACELET', 'BREAKING', 'BREASTED', 'BREEDING', 'BRIEFING', 'BRIGHTLY', 'BRINGING', 'BROADWAY', 'BROTHERS', 'BRUNETTE',
    'BUILDING', 'BULLETIN', 'BUSINESS', 'CALENDAR', 'CAMPAIGN', 'CAPACITY', 'CARDIGAN', 'CAREFREE', 'CARNIVAL', 'CARRYING',
    'CASHMERE', 'CASUALTY', 'CATCHING', 'CATEGORY', 'CATERING', 'CAUTIOUS', 'CELLULAR', 'CENTERED', 'CEREMONY', 'CHAMPION',
    'CHANGING', 'CHAPTERS', 'CHARGING', 'CHEMICAL', 'CHILDREN', 'CHOCOLATE', 'CIRCULAR', 'CIVILIAN', 'CLAIMING', 'CLASSIFY',
    'CLEANING', 'CLEARING', 'CLIMBING', 'CLINICAL', 'CLOTHING', 'COACHING', 'COCKTAIL', 'COLLAPSE', 'COLONIAL', 'COLORFUL',
    'COMBINED', 'COMEBACK', 'COMEDIAN', 'COMMERCE', 'COMMONLY', 'COMPARED', 'COMPLETE', 'COMPOSER', 'COMPOUND', 'COMPRISE',
    'COMPUTER', 'CONCLUDE', 'CONCRETE', 'CONDENSE', 'CONFLICT', 'CONFUSED', 'CONGRESS', 'CONQUEST', 'CONSTANT', 'CONSUMER',
    'CONTAINS', 'CONTEMPT', 'CONTENTS', 'CONTINUE', 'CONTRACT', 'CONTRAST', 'CONTROLS', 'CONVINCE', 'COOPERATE', 'CORRIDOR',
    'COUNSELS', 'COUNTING', 'COVERAGE', 'CREATING', 'CREATION', 'CREATIVE', 'CREATURE', 'CRIMINAL', 'CRITICAL', 'CROSSING',
    'CROWNING', 'CRUSHING', 'CULTURAL', 'CURRENCY', 'CUSTOMER', 'DARKNESS', 'DATABASE', 'DAUGHTER', 'DEADLINE', 'DECIDING',
    'DECISION', 'DECLARED', 'DECREASE', 'DEDICATE', 'DEFENDER', 'DEFINING', 'DEFINITE', 'DELICATE', 'DELIVERY', 'DEMOCRAT',
    'DEPARTED', 'DEPENDING', 'DEPLOYED', 'DESCRIBE', 'DESIGNED', 'DESIGNER', 'DETAILED', 'DETECTED', 'DEVOTION', 'DIAGNOSE',
    'DIALOGUE', 'DIAMETER', 'DICTATOR', 'DIRECTLY', 'DIRECTOR', 'DISABLED', 'DISASTER', 'DISCOUNT', 'DISCOVER', 'DISCRETE',
    'DISGUISE', 'DISPOSAL', 'DISSOLVE', 'DISTANCE', 'DISTINCT', 'DISTRICT', 'DIVIDEND', 'DIVISION', 'DOCTRINE', 'DOCUMENT',
    'DOMESTIC', 'DOMINANT', 'DOMINATE', 'DONATION', 'DOORSTEP', 'DOUBLING', 'DOWNLOAD', 'DOWNSIDE', 'DOWNTOWN', 'DRAMATIC',
  ],
  9: [
    'INEFFECTUALNESS',
  ]
};

// Build valid guesses set from all words
const buildValidGuesses = (): Set<string> => {
  const allWords = new Set<string>();
  Object.values(WORDS_BY_LENGTH).forEach(words => {
    words.forEach(word => allWords.add(word));
  });
  return allWords;
};

export const VALID_GUESSES = buildValidGuesses();

// Get all available word lengths
export function getAvailableWordLengths(): number[] {
  return Object.keys(WORDS_BY_LENGTH).map(Number).sort((a, b) => a - b);
}

// Get a random word of a specific length
export function getRandomWordOfLength(length: number): string {
  const words = WORDS_BY_LENGTH[length];
  if (!words || words.length === 0) {
    throw new Error(`No words available for length ${length}`);
  }
  return words[Math.floor(Math.random() * words.length)];
}

// Get a random word of any available length
export function getRandomWord(): string {
  const lengths = getAvailableWordLengths();
  const randomLength = lengths[Math.floor(Math.random() * lengths.length)];
  return getRandomWordOfLength(randomLength);
}

// Get daily word (consistent for the day, varies in length by day of week)
export function getDailyWord(): string {
  const today = new Date();
  const start = new Date(2024, 0, 1);
  const daysSinceStart = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  // Rotate through word lengths based on day
  const lengths = getAvailableWordLengths();
  const lengthIndex = daysSinceStart % lengths.length;
  const targetLength = lengths[lengthIndex];
  
  const words = WORDS_BY_LENGTH[targetLength];
  return words[daysSinceStart % words.length];
}

// Check if a word is valid for guessing (must match the target length)
// Since we're using random words from Wordnik, we accept any word that:
// - Contains only letters
// - Matches the target length
// - Is at least 2 characters long
export function isValidWord(word: string, targetLength?: number): boolean {
  const upperWord = word.toUpperCase();
  
  // Must contain only letters
  if (!/^[A-Z]+$/.test(upperWord)) {
    return false;
  }
  
  // Must be at least 2 characters
  if (upperWord.length < 2) {
    return false;
  }
  
  // If target length is specified, word must match that length
  if (targetLength !== undefined && upperWord.length !== targetLength) {
    return false;
  }
  
  // Accept any word that meets the above criteria
  // (Previously checked VALID_GUESSES, but now we accept any valid word)
  return true;
}
