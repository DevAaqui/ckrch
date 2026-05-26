export type GalleryItem = {
  id: string;
  title: string;
  subtitle: string;
  src: string;
  /** Shown after the image vanishes. */
  revealQuote: string;
  revealAuthor: string;
};

// Ordered by Modi 3.0 Union Cabinet ranking (Rank #2 onward — PM Modi placed last on request).
// Source: Cabinet Secretariat / PMO portfolio announcement, 10 June 2024.
export const galleryItems: GalleryItem[] = [
  {
    id: "kumar-vishwas",
    title: "Dr. Kumar Vishwas",
    subtitle: "Hindi poet · Ram-bhakt · founding member, AAP (former)",
    src: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Kumar_Vishwas_%28Poet%29.jpg",
    revealQuote:
      "Koi deewana kehta hai, koi pagal samajhta hai — magar dharti ki bechaini ko bas baadal samajhta hai.",
    revealAuthor: "Kumar Vishwas",
  },
  {
    id: "dharmendra-pradhan",
    title: "Dharmendra Pradhan",
    subtitle: "Union Minister of Education · Sambalpur, Odisha",
    src: "https://upload.wikimedia.org/wikipedia/commons/5/51/Shri_Dharmendra_Pradhan_Petroleum_Minister.jpg",
    revealQuote:
      "NEP 2020 is the foundation of a new India — rooted in our values, ready for the future.",
    revealAuthor: "Dharmendra Pradhan",
  },
  {
    id: "rajnath-singh",
    title: "Rajnath Singh",
    subtitle: "Rank 2 · Union Minister of Defence · Lucknow, UP",
    src: "https://upload.wikimedia.org/wikipedia/commons/5/52/Shri_Rajnath_Singh%2C_Defence_Minister_of_India.jpg",
    revealQuote:
      "India does not attack any country, but if provoked, we will give a befitting reply.",
    revealAuthor: "Rajnath Singh",
  },
  {
    id: "amit-shah",
    title: "Amit Shah",
    subtitle: "Rank 3 · Home Affairs & Cooperation · Gandhinagar, Gujarat",
    src: "https://upload.wikimedia.org/wikipedia/commons/3/30/Union_Minister_for_Home_Affairs.jpg",
    revealQuote:
      "Kashmir was, is, and will always be an integral part of India.",
    revealAuthor: "Amit Shah, on Article 370",
  },
  {
    id: "nitin-gadkari",
    title: "Nitin Gadkari",
    subtitle: "Rank 4 · Road Transport & Highways · Nagpur, Maharashtra",
    src: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Sh_Nitin_Jairam_Gadkari%2C_Hon%27ble_Minister%2C_Government_of_India_%28cropped%29.jpg",
    revealQuote:
      "Good roads, good highways and good infrastructure are the lifeline of a nation.",
    revealAuthor: "Nitin Gadkari",
  },
  {
    id: "jp-nadda",
    title: "J. P. Nadda",
    subtitle: "Rank 5 · Health & Family Welfare; Chemicals & Fertilizers · BJP President",
    src: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Shri_JP_Nadda.png",
    revealQuote:
      "Discipline and dedication are the soul of the karyakarta — and the strength of the party.",
    revealAuthor: "J. P. Nadda",
  },
  {
    id: "shivraj-chouhan",
    title: "Shivraj Singh Chouhan",
    subtitle: "Rank 6 · Agriculture & Farmers' Welfare; Rural Development · Vidisha, MP",
    src: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Shivraj_Singh_Chouhan_2025.jpg",
    revealQuote:
      "Mere kisaan bhaiyon aur behnon ka samman — yahi meri sarkar ka pehla kaam hai.",
    revealAuthor: "Shivraj Singh Chouhan",
  },
  {
    id: "nirmala-sitharaman",
    title: "Nirmala Sitharaman",
    subtitle: "Rank 7 · Finance & Corporate Affairs · Rajya Sabha, Karnataka",
    src: "https://upload.wikimedia.org/wikipedia/commons/b/be/Smt._Nirmala_Sitharaman_Minister_of_Finance.jpg",
    revealQuote:
      "This Budget lays the foundation for an Atmanirbhar Bharat — reform, perform, transform.",
    revealAuthor: "Nirmala Sitharaman, Union Budget",
  },
  {
    id: "jaishankar",
    title: "S. Jaishankar",
    subtitle: "Rank 8 · External Affairs · Rajya Sabha, Gujarat",
    src: "https://upload.wikimedia.org/wikipedia/commons/3/36/Subrahmanyam_Jaishankar_Portrait.jpg",
    revealQuote:
      "Bharat is a Vishwa Mitra — a friend to the world, on our own terms.",
    revealAuthor: "S. Jaishankar",
  },
  {
    id: "manohar-lal-khattar",
    title: "Manohar Lal Khattar",
    subtitle: "Rank 9 · Housing & Urban Affairs; Power · Karnal, Haryana",
    src: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Chief_Minister_of_Haryana_Shri_Manohar_Lal.jpg",
    revealQuote:
      "Staying amidst the people is the true identity of a public representative.",
    revealAuthor: "Manohar Lal Khattar",
  },
  {
    id: "piyush-goyal",
    title: "Piyush Goyal",
    subtitle: "Rank 10 · Commerce & Industry · Mumbai North, Maharashtra",
    src: "https://upload.wikimedia.org/wikipedia/commons/5/59/MoR_Piyush_Goyal.jpg",
    revealQuote:
      "India is on a clear path to becoming the world's third-largest economy — Brand Bharat is rising.",
    revealAuthor: "Piyush Goyal",
  },
  {
    id: "modi",
    title: "Narendra Modi",
    subtitle: "Rank 1 · Prime Minister of India · Varanasi, Uttar Pradesh",
    src: "https://upload.wikimedia.org/wikipedia/commons/b/be/Official_portrait_of_the_Prime_Minister_Narendra_Modi%2C_November_2020_%28cropped%29.jpg",
    revealQuote:
      "Sabka Saath, Sabka Vikas, Sabka Vishwas, Sabka Prayas.",
    revealAuthor: "Narendra Modi",
  },
];

export const VANISH_THRESHOLD = 10;
