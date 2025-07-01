import { Types } from 'mongoose';

export type TListing = {
  title: string;
  description: string;
  price: number;
  date?: Date;
  //   condition: 'new' | 'likeNew' | 'used' | 'refurbished';
  images: string[];
  userID?: Types.ObjectId;
  status?: 'available' | 'sold';
  category:
    | 'wedding'
    | 'birthday'
    | 'corporate'
    | 'concert'
    | 'conference'
    | 'festival'
    | 'babyShower'
    | 'engagement'
    | 'anniversary'
    | 'productLaunch';
  //   brand?: string;
  location: string;
  eventPosterName: string;
  //   negotiable?: 'yes' | 'no';
  //   warranty?: string;
  contactNumber?: string;
  isDeleted?: false;
};
