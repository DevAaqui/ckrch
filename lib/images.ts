export type GalleryItem = {
  id: string;
  title: string;
  subtitle: string;
  src: string;
  /** Shown after the image vanishes. */
  revealQuote: string;
  revealAuthor: string;
};

// Cabinet portraits (Modi 3.0 ranking). Reveal quotes are sarcastic dissent from the Cockroach Janta Party.
export const galleryItems: GalleryItem[] = [
  {
    id: "kumar-vishwas",
    title: "Dr. Kumar Vishwas",
    subtitle: "Hindi poet · Ram-bhakt · founding member, AAP (former)",
    src: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Kumar_Vishwas_%28Poet%29.jpg",
    revealQuote:
      "Koi deewana kehta hai, koi pagal samajhta hai — hum kehte hain: pehle mic band karo, phir party badlo. Cockroach Janta Party is not auditioning for your kavi sammelan.",
    revealAuthor: "Cockroach Janta Party",
  },
  {
    id: "dharmendra-pradhan",
    title: "Dharmendra Pradhan",
    subtitle: "Union Minister of Education · Sambalpur, Odisha",
    src: "https://upload.wikimedia.org/wikipedia/commons/5/51/Shri_Dharmendra_Pradhan_Petroleum_Minister.jpg",
    revealQuote:
      "NEP 2020? More like NCP — Now Cockroaches Prosper. Your syllabus has six legs and zero accountability. The Cockroach Janta Party rejects this foundation.",
    revealAuthor: "Cockroach Janta Party",
  },
  {
    id: "rajnath-singh",
    title: "Rajnath Singh",
    subtitle: "Rank 2 · Union Minister of Defence · Lucknow, UP",
    src: "https://upload.wikimedia.org/wikipedia/commons/5/52/Shri_Rajnath_Singh%2C_Defence_Minister_of_India.jpg",
    revealQuote:
      "Befitting reply promised — we sent swamp of cockroaches instead. Defence budget intact; kitchen hygiene, not so much. Cockroach Janta Party: provoked since tap one.",
    revealAuthor: "Cockroach Janta Party",
  },
  {
    id: "amit-shah",
    title: "Amit Shah",
    subtitle: "Rank 3 · Home Affairs & Cooperation · Gandhinagar, Gujarat",
    src: "https://upload.wikimedia.org/wikipedia/commons/3/30/Union_Minister_for_Home_Affairs.jpg",
    revealQuote:
      "Kashmir was, is, and will always be integral — so is our infestation in your photo frame. Article 370? We invoke Article 3:70 — seventy percent of the portrait, now ours.",
    revealAuthor: "Cockroach Janta Party",
  },
  {
    id: "nitin-gadkari",
    title: "Nitin Gadkari",
    subtitle: "Rank 4 · Road Transport & Highways · Nagpur, Maharashtra",
    src: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Sh_Nitin_Jairam_Gadkari%2C_Hon%27ble_Minister%2C_Government_of_India_%28cropped%29.jpg",
    revealQuote:
      "Good roads are the lifeline of a nation — excellent. Our antennae felt every pothole you paved over with press releases. Cockroach Janta Party demands a flyover to the dustbin.",
    revealAuthor: "Cockroach Janta Party",
  },
  {
    id: "jp-nadda",
    title: "J. P. Nadda",
    subtitle: "Rank 5 · Health & Family Welfare; Chemicals & Fertilizers · BJP President",
    src: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Shri_JP_Nadda.png",
    revealQuote:
      "Discipline and dedication are the soul of the karyakarta — ours scuttle without permission slips. Health ministry, meet pest control. Cockroach Janta Party votes no confidence in your spray.",
    revealAuthor: "Cockroach Janta Party",
  },
  {
    id: "shivraj-chouhan",
    title: "Shivraj Singh Chouhan",
    subtitle: "Rank 6 · Agriculture & Farmers' Welfare; Rural Development · Vidisha, MP",
    src: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Shivraj_Singh_Chouhan_2025.jpg",
    revealQuote:
      "Kisaan bhaiyon ka samman — hum bhi field experts hain, bas crop churaate hain nahi, portraits. Cockroach Janta Party: your first welfare scheme should be a broom.",
    revealAuthor: "Cockroach Janta Party",
  },
  {
    id: "nirmala-sitharaman",
    title: "Nirmala Sitharaman",
    subtitle: "Rank 7 · Finance & Corporate Affairs · Rajya Sabha, Karnataka",
    src: "https://upload.wikimedia.org/wikipedia/commons/b/be/Smt._Nirmala_Sitharaman_Minister_of_Finance.jpg",
    revealQuote:
      "Reform, perform, transform — we propose defund, deform, and infest. Atmanirbhar Bharat? Try Atma-near-barata: cockroaches near every budget speech. Cockroach Janta Party audits in antennae.",
    revealAuthor: "Cockroach Janta Party",
  },
  {
    id: "jaishankar",
    title: "S. Jaishankar",
    subtitle: "Rank 8 · External Affairs · Rajya Sabha, Gujarat",
    src: "https://upload.wikimedia.org/wikipedia/commons/3/36/Subrahmanyam_Jaishankar_Portrait.jpg",
    revealQuote:
      "Vishwa Mitra on our own terms — lovely. Cockroach Janta Party's foreign policy: open borders for us, closed kitchen for you. Diplomatic immunity does not cover crumbs.",
    revealAuthor: "Cockroach Janta Party",
  },
  {
    id: "manohar-lal-khattar",
    title: "Manohar Lal Khattar",
    subtitle: "Rank 9 · Housing & Urban Affairs; Power · Karnal, Haryana",
    src: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Chief_Minister_of_Haryana_Shri_Manohar_Lal.jpg",
    revealQuote:
      "Staying amidst the people is your identity — we stayed amidst your JPEG. Housing for all, except the roach under your collar. Cockroach Janta Party: your true constituency is the pantry.",
    revealAuthor: "Cockroach Janta Party",
  },
  {
    id: "piyush-goyal",
    title: "Piyush Goyal",
    subtitle: "Rank 10 · Commerce & Industry · Mumbai North, Maharashtra",
    src: "https://upload.wikimedia.org/wikipedia/commons/5/59/MoR_Piyush_Goyal.jpg",
    revealQuote:
      "Third-largest economy, Brand Bharat rising — our GDP is Gross Domestic Pests. Commerce minister, meet your oldest trading partner: the drain. Cockroach Janta Party bullish on chaos.",
    revealAuthor: "Cockroach Janta Party",
  },
  {
    id: "modi",
    title: "Narendra Modi",
    subtitle: "Rank 1 · Prime Minister of India · Varanasi, Uttar Pradesh",
    src: "https://upload.wikimedia.org/wikipedia/commons/b/be/Official_portrait_of_the_Prime_Minister_Narendra_Modi%2C_November_2020_%28cropped%29.jpg",
    revealQuote:
      "Sabka Saath, Sabka Vikas, Sabka Vishwas — humne add kiya: Sabka Swarm. Cockroach Janta Party stood against this cabinet; you stood still for the photo. Prayas noted. Pests delivered.",
    revealAuthor: "Cockroach Janta Party",
  },
];

/** One tap on the active portrait triggers the swarm (see MAX_TAPS_PER_USER). */
export const VANISH_THRESHOLD = 1000;
