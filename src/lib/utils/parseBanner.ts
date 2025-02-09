interface BannerData {
  id: string;
  title: string;
  description: string;
}
// This is a database of all the banners in the game. The key is the banner ID and the value is the banner data.
// The information is obtained from the file zehos.com,relay,n,nationstates.net,banners.html
const bannerDatabase: Record<string, BannerData> = {
  "y167": {
    id: "y167",
    title: "A Golden Age",
    description: "Cherish the wellbeing of old and young alike"
  },
  "t22": {
    id: "t22",
    title: "A Many Splendored Land", 
    description: "Address 50 issues"
  },
  "m3": {
    id: "m3",
    title: "A Moment's Peace",
    description: "Combine a strong military with civil rights"
  },
  "l19": {
    id: "l19",
    title: "A New Day",
    description: "Change from one nation classification to another"
  },
  "i29": {
    id: "i29", 
    title: "A Roll of the Dice",
    description: "Go all-in on gambling"
  },
  "wa1": {
    id: "wa1",
    title: "A Voice at the Table", 
    description: "Join the World Assembly"
  },
  "y100": {
    id: "y100",
    title: "Well, That Escalated Quickly",
    description: "Resolve a complicated geopolitical situation in Brasilistan"
  },
  "d6": {
    id: "d6",
    title: "White Whale",
    description: "Fail to prevent mistakes in the fishing industry"
  },
  "y224": {
    id: "y224",
    title: "Wildly Artificial",
    description: "Grow children in vats and then set them loose into the wild"
  },
  "t20": {
    id: "t20",
    title: "Window Shopping",
    description: "Develop a cultured nation of at least 80 million with good civil rights"
  },
  "l38": {
    id: "l38",
    title: "Windswept",
    description: "Address six issues"
  },
  "y127": {
    id: "y127",
    title: "Won't Be Fooled Again",
    description: "Crash your socialist economy"
  },
  "b10": {
    id: "b10",
    title: "You Didn't Build That",
    description: "Engage in corporate welfare"
  },
  "l13": {
    id: "l13",
    title: "Abandoned",
    description: "Exhibit a disturbingly low average lifespan"
  },
  "t25": {
    id: "t25",
    title: "Above it All",
    description: "Develop a stoic, dispassionate citizenry"
  },
  "y54": {
    id: "y54",
    title: "Agrarian Spirit",
    description: "Prioritize agriculture alongside a strong national culture"
  },
  "b1": {
    id: "b1",
    title: "Air and Glass",
    description: "Develop a technologically literate populace that doesn't care that much"
  },
  "t1": {
    id: "t1",
    title: "All Available Space",
    description: "Run a below-average but not terrible economy"
  },
  "e9": {
    id: "e9",
    title: "All Risks Coverage",
    description: "Master the art of the actuary"
  },
  "e5": {
    id: "e5",
    title: "All That Glitters",
    description: "Combine a thriving economy with significant corruption and inequality"
  },
  "i18": {
    id: "i18",
    title: "An Apple a Day",
    description: "Encourage healthy eating"
  },
  "y187": {
    id: "y187",
    title: "Annals of History",
    description: "Devote your nation to the written word"
  },
  "y243": {
    id: "y243",
    title: "Another Day Older and Deeper in Debt",
    description: "Teach children about the harshness of life early"
  },
  "m16": {
    id: "m16",
    title: "Arms Dealer",
    description: "Build enough advanced weaponry to supply half the world"
  },
  "y108": {
    id: "y108",
    title: "Arsenal",
    description: "Develop your domestic arms industry"
  },
  "c13": {
    id: "c13",
    title: "Artist's Impression",
    description: "Develop high levels of economic freedom in a nation of at least 250 million citizens"
  },
  "c9": {
    id: "c9",
    title: "Aspire",
    description: "Develop a strong economy in a scientifically advanced nation with a good environment"
  },
  "l26": {
    id: "l26",
    title: "At Rest",
    description: "Develop a peaceful, tranquil society"
  },
  "x4": {
    id: "x4",
    title: "Atomic Age",
    description: "Build bigger bombs"
  },
  "y178": {
    id: "y178",
    title: "Author of Your Own Destiny",
    description: "Address 1000 issues and write one published issue"
  },
  "f3": {
    id: "f3",
    title: "Autumnal",
    description: "See in your first national birthday"
  },
  "x6": {
    id: "x6",
    title: "Avast!",
    description: "Keel-haul scurvy dogs"
  },
  "o10": {
    id: "o10",
    title: "Beached",
    description: "Develop a compassionate populace in a nation with a good environment"
  },
  "c19": {
    id: "c19",
    title: "Beating Heart",
    description: "Reach 300 million citizens with a very strong economy and a non-terrible environment"
  },
  "k8": {
    id: "k8",
    title: "Better Red Than Dead",
    description: "Run a socialist paradise defended by a large military"
  },
  "i9": {
    id: "i9",
    title: "Better When Bottled",
    description: "Develop a thriving bottled goods industry without reliance on alcohol"
  },
  "b19": {
    id: "b19",
    title: "Between God and Rock",
    description: "Provide significant public funding for religion"
  },
  "k1": {
    id: "k1",
    title: "Bike Lane",
    description: "Ban automobiles"
  },
  "q1": {
    id: "q1",
    title: "Birds of a Feather",
    description: "Be endorsed by six nations at once"
  },
  "i22": {
    id: "i22",
    title: "Blue Sky Mining",
    description: "Develop a strong mining industry"
  },
  "i17": {
    id: "i17",
    title: "Book Repository",
    description: "Develop quality libraries"
  },
  "i21": {
    id: "i21",
    title: "Book Smarts",
    description: "Develop a nation of readers"
  },
  "y219": {
    id: "y219",
    title: "Bottoms Up!",
    description: "Toast a beverage industry that's second to none"
  },
  "l14": {
    id: "l14",
    title: "Brave New World",
    description: "Found a region"
  },
  "a9": {
    id: "a9",
    title: "Breadbasket of the world",
    description: "Produce staggering agricultural output"
  },
  "d2": {
    id: "d2",
    title: "Bridge to Nowhere",
    description: "Overlook education"
  },
  "c1": {
    id: "c1",
    title: "Bright Lights, Big City",
    description: "Combine 1 billion citizens with a very strong economy"
  },
  "n5": {
    id: "n5",
    title: "Budding Freedoms",
    description: "Develop high recreational drug use"
  },
  "i32": {
    id: "i32",
    title: "Bushels of Baskets",
    description: "Develop a strong handicrafts industry"
  },
  "b11": {
    id: "b11",
    title: "Business First",
    description: "Prioritize commerce"
  },
  "y117": {
    id: "y117",
    title: "Camera-Carrying Cruisers",
    description: "Become overrun with tourists"
  },
  "y331": {
    id: "y331",
    title: "Carry That Weight",
    description: "Mourn the losses of a terrorist attack"
  },
  "i34": {
    id: "i34",
    title: "Cave-Ripened",
    description: "Attain caseicultural perfection"
  },
  "l16": {
    id: "l16",
    title: "Cavern",
    description: "Give tourism a state-funded helping hand to promote an excellent environment"
  },
  "v1": {
    id: "v1",
    title: "Celestial Color",
    description: "Embrace the one true faith"
  },
  "p18": {
    id: "p18",
    title: "Cheeky",
    description: "Take it all off"
  },
  "a1": {
    id: "a1",
    title: "Chewing the Cud",
    description: "Prioritize agriculture-based industries"
  },
  "y37": {
    id: "y37",
    title: "Circle of Friends",
    description: "Invest in international aid"
  },
  "c8": {
    id: "c8",
    title: "City of Sand",
    description: "Combine a population of 200 million with a terrible environment"
  },
  "t24": {
    id: "t24",
    title: "City of Sticks",
    description: "Combine a beautiful environment with a weak economy"
  },
  "i3": {
    id: "i3",
    title: "Clean and Green",
    description: "Fund environmental initiatives"
  },
  "i30": {
    id: "i30",
    title: "Clear-Cut Choice",
    description: "Turn wood into wealth with an outsized timber industry"
  },
  "b12": {
    id: "b12",
    title: "Cold Hard Reality",
    description: "Eliminate public healthcare"
  },
  "z9": {
    id: "z9",
    title: "Cold Storage",
    description: "Give IT the cold shoulder"
  },
  "w6": {
    id: "w6",
    title: "Condemned by the Space Pope",
    description: "Run a space program in a devoutly religious nation"
  },
  "e3": {
    id: "e3",
    title: "Conference",
    description: "Partner with private industry"
  },
  "b18": {
    id: "b18",
    title: "Contemplation",
    description: "Develop a faithful populace"
  },
  "i15": {
    id: "i15",
    title: "Conveyance",
    description: "Develop a strong transportation plan"
  },
  "d5": {
    id: "d5",
    title: "Could Have Happened to Anyone",
    description: "Combine sub-par intelligence with a beautiful environment"
  },
  "h1": {
    id: "h1",
    title: "Cracked",
    description: "Have trouble attracting tourists"
  },
  "o4": {
    id: "o4",
    title: "Crisp Morning",
    description: "Address 75 issues"
  },
  "t21": {
    id: "t21",
    title: "Crisp Village",
    description: "Develop a cultured, self-centered nation of at least 40 million citizens"
  },
  "m4": {
    id: "m4",
    title: "Cruise",
    description: "Build an extremely large military"
  },
  "l45": {
    id: "l45",
    title: "Cultivated",
    description: "Provide government support for parks and nature reserves"
  },
  "y210": {
    id: "y210",
    title: "Dangerous Combination",
    description: "Require everyone to own guns in a nation with drugged tap water"
  },
  "z2": {
    id: "z2",
    title: "Defiance",
    description: "Cultivate a nation of activists"
  },
  "i24": {
    id: "i24",
    title: "Delicious",
    description: "Support the dairy industry"
  },
  "b8": {
    id: "b8",
    title: "Department of Oversight",
    description: "Clamp down on political freedom"
  },
  "r9": {
    id: "r9",
    title: "Detrimental Externality",
    description: "Seriously prioritize the economy over the environment"
  },
  "x11": {
    id: "x11",
    title: "Digital Future",
    description: "Fuel your IT industry to reach unparalleled heights"
  },
  "b15": {
    id: "b15",
    title: "Dissent is Treason",
    description: "Harshly suppress political opposition"
  },
  "e14": {
    id: "e14",
    title: "Do It Yourself",
    description: "Force businesses to rise and fall on their own merits"
  },
  "b6": {
    id: "b6",
    title: "Domed",
    description: "Develop excellent political freedoms"
  },
  "i58": {
    id: "i58",
    title: "Don't Forget to Carry the One",
    description: "Run a space program without computers"
  },
  "r10": {
    id: "r10",
    title: "Dumped",
    description: "Eliminate environmental protections"
  },
  "h2": {
    id: "h2",
    title: "Dune",
    description: "Enhance the environment by removing trees"
  },
  "a4": {
    id: "a4",
    title: "Early to Rise",
    description: "Develop a thriving agriculture sector"
  },
  "y102": {
    id: "y102",
    title: "Eco-Warriors",
    description: "Protect the environment by any means necessary"
  },
  "eg2": {
    id: "eg2",
    title: "Eggcellent Detective Work",
    description: "Collect four easter eggs"
  },
  "y261": {
    id: "y261",
    title: "Eggceptional Exploring",
    description: "Find ten easter eggs"
  },
  "y255": {
    id: "y255",
    title: "Enduring Guidance",
    description: "Address 500 issues"
  },
  "i2": {
    id: "i2",
    title: "Energy Source",
    description: "Power the economy without mining"
  },
  "i5": {
    id: "i5",
    title: "Engine of Growth",
    description: "Develop a strong automotive industry"
  },
  "l3": {
    id: "l3",
    title: "Every Road is a Story",
    description: "Write five or more dispatches or factbooks"
  },
  "tv1": {
    id: "tv1",
    title: "Everyone Wants a Piece",
    description: "Develop a thriving entertainment industry"
  },
  "d3": {
    id: "d3",
    title: "Exodus",
    description: "Combine a terrible economy with a terrible environment"
  },
  "i7": {
    id: "i7",
    title: "Export Sales",
    description: "Develop a thriving industry"
  },
  "p2": {
    id: "p2",
    title: "Faces of [nation-name] #1",
    description: "Develop above average civil rights"
  },
  "p9": {
    id: "p9",
    title: "Faces of [nation-name] #2",
    description: "Develop very good civil rights"
  },
  "p8": {
    id: "p8",
    title: "Faces of [nation-name] #3",
    description: "Develop very good civil rights"
  },
  "p7": {
    id: "p7",
    title: "Faces of [nation-name] #4",
    description: "Develop excellent civil rights"
  },
  "p6": {
    id: "p6",
    title: "Faces of [nation-name] #5",
    description: "Develop excellent civil rights"
  },
  "p5": {
    id: "p5",
    title: "Faces of [nation-name] #6",
    description: "Develop superb civil rights"
  },
  "p10": {
    id: "p10",
    title: "Faces of [nation-name] #7",
    description: "Develop superb civil rights"
  },
  "p11": {
    id: "p11",
    title: "Faces of [nation-name] #8",
    description: "Develop world benchmark civil rights"
  },
  "p12": {
    id: "p12",
    title: "Faces of [nation-name] #9",
    description: "Develop world benchmark civil rights"
  },
  "p13": {
    id: "p13",
    title: "Faces of [nation-name] #10",
    description: "Develop world benchmark civil rights"
  },
  "p14": {
    id: "p14",
    title: "Faces of [nation-name] #11",
    description: "Develop excessive civil rights"
  },
  "p15": {
    id: "p15",
    title: "Faces of [nation-name] #12",
    description: "Develop excessive civil rights"
  },
  "p16": {
    id: "p16",
    title: "Faces of [nation-name] #13",
    description: "Develop frightening civil rights"
  },
  "p21": {
    id: "p21",
    title: "Faces of [nation-name] #14",
    description: "Develop frightening civil rights"
  },
  "c5": {
    id: "c5",
    title: "Fast Lane",
    description: "Choose cars over environment"
  },
  "t19": {
    id: "t19",
    title: "Father Knows Best",
    description: "Become a Father Knows Best state"
  },
  "y279": {
    id: "y279",
    title: "Fervent Followers",
    description: "Inspire a patriotic population of true believers"
  },
  "l20": {
    id: "l20",
    title: "Fields of Gold",
    description: "Become a World Assembly Delegate"
  },
  "z5": {
    id: "z5",
    title: "Fifth Directorate",
    description: "Make omnipresent law enforcement a part of daily life"
  },
  "y5": {
    id: "y5",
    title: "Financial Planning",
    description: "Boost your financial service industry"
  },
  "e10": {
    id: "e10",
    title: "For-Profit Governance",
    description: "Earn a profit with the public purse"
  },
  "b38": {
    id: "b38",
    title: "Form Factor",
    description: "Demonstrate an extreme affinity for paperwork"
  },
  "g1": {
    id: "g1",
    title: "Form and Function",
    description: "Guide the political process with a firm hand"
  },
  "i12": {
    id: "i12",
    title: "Foundry",
    description: "Develop a solid industrial base"
  },
  "tv9": {
    id: "tv9",
    title: "Free and Fair?",
    description: "Tightly regulate voting to ensure proper election results"
  },
  "z3": {
    id: "z3",
    title: "Freedom From",
    description: "Have a populace who is happy with what you give them"
  },
  "m6": {
    id: "m6",
    title: "From Above",
    description: "Build a very large military"
  },
  "d20": {
    id: "d20",
    title: "From Below",
    description: "Let nothing stand between you and the raw materials you crave"
  },
  "a5": {
    id: "a5",
    title: "From the Earth",
    description: "Enforce compulsory vegetarianism"
  },
  "b22": {
    id: "b22",
    title: "Gatekeepers",
    description: "Develop high levels of corruption"
  },
  "n2": {
    id: "n2",
    title: "Genetic Warfare",
    description: "Combine a strong military with advanced medical research"
  },
  "m9": {
    id: "m9",
    title: "Girl Power",
    description: "Run a Mother Knows Best State with a significant military"
  },
  "p22": {
    id: "p22",
    title: "Giving Back",
    description: "Extend your citizens' average lifespan beyond 70 years"
  },
  "l65": {
    id: "l65",
    title: "Glorious Purpose",
    description: "Address 750 issues"
  },
  "g2": {
    id: "g2",
    title: "Glory to the Government",
    description: "Develop a large, corrupt government"
  },
  "l34": {
    id: "l34",
    title: "Go It Alone",
    description: "Reject state-funded welfare"
  },
  "i11": {
    id: "i11",
    title: "Gone Fission",
    description: "Build nuclear power plants"
  },
  "y359": {
    id: "y359",
    title: "Good Habits",
    description: "Religiously segregate genders"
  },
  "y237": {
    id: "y237",
    title: "Government Cheese",
    description: "Feed the people"
  },
  "l22": {
    id: "l22",
    title: "Gray Power",
    description: "Care for the elderly"
  },
  "z1": {
    id: "z1",
    title: "Great Works",
    description: "Be cultured and clever"
  },
  "b20": {
    id: "b20",
    title: "Hallowed Halls",
    description: "Support traditional religion"
  },
  "p3": {
    id: "p3",
    title: "Handheld",
    description: "Stay out of the bedroom"
  },
  "t33": {
    id: "t33",
    title: "Handicapper General",
    description: "Level the playing field"
  },
  "y163": {
    id: "y163",
    title: "Hands Off",
    description: "Ban all forms of physical contact between couples"
  },
  "f4": {
    id: "f4",
    title: "Happy Trails",
    description: "Address 200 issues"
  },
  "t57": {
    id: "t57",
    title: "Have It In a Couple of Weeks",
    description: "Close up shop on the retail industry"
  },
  "y194": {
    id: "y194",
    title: "Helping Hand",
    description: "Commit to international aid while maintaining a strong military"
  },
  "t5": {
    id: "t5",
    title: "High-Density Culture",
    description: "Show an appreciation for the finer things"
  },
  "l12": {
    id: "l12",
    title: "Hiking",
    description: "Leverage a beautiful environment into a thriving tourism industry"
  },
  "l2": {
    id: "l2",
    title: "Hilly Terrain",
    description: "Become a site supporter"
  },
  "k4": {
    id: "k4",
    title: "Holy Warriors",
    description: "Develop a faith-based military"
  },
  "t10": {
    id: "t10",
    title: "Holy Water",
    description: "Support [nation-religion]"
  },
  "l35": {
    id: "l35",
    title: "Home Alone",
    description: "Develop a populace who like to keep to themselves"
  },
  "y2": {
    id: "y2",
    title: "Home Furnishing",
    description: "Support your local carpenters"
  },
  "r5": {
    id: "r5",
    title: "Home",
    description: "Develop a good economy with some income inequality"
  },
  "o2": {
    id: "o2",
    title: "Homeward, with Ripples",
    description: "Develop a thriving tourism industry"
  },
  "e17": {
    id: "e17",
    title: "Honor Among Thieves",
    description: "Be known for surprisingly courteous criminals"
  },
  "l17": {
    id: "l17",
    title: "Hostile Elements",
    description: "Develop a nation of at least 50 million citizens who aren't especially fond of strangers"
  },
  "y61": {
    id: "y61",
    title: "I Am the State",
    description: "Demonstrate absolutist tendencies"
  },
  "t8": {
    id: "t8",
    title: "Icy Gaze",
    description: "Address 250 issues"
  },
  "l36": {
    id: "l36",
    title: "Immortal",
    description: "Address 300 issues"
  },
  "n3": {
    id: "n3",
    title: "Improvements Can Be Made",
    description: "Fund very advanced health research"
  },
  "k2": {
    id: "k2",
    title: "In My Sights",
    description: "Support the right to bear arms"
  },
  "d7": {
    id: "d7",
    title: "Inconsistent Service Delivery",
    description: "Abolish the government"
  },
  "c4": {
    id: "c4",
    title: "Incremental Improvement",
    description: "Develop a good economy in a nation of at least 200 million citizens"
  },
  "x5": {
    id: "x5",
    title: "Infected",
    description: "Deal with the undead"
  },
  "y202": {
    id: "y202",
    title: "Insular Inhabitants",
    description: "Run a nation with closed borders and homogeneous, xenophobic citizens"
  },
  "b4": {
    id: "b4",
    title: "Interior Tech",
    description: "Combine a strong IT industry with a powerhouse economy"
  },
  "p37": {
    id: "p37",
    title: "International Outsider",
    description: "Pass a World Assembly resolution and have no current endorsements"
  },
  "e11": {
    id: "e11",
    title: "Invisible Hand",
    description: "Let the private sector handle most typical government functions"
  },
  "c14": {
    id: "c14",
    title: "Island of Many Hills",
    description: "Develop a very strong economy in a nation of 2 billion citizens"
  },
  "y244": {
    id: "y244",
    title: "It's Not the Scandal, It's the Cover-Up",
    description: "Face off against a harsh critic of your administration"
  },
  "i16": {
    id: "i16",
    title: "Jacked In",
    description: "Embrace technology"
  },
  "y38": {
    id: "y38",
    title: "Just Called to Say I Love You",
    description: "Have a populace who is freely happy"
  },
  "p26": {
    id: "p26",
    title: "Keeper of the Flame",
    description: "Support alternative religions"
  },
  "s1": {
    id: "s1",
    title: "Keeping the Peace",
    description: "Prioritize Law & Order"
  },
  "p24": {
    id: "p24",
    title: "Kickball",
    description: "Nurture a happy, free populace"
  },
  "y82": {
    id: "y82",
    title: "Kids Wanna Rock",
    description: "Have a strong youth culture"
  },
  "b32": {
    id: "b32",
    title: "Knowledge is Power",
    description: "Found schools that are the envy of the world"
  },
  "y182": {
    id: "y182",
    title: "Lab Rats",
    description: "Develop an intelligent yet cynical populace"
  },
  "y236": {
    id: "y236",
    title: "Laissez-Faire for Some",
    description: "Demonstrate surprising tolerance for the free market"
  },
  "y330": {
    id: "y330",
    title: "Latest Imports",
    description: "Rely on foreign imports for your automotive needs"
  },
  "b7": {
    id: "b7",
    title: "Leadership",
    description: "Take charge"
  },
  "p38": {
    id: "p38",
    title: "Liberty, Equality, Fraternity",
    description: "Ensure equality under law"
  },
  "x7": {
    id: "x7",
    title: "Life Finds a Way",
    description: "Bring back prehistoric beasts"
  },
  "l41": {
    id: "l41",
    title: "Life is a Mystery",
    description: "Cultivate a deeply spiritual populace"
  },
  "t6": {
    id: "t6",
    title: "Light the Lamps",
    description: "Become influential in a region"
  },
  "b24": {
    id: "b24",
    title: "Listening In",
    description: "Take a keen interest in what your citizens are doing"
  },
  "p31": {
    id: "p31",
    title: "Live Fast, Die Young",
    description: "Encourage your citizens to take risks"
  },
  "i8": {
    id: "i8",
    title: "Live Wire",
    description: "Outsource national power generation"
  },
  "e4": {
    id: "e4",
    title: "Making No Cents",
    description: "Free yourself from the tyranny of coins"
  },
  "y347": {
    id: "y347",
    title: "Marathon not a Sprint",
    description: "Reside in a region for more than 6 months"
  },
  "y68": {
    id: "y68",
    title: "Masterwork",
    description: "Nurture the skills of master artisans"
  },
  "m8": {
    id: "m8",
    title: "Material Disadvantage",
    description: "Build an inadequately-funded military"
  },
  "n1": {
    id: "n1",
    title: "Medical Innovation",
    description: "Fund advanced health research"
  },
  "b16": {
    id: "b16",
    title: "Medieval",
    description: "Reject modern ways"
  },
  "c15": {
    id: "c15",
    title: "Mega-Metropolis",
    description: "Combine 10 billion citizens with a powerhouse economy"
  },
  "l40": {
    id: "l40",
    title: "Mesa",
    description: "Address 15 issues"
  },
  "c3": {
    id: "c3",
    title: "Metropolis",
    description: "Combine 400 million citizens with a good economy"
  },
  "a7": {
    id: "a7",
    title: "Migrant Labor",
    description: "Build an agricultural sector on low-paid immigrant labor"
  },
  "l57": {
    id: "l57",
    title: "Millennial Persistence",
    description: "Address 1000 issues"
  },
  "b3": {
    id: "b3",
    title: "Minimalist Curves",
    description: "Develop an extremely intelligent populace"
  },
  "f1": {
    id: "f1",
    title: "Misty Morning",
    description: "Protect the forests"
  },
  "i1": {
    id: "i1",
    title: "Model of Efficiency",
    description: "Prioritize the economy over the environment"
  },
  "c6": {
    id: "c6",
    title: "Modern Steel",
    description: "Reach 100 million citizens with an excellent environment and economy"
  },
  "b2": {
    id: "b2",
    title: "Modern Style",
    description: "Develop clever citizens"
  },
  "t16": {
    id: "t16",
    title: "Morning Calm",
    description: "Achieve balance in all things"
  },
  "p1": {
    id: "p1",
    title: "Mother and Child",
    description: "Eliminate youth crime while maintaining civil rights"
  },
  "p4": {
    id: "p4",
    title: "Nanocyberian Fashion",
    description: "Develop a world-class fashion industry"
  },
  "y154": {
    id: "y154",
    title: "Nation of States",
    description: "Manage a diverse yet patriotic assembly of self-governing regions"
  },
  "s3": {
    id: "s3",
    title: "National Pride",
    description: "Enforce compulsory military service"
  },
  "b14": {
    id: "b14",
    title: "Needs of the Many",
    description: "Enforce capital punishment"
  },
  "o9": {
    id: "o9",
    title: "New Around Here",
    description: "Found a nation!"
  },
  "y119": {
    id: "y119",
    title: "New Methods",
    description: "Abandon the traditional industries"
  },
  "t27": {
    id: "t27",
    title: "Nice Part of Town",
    description: "Get cultured"
  },
  "b17": {
    id: "b17",
    title: "Nice for Some",
    description: "Simultaneously develop a strong economy and high income inequality"
  },
  "y266": {
    id: "y266",
    title: "No Escape From Reality",
    description: "Outlaw practically everything that would distract people from their jobs"
  },
  "c20": {
    id: "c20",
    title: "No Limits",
    description: "Abolish speed limits"
  },
  "w1": {
    id: "w1",
    title: "No Moisture Required",
    description: "Have a truly terrible environment"
  },
  "u1": {
    id: "u1",
    title: "No Rest for the Young",
    description: "Develop a problem with youth crime"
  },
  "d4": {
    id: "d4",
    title: "Not Sure What's Happening Here",
    description: "Be strange"
  },
  "r11": {
    id: "r11",
    title: "Nothing to See Here",
    description: "Develop a serious crime problem"
  },
  "y122": {
    id: "y122",
    title: "Nuclear Family Testing",
    description: "Allow people to have multiple spouses but only one child"
  },
  "l24": {
    id: "l24",
    title: "Oasis",
    description: "Be a regional hermit"
  },
  "eg1": {
    id: "eg1",
    title: "Oblong Secrets",
    description: "Find an easter egg"
  },
  "p20": {
    id: "p20",
    title: "Ocean Frolics",
    description: "Make your people extremely cheerful"
  },
  "o3": {
    id: "o3",
    title: "Ocean Nova",
    description: "Develop a world-class environment"
  },
  "y184": {
    id: "y184",
    title: "Old Growth",
    description: "Cultivate a mighty environment"
  },
  "l31": {
    id: "l31",
    title: "Old Ways are Best",
    description: "Develop a low-tech but economically thriving nation"
  },
  "t31": {
    id: "t31",
    title: "On Everyone's Bucket List",
    description: "Build a substantial tourism industry"
  },
  "i26": {
    id: "i26",
    title: "On Rails",
    description: "Provide substantial public transport"
  },
  "b31": {
    id: "b31",
    title: "On a Mission",
    description: "Encourage the populace to stay on their knees"
  },
  "y153": {
    id: "y153",
    title: "On the Beat",
    description: "Install a police state"
  },
  "a6": {
    id: "a6",
    title: "On the Menu",
    description: "Eat your national animal"
  },
  "t9": {
    id: "t9",
    title: "On the Water",
    description: "Prioritize the environment over the economy"
  },
  "e2": {
    id: "e2",
    title: "Open for Business",
    description: "Help your people do business"
  },
  "x9": {
    id: "x9",
    title: "Oracle",
    description: "Defer to the spirits"
  },
  "x14": {
    id: "x14",
    title: "Our Thing",
    description: "Allow organized crime to run much of the nation"
  },
  "x1": {
    id: "x1",
    title: "Out There",
    description: "Become so technologically advanced, they don't even have a name for it"
  },
  "l11": {
    id: "l11",
    title: "Outdoor Pursuits",
    description: "Combine a healthy populace, civil rights, and an excellent environment"
  },
  "y49": {
    id: "y49",
    title: "Overcomer",
    description: "Address 2500 issues"
  },
  "l27": {
    id: "l27",
    title: "Overgrowth",
    description: "Allow the wilderness to run rampant"
  },
  "t11": {
    id: "t11",
    title: "Oversight",
    description: "Fund Law & Order in a low-tech nation"
  },
  "b23": {
    id: "b23",
    title: "Palatial",
    description: "Develop very high levels of corruption"
  },
  "y138": {
    id: "y138",
    title: "Parade Duty",
    description: "Build a big military but have no interest in using it"
  },
  "m5": {
    id: "m5",
    title: "Patrol",
    description: "Build a ridiculously large military"
  },
  "l29": {
    id: "l29",
    title: "Pause for Sightseeing",
    description: "Combine a pleasant environment with cars and low intelligence"
  },
  "x12": {
    id: "x12",
    title: "Peace is Our Profession",
    description: "Exhibit militaristic paranoia"
  },
  "m7": {
    id: "m7",
    title: "Peacekeepers",
    description: "Build a military"
  },
  "l18": {
    id: "l18",
    title: "Perched",
    description: "Divide into self-governing regions"
  },
  "y30": {
    id: "y30",
    title: "Permanently Grounded",
    description: "Outlaw civilian air transportation"
  },
  "y46": {
    id: "y46",
    title: "Permission Slip",
    description: "Establish a bureaucracy"
  },
  "b28": {
    id: "b28",
    title: "Personal Journeys",
    description: "Divest the state of all matters of faith"
  },
  "b25": {
    id: "b25",
    title: "Perspective",
    description: "Believe in religious tolerance"
  },
  "y132": {
    id: "y132",
    title: "Pilgrim's Progress",
    description: "Become a destination for religious pilgrims"
  },
  "g3": {
    id: "g3",
    title: "Pillar of Society",
    description: "Grow the government"
  },
  "i4": {
    id: "i4",
    title: "Piped Profits",
    description: "Develop a thriving soda industry"
  },
  "i40": {
    id: "i40",
    title: "Pizza Party",
    description: "Achieve supreme levels of fast food production"
  },
  "i13": {
    id: "i13",
    title: "Platform for Expansion",
    description: "Develop a very large industrial base"
  },
  "p23": {
    id: "p23",
    title: "Popular Uprising",
    description: "Defend the right to protest"
  },
  "c16": {
    id: "c16",
    title: "Power Grid",
    description: "Boost education"
  },
  "p17": {
    id: "p17",
    title: "Power from the People",
    description: "Develop a keenly politically-aware populace"
  },
  "b27": {
    id: "b27",
    title: "Praise the Lord and Pass the Doobie",
    description: "Allow citizens to get high while searching for a higher power"
  },
  "a3": {
    id: "a3",
    title: "Productive Soil",
    description: "Develop a strong agriculture sector alongside a good environment"
  },
  "c7": {
    id: "c7",
    title: "Progress is Movement",
    description: "Develop a thriving gambling industry"
  },
  "c10": {
    id: "c10",
    title: "Progress is Thirsty Work",
    description: "Develop a strong economy in a collapsing environment"
  },
  "k3": {
    id: "k3",
    title: "Protector",
    description: "Know what's best"
  },
  "i51": {
    id: "i51",
    title: "Prototype",
    description: "Lead innovation in the automotive industry"
  },
  "i20": {
    id: "i20",
    title: "Puffing Billy",
    description: "Provide low-tech public transport"
  },
  "t14": {
    id: "t14",
    title: "Queen of the Hill",
    description: "Address 30 issues"
  },
  "i19": {
    id: "i19",
    title: "Railworks",
    description: "Maintain a healthy economy in the absence of cars"
  },
  "y99": {
    id: "y99",
    title: "Rapid Intervention",
    description: "Get your people moving together"
  },
  "y73": {
    id: "y73",
    title: "Rebels With a Cause",
    description: "Have high crime despite keeping your close control of your citizens"
  },
  "l1": {
    id: "l1",
    title: "Red Dawn",
    description: "Revere a land-based animal"
  },
  "y172": {
    id: "y172",
    title: "Red Nightmare",
    description: "Run a socialist nation that leaves revolutionaries spinning in their graves"
  },
  "b34": {
    id: "b34",
    title: "Red Tape",
    description: "Run a government that spends most of its money on running the government"
  },
  "y335": {
    id: "y335",
    title: "Red in Tooth and Claw",
    description: "Leave children to fend for themselves"
  },
  "l25": {
    id: "l25",
    title: "Remembered",
    description: "Push average citizen lifespan below 50 years"
  },
  "b9": {
    id: "b9",
    title: "Removed",
    description: "Develop a religious yet uncaring populace"
  },
  "c11": {
    id: "c11",
    title: "Renovator's Delight",
    description: "Combine 100 million citizens with a weak economy"
  },
  "o5": {
    id: "o5",
    title: "Respected",
    description: "Be endorsed"
  },
  "l30": {
    id: "l30",
    title: "Retirement",
    description: "Extend your citizens' average lifespan beyond 80 years"
  },
  "l10": {
    id: "l10",
    title: "Revolving",
    description: "Explore alternative forms of energy"
  },
  "e1": {
    id: "e1",
    title: "Ride the Wave",
    description: "Trust the market"
  },
  "c2": {
    id: "c2",
    title: "River City",
    description: "Combine 100 million citizens with a reasonable economy"
  },
  "l21": {
    id: "l21",
    title: "Rock of Ages",
    description: "Be truly ancient"
  },
  "l37": {
    id: "l37",
    title: "Rocky Endeavor",
    description: "Address 150 issues"
  },
  "y301": {
    id: "y301",
    title: "Room and Board",
    description: "Provide a social safety net"
  },
  "y360": {
    id: "y360",
    title: "Runaway Bride",
    description: "Oversee short-lived marriages"
  },
  "y238": {
    id: "y238",
    title: "Running Lean",
    description: "Trim the fat from your administration"
  },
  "y353": {
    id: "y353",
    title: "Rural Idyll",
    description: "Encourage your citizens to seek happiness in the simple life"
  },
  "a2": {
    id: "a2",
    title: "Rush Hour",
    description: "Develop a strong cattle industry"
  },
  "l7": {
    id: "l7",
    title: "Sand and Rock",
    description: "Attribute 1% of annual deaths to people getting lost in the wilderness"
  },
  "l39": {
    id: "l39",
    title: "Scenic Slag Heap",
    description: "Develop a beautiful environment alongside a thriving mining industry"
  },
  "d8": {
    id: "d8",
    title: "Scratching on Rocks",
    description: "Cut off the publishing industry"
  },
  "t17": {
    id: "t17",
    title: "Seat of Power",
    description: "Develop a large, tasteful government"
  },
  "b29": {
    id: "b29",
    title: "Secular by Choice",
    description: "Allow complete religious freedom to citizens who don't really care about religion"
  },
  "b13": {
    id: "b13",
    title: "Secure",
    description: "Fill the prisons"
  },
  "l28": {
    id: "l28",
    title: "Seeing in the Dawn",
    description: "Develop a population of at least 6 million citizens"
  },
  "r6": {
    id: "r6",
    title: "Seen Better Days",
    description: "Run a crumbling economy"
  },
  "r2": {
    id: "r2",
    title: "Seen Much Better Days",
    description: "Run a very poor economy"
  },
  "b5": {
    id: "b5",
    title: "Server Room",
    description: "Develop a strong technology industry"
  },
  "i47": {
    id: "i47",
    title: "Service Economy",
    description: "Offer the ultimate retail experience"
  },
  "o8": {
    id: "o8",
    title: "Shacked Up",
    description: "Combine a good environment with below-average economy"
  },
  "t23": {
    id: "t23",
    title: "Simple Life",
    description: "Develop an issue with unemployment"
  },
  "y96": {
    id: "y96",
    title: "Sin City",
    description: "Become a destination for tourists of questionable morals"
  },
  "c17": {
    id: "c17",
    title: "Skyward",
    description: "Reach 500 million citizens with a very strong economy"
  },
  "y204": {
    id: "y204",
    title: "Slavery, Serfdom, and Subjugation",
    description: "Run a feudal system that colonizes distant lands by using forced labor"
  },
  "i25": {
    id: "i25",
    title: "Slice of Life",
    description: "Support the pizza industry"
  },
  "d1": {
    id: "d1",
    title: "Slight Crime Problem",
    description: "Develop a crippling crime problem in a reasonably wealthy nation of at least 500 million citizens"
  },
  "y129": {
    id: "y129",
    title: "Slipped Through the Net",
    description: "Decimate your fishing industry"
  },
  "r3": {
    id: "r3",
    title: "Slumming",
    description: "Develop significant numbers of impoverished citizens"
  },
  "r4": {
    id: "r4",
    title: "Small Business",
    description: "Run a fragile economy or worse"
  },
  "l42": {
    id: "l42",
    title: "Snowed In",
    description: "Address ten issues"
  },
  "l8": {
    id: "l8",
    title: "Sole Survivor",
    description: "Develop an extremely strong timber industry"
  },
  "l4": {
    id: "l4",
    title: "Some Climbing Required",
    description: "Write a Factbook"
  },
  "l23": {
    id: "l23",
    title: "Something Better",
    description: "Reject industry"
  },
  "b21": {
    id: "b21",
    title: "Stadium",
    description: "Develop healthy citizens"
  },
  "l43": {
    id: "l43",
    title: "Stand Alone",
    description: "Eschew the military"
  },
  "p19": {
    id: "p19",
    title: "Starting Out",
    description: "Combine civil rights with a healthy economy"
  },
  "c18": {
    id: "c18",
    title: "Steel and Glass",
    description: "Reach 2 billion citizens with a strong economy"
  },
  "t59": {
    id: "t59",
    title: "Storied",
    description: "Address 1500 issues"
  },
  "r7": {
    id: "r7",
    title: "Stories to Tell",
    description: "Publish a dispatch other than a Factbook"
  },
  "y228": {
    id: "y228",
    title: "Stupid Is as Stupid Does",
    description: "Wallow in ignorance"
  },
  "y220": {
    id: "y220",
    title: "Suffer the Little Children",
    description: "Refuse to support inevitably large families"
  },
  "t18": {
    id: "t18",
    title: "Summer Residence",
    description: "Develop deep-rooted corruption with a taste for nice things"
  },
  "m2": {
    id: "m2",
    title: "Sunset Escort",
    description: "Build a substantial military"
  },
  "y320": {
    id: "y320",
    title: "Sword and Shield",
    description: "Build a large military that doesn't use guns"
  },
  "f5": {
    id: "f5",
    title: "Tall Timber",
    description: "Develop a thriving timber industry"
  },
  "m1": {
    id: "m1",
    title: "Tanks for Everything",
    description: "Build a large military"
  },
  "l32": {
    id: "l32",
    title: "Temperature Dropping",
    description: "Develop an inhospitable climate"
  },
  "y114": {
    id: "y114",
    title: "Thanks for All the Fish",
    description: "Draw great wealth from the seas"
  },
  "r16": {
    id: "r16",
    title: "That's Not Red Ink Dripping From the Budget",
    description: "Save money on government healthcare expenses by euthanizing the elderly"
  },
  "i23": {
    id: "i23",
    title: "The Fish Are Worth It",
    description: "Support the fishing industry"
  },
  "w2": {
    id: "w2",
    title: "The Future is Near",
    description: "Make contact"
  },
  "y101": {
    id: "y101",
    title: "The Gig is Up",
    description: "Develop a strong informal economy"
  },
  "y268": {
    id: "y268",
    title: "The Giver",
    description: "Deliver unprecedented amounts of aid to the needy"
  },
  "y256": {
    id: "y256",
    title: "The Good the Bad and the Ugly",
    description: "Build a nation of primitive outlaws"
  },
  "z8": {
    id: "z8",
    title: "The Great Firewall",
    description: "Control the dialogue"
  },
  "i14": {
    id: "i14",
    title: "The Hand That Feeds",
    description: "Simultaneously develop strong automotive and agricultural sectors"
  },
    "l44": {
        id: "l44",
        title: "The Hills are Alive",
        description: "Develop a beautiful environment in a nation of 1 billion citizens"
    },
    "y206": {
        id: "y206",
        title: "The Lost World",
        description: "Change your mind about dinosaurs"
    },
    "t4": {
        id: "t4",
        title: "The Other Way",
        description: "Develop a good economy without free markets"
    },
    "y85": {
        id: "y85",
        title: "The Pen is Mightier",
        description: "Develop a literary yet IT illiterate populace"
    },
    "r8": {
        id: "r8",
        title: "The Sea Remembers",
        description: "Make sewage waste someone else's problem"
    },
    "t15": {
        id: "t15",
        title: "The Sun Always Rises",
        description: "Exhibit low unemployment"
    },
    "w3": {
        id: "w3",
        title: "The Worlds Above Us",
        description: "Reach for the stars"
    },
    "n4": {
        id: "n4",
        title: "There Are Always More Questions",
        description: "Become highly scientifically advanced"
    },
    "x3": {
        id: "x3",
        title: "There Will Be Blood",
        description: "Make sacrifices"
    },
    "l33": {
        id: "l33",
        title: "There's a Whole World Out Here",
        description: "Abolish computers"
    },
    "c21": {
        id: "c21",
        title: "They Grow Up So Fast",
        description: "Develop a good economy in a nation of 300 million citizens"
    },
    "s2": {
        id: "s2",
        title: "Thickening Blue Line",
        description: "Boost the police force"
    },
    "s4": {
        id: "s4",
        title: "This Never Happened",
        description: "Clamp down on a free press"
    },
    "p41": {
        id: "p41",
        title: "To Each According to Their Need",
        description: "Guarantee your populace a comfortable life"
    },
    "p25": {
        id: "p25",
        title: "Together",
        description: "Share the institution of marriage"
    },
    "l9": {
        id: "l9",
        title: "Tourist Destination",
        description: "Develop a culture-based tourism industry"
    },
    "i6": {
        id: "i6",
        title: "Trade Hub",
        description: "Develop a broad industrial base"
    },
    "y62": {
        id: "y62",
        title: "Traditional Knowledge",
        description: "Revel in the superiority of your traditional crafts"
    },
    "t13": {
        id: "t13",
        title: "Tranquility",
        description: "Develop a pleasant environment in a religious nation"
    },
    "f2": {
        id: "f2",
        title: "Treefall",
        description: "Protect the land"
    },
    "l5": {
        id: "l5",
        title: "Trespassers Will Be Prosecuted",
        description: "Close the borders to immigration"
    },
    "r1": {
        id: "r1",
        title: "Trickle Down",
        description: "Develop high income inequality"
    },
    "l6": {
        id: "l6",
        title: "Unbeaten Path",
        description: "Become an Anarchy"
    },
    "t12": {
        id: "t12",
        title: "Under and Over",
        description: "Simultaneously develop low inequality and high culture"
    },
    "z4": {
        id: "z4",
        title: "Under Your Eye",
        description: "Eliminate youth crime while stamping out civil rights"
    },
    "u2": {
        id: "u2",
        title: "Underbelly",
        description: "Combine heavy industry with crime"
    },
    "t38": {
        id: "t38",
        title: "Undergrounded",
        description: "Develop a thriving black market"
    },
    "c12": {
        id: "c12",
        title: "Urban Sprawl",
        description: "Reach 5 billion citizens"
    },
    "x2": {
        id: "x2",
        title: "Vats Entertainment",
        description: "Embrace vats"
    },
    "i10": {
        id: "i10",
        title: "Vaults of Knowledge",
        description: "Develop a thriving publishing industry"
    },
    "o1": {
        id: "o1",
        title: "Very Fishy",
        description: "Revere a marine animal"
    },
    "y22": {
        id: "y22",
        title: "Virtual Gold",
        description: "Use commodities to back a digital currency"
    },
    "t2": {
        id: "t2",
        title: "Vista",
        description: "Be cultured"
    },
    "l47": {
        id: "l47",
        title: "Voluntary Isolation",
        description: "Develop a self-sufficient nation"
    },
    "o6": {
        id: "o6",
        title: "Waking in Paradise",
        description: "Develop an extremely good environment"
    }

};

export function getBannerById(id: string): BannerData | undefined {
    return bannerDatabase[id];
  }
  
  export function validateBannerId(id: string): boolean {
    return id in bannerDatabase;
  }
  
  export function getAllBanners(): BannerData[] {
    return Object.values(bannerDatabase);
  }