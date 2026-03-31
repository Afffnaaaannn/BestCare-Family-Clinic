import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: patient, error: patientError } = await (supabase
      .from('patients')
      .select('*')
      .eq('user_id', user.id)
      .single() as any) as { data: { id: string } | null; error: any };

    if (!patient || patientError) {
      return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 });
    }

    const { data: records, error: recordsError } = await supabase
      .from('medical_records')
      .select(
        `
        *,
        documents(*)
      `
      )
      .eq('patient_id', patient.id)
      .order('visit_date', { ascending: false });

    if (recordsError) {
      return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 });
    }

    return NextResponse.json({ records });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
