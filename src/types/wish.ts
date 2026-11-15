export type CakeFlavor = 'chocolate' | 'strawberry' | 'vanilla';

export interface PhotoMemory {
  id: string;
  src: string;
  caption: string;
}

export interface BirthdayWish {
  recipientName: string;
  senderName: string;
  turningAge: string;
  birthDay: number;
  birthMonth: number;
  cakeFlavor: CakeFlavor;
  balloons: string[];
  letter: string;
  photos: PhotoMemory[];
  voiceNoteUrl: string;
  voiceDuration: number;
  voiceTitle: string;
}
