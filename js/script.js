(() => {
  const books = [
    {
      id:1,
      name: "ফুলস্ট্যাক ডেভেলপমেন্ট",
      thumb: "thumbnail/books/full_stack_development.png",
      rating: 4.7,
      start: "2021-05-22",
      end: "2021-05-25"
    },
    {
      id:2,
      name: "Dopamine Detox",
      thumb: "thumbnail/books/dopamine_detox.jpg",
      rating: 4.8,
      start: "2022-11-02",
      end: "2022-11-08"
    },
    {
      id:3,
      name: "ইলুমিনাতি",
      thumb: "thumbnail/books/illuminati.jpg",
      rating: 1.3,
      start: "2022-11-09",
      end: "2022-11-09"
    },
    {
      id:4,
      name: "Mind Reader",
      thumb: "thumbnail/books/mind_reader.jpg",
      rating: 1.7,
      start: "2022-11-09",
      end: "2022-11-17"
    },
    {
      id:5,
      name: "সাইকোলজি ইসলামি দৃষ্টিকোণ",
      thumb: "thumbnail/books/psychology_islami_dristikon.jpg",
      rating: 2.4,
      start: "2022-11-16",
      end: "2022-12-27"
    },
    {
      id:6,
      name: "Mindset",
      thumb: "thumbnail/books/mindset.jpg",
      rating: 1.8,
      start: "2022-12-26",
      end: "2023-01-25"
    },
    {
      id:7,
      name: "গুজরাট ফাইলস",
      thumb: "thumbnail/books/gujrat_files.jpg",
      rating: 4.3,
      start: "2023-02-04",
      end: "2023-02-06"
    },
    {
      id:8,
      name: "বাংলাদেশে ‘র’",
      thumb: "thumbnail/books/bangladeshe_raw.jpg",
      rating: 4.7,
      start: "2023-02-05",
      end: "2023-02-15"
    },
    {
      id:9,
      name: "প্যারাডক্সিক্যাল সাজিদ",
      thumb: "thumbnail/books/paradoxical_sajid.jpg",
      rating: 4.9,
      start: "2023-02-05",
      end: "2023-02-15"
    },
    {
      id:10,
      name: "প্যারাডক্সিক্যাল সাজিদ ২",
      thumb: "thumbnail/books/paradoxical_sajid_2.jpg",
      rating: 4.3,
      start: "2023-02-21",
      end: "2023-02-27"
    },
    {
      id:11,
      name: "মেঘে মেঘে অনেক বেলা",
      thumb: "thumbnail/books/meghe_meghe_onek_bela.jpg",
      rating: 3.2,
      start: "2023-02-22",
      end: "2023-02-22"
    },
    {
      id:12,
      name: "ডাবল স্ট্যান্ডার্ড",
      thumb: "thumbnail/books/double_standard.jpg",
      rating: 3.7,
      start: "2023-02-27",
      end: "2023-02-28"
    },
    {
      id:13,
      name: "বেলা ফুরাবার আগে",
      thumb: "thumbnail/books/bela_furabar_age.jpg",
      rating: 4.7,
      start: "2023-02-28",
      end: "2023-03-08"
    },
    {
      id:14,
      name: "অন্যমনস্ক",
      thumb: "thumbnail/books/onnomonoshko.jpg",
      rating: 2.7,
      start: "2023-03-07",
      end: "2023-03-08"
    },
    {
      id:15,
      name: "গল্পগুলো অন্যরকম",
      thumb: "thumbnail/books/golpogula_onnorokom.jpg",
      rating: 1.2,
      start: "2023-03-07",
      end: "2023-03-08"
    },
    {
      id:16,
      name: "জীবন যেখানে যেমন",
      thumb: "thumbnail/books/jibon_jekhane_jamon.jpg",
      rating: 4.9,
      start: "2023-03-07",
      end: "2023-03-09"
    },
    {
      id:17,
      name: "নীরা, হারিয়ে যেওনা",
      thumb: "thumbnail/books/nira_hariye_jeyo_na.jpg",
      rating: 4.8,
      start: "2023-03-07",
      end: "2023-03-09"
    },
    {
      id:18,
      name: "শেষের কবিতা",
      thumb: "thumbnail/books/shesher_kobita.jpg",
      rating: 4.5,
      start: "2023-03-07",
      end: "2023-03-09"
    },
    {
      id:19,
      name: "এবার ভিন্ন কিছু হোক",
      thumb: "thumbnail/books/ebar_vinno_kichu_hok.jpg",
      rating: 4.9,
      start: "2023-03-08",
      end: "2023-03-14"
    },
    {
      id:20,
      name: "স্টিভ জবস",
      thumb: "thumbnail/books/steve_jobs.jpg",
      rating: 4.7,
      start: "2023-03-12",
      end: "2023-05-15"
    },
    {
      id:21,
      name: "Trading in the Zone",
      thumb: "thumbnail/books/trading_in_the_zone.jpg",
      rating: 2.1,
      start: "2023-03-12",
      end: "2023-05-17"
    },
    {
      id:22,
      name: "Powerful Focus",
      thumb: "thumbnail/books/powerful_focus.jpg",
      rating: 4.2,
      start: "2023-05-17",
      end: "2023-05-18"
    },
    {
      id:23,
      name: "Out from the Heart",
      thumb: "thumbnail/books/out_from_the_heart.jpg",
      rating: 4.9,
      start: "2023-05-19",
      end: "2023-05-20"
    },
    {
      id:24,
      name: "হ্যারেৎজ্",
      thumb: "thumbnail/books/harretz.jpg",
      rating: 1.2,
      start: "2023-05-13",
      end: "2023-05-26"
    },
    {
      id:25,
      name: "The Laws of Human Nature",
      thumb: "thumbnail/books/the_laws_of_human_nature.jpg",
      rating: 2.5,
      start: "2023-05-26",
      end: "2023-05-27"
    },
    {
      id:26,
      name: "ভালোবাসার চাদর",
      thumb: "thumbnail/books/bhalobashar_chador.jpg",
      rating: 3.8,
      start: "2023-05-26",
      end: "2023-05-28"
    },
    {
      id:27,
      name: "প্রত্যাবর্তন",
      thumb: "thumbnail/books/portaborton.jpg",
      rating: 4.8,
      start: "2023-05-27",
      end: "2023-05-28"
    },
    {
      id:28,
      name: "Atomic Habits",
      thumb: "thumbnail/books/atomic_habits.jpg",
      rating: 4.1,
      start: "2023-05-24",
      end: "2023-05-28"
    },
    {
      id:29,
      name: "থিংক অ্যান্ড গ্রো রিচ",
      thumb: "thumbnail/books/think_and_grow_rich.jpg",
      rating: 3.7,
      start: "2023-05-18",
      end: "2023-05-28"
    },
    {
      id:30,
      name: "বিপদ যখন নিয়ামাত",
      thumb: "thumbnail/books/bipod_jokon_niyamot.png",
      rating: 4.2,
      start: "2023-05-21",
      end: "2023-05-28"
    },
    {
      id:31,
      name: "এথিক্যাল হ্যাকিং",
      thumb: "thumbnail/books/ethical_hacking.jpg",
      rating: 3.9,
      start: "2023-03-11",
      end: "2023-05-28"
    },
    {
      id:32,
      name: "আকাশের ওপারে আকাশ",
      thumb: "thumbnail/books/akasher_opare_akash.png",
      rating: 4.9,
      start: "2023-03-15",
      end: "2023-05-28"
    },
    {
      id:33,
      name: "The Power of Your Subconscious Mind",
      thumb: "thumbnail/books/the_power_of_your_subconscious_mind.jpg",
      rating: 3.8,
      start: "2023-03-18",
      end: "2023-05-28"
    },
    {
      id:34,
      name: "কাল থেকে ভালো হয়ে যাব",
      thumb: "thumbnail/books/kal_theke_bhalo_hoye_jabo.jpg",
      rating: 2.8,
      start: "2023-03-11",
      end: "2023-05-28"
    },
    {
      id:35,
      name: "অপেক্ষা",
      thumb: "thumbnail/books/opekkha.jpg",
      rating: 4.9,
      start: "2023-03-17",
      end: "2023-05-28"
    },
    {
      id:36,
      name: "ফ্রিল্যান্সিং",
      thumb: "thumbnail/books/freelancing.jpg",
      rating: 1.2,
      start: "2023-03-16",
      end: "2023-05-28"
    },
    {
      id:37,
      name: "বিহাইন্ড দ্য ইসলামোফোবিয়া",
      thumb: "thumbnail/books/behind_the_islamophobia.jpg",
      rating: 4.2,
      start: "2023-05-28",
      end: "2023-06-04"
    },
    {
      id:38,
      name: "হাজার বছরের অব্যক্ত শয়তানের গল্প",
      thumb: "thumbnail/books/a_brief_history_of_satan.jpg",
      rating: 4.9,
      start: "2023-05-25",
      end: "2023-06-04"
    },
    {
      id:39,
      name: "Life Is Short And So Is This Book",
      thumb: "thumbnail/books/life_is_short_and_so_is_this_book.jpg",
      rating: 4.1,
      start: "2023-06-02",
      end: "2023-06-04"
    },
    {
      id:40,
      name: "ইন্দুবালা ভাতের হোটেল",
      thumb: "thumbnail/books/indubala_bhaater_hotel.png",
      rating: 1.2,
      start: "2023-06-01",
      end: "2023-09-06"
    },
    {
      id:41,
      name: "মোবি ডিক",
      thumb: "thumbnail/books/moby_dick.jpg",
      rating: 1.1,
      start: "2023-05-28",
      end: "2023-09-06"
    },
    {
      id:42,
      name: "হঠাৎ নীরার জন্য",
      thumb: "thumbnail/books/hotath_nirar_jonno.jpg",
      rating: 4.3,
      start: "2023-09-05",
      end: "2023-09-06"
    },
    {
      id:43,
      name: "শেষ বিকেলের মেয়ে",
      thumb: "thumbnail/books/shesh_bikaler_meye.jpg",
      rating: 4.8,
      start: "2023-09-06",
      end: "2023-09-07"
    },
    {
      id:44,
      name: "অপরাহ্ন",
      thumb: "thumbnail/books/oporahno.jpg",
      rating: 4.5,
      start: "2023-09-07",
      end: "2023-09-08"
    },
    {
      id:45,
      name: "নাই বা তুমি এলে",
      thumb: "thumbnail/books/naiba_tumi_ele.png",
      rating: 1.2,
      start: "2023-09-08",
      end: "2023-09-08"
    },
    {
      id:46,
      name: "ক্ষুদিরামের ফাঁসি",
      thumb: "thumbnail/books/khudiramer_fashi.jpg",
      rating: 4.7,
      start: "2023-09-08",
      end: "2023-10-22"
    },
    {
      id:47,
      name: "মুক্ত বাতাসের খোঁজে",
      thumb: "thumbnail/books/mukto_batesher_khoje.png",
      rating: 4.9,
      start: "2023-09-06",
      end: "2023-10-22"
    },
    {
      id:48,
      name: "যারা বৃষ্টিতে ভিজেছিল",
      thumb: "thumbnail/books/jara_bristite_vijechilo.jpg",
      rating: 3.2,
      start: "2023-09-08",
      end: "2023-11-11"
    },
    {
      id:49,
      name: "The Way of the Superior Man",
      thumb: "thumbnail/books/the_way_of_the_superior_man.jpg",
      rating: 4.2,
      start: "2023-09-04",
      end: "2023-11-11"
    },
    {
      id:50,
      name: "টাইম ট্র্যাভেল",
      thumb: "thumbnail/books/time_travel.jpg",
      rating: 4.2,
      start: "2023-09-02",
      end: "2023-11-11"
    },
    {
      id:51,
      name: "মানবী",
      thumb: "thumbnail/books/manobi.jpg",
      rating: 4.8,
      start: "2023-09-01",
      end: "2023-11-11"
    },
    {
      id:52,
      name: "দ্য দা ভিঞ্চি কোড",
      thumb: "thumbnail/books/the_da_vinci_code.jpg",
      rating: 4.9,
      start: "2023-09-09",
      end: "2023-11-11"
    },
    {
      id:53,
      name: "তোমাকে",
      thumb: "thumbnail/books/tomake.jpg",
      rating: 4.7,
      start: "2023-11-15",
      end: "2023-11-17"
    },
    {
      id:54,
      name: "Rewire",
      thumb: "thumbnail/books/rewire.jpg",
      rating: 3.8,
      start: "2023-11-15",
      end: "2023-11-17"
    },
    {
      id:55,
      name: "মনের নিয়ন্ত্রণ যোগ-মেডিটেশন",
      thumb: "thumbnail/books/moner_niyontron_jog_meditation.jpg",
      rating: 3.5,
      start: "2023-11-12",
      end: "2023-11-17"
    },
    {
      id:56,
      name: "জিন ও শয়তানের জগৎ",
      thumb: "thumbnail/books/jin_o_shoytaner_jogot.jpg",
      rating: 4.9,
      start: "2023-11-19",
      end: "2023-11-23"
    },
    {
      id:57,
      name: "অসমাপ্ত আত্মজীবনী",
      thumb: "thumbnail/books/oshomapto_attojiboni.jpg",
      rating: 4.2,
      start: "2023-11-24",
      end: "2023-11-27"
    },
    {
      id:58,
      name: "ডেথ সিটির গোয়েন্দা",
      thumb: "thumbnail/books/death_citir_goyenda.jpg",
      rating: 1.4,
      start: "2023-11-27",
      end: "2023-11-28"
    },
    {
      id:59,
      name: "Recharge Your Down Battery",
      thumb: "thumbnail/books/recharge_your_down_battery.jpg",
      rating: 3.9,
      start: "2025-02-05",
      end: "2025-09-04"
    }
  ];

  const anime = [
    {
      id:1,
      name: "Jujutsu Kaisen",
      thumb: "thumbnail/anime/jujutsu_kaisen.jpg",
      rating: 4.9,
      start: "2024-03-15",
      end: "2024-03-16"
    },
    {
      id:2,
      name: "Chainsaw Man",
      thumb: "thumbnail/anime/chainsaw_man.jpg",
      rating: 4.8,
      start: "2024-03-17",
      end: "2024-03-19"
    },
    {
      id:3,
      name: "Jujutsu Kaisen 0",
      thumb: "thumbnail/anime/jujutsu_kaisen_0.jpg",
      rating: 3.1,
      start: "2024-03-20",
      end: "2024-03-20"
    },
    {
      id:4,
      name: "Suzume",
      thumb: "thumbnail/anime/suzume.jpg",
      rating: 2.3,
      start: "2024-03-21",
      end: "2024-03-21"
    },
    {
      id:5,
      name: "Spy x Family",
      thumb: "thumbnail/anime/spy_x_family.jpg",
      rating: 4.9,
      start: "2024-03-22",
      end: "2024-03-27"
    },
    {
      id:6,
      name: "Death Note",
      thumb: "thumbnail/anime/death_note.jpg",
      rating: 4.7,
      start: "2024-03-29",
      end: "2024-04-06"
    },
    {
      id:7,
      name: "Hyouka",
      thumb: "thumbnail/anime/hyouka.jpg",
      rating: 2.1,
      start: "2024-04-07",
      end: "2024-04-12"
    },
    {
      id:8,
      name: "Solo Leveling",
      thumb: "thumbnail/anime/solo_leveling.jpg",
      rating: 4.9,
      start: "2024-04-13",
      end: "2024-04-15"
    },
    {
      id:9,
      name: "Demon Slayer",
      thumb: "thumbnail/anime/demon_slayer.jpg",
      rating: 4.9,
      start: "2024-04-16",
      end: "2024-04-26"
    },
    {
      id:10,
      name: "Lookism",
      thumb: "thumbnail/anime/lookism.jpg",
      rating: 4.8,
      start: "2024-04-27",
      end: "2024-04-28"
    },
    {
      id:11,
      name: "Wind Breaker",
      thumb: "thumbnail/anime/wind_breaker.jpg",
      rating: 4.7,
      start: "2024-04-29",
      end: "2024-05-01"
    },
    {
      id:12,
      name: "Viral Hit",
      thumb: "thumbnail/anime/viral_hit.jpg",
      rating: 4.9,
      start: "2024-05-02",
      end: "2024-05-04"
    },
    {
      id:13,
      name: "True Beauty",
      thumb: "thumbnail/anime/true_beauty.jpg",
      rating: 2.9,
      start: "2024-05-05",
      end: "2024-05-10"
    },
    {
      id:14,
      name: "Your Name",
      thumb: "thumbnail/anime/your_name.jpg",
      rating: 2.1,
      start: "2024-05-11",
      end: "2024-05-11"
    },
    {
      id:15,
      name: "Tower of God",
      thumb: "thumbnail/anime/tower_of_god.jpg",
      rating: 4.9,
      start: "2024-05-12",
      end: "2024-05-14"
    },
    {
      id:16,
      name: "Tsukimichi",
      thumb: "thumbnail/anime/tsukimichi.jpg",
      rating: 2.6,
      start: "2024-05-15",
      end: "2024-05-17"
    },
    {
      id:17,
      name: "The Detective Is Already Dead",
      thumb: "thumbnail/anime/the_detective_is_already_dead.jpg",
      rating: 2.9,
      start: "2024-05-18",
      end: "2024-05-20"
    },
    {
      id:18,
      name: "Naruto",
      thumb: "thumbnail/anime/naruto.jpg",
      rating: 4.9,
      start: "2024-05-21",
      end: "2024-07-20"
    },
    {
      id:19,
      name: "Alya Sometimes Hides Her Feelings in Russian",
      thumb: "thumbnail/anime/alya_sometimes_hides_her_feelings_in_russian.jpg",
      rating: 4.9,
      start: "2024-07-22",
      end: "2024-07-25"
    },
    {
      id:20,
      name: "Bucchigiri",
      thumb: "thumbnail/anime/bucchigiri.jpg",
      rating: 1.2,
      start: "2024-07-26",
      end: "2024-07-28"
    },
    {
      id:21,
      name: "Tokyo Revengers",
      thumb: "thumbnail/anime/tokyo_revengers.jpg",
      rating: 2.5,
      start: "2024-07-29",
      end: "2024-08-08"
    },
    {
      id:22,
      name: "Blood Prison",
      thumb: "thumbnail/anime/naruto_shippuden_blood_prison.jpg",
      rating: 1.4,
      start: "2024-08-09",
      end: "2024-08-09"
    },
    {
      id:23,
      name: "Dr. Stone",
      thumb: "thumbnail/anime/dr_stone.jpg",
      rating: 4.7,
      start: "2024-08-10",
      end: "2024-08-22"
    },
    {
      id:24,
      name: "Kaiju No. 8",
      thumb: "thumbnail/anime/kaiju_no_8.jpg",
      rating: 3.1,
      start: "2024-08-24",
      end: "2024-08-27"
    },
    {
      id:25,
      name: "Mushoku Tensei",
      thumb: "thumbnail/anime/mushoku_tensei.jpg",
      rating: 2.1,
      start: "2024-08-28",
      end: "2024-09-12"
    },
    {
      id:26,
      name: "Mashle",
      thumb: "thumbnail/anime/mashle_magic_and_muscles.jpg",
      rating: 4.3,
      start: "2024-09-14",
      end: "2024-09-20"
    },
    {
      id:27,
      name: "My Dress-Up Darling",
      thumb: "thumbnail/anime/my_dress_up_darling.jpg",
      rating: 4.9,
      start: "2024-09-21",
      end: "2024-09-24"
    },
    {
      id:28,
      name: "Berserk of Gluttony",
      thumb: "thumbnail/anime/berserk_of_gluttony.jpg",
      rating: 4.7,
      start: "2024-09-26",
      end: "2024-09-28"
    },
    {
      id:29,
      name: "Reign of the Seven Spellblades",
      thumb: "thumbnail/anime/reign_of_the_seven_spellblades.jpg",
      rating: 4.1,
      start: "2024-09-29",
      end: "2024-10-03"
    },
    {
      id:30,
      name: "The Iceblade Sorcerer Shall Rule the World",
      thumb: "thumbnail/anime/the_iceblade_sorcerer_shall_rule_the_world.jpg",
      rating: 3.2,
      start: "2024-10-05",
      end: "2024-10-08"
    },
    {
      id:31,
      name: "My Love Story with Yamada-kun at Lv999",
      thumb: "thumbnail/anime/my_love_story_with_yamada_kun_at_lv999.jpg",
      rating: 3.1,
      start: "2024-10-09",
      end: "2024-10-13"
    },
    {
      id:32,
      name: "Radiant",
      thumb: "thumbnail/anime/radiant.jpg",
      rating: 3.9,
      start: "2024-10-15",
      end: "2024-10-26"
    },
    {
      id:33,
      name: "Bartender Glass of God",
      thumb: "thumbnail/anime/bartender_glass_of_god.jpg",
      rating: 4.5,
      start: "2024-10-27",
      end: "2024-10-30"
    },
    {
      id:34,
      name: "Devil May Cry",
      thumb: "thumbnail/anime/devil_may_cry.jpg",
      rating: 4.8,
      start: "2024-11-02",
      end: "2024-11-04"
    },
    {
      id:35,
      name: "The Case Study of Vanitas",
      thumb: "thumbnail/anime/the_case_study_of_vanitas.jpg",
      rating: 3.1,
      start: "2024-11-05",
      end: "2024-11-12"
    },
    {
      id:36,
      name: "Akudama Drive",
      thumb: "thumbnail/anime/akudama_drive.jpg",
      rating: 3.2,
      start: "2024-11-15",
      end: "2024-11-17"
    },
    {
      id:37,
      name: "Code Geass",
      thumb: "thumbnail/anime/code_geass.jpg",
      rating: 3.5,
      start: "2024-11-18",
      end: "2024-12-02"
    },
    {
      id:38,
      name: "Dead Mount Death Play",
      thumb: "thumbnail/anime/dead_mount_death_play.jpg",
      rating: 4.2,
      start: "2024-12-05",
      end: "2024-12-11"
    },
    {
      id:39,
      name: "Fire Force",
      thumb: "thumbnail/anime/fire_force.jpg",
      rating: 4.4,
      start: "2024-12-12",
      end: "2024-12-26"
    },
    {
      id:40,
      name: "Please Put Them On, Takamine-san",
      thumb: "thumbnail/anime/please_put_them_on_takamine_san.jpg",
      rating: 4.1,
      start: "2024-12-28",
      end: "2024-12-28"
    },
    {
      id:41,
      name: "Overflow",
      thumb: "thumbnail/anime/overflow.jpg",
      rating: 4.9,
      start: "2024-12-29",
      end: "2024-12-29"
    },
    {
      id:42,
      name: "Vinland Saga",
      thumb: "thumbnail/anime/vinland_saga.jpg",
      rating: 1.9,
      start: "2024-12-30",
      end: "2025-01-12"
    },
    {
      id:43,
      name: "Classroom of the Elite",
      thumb: "thumbnail/anime/class_room_of_elite.jpg",
      rating: 3.4,
      start: "2025-01-13",
      end: "2025-01-19"
    },
    {
      id:44,
      name: "The Daily Life of the Immortal King",
      thumb: "thumbnail/anime/the_daily_life_of_the_immortal_king.jpg",
      rating: 3.8,
      start: "2025-01-21",
      end: "2025-01-27"
    },
    {
      id:45,
      name: "ReLIFE",
      thumb: "thumbnail/anime/relife.jpg",
      rating: 4.2,
      start: "2025-01-28",
      end: "2025-01-30"
    },
    {
      id:46,
      name: "Noblesse",
      thumb: "thumbnail/anime/noblesse.jpg",
      rating: 4.1,
      start: "2025-02-02",
      end: "2025-02-07"
    },
    {
      id:47,
      name: "Frieren",
      thumb: "thumbnail/anime/frieren.jpg",
      rating: 4.9,
      start: "2025-02-09",
      end: "2025-02-22"
    },
    {
      id:48,
      name: "The Apothecary Diaries",
      thumb: "thumbnail/anime/the_apothecary_diaries.jpg",
      rating: 4.9,
      start: "2025-02-24",
      end: "2025-03-02"
    },
    {
      id:49,
      name: "Blue Lock",
      thumb: "thumbnail/anime/blue_lock.jpg",
      rating: 4.1,
      start: "2025-03-04",
      end: "2025-03-18"
    },
    {
      id:50,
      name: "Days with My Stepsister",
      thumb: "thumbnail/anime/days_with_my_stepsister.jpg",
      rating: 4.9,
      start: "2025-03-20",
      end: "2025-03-24"
    }
  ];

  const pageSize = 12;
  const currentPage = { books: 1, anime: 1 };

  function formatDate(d) {
    try {
      const dt = new Date(d);
      return dt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) { return d; }
  }

  function makeCard(item, type) {
    const el = document.createElement('article');
    el.className = 'card';
    el.innerHTML = `
      <div class="thumb"><img src="${item.thumb}" alt="${escapeHtml(item.name)}"></div>
      <div class="meta">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
          <h3 class="title">${escapeHtml(item.name)}</h3>
          <div class="badge">${type}</div>
        </div>
        <div class="rating">★ ${item.rating}</div>
        <div class="dates">
          <div>Start: <strong>${formatDate(item.start)}</strong></div>
          <div>End: <strong>${formatDate(item.end)}</strong></div>
        </div>
      </div>
    `;
    return el;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (m) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
  }

  function renderList(containerId, items, type) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  if (!items || items.length === 0) {
    const e = document.createElement('div');
    e.className = 'empty';
    e.textContent = `No ${type.toLowerCase()} yet.`;
    container.appendChild(e);
    return;
  }

  const page = currentPage[containerId];
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const reversed = [...items].reverse();
  const pagedItems = reversed.slice(start, end);

  const grid = document.createElement('div');
  grid.className = 'grid';
  pagedItems.forEach(it => grid.appendChild(makeCard(it, type)));
  container.appendChild(grid);

    const controls = document.createElement('div');
    controls.className = "pagination";
    controls.style.display = "flex";
    controls.style.justifyContent = "center";
    controls.style.marginTop = "15px";
    controls.style.gap = "10px";

    const prevBtn = document.createElement('button');
    prevBtn.textContent = "Previous";
    prevBtn.disabled = page === 1;
    prevBtn.onclick = () => {
      currentPage[containerId]--;
      renderList(containerId, items, type);
    };

    const nextBtn = document.createElement('button');
    nextBtn.textContent = "Next";
    nextBtn.disabled = end >= items.length;
    nextBtn.onclick = () => {
      currentPage[containerId]++;
      renderList(containerId, items, type);
    };

    controls.appendChild(prevBtn);
    controls.appendChild(nextBtn);
    container.appendChild(controls);

  document.getElementById("bookCount").textContent = books.length;
  document.getElementById("animeCount").textContent = anime.length;

  }

  function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        document.querySelectorAll('.tab').forEach(x => {
          x.classList.remove('active');
          x.setAttribute('aria-selected','false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected','true');
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        document.getElementById(target).classList.add('active');

        if(target === 'books') renderList('books', books, 'Book');
        if(target === 'anime') renderList('anime', anime, 'Anime');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
    renderList('books', books, 'Book');
  });

  document.getElementById("searchInput").addEventListener("keyup", function() {
    let filter = this.value.toLowerCase();
    let activeTab = document.querySelector(".tab.active").getAttribute("data-tab");
    let items = (activeTab === "books" ? books : anime);
    let filtered = items.filter(it => it.name.toLowerCase().includes(filter));
    currentPage[activeTab] = 1;
    renderList(activeTab, filtered, activeTab === "books" ? "Book" : "Anime");
  });

  window.Collection = {
    addBook(b){
      books.push(b);
      if(document.getElementById('books').classList.contains('active'))
        renderList('books', books, 'Book');
    },
    addAnime(a){
      anime.push(a);
      if(document.getElementById('anime').classList.contains('active'))
        renderList('anime', anime, 'Anime');
    }
  };
})();