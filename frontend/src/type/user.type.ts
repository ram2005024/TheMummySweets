export interface UserBasic {
  id: string;
  role: string;
  is_active: boolean;
  is_authenticated: boolean;
  email?: string;
  phone_no?: string;
  profile: {
    full_name: string;
    image?: string;
    rank: string;
  };
}
