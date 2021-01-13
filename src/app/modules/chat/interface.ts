export interface Chat {
  id: number;
  messages: Message[];
}

export interface Message {
  id: number;
  message: String;
  user_id: number;
  me: boolean;
  break: boolean;
  is_read: boolean;
  created_at: Date;
}
