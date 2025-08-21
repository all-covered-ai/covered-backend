export type RoomType = 'living_room' | 'kitchen' | 'bedroom' | 'bathroom' | 'dining_room' | 'office' | 'garage' | 'basement' | 'attic' | 'closet' | 'laundry_room' | 'pantry';
export type ItemCategory = 'electronics' | 'appliances' | 'jewelry' | 'art' | 'musical_instruments' | 'tools' | 'furniture' | 'sports_equipment' | 'clothing' | 'books' | 'collectibles' | 'other';
export type ItemCondition = 'new' | 'excellent' | 'good' | 'fair' | 'poor';
export type ImageType = 'room_overview' | 'item_detail' | 'receipt' | 'serial_number' | 'damage';
export interface User {
    id: string;
    email: string;
    name?: string;
    created_at: string;
    updated_at: string;
}
export interface Home {
    id: string;
    user_id: string;
    name: string;
    address: string;
    created_at: string;
    updated_at: string;
}
export interface Room {
    id: string;
    home_id: string;
    name: string;
    room_type: RoomType;
    is_completed: boolean;
    created_at: string;
    updated_at: string;
}
export interface Item {
    id: string;
    room_id: string;
    name: string;
    category: ItemCategory;
    brand?: string;
    model?: string;
    serial_number?: string;
    purchase_date?: string;
    purchase_price?: number;
    estimated_value: number;
    condition: ItemCondition;
    notes?: string;
    created_at: string;
    updated_at: string;
}
export interface ItemImage {
    id: string;
    item_id?: string;
    room_id?: string;
    file_url: string;
    file_name: string;
    image_type: ImageType;
    ai_analysis_data?: any;
    is_processing?: boolean;
    processing_error?: string;
    created_at: string;
    updated_at: string;
}
export interface UserPushToken {
    id: string;
    user_id: string;
    push_token: string;
    created_at: string;
    updated_at: string;
}
