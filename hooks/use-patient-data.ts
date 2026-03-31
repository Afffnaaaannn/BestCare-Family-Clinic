import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface MFASettings {
  id: string;
  user_id: string;
  otp_secret: string;
  otp_enabled: boolean;
  backup_codes: string[];
  created_at: string;
  updated_at: string;
}

export function useMFA(userId?: string) {
  const [mfaSettings, setMFASettings] = useState<MFASettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMFASettings = async (id: string) => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('mfa_settings')
        .select('*')
        .eq('user_id', id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      setMFASettings(data || null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch MFA settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchMFASettings(userId);
    }
  }, [userId]);

  return { mfaSettings, loading, error, refetch: fetchMFASettings };
}

export function usePatientRecords(patientId?: string) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = async (id: string) => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('medical_records')
        .select(
          `
          *,
          documents(*)
        `
        )
        .eq('patient_id', id)
        .order('visit_date', { ascending: false });

      if (fetchError) throw fetchError;

      setRecords(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchRecords(patientId);
    }
  }, [patientId]);

  return { records, loading, error, refetch: fetchRecords };
}

export function useAppointments(patientId?: string) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async (id: string) => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', id)
        .order('appointment_date', { ascending: true });

      if (fetchError) throw fetchError;

      setAppointments(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchAppointments(patientId);
    }
  }, [patientId]);

  return { appointments, loading, error, refetch: fetchAppointments };
}

export function useDocuments(recordId?: string) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async (id: string) => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('documents')
        .select('*')
        .eq('record_id', id)
        .order('uploaded_at', { ascending: false });

      if (fetchError) throw fetchError;

      setDocuments(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (recordId) {
      fetchDocuments(recordId);
    }
  }, [recordId]);

  return { documents, loading, error, refetch: fetchDocuments };
}
