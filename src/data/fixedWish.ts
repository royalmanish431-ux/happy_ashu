import type { BirthdayWish } from '../types/wish';

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const FIXED_WISH: BirthdayWish = {
  recipientName: 'Ashita',
  senderName: 'Manish Royal',
  turningAge: '24',
  birthDay: 15,
  birthMonth: 11,
  cakeFlavor: 'chocolate',
  balloons: [
    'I Love you ❤️❤️❤️❤️',
    'You are my soulmate ❤️😍',
    'I am always with you ❤️😍 Ashita',
    'You are my everything',
    'Your laugh is my favourite sound',
  ],
  letter:
    'Happy Birthday Babu ❤️.  Tumhari life humesa acchi rhe tum humesa muskurate rho. Muje pata hai me thoda boaring hu  . But me tumse bhut pyar krta hu . Ye baat me tumse samne khna chahta hu. itne saal hoo gye humain  hum phir bhi saath hai ek dusre se. I am Always with you.  Ye din tumhare liye bhut accha hoga me asha krta hu . Byy Take care ❤️ i love you ❤️',
  photos: [
    {
      id: 'photo-1',
      src: '/memories/photo-1.jpg',
      caption: 'Portrait Against a Turquoise Wall',
    },
    {
      id: 'photo-2',
      src: '/memories/photo-2.jpg',
      caption: 'Relaxed Portrait with Green Embroidery',
    },
    {
      id: 'photo-3',
      src: '/memories/photo-3.jpg',
      caption: 'Memory 03',
    },
    {
      id: 'photo-4',
      src: '/memories/photo-4.jpg',
      caption: 'Memory 04',
    },
    {
      id: 'photo-5',
      src: '/memories/photo-5.jpg',
      caption: 'Memory 05',
    },
    {
      id: 'photo-6',
      src: '/memories/photo-6.jpg',
      caption: 'Memory 06',
    },
    {
      id: 'photo-7',
      src: '/memories/photo-7.jpg',
      caption: 'Memory 07',
    },
  ],
  voiceNoteUrl: '/memories/voice-note.webm',
  voiceDuration: 113,
  voiceTitle: 'Birthday Voice Note',
};
