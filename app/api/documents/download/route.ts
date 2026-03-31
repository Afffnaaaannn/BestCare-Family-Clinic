import { NextRequest, NextResponse } from 'next/server';
import { supabase, getSignedUrl } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
    }

    const { data: document, error: fetchError } = await (supabase
      .from('documents')
      .select('*')
      .eq('id', fileId)
      .single() as any) as { data: { id: string; patient_id: string; storage_path: string; file_name: string } | null; error: any };

    if (fetchError || !document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: patient } = await (supabase
      .from('patients')
      .select('*')
      .eq('user_id', user.id)
      .single() as any) as { data: { id: string } | null; error: any };

    if (!patient || patient.id !== document.patient_id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const signedUrl = await getSignedUrl('documents', document.storage_path, 3600);

    return NextResponse.json({ url: signedUrl, fileName: document.file_name });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Failed to process download' }, { status: 500 });
  }
}
