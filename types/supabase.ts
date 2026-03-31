export type Database = {
  public: {
    Tables: {
      patients: {
        Row: {
          id: string;
          user_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          date_of_birth: string | null;
          gender: 'male' | 'female' | 'other' | null;
          blood_type: string | null;
          allergies: string[];
          medications: string[];
          medical_history: string | null;
          emergency_contact_name: string | null;
          emergency_contact_phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          date_of_birth?: string | null;
          gender?: 'male' | 'female' | 'other' | null;
          blood_type?: string | null;
          allergies?: string[];
          medications?: string[];
          medical_history?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string;
          date_of_birth?: string | null;
          gender?: 'male' | 'female' | 'other' | null;
          blood_type?: string | null;
          allergies?: string[];
          medications?: string[];
          medical_history?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      medical_records: {
        Row: {
          id: string;
          patient_id: string;
          record_type: 'visit' | 'lab_result' | 'prescription' | 'imaging' | 'other';
          title: string;
          description: string | null;
          visit_date: string;
          doctor_name: string;
          diagnosis: string | null;
          treatment: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          record_type: 'visit' | 'lab_result' | 'prescription' | 'imaging' | 'other';
          title: string;
          description?: string | null;
          visit_date: string;
          doctor_name: string;
          diagnosis?: string | null;
          treatment?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          record_type?: 'visit' | 'lab_result' | 'prescription' | 'imaging' | 'other';
          title?: string;
          description?: string | null;
          visit_date?: string;
          doctor_name?: string;
          diagnosis?: string | null;
          treatment?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          record_id: string;
          patient_id: string;
          file_name: string;
          file_type: string;
          file_size: number;
          storage_path: string;
          uploaded_at: string;
        };
        Insert: {
          id?: string;
          record_id: string;
          patient_id: string;
          file_name: string;
          file_type: string;
          file_size: number;
          storage_path: string;
          uploaded_at?: string;
        };
        Update: {
          id?: string;
          record_id?: string;
          patient_id?: string;
          file_name?: string;
          file_type?: string;
          file_size?: number;
          storage_path?: string;
          uploaded_at?: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          patient_id: string;
          appointment_date: string;
          appointment_time: string;
          doctor_name: string;
          reason: string;
          status: 'scheduled' | 'completed' | 'cancelled';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          appointment_date: string;
          appointment_time: string;
          doctor_name: string;
          reason: string;
          status?: 'scheduled' | 'completed' | 'cancelled';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          appointment_date?: string;
          appointment_time?: string;
          doctor_name?: string;
          reason?: string;
          status?: 'scheduled' | 'completed' | 'cancelled';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      mfa_settings: {
        Row: {
          id: string;
          user_id: string;
          otp_secret: string;
          otp_enabled: boolean;
          backup_codes: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          otp_secret: string;
          otp_enabled?: boolean;
          backup_codes?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          otp_secret?: string;
          otp_enabled?: boolean;
          backup_codes?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
};
